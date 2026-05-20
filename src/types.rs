use swc_core::ecma::ast::*;
use swc_core::common::DUMMY_SP;

#[derive(Debug, Clone)]
pub struct PluginConfig {
    pub view_library: String,
}

#[derive(Debug, Clone)]
pub struct InstrumentationOutput {
    pub build_id: String,
    pub imports: Vec<ImportDecl>,
    pub transformed_node: VarDeclarator,
}

pub const ENGINE_KEYWORDS: [&str; 2] = ["view", "producer"];

pub fn create_import_decl(specifier: &str, source: &str) -> ImportDecl {
    ImportDecl {
        span: DUMMY_SP,
        specifiers: vec![ImportSpecifier::Named(ImportNamedSpecifier {
            span: DUMMY_SP,
            local: Ident::new(specifier.into(), DUMMY_SP),
            imported: None,
            is_type_only: false,
        })],
        src: Box::new(Str {
            span: DUMMY_SP,
            value: source.into(),
            raw: None,
        }),
        type_only: false,
        asserts: None,
    }
}