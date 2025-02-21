# @c11/engine.swc-plugin-syntax

A SWC plugin that processes TypeScript type annotations to identify special engine keywords (`view` and `producer`) and transforms them into instrumented code. This is a Rust implementation of the functionality provided by [@c11/engine.babel-plugin-syntax](../engine.babel-plugin-syntax).

## Installation

```bash
npm install @c11/engine.swc-plugin-syntax
```

## Usage

Add the plugin to your SWC configuration:

```json
{
  "jsc": {
    "experimental": {
      "plugins": [
        ["@c11/engine.swc-plugin-syntax", {
          "output": true,
          "viewLibrary": "engineViewLibrary"
        }]
      ]
    }
  }
}
```

### Configuration Options

- `output` (boolean): Whether to generate instrumentation output in `.app-structure.json`
- `viewLibrary` (string): The library name to import view functions from
- `root` (string): Root path for output file generation

## Examples

### View Component

```typescript
const MyComponent: view = ({ count = observe.count }) => {
  return <div>{count}</div>
};
```

### Producer Function

```typescript
const incrementCount: producer = ({ count = update.count }) => {
  count(prev => prev + 1);
};
```

## Development

### Prerequisites

- Rust toolchain
- wasm32-wasi target (`rustup target add wasm32-wasi`)
- Node.js and npm/yarn

### Building

```bash
cargo build --target wasm32-wasi --release
```

### Testing

```bash
cargo test
```

### Running Examples

See the [examples](./examples) directory for usage examples.

## Comparison with Babel Plugin

This SWC plugin is a direct port of the Babel plugin functionality to Rust. It:
- Uses the same visitor pattern for AST manipulation
- Generates identical instrumentation output
- Maintains the same configuration options
- Produces compatible `.app-structure.json` output

The main differences are:
- Implemented in Rust using SWC's plugin system
- Better performance due to Rust and SWC optimizations
- Slightly different error messages due to Rust's error handling

## License

MIT License - see [LICENSE](./LICENSE) for details