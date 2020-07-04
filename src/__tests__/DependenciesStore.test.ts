import * as assert from 'assert';

import { DependenciesStore } from '../DependenciesStore';

describe('DependenciesStore', () => {
	describe('stores an object and returns equality with previous state', () => {
		it('starts with an empty object', () => {
			const store = new DependenciesStore();

			assert.deepEqual(store.storeNew({}, {}), true);
		});

		it('returns true when updating with same value', () => {
			const store = new DependenciesStore();
			store.storeNew({ test: 'test' }, { testDev: 'test dev' });

			assert.deepEqual(store.storeNew({ test: 'test' }, { testDev: 'test dev' }), true);
		});

		it('returns false when updating with different value', () => {
			const store = new DependenciesStore();
			store.storeNew({ test: 'test' }, { testDev: 'test dev' });

			assert.deepEqual(store.storeNew({}, {}), false);
		});

		it('returns false when updating with different deep value', () => {
			const store = new DependenciesStore();
			store.storeNew({ test: 'test' }, { testDev: 'test dev' });

			assert.deepEqual(store.storeNew({ test: 'test1' }, { testDev: 'test dev' }), false);
			assert.deepEqual(store.storeNew({ test: 'test1' }, { testDev: 'test dev 1' }), false);
		});
	});
});