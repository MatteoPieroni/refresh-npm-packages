import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { DependenciesStore } from './DependenciesStore';
import { moduleGetVersion } from './utils/moduleGetVersion';
import { ModulesStore, StoredModules, StoreEquality } from './ModulesStore';
import { getBasePath } from './utils/getBasePath';

// document could have changed from GIT (yes)
// from saving (yes) onDidSaveTextDocument
// from moving (yes?) onDidCreateFiles
// from creating without packages (no) could use a flag onDidCreateFiles
// from installing in terminal (no) onDidChangeWorkspaceFolders
// from removing in terminal (no) onDidChangeWorkspaceFolders
// setTimeout

type Dependency = { [key: string]: string };

type PackageJson = {
	dependencies?: Dependency;
	devDependencies?: Dependency;
};

export class PackageChangeWatcher {
	private packagesStore: DependenciesStore;
	private modulesStore: ModulesStore;
	private isYarn: boolean;
	private doubleSafeGuard: boolean;
	private basePath: string;
	private watcher: vscode.FileSystemWatcher;

	constructor(path: string) {
		const basePath = getBasePath(path);
		const isYarn = path.includes('yarn.lock');

		this.packagesStore = new DependenciesStore();
		this.modulesStore = new ModulesStore();
		this.isYarn = isYarn;
		this.doubleSafeGuard = false;
		this.basePath = basePath;
		this.watcher = vscode.workspace.createFileSystemWatcher(
			new vscode.RelativePattern(
				basePath,
				isYarn ? 'yarn.lock' : 'package-lock.json'
			),
			false,
			false,
			true,
		);
	}

	public init() {
		this.storeDependencies();
		this.storeModules();
		this.setListeners();
	}

	private getDependencies(): PackageJson | false {
		const packageJsonAddress = path.join(this.basePath, 'package.json');
		if (fs.existsSync(packageJsonAddress)) {
			try {
				return JSON.parse(fs.readFileSync(packageJsonAddress, 'utf-8')) as PackageJson;
			} catch (e) {
				return false;
			}
		}

		return false;
	}

	private toStoreDep(depsObject: Dependency) {
		return Object.keys(depsObject).reduce((acc, depName) => {
			return {
				...acc,
				[depName]: {
					name: depName,
					version: depsObject[depName]
				}
			};
		}, {});
	}

	private async getModules(): Promise<StoredModules | false> {
		return new Promise((resolve) => {
			const modulesPath = path.join(this.basePath, 'node_modules');
			if (!fs.existsSync(modulesPath)) {
				return resolve({});
			}

			try {
				vscode.workspace.fs.readDirectory(vscode.Uri.parse(modulesPath)).then(values => {
					const toStore = this.toStoreModule(values);

					return resolve(toStore);
				});
			} catch (e) {
				resolve({});
			}
		});
	}

	private toStoreModule(modulesArr: [string, vscode.FileType][]): Dependency {
		return modulesArr.reduce((acc, singleModule) => {
			const modulePackagePath = path.join(this.basePath, 'node_modules', singleModule[0], 'package.json');
			return {
				...acc,
				[singleModule[0]]: moduleGetVersion(modulePackagePath)
			};
		}, {});
	}

	private storeDependencies(): boolean | void {
		const packageJson = this.getDependencies();
		if (packageJson) {
			const { dependencies, devDependencies } = packageJson;
			const dependenciesToStore =
				typeof dependencies === 'object' ?
					this.toStoreDep(dependencies) :
					{};
			const devDependenciesToStore =
				typeof devDependencies === 'object' ?
					this.toStoreDep(devDependencies) :
					{};

			return this.packagesStore.storeNew(dependenciesToStore, devDependenciesToStore);
		}
	}

	private checkDependenciesChange(): boolean {
		return this.storeDependencies() || false;
	}

	private async storeModules(): Promise<StoreEquality> {
		const modules = await this.getModules();

		if (modules) {
			return this.modulesStore.storeNew(modules);
		}

		return {
			shallow: false,
			deep: false,
		};
	}

	private async checkModulesChange(): Promise<StoreEquality> {
		return await this.storeModules();
	}

	private warn() {
		if (!this.doubleSafeGuard) {
			vscode.window.showWarningMessage(
				`One of the project dependencies has been updated, please run ${
				this.isYarn ? 'yarn' : 'npm ci'
				}!`
			);
			this.doubleSafeGuard = true;
		}

		setTimeout(() => {
			this.doubleSafeGuard = false;
		}, 5000);
	}

	private async checkAndGenerateWarning(shouldSkip?: boolean) {
		if (shouldSkip) {
			return;
		}

		const depsAreEqual = this.checkDependenciesChange();
		const {
			shallow: modulesAreShallowEqual,
			deep: modulesAreDeepEqual
		} = await this.checkModulesChange();

		// changed package && lock => npm rm (deps different && node_modules different)
		// changed package && lock => npm i ...(deps different && node_modules different)
		if (!depsAreEqual && !modulesAreShallowEqual) {
			return;
		}

		// changed package && lock => git (deps changed && node_modules !different)
		if (!depsAreEqual && modulesAreShallowEqual) {
			this.warn();
			return;
		}

		// packagelock  && !package => npm i (equal node_modules && versions matching)
		if (depsAreEqual && modulesAreShallowEqual && !modulesAreDeepEqual) {
			return;
		}

		// packagelock  && !package => git (equal node_modules && versions !matching)
		if (depsAreEqual && modulesAreShallowEqual && modulesAreDeepEqual) {
			this.warn();
		}
	}

	private setListeners() {
		this.watcher.onDidChange((e) =>
			this.checkAndGenerateWarning(e.scheme === 'git'));
		this.watcher.onDidCreate((e) =>
			this.checkAndGenerateWarning(e.scheme === 'git'));
		// this.watcher.onDidDelete((e) =>
		// 	this.checkAndGenerateWarning(e.scheme === 'git'));
	}

	public destroy() {
		this.watcher.dispose();
	}
}