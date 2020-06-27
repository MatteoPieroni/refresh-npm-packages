export function matchPackages(path: string | string[]) {
	if (Array.isArray(path)) {
		return {
			isPackageLock: !!path.some(single => single.match(/.*\/package-lock.json/)),
			isYarnLock: !!path.some(single => single.match(/.*\/yarn.lock/)),
		};
	}

	return {
		isPackageLock: !!path.match(/.*\/package-lock.json/),
		isYarnLock: !!path.match(/.*\/yarn.lock/),
	};
}