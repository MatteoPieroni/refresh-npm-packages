# Refresh NPM Packages

Refresh NPM Packages is the VS Code extension that prompts you to run a fresh install when you pull an updated package-lock.json or yarn.lock.

## Requirements

This extension is intended for workspaces that have source control and for which the lock file might be updated on the remotes.

This extension only works when opening a workspace folder in VS Code that contains at least one lock file for NPM Packages.

## Known Issues

At the moment there are no known issues. If you find any please contibute using the repo [issues tab](https://github.com/MatteoPieroni/refresh-npm-packages/issues)

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release:
- watch for changes on `package-lock.json` or `yarn.lock` files
- prompt to run `npm ci` or `yarn`

-----------------------------------------------------------------------------------------------------------

**Enjoy!**
