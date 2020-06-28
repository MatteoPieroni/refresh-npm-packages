import * as vscode from 'vscode';
import { PackageChangeWatcher } from './PackageChangeWatcher';
import { findFilePromise } from './utils/findFilePromise';

let allWatchers: PackageChangeWatcher[] = [];

export async function activate(context: vscode.ExtensionContext) {
	
	console.log('Congratulations, your extension "refresh-packages" is now active!');
	
	if (vscode.workspace.rootPath) {
		const packageLocks = await findFilePromise('**/package-lock.json');
		const yarnLocks = await findFilePromise('**/yarn.lock');
		const allLocks = [...packageLocks, ...yarnLocks];

		allLocks.forEach(singleLock => {
			const watchPackages = new PackageChangeWatcher(singleLock);
			allWatchers.push(watchPackages);

			watchPackages.init();
		});
	}
}

// this method is called when your extension is deactivated
export function deactivate() {
	if (allWatchers.length > 0) {
		allWatchers.forEach(watcher => watcher.destroy());
	}
}
