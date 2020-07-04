import * as assert from 'assert';

import { getBasePath } from '../getBasePath';

describe('utils | getBasePath', () => {
	it('should return the location of the package-lock file', () => {
		assert.strictEqual(getBasePath('/home/test/src/package-lock.json'), '/home/test/src');
		assert.strictEqual(getBasePath('c:\\user\\test\\src\\package-lock.json'), 'c:\\user\\test\\src');
	});
	
	it('should return the location of the yarn.lock file', () => {
		assert.strictEqual(getBasePath('/home/test/src/yarn.lock'), '/home/test/src');
		assert.strictEqual(getBasePath('c:\\user\\test\\src\\yarn.lock'), 'c:\\user\\test\\src');
	});

	it('should return a string as is if no package-lock or yarn.lock is present', () => {
		assert.strictEqual(getBasePath('test'), 'test');
		assert.strictEqual(getBasePath('/home/test'), '/home/test');
		assert.strictEqual(getBasePath('d:\\test\\'), 'd:\\test\\');
	});
});