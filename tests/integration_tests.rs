use swc_core::ecma::{
    parser::{Syntax, TsConfig},
    transforms::testing::test,
    visit::as_folder,
};
use swc_core::plugin::proxies::TransformPluginProgramMetadata;

use engine_swc_plugin::process_transform;

fn run_test(input: &str, expected: &str) {
    let metadata = TransformPluginProgramMetadata::default();
    test!(
        Syntax::Typescript(TsConfig {
            tsx: true,
            ..Default::default()
        }),
        |_| as_folder(process_transform(metadata.clone())),
        input,
        expected,
        true
    );
}

#[test]
fn test_view_transform() {
    run_test(
        "const foo: view = ({ foo = observe.foo }) => {};",
        r#"import { view } from "engineViewLibrary";
        const foo = view({ buildId: "unique_id" }, ({ foo = observe.foo }) => {});"#,
    );
}

#[test]
fn test_producer_transform() {
    run_test(
        "const foo: producer = ({ foo = observe.foo }) => {};",
        r#"import { producer } from "engineViewLibrary";
        const foo = producer({ buildId: "unique_id" }, ({ foo = observe.foo }) => {});"#,
    );
}

#[test]
fn test_multiple_declarations() {
    run_test(
        r#"
        const foo: view = ({ foo = observe.foo }) => {};
        const bar: view = ({ bar = observe.bar }) => {};
        "#,
        r#"import { view } from "engineViewLibrary";
        const foo = view({ buildId: "unique_id" }, ({ foo = observe.foo }) => {});
        const bar = view({ buildId: "unique_id" }, ({ bar = observe.bar }) => {});"#,
    );
}

#[test]
fn test_empty_arguments() {
    run_test(
        "const foo: view = () => {};",
        r#"import { view } from "engineViewLibrary";
        const foo = view({ buildId: "unique_id" }, () => {});"#,
    );
}

#[test]
fn test_props_handling() {
    run_test(
        "const foo: view = ({ prop }) => {};",
        r#"import { view } from "engineViewLibrary";
        const foo = view({ buildId: "unique_id" }, ({ prop }) => {});"#,
    );
}

#[test]
#[should_panic(expected = "Invalid usage")]
fn test_invalid_syntax() {
    run_test(
        "const foo: view = 123;",
        "",
    );
}

#[test]
#[should_panic(expected = "Invalid usage")]
fn test_object_pattern() {
    run_test(
        "const { foo }: view = () => {};",
        "",
    );
}