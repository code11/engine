"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const init_1 = require("./init");
function activate(context) {
    (0, init_1.default)(context);
    context.subscriptions.push(vscode.commands.registerCommand('engine.dashboard.start', () => {
        EngineDashboardPanel.createOrShow(context.extensionUri);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('extension.refreshButtons', () => {
        (0, init_1.default)(context);
    }));
    // context.subscriptions.push(
    // 	vscode.commands.registerCommand('catCoding.doRefactor', () => {
    // 		if (CatCodingPanel.currentPanel) {
    // 			CatCodingPanel.currentPanel.doRefactor();
    // 		}
    // 	})
    // );
    if (vscode.window.registerWebviewPanelSerializer) {
        // Make sure we register a serializer in activation event
        vscode.window.registerWebviewPanelSerializer(EngineDashboardPanel.viewType, {
            async deserializeWebviewPanel(webviewPanel, state) {
                console.log(`Got state: ${state}`);
                // Reset the webview options so we use latest uri for `localResourceRoots`.
                webviewPanel.webview.options = getWebviewOptions(context.extensionUri);
                EngineDashboardPanel.revive(webviewPanel, context.extensionUri);
            }
        });
    }
}
exports.activate = activate;
function getWebviewOptions(extensionUri) {
    return {
        // Enable javascript in the webview
        enableScripts: true,
        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
    };
}
/**
 * Manages cat coding webview panels
 */
class EngineDashboardPanel {
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        // Set the webview's initial html content
        this._update();
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // Update the content based on view changes
        this._panel.onDidChangeViewState(e => {
            if (this._panel.visible) {
                this._update();
            }
        }, null, this._disposables);
        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'alert':
                    vscode.window.showErrorMessage(message.text);
                    return;
            }
        }, null, this._disposables);
    }
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        // If we already have a panel, show it.
        if (EngineDashboardPanel.currentPanel) {
            EngineDashboardPanel.currentPanel._panel.reveal(column);
            return;
        }
        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(EngineDashboardPanel.viewType, 'Engine Dashboard', column || vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
        });
        EngineDashboardPanel.currentPanel = new EngineDashboardPanel(panel, extensionUri);
    }
    static revive(panel, extensionUri) {
        EngineDashboardPanel.currentPanel = new EngineDashboardPanel(panel, extensionUri);
    }
    doRefactor() {
        // Send a message to the webview webview.
        // You can send any JSON serializable data.
        this._panel.webview.postMessage({ command: 'refactor' });
    }
    dispose() {
        EngineDashboardPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    _update() {
        const webview = this._panel.webview;
        // Vary the webview's content based on where it is located in the editor.
        switch (this._panel.viewColumn) {
            // case vscode.ViewColumn.Two:
            // 	this._updateForCat(webview, 'Compiling Cat');
            // 	return;
            // case vscode.ViewColumn.Three:
            // 	this._updateForCat(webview, 'Testing Cat');
            // 	return;
            // case vscode.ViewColumn.One:
            default:
                this._updateForCat(webview, 'Engine Dashboard');
                return;
        }
    }
    _updateForCat(webview, catName) {
        this._panel.title = catName;
        this._panel.webview.html = this._getHtmlForWebview(webview, catName);
    }
    _getHtmlForWebview(webview, catGifPath) {
        // Local path to main script run in the webview
        const scriptPathOnDisk = vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js');
        // And the uri we use to load this script in the webview
        const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
        // Local path to css styles
        const styleResetPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css');
        const stylesPathMainPath = vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css');
        // Uri to load styles into webview
        const stylesResetUri = webview.asWebviewUri(styleResetPath);
        const stylesMainUri = webview.asWebviewUri(stylesPathMainPath);
        // Use a nonce to only allow specific scripts to be run
        const nonce = getNonce();
        return `<!DOCTYPE html>
		<html lang="en">
		
		<head>
			<meta charset="UTF-8">
			<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
		
			<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
						and only allow scripts that have a specific nonce.
						-->
			<title>Engine Dashboard</title>
		</head>
		
		<body>
			<input onblur="insertIframe(this)" placeholder="dashboard ip:port">
			<h1 id="lines-of-code-counter">0</h1>
			<script nonce="${nonce}" src="${scriptUri}"></script>
		</body>
		
		</html>`;
    }
}
EngineDashboardPanel.viewType = 'engineDashboard';
function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=extension.js.map