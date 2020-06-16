import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

function pathExists(p: string): boolean {
	try {
		fs.accessSync(p);
	} catch (err) {
		return false;
	}
	return true;
}

export function getDepsInPackageJson(packageJsonPath: string): any {
	if (pathExists(packageJsonPath)) {
		const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

		const deps = packageJson.dependencies
			? Object.keys(packageJson.dependencies).map(dep =>
				console.log(dep, packageJson.dependencies[dep])
			)
			: [];

		console.log(deps);
		//   return deps.concat(devDeps);
	} else {
		return [];
	}
}