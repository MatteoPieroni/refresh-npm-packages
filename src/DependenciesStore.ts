const deepEqual = require('deep-equal');

export type Dependency = {
	name: string;
	version: string;
};

interface StoredDependencies {
	[name: string]: string;
}

export class DependenciesStore {
	private deps: StoredDependencies;
	private devDeps: StoredDependencies;

	constructor() {
		this.deps = {};
		this.devDeps = {};
	}

	private comparePreviousDeps(deps: StoredDependencies, devDeps: StoredDependencies): boolean {
		const oldDeps = Object.keys(this.deps);
		const oldDevDeps = Object.keys(this.devDeps);
		const newDeps = Object.keys(deps);
		const newDevDeps = Object.keys(devDeps);

		if (oldDeps.length !== newDeps.length || oldDevDeps.length !== newDevDeps.length) {
			return false;
		}
		
		try {
			return deepEqual(this.deps, deps) && deepEqual(this.devDeps, devDeps);
		} catch(e) {
			return false;
		}
	}

	public storeNew(deps: StoredDependencies, devDeps: StoredDependencies): boolean {
		const areEqual = this.comparePreviousDeps(deps, devDeps);

		this.deps = deps;
		this.devDeps = devDeps;

		return areEqual;
	}
}