import * as vscode from 'vscode';
import { PackageChangeWatcher } from './PackageChangeWatcher';

export function activate(context: vscode.ExtensionContext) {
	
	console.log('Congratulations, your extension "refresh-packages" is now active!');
	
	if (vscode.workspace.rootPath) {
		const watchPackages = new PackageChangeWatcher();
		watchPackages.init();

		vscode.workspace.onDidChangeTextDocument(e => watchPackages.listenToPackageChanges(e));
		vscode.workspace.onDidCreateFiles(e => watchPackages.listenToPackageChanges(e));
		vscode.workspace.onDidDeleteFiles(e => watchPackages.listenToPackageChanges(e));
	}
}

// this method is called when your extension is deactivated
export function deactivate() {}
