use swc_core::ecma::{
    ast::*,
    visit::{Visit, VisitWith},
};
use swc_core::common::DUMMY_SP;

use crate::types::{PluginConfig, InstrumentationOutput, ENGINE_KEYWORDS};
use crate::utils::{instrument_producer, instrument_view};

pub struct VariableVisitor {
    pub config: PluginConfig,
    pub instrumentation_output: Option<InstrumentationOutput>,
}

impl VariableVisitor {
    pub fn new(config: PluginConfig) -> Self {
        Self {
            config,
            instrumentation_output: None,
        }
    }
}

impl Visit for VariableVisitor {
    fn visit_var_declarator(&mut self, n: &VarDeclarator) {
        n.visit_children_with(self);

        // Check if we have a type annotation
        if let Pat::Ident(id) = &n.name {
            if let Some(type_ann) = &id.type_ann {
                if let TsType::TsTypeRef(type_ref) = &*type_ann.type_ann {
                    if let TsEntityName::Ident(type_name) = &type_ref.type_name {
                        let keyword = type_name.sym.to_string();
                        
                        if !ENGINE_KEYWORDS.contains(&keyword.as_str()) {
                            return;
                        }

                        // Validate init is an arrow function
                        if let Some(init) = &n.init {
                            if !matches!(**init, Expr::Arrow(_)) {
                                panic!("Invalid usage: {} must be initialized with an arrow function", keyword);
                            }
                        }

                        // Handle object pattern
                        if matches!(n.name, Pat::Object(_)) {
                            panic!("Invalid usage: Cannot use object pattern with {} type", keyword);
                        }

                        let output = match keyword.as_str() {
                            "producer" => instrument_producer(&self.config, n),
                            "view" => instrument_view(&self.config, n),
                            _ => unreachable!(),
                        };

                        self.instrumentation_output = Some(output);
                    }
                }
            }
        }
    }
}