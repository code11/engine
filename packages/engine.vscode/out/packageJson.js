"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildConfigFromPackageJson = exports.getPackageJson = void 0;
const vscode_1 = require("vscode");
const getPackageJson = async () => new Promise(resolve => {
    const cwd = vscode_1.workspace.rootPath;
    try {
        const packageJson = require(`${cwd}/package.json`);
        resolve(packageJson);
    }
    catch (e) {
        resolve(undefined);
    }
});
exports.getPackageJson = getPackageJson;
const buildConfigFromPackageJson = async (defaultColor) => {
    const pkg = await (0, exports.getPackageJson)();
    if (!pkg) {
        return [];
    }
    const { scripts } = pkg;
    return Object.keys(scripts).map(key => ({
        command: `npm run ${key}`,
        color: defaultColor || 'white',
        name: key,
        singleInstance: true
    }));
};
exports.buildConfigFromPackageJson = buildConfigFromPackageJson;
//# sourceMappingURL=packageJson.js.map