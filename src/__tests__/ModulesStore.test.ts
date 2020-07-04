import * as assert from 'assert';

import { ModulesStore } from '../ModulesStore';

const allFalse = {
	shallow: false,
	deep: false,
};

const allTrue = {
	shallow: true,
	deep: true,
};

const deepFalse = {
	shallow: true,
	deep: false,
};

describe('ModulesStore', () => {
	describe('stores an object and returns equality with previous state', () => {
		it('starts with an empty object', () => {
			const store = new ModulesStore();

			assert.deepEqual(store.storeNew({}), allTrue);
		});

		it('returns both true when updating with same value', () => {
			const store = new ModulesStore();
			store.storeNew({ test: 'test' });

			assert.deepEqual(store.storeNew({ test: 'test' }), allTrue);
		});

		it('returns both false when updating with different value', () => {
			const store = new ModulesStore();
			store.storeNew({ test: 'test' });

			assert.deepEqual(store.storeNew({}), allFalse);
		});

		it('returns deep false when updating with different deep value', () => {
			const store = new ModulesStore();
			store.storeNew({ test: 'test' });

			assert.deepEqual(store.storeNew({ test: 'test-1' }), deepFalse);
		});
	});
});