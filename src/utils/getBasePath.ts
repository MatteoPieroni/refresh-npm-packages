export function getBasePath(path: string) {
	const finalPath = path.replace(/(\/|\\)(package-lock\.json|yarn.lock)/, '');
	return finalPath;
}