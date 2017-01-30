# morph-expressions

[![Build Status](https://travis-ci.org/abukurov/morph-expressions.svg?branch=master)](https://travis-ci.org/abukurov/morph-expressions)
[![Coverage Status](https://coveralls.io/repos/github/abukurov/morph-expressions/badge.svg?branch=master)](https://coveralls.io/github/abukurov/morph-expressions?branch=master)
[![David](https://img.shields.io/david/abukurov/morph-expressions.svg)]()
[![npm](https://img.shields.io/npm/dt/morph-expressions.svg)](https://www.npmjs.com/package/morph-expressions)
[![MIT](https://img.shields.io/npm/l/morph-expressions.svg)](https://github.com/abukurov/morph-expressions/blob/master/LICENSE.md)
[![NPM Version](https://img.shields.io/npm/v/morph-expressions.svg)](https://www.npmjs.com/package/morph-expressions)

An extremely efficient and flexible parser for Math or Logical expression using Javascript. It has all the basic functions supported with extensive support for new functions, variable etc.

##Install
```
$ npm install morph-expressions
```

## Usage

```javascript
import Parser from 'morph-expressions';
const parser = new Parser();

const compiled = parser.parse('1 + 1');
compiled.eval(); // returns 2
```

You can also specify `scope`:

```javascript
const compiled = parser.parse('x + 1 - y == 0');
compiled.identifiers; // ['x', 'y'] - returns list of identifiers, which used in expression
compiled.eval({ x: 2, y: 3 }); // returns true

//Or

parser.parseAndEval('x + 1 - y == 0', { x: 2, y: 3 });  // returns true
```

For register the custom function or computed properties

```javascript
parser.registerFunction('sqr', value => value * value);

parser.parseAndEval('sqr(sqr(x))', { x: 2 });  // returns 16
```

## Test

To execute tests for the library, install the project dependencies once:

    npm install

Then, the tests can be executed:

    npm test
