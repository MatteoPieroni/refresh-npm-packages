const deepEqual = require('deep-equal');

export interface StoredModules {
	[name: string]: string;
}

export interface StoreEquality {
	shallow: boolean;
	deep: boolean;
}

export class ModulesStore {
	private modules: StoredModules;

	constructor() {
		this.modules = {};
	}

	private comparePreviousDeps(modules: StoredModules): StoreEquality {
		const oldModules = Object.keys(this.modules);
		const newModules = Object.keys(modules);

		if (oldModules.length !== newModules.length) {
			return {
				shallow: false,
				deep: false,
			};
		}
		
		try {
			const shallowEqual = oldModules.filter(singleModule => !newModules.includes(singleModule)).length === 0;
			return {
				shallow: shallowEqual,
				deep: deepEqual(this.modules, modules),
			};
		} catch(e) {
			return {
				shallow: false,
				deep: false,
			};
		}
	}

	public storeNew(modules: StoredModules): StoreEquality {
		const areEqual = this.comparePreviousDeps(modules);

		this.modules = modules;

		return areEqual;
	}
}