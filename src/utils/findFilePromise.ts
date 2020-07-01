import * as vscode from 'vscode';

export function findFilePromise(
	include: vscode.GlobPattern,
	exclude?: string | vscode.RelativePattern | null | undefined,
	maxResults?: number | undefined,
	token?: vscode.CancellationToken | undefined
): Promise<string[]> {
	return new Promise(resolve => {
		return vscode.workspace.findFiles(include, exclude, maxResults, token).then(results => resolve(results.map(result => {
			return result.fsPath;
		})));
	});
};