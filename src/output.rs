use std::collections::HashMap;
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use std::time::Duration;
use tokio::time::sleep;
use serde::{Deserialize, Serialize};
use anyhow::{Result, Context};

/// Represents the structure of a single file's output data
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileOutput {
    #[serde(flatten)]
    pub builds: HashMap<String, InstrumentationOutput>,
}

/// The overall output structure mapping file paths to their outputs
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OutputStructure {
    #[serde(flatten)]
    pub files: HashMap<String, FileOutput>,
}

/// Represents the instrumentation output for a single build
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InstrumentationOutput {
    pub build_id: String,
    pub meta: OutputMeta,
    // Add other fields as needed based on your requirements
}

/// Metadata for the instrumentation output
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OutputMeta {
    pub absolute_file_path: String,
    // Add other metadata fields as needed
}

/// Handles file output operations with caching and scheduled writes
pub struct FileOutputManager {
    cache: Arc<Mutex<HashMap<String, FileOutput>>>,
    root_path: PathBuf,
    output_file: String,
    write_scheduled: Arc<Mutex<bool>>,
}

impl FileOutputManager {
    /// Creates a new FileOutputManager instance
    pub fn new<P: AsRef<Path>>(root_path: P) -> Self {
        Self {
            cache: Arc::new(Mutex::new(HashMap::new())),
            root_path: root_path.as_ref().to_path_buf(),
            output_file: ".app-structure.json".to_string(),
            write_scheduled: Arc::new(Mutex::new(false)),
        }
    }

    /// Updates the cache with new instrumentation output
    pub fn update_cache(&self, output: InstrumentationOutput) -> Result<()> {
        let mut cache = self.cache.lock().map_err(|e| anyhow::anyhow!("Failed to lock cache: {}", e))?;
        
        let file_path = output.meta.absolute_file_path.clone();
        let entry = cache.entry(file_path).or_insert_with(|| FileOutput {
            builds: HashMap::new(),
        });
        
        entry.builds.insert(output.build_id.clone(), output);
        
        self.schedule_write();
        Ok(())
    }

    /// Clears cache entry for a specific file
    pub fn clear_file_cache(&self, filename: &str) -> Result<()> {
        let mut cache = self.cache.lock().map_err(|e| anyhow::anyhow!("Failed to lock cache: {}", e))?;
        cache.remove(filename);
        Ok(())
    }

    /// Schedules a write operation with a timeout
    fn schedule_write(&self) {
        let cache = Arc::clone(&self.cache);
        let root_path = self.root_path.clone();
        let output_file = self.output_file.clone();
        let write_scheduled = Arc::clone(&self.write_scheduled);

        tokio::spawn(async move {
            // Set write scheduled flag
            let mut scheduled = write_scheduled.lock().unwrap();
            if *scheduled {
                return;
            }
            *scheduled = true;
            drop(scheduled);

            // Wait for the timeout
            sleep(Duration::from_millis(1000)).await;

            // Perform the write
            let cache_guard = cache.lock().unwrap();
            let output = OutputStructure {
                files: cache_guard.clone(),
            };

            let output_path = root_path.join(&output_file);
            if let Err(e) = fs::write(
                &output_path,
                serde_json::to_string_pretty(&output).unwrap(),
            ) {
                eprintln!("Failed to write output file: {}", e);
            }

            // Reset write scheduled flag
            let mut scheduled = write_scheduled.lock().unwrap();
            *scheduled = false;
        });
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::TempDir;
    use std::fs;
    use tokio::time::sleep;

    #[tokio::test]
    async fn test_file_output_manager() {
        let temp_dir = TempDir::new().unwrap();
        let manager = FileOutputManager::new(temp_dir.path());

        // Test updating cache
        let output = InstrumentationOutput {
            build_id: "test-build".to_string(),
            meta: OutputMeta {
                absolute_file_path: "/test/file.js".to_string(),
            },
        };

        manager.update_cache(output.clone()).unwrap();

        // Wait for write to complete
        sleep(Duration::from_millis(1500)).await;

        // Verify file was written
        let output_path = temp_dir.path().join(".app-structure.json");
        assert!(output_path.exists());

        // Verify content
        let content = fs::read_to_string(output_path).unwrap();
        let parsed: OutputStructure = serde_json::from_str(&content).unwrap();
        assert!(parsed.files.contains_key("/test/file.js"));

        // Test cache clearing
        manager.clear_file_cache("/test/file.js").unwrap();
        let cache = manager.cache.lock().unwrap();
        assert!(!cache.contains_key("/test/file.js"));
    }
}