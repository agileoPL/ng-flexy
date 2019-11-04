# @ng-flexy

Rapid ui development tools for Angular 8+ applications

## Modules

### core

Install: `npm i --save @ng-flexy/core`

Docs: <a href="https://ng-flexy.io/core">https://ng-flexy.io/core</a>

### freezer

Install: `npm i --save @ng-flexy/freezer`

Docs: <a href="https://ng-flexy.io/freezer">https://ng-flexy.io/freezer</a>

### skins

Install: `npm i --save @ng-flexy/skins`

Docs: <a href="https://ng-flexy.io/skins">https://ng-flexy.io/skins</a>

### toasts

Install: `npm i --save @ng-flexy/toasts`

Docs: <a href="https://ng-flexy.io/toasts">https://ng-flexy.io/toasts</a>

### json-impexp

Install: `npm i --save @ng-flexy/json-impexp`

Docs: <a href="https://ng-flexy.io/json-impexp">https://ng-flexy.io/json-impexp</a>

# Library development

## Install

Init dependencies `npm install --no-optional`

Build projects

Run: `npm i --save-optional && npm run core:build && npm i dist/core --no-optional && npm run freezer:build && npm i dist/freezer --no-optional && npm run skins:build && npm i dist/skins --no-optional && npm run toasts:build && npm i dist/toasts --no-optional && npm run json-impexp:build && npm i dist/json-impexp --no-optional && npm run layout:build && npm i dist/layout --no-optional && npm run form:build && npm i dist/form --no-optional && npm run form-bootstrap:build && npm i dist/form-bootstrap --no-optional`

or

`npm run build:projects`

Start demo `npm run demo`

## Create new library

Based on https://medium.com/better-programming/angular-7-series-part-2-create-custom-library-8d7a0494b2cc

Run `ng g library {lib_name} --prefix=flexy`

e.g.: `ng g library freezer --prefix=flexy`

### Build library and add to Demo

Run `ng build {lib_name}`

e.g.: `ng build freezer`

#### Add prefix @ng-flexy to project package.json

```json5
{
  name: '@ng-flexy/freezer',
  version: '0.0.1',
  peerDependencies: {
    '@angular/common': '^8.1.3',
    '@angular/core': '^8.1.3'
  }
}
```

#### Change paths in tsconfig.json

```json5
{
  paths: {
    '@ng-flexy/freezer': ['dist/freezer'],
    '@ng-flexy/freezer/*': ['dist/freezer/*']
  }
}
```

#### Add to package json

`"optionalDependencies": { "@flexy/freezer": "file:dist/freezer" }`
or
Run `npm install dist/freezer --save-optional`

## Develop

`npm run demo`

### Watch project e.g.

Run `npm run skins:watch`

Run `npm run skins:watch-scripts`

Run `npm run demo`

### Npm publish

`./publish {project_name}`

### Demo publish

npm install -g firebase-tools
firebase login
firebase init

ng build demo
firebase deploy
