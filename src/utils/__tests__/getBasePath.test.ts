const assert = require('assert');

const { getBasePath } = require('../getBasePath.ts');

describe('utils | getBasePath', () => {
	it('it should return the location of the package-lock file', () => {
		assert.strictEqual(getBasePath('/home/test/src/package-lock.json'), '/home/test/src');
	});
});