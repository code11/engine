use swc_core::ecma::{
    transforms::testing::test,
    visit::as_folder,
};
use engine_swc_plugin_syntax::EngineSyntaxVisitor;

#[test]
fn basic_plugin_test() {
    test!(
        Default::default(),
        |_| as_folder(EngineSyntaxVisitor::new()),
        // Test input
        r#"const x = 1;"#,
        // Expected output
        r#"const x = 1;"#,
        // Test name
        ok("should pass through basic code")
    );
}