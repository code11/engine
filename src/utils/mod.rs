use swc_core::ecma::ast::*;
use swc_core::common::DUMMY_SP;
use uuid::Uuid;

use crate::types::{PluginConfig, InstrumentationOutput, create_import_decl};

pub fn generate_build_id() -> String {
    Uuid::new_v4().to_string()
}

pub fn instrument_view(config: &PluginConfig, node: &VarDeclarator) -> InstrumentationOutput {
    let build_id = generate_build_id();
    let view_import = create_import_decl("view", &config.view_library);

    // Transform the node to remove type annotation and add instrumentation
    let mut transformed = node.clone();
    if let Pat::Ident(id) = &mut transformed.name {
        id.type_ann = None;
    }

    // Add view wrapper around the function
    if let Some(init) = transformed.init {
        if let Expr::Arrow(arrow) = *init {
            transformed.init = Some(Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: Callee::Expr(Box::new(Expr::Ident(Ident::new("view".into(), DUMMY_SP)))),
                args: vec![
                    ExprOrSpread {
                        spread: None,
                        expr: Box::new(Expr::Object(ObjectLit {
                            span: DUMMY_SP,
                            props: vec![PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                key: PropName::Ident(Ident::new("buildId".into(), DUMMY_SP)),
                                value: Box::new(Expr::Lit(Lit::Str(Str {
                                    span: DUMMY_SP,
                                    value: build_id.clone().into(),
                                    raw: None,
                                }))),
                            })))],
                        })),
                    },
                    ExprOrSpread {
                        spread: None,
                        expr: Box::new(Expr::Arrow(arrow)),
                    },
                ],
                type_args: None,
            })));
        }
    }

    InstrumentationOutput {
        build_id,
        imports: vec![view_import],
        transformed_node: transformed,
    }
}

pub fn instrument_producer(config: &PluginConfig, node: &VarDeclarator) -> InstrumentationOutput {
    let build_id = generate_build_id();
    let producer_import = create_import_decl("producer", &config.view_library);

    // Transform the node to remove type annotation and add instrumentation
    let mut transformed = node.clone();
    if let Pat::Ident(id) = &mut transformed.name {
        id.type_ann = None;
    }

    // Add producer wrapper around the function
    if let Some(init) = transformed.init {
        if let Expr::Arrow(arrow) = *init {
            transformed.init = Some(Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: Callee::Expr(Box::new(Expr::Ident(Ident::new("producer".into(), DUMMY_SP)))),
                args: vec![
                    ExprOrSpread {
                        spread: None,
                        expr: Box::new(Expr::Object(ObjectLit {
                            span: DUMMY_SP,
                            props: vec![PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                key: PropName::Ident(Ident::new("buildId".into(), DUMMY_SP)),
                                value: Box::new(Expr::Lit(Lit::Str(Str {
                                    span: DUMMY_SP,
                                    value: build_id.clone().into(),
                                    raw: None,
                                }))),
                            })))],
                        })),
                    },
                    ExprOrSpread {
                        spread: None,
                        expr: Box::new(Expr::Arrow(arrow)),
                    },
                ],
                type_args: None,
            })));
        }
    }

    InstrumentationOutput {
        build_id,
        imports: vec![producer_import],
        transformed_node: transformed,
    }
}