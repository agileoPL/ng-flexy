# Core

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.3.

#### Install

run `npm i --save @ng-flexy/core`

## Models

Flexy model is a very easy/loose implementation of domain object / data transfer object pattern.

FlexyModel separates the application layer from the API layer - FlexyData

Docs: <a href="./src/lib/models/README.md">Readme</a>


## Pipes

#### flexyTruncate

Based on <a href="https://lodash.com/docs/4.17.15#truncate" target="_blank">Lodash truncate</a>. Truncates string if it's longer than the given maximum string length. The last characters of the truncated string are replaced with the omission string which defaults to "...".

Parameters

- length: number - required
- omission: default: '...'
- separator: default: ' '

e.g.
`{{ 'Lorem ipsum dolor sit amet' | flexyTruncate:10 }}` => `Lorem...`

`{{ 'Lorem ipsum dolor sit amet' | flexyTruncate:10:'.':'' }}` => `Lorem ips.`

#### flexyEmpty

Expose empty values

Parameters

- emptyMark: default: '---'

e.g.
`{{ '' | flexyEmpty }}` => `---`

`{{ null | flexyEmpty:'--' }}` => `--`

`{{ false | flexyEmpty:'--' }}` => `--`

#### flexyCamelCase

Based on <a href="https://lodash.com/docs/4.17.15#camelCase" target="_blank">Lodash camelCase</a>. Converts string to camel case.

e.g.
`{{ 'Foo Bar' | flexyCamelCase }}` => `fooBar`

`{{ '--foo-bar--' | flexyCamelCase }}` => `fooBar`

`{{ '__FOO_BAR__' | flexyCamelCase }}` => `fooBar`
