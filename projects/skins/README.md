# Skins

## Install

Run `npm i @ng-flexy/skins --save`

In app-module.ts import

`FlexySkinsModule.forRoot(['default', 'dark'])`

In index.html add

```javascript
let buildId = 123;
document.write('<link href="styles/default.css?b=' + buildId + '" rel="stylesheet" data-skin="default" disabled/>');
document.write('<link href="styles/dark.css?b=' + buildId + '" rel="stylesheet" data-skin="dark" disabled/>');
```

In angular.json

```json
"build": {
    "builder": "@angular-devkit/build-angular:browser",
    "options": {
      "extractCss": true,
      "styles": [
        {
          "input": "projects/demo/src/scss/light-skin/index.scss",
          "lazy": true,
          "bundleName": "styles/default"
        },
        {
          "input": "projects/demo/src/scss/dark-skin/index.scss",
          "lazy": true,
          "bundleName": "styles/dark"
        }
      ],
      "scripts": [
        "node_modules/@ng-flexy/skins/scripts/skin-switcher.js"
      ]
    }
  }
}
```
