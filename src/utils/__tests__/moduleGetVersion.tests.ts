import * as fs from 'fs';

export function moduleGetVersion(path: string): string {
	if (!fs.existsSync(path)) {
		return '0';
	}
	const modulePackageJson = JSON.parse(fs.readFileSync(path, 'utf-8'));

	return modulePackageJson.version;
}