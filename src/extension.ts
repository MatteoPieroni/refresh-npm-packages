import * as vscode from 'vscode';
import { PackageChangeWatcher } from './PackageChangeWatcher';
import { findFilePromise } from './utils/findFilePromise';

let allWatchers: PackageChangeWatcher[] = [];

const createWatchers = async () => {
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
};

const killWatchers = () => {
	if (allWatchers.length > 0) {
		allWatchers.forEach(watcher => watcher.destroy());
	}
};

export async function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand('refresh-npm-packages.enable', () => {
			if (allWatchers.length === 0) {
				createWatchers();
			} else {
				killWatchers();
				createWatchers();
			}
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('refresh-npm-packages.disable', () => {
				killWatchers();
		})
	);

	createWatchers();

}

// this method is called when your extension is deactivated
export function deactivate() {
	killWatchers();
}
