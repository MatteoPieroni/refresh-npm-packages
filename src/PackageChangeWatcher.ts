import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { DependenciesStore } from './DependenciesStore';
import { moduleGetVersion } from './utils/moduleGetVersion';
import { ModulesStore, StoredModules, StoreEquality } from './ModulesStore';
import { matchPackages } from './utils/matchPackages';

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

interface Checker {
	isPackageLock: boolean,
	isYarnLock: boolean,
}

export class PackageChangeWatcher {
	private packagesStore: DependenciesStore;
	private modulesStore: ModulesStore;
	private isYarn: boolean;
	private doubleSafeGuard: boolean;

	constructor() {
		this.packagesStore = new DependenciesStore();
		this.modulesStore = new ModulesStore();
		this.isYarn = false;
		this.doubleSafeGuard = false;
	}

	public init() {
		this.storeDependencies();
		this.storeModules();
		this.checkYarn();
	}

	private getDependencies(): PackageJson | false {
		const packageJsonAddress = path.join(vscode.workspace.rootPath || '', 'package.json');
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
			const modulesPath = path.join(vscode.workspace.rootPath || '', 'node_modules');
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
			const modulePackagePath = `${path.join(vscode.workspace.rootPath || '', 'node_modules')}/${singleModule[0]}/package.json`;
			return {
				...acc,
				[singleModule[0]]: moduleGetVersion(modulePackagePath)
			};
		}, {});
	}

	// TODO: other paths?
	private checkYarn(): void {
		const yarnLockAddress = path.join(vscode.workspace.rootPath || '', 'yarn.lock');
		this.isYarn = fs.existsSync(yarnLockAddress);
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

	private async checkAndGenerateWarning({ isPackageLock, isYarnLock }: Checker) {
		// TODO: remove this check
		if (isPackageLock || isYarnLock) {
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
	}

	// change to listen only to package-lock or yarn-lock
	public listenToPackageChanges(e: vscode.TextDocumentChangeEvent | vscode.FileCreateEvent | vscode.FileDeleteEvent) {
		const { document } = e as vscode.TextDocumentChangeEvent;
		const { files } = e as vscode.FileCreateEvent | vscode.FileDeleteEvent;

		if (document && !document.isDirty) {
			const checks = matchPackages(document.fileName);
			this.checkAndGenerateWarning(checks);
		}

		if (files && files.length > 0) {
			const checks = matchPackages(files.map(file => file.path));
			this.checkAndGenerateWarning(checks);
		}
	}
}