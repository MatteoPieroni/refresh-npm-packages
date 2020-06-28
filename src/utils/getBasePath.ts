export function getBasePath(path: string) {
	return `/${path.replace(/^file\:(\/)+/, '').replace(/\/(package-lock\.json|yarn.lock)/, '')}`;
}