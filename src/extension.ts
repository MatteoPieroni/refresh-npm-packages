// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { getDepsInPackageJson } from './readPackage';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "refresh-packages" is now active!');

	if (!vscode.workspace.rootPath) {
		console.log('vscode');
		vscode.window.showInformationMessage('No dependency in empty workspace');
	} else {		
		vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.fileName.match(/package.json/) && !e.document.isDirty) {
				vscode.window.showWarningMessage('One of the project dependencies has been updated, please run yarn!');
			}
		});

		const packageJsonPath = path.join(vscode.workspace.rootPath, 'package.json');
		// } else {
			//   vscode.window.showInformationMessage('Workspace has no package.json');
			//   return Promise.resolve([]);
			// }
			
		getDepsInPackageJson(packageJsonPath);
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
