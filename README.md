# ng-flexy

Flexy components to build webapps

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Library

Based on https://medium.com/better-programming/angular-7-series-part-2-create-custom-library-8d7a0494b2cc

Run `ng g library {lib_name} --prefix=flexy`

e.g.: `ng g library freezer --prefix=flexy`

### Build library and add to Demo

Run `ng build {lib_name}`

e.g.: `ng build freezer`

#### Add to package json

`"optionalDependencies": { "@flexy/freezer": "file:dist/freezer" }`
or
Run `npm install dist/freezer --save-optional`

#### Init Demo

Run `npm install --no-optional`
then build library `ng build ng7-common`
finally, `run npm install`, this will install optional dependency which was skipped in 1.

### Developing

`npm run demo`

#### Skins

Run `npm run skins:watch`

Run `npm run skins:watch-scripts`

Run `npm run demo`
