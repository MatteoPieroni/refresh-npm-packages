# Change Log

All notable changes to the "npm-refresh-packages" extension will be documented in this file.

## 1.3.1

09 Jul 2020

### Bugfix

* Changed readme with absolute path to settings image

## 1.3.0

09 Jul 2020

### Performance

* Change from running install in node childProcess to creation of shell (#7)

> This change was required since running the rebuild in a childProcess was consuming too much resources in workspaces with many dependencies

### Features

* Added setting to be able to run npm i instead of ci (#8)


## 1.2.1

06 Jul 2020

### Bugfix

* Changed readme with absolute path to gif

## 1.2.0

06 Jul 2020

### Features

* Allow multiple warnings for workspaces with multiple package.json (#5)

* Ability to run `npm ci` or `yarn` command and status notification (#6)

## 1.1.0

04 Jul 2020

### Features

* Updated bundling and reduced size to 39kb (#4)

### Chores

* Azure Pipelines CI/CD (#3)

* unit tests (#2)

* Updated Changelog

## 1.0.2

01 Jul 2020

### Bugfixes

* Added support for Windows filesystems

## 1.0.1

29 Jun 2020

### Features

Initial release:

* watch for changes on `package-lock.json` or `yarn.lock` files
* prompt to run `npm ci` or `yarn`
