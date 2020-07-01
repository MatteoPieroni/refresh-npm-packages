export function getBasePath(path: string) {
	const finalPath = path.replace(/^file\:(\/)+/, '').replace(/(\/|\\)(package-lock\.json|yarn.lock)/, '');
	const isWindowsPath = !path.match(/\//)?.length || path.match(/\//)?.length === 0;
	return isWindowsPath ? finalPath : `/${finalPath}`;
}