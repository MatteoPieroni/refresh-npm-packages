# Refresh NPM Packages

Refresh NPM Packages is the VS Code extension that prompts you to run a fresh install when you pull an updated package-lock.json or yarn.lock.

![Refresh NPM Packages demo](https://raw.githubusercontent.com/MatteoPieroni/refresh-npm-packages/main/images/refresh-npm-packages.gif)

## Settings

You can set your preference for the rebuild command when a `package-lock.json` is detected.

This setting defaults to `npm ci`, but you can change it in VS Code settings.

![Refresh NPM Packages setting default npm ci](https://raw.githubusercontent.com/MatteoPieroni/refresh-npm-packages/main/images/refresh-npm-packages-settings-1.png)


![Refresh NPM Packages setting npm i](https://raw.githubusercontent.com/MatteoPieroni/refresh-npm-packages/main/images/refresh-npm-packages-settings-2.png)

## Requirements

This extension is intended for workspaces that have source control and for which the lock file might be updated on the remotes.

This extension only works when opening a workspace folder in VS Code that contains at least one lock file for NPM Packages.

## Known Issues

At the moment there are no known issues. If you find any please contibute using the repo [issues tab](https://github.com/MatteoPieroni/refresh-npm-packages/issues)

## Release Notes

See [changelog](https://github.com/MatteoPieroni/refresh-npm-packages/blob/main/CHANGELOG.md)

-----------------------------------------------------------------------------------------------------------

**Enjoy!**
