// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    var disposable = vscode.commands.registerCommand('extension.output.send', function () {
        // vscode.window.showInformationMessage('request send');
        try {
            var restful = require('./src/restful');
            new restful(vscode, 'output');
            
            /**
             * markdown.showPreview
/Applications/Visual Studio Code.app/Contents/Resources/app/node_modules/arr-diff/README.md
             */
            // var markdown = 'markdown.showPreview';
            // var repath = '/Applications/Visual Studio Code.app/Contents/Resources/app/node_modules/arr-diff/README.md';
            
            // vscode.commands.executeCommand(MARKDOWN_PREVIEW, vscode.Uri.parse('file://' + readmePath));
            // vscode.commands.executeCommand(markdown, vscode.Uri.parse('file://' + repath));
            // vscode.commands.executeCommand('vscode.previewHtml', vscode.Uri.parse('file://' + repath));
            // var languageId = vscode.window.activeTextEditor.document.languageId;
            
            // var r = vscode.window.createTerminal('Code');
            // r.sendText('sdf');
            // var _outputChannel = vscode.window.createOutputChannel('Code');
            // _outputChannel.clear();
            // _outputChannel.show(true);
            // _outputChannel.appendLine("[Running] rest");
            // _outputChannel.append('{"aa":"bb"}');
        } catch (error) {
            vscode.window.showWarningMessage(error);
        }
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;