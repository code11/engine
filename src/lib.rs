use swc_core::ecma::{
    ast::*,
    visit::{VisitMut, VisitMutWith},
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};
use swc_core::common::DUMMY_SP;

mod types;
mod visitors;
mod utils;
mod output;

use types::PluginConfig;
use visitors::VariableVisitor;
use output::FileOutputManager;
use std::sync::Arc;

pub struct TransformVisitor {
    config: PluginConfig,
    output_manager: Arc<FileOutputManager>,
}

impl TransformVisitor {
    pub fn new(config: PluginConfig, root_path: &str) -> Self {
        Self {
            config,
            output_manager: Arc::new(FileOutputManager::new(root_path)),
        }
    }
}

impl VisitMut for TransformVisitor {
    fn visit_mut_module(&mut self, module: &mut Module) {
        // Process each statement
        let mut new_imports = Vec::new();
        
        for stmt in module.body.iter_mut() {
            if let ModuleItem::Stmt(Stmt::Decl(Decl::Var(var_decl))) = stmt {
                for decl in var_decl.decls.iter_mut() {
                    let mut visitor = VariableVisitor::new(self.config.clone());
                    decl.visit_with(&mut visitor);

                    if let Some(output) = visitor.instrumentation_output {
                        // Add imports if not already present
                        for import in output.imports.clone() {
                            if !new_imports.iter().any(|i: &ImportDecl| i.src.value == import.src.value) {
                                new_imports.push(import);
                            }
                        }

                        // Update the output cache
                        if let Err(e) = self.output_manager.update_cache(output.clone()) {
                            eprintln!("Failed to update output cache: {}", e);
                        }

                        // Replace the declaration
                        *decl = output.transformed_node;
                    }
                }
            }
        }

        // Add new imports at the beginning
        for import in new_imports {
            module.body.insert(0, ModuleItem::ModuleDecl(ModuleDecl::Import(import)));
        }
    }
}

#[plugin_transform]
pub fn process_transform(program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    // Get config from plugin options
    let config_map = metadata.get_transform_plugin_config().unwrap_or_default();
    
    let config = PluginConfig {
        view_library: config_map.get("viewLibrary")
            .and_then(|v| v.as_str())
            .unwrap_or("engineViewLibrary")
            .to_string(),
    };

    let root_path = config_map.get("root")
        .and_then(|v| v.as_str())
        .unwrap_or(".");

    let filename = metadata.get_context(&program)
        .and_then(|ctx| ctx.filename.as_deref())
        .unwrap_or("");

    let mut visitor = TransformVisitor::new(config, root_path);
    
    // Clear previous cache for this file
    if !filename.is_empty() {
        if let Err(e) = visitor.output_manager.clear_file_cache(filename) {
            eprintln!("Failed to clear cache for {}: {}", filename, e);
        }
    }

    program.visit_mut_with(&mut visitor);
    program
}
