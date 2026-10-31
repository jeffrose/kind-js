# kind.js

> A simple, dependency-free type-checking utility for JavaScript

[![CI](https://github.com/jeffrose/kind-js/actions/workflows/ci.yml/badge.svg)](https://github.com/jeffrose/kind-js/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

`kind.js` answers two questions about any value: **what kind is it?** and **is it this
kind?** It works in Node, browsers, AMD loaders, CommonJS and ES modules, has no
runtime dependencies, and ships with TypeScript declarations.

The npm package is named **`kind-js`** because the historical `kind.js` name is
retired on npm. The project and the file are still called kind.js.

## Installation

```sh
npm install kind-js
```

Or load it directly in a browser:

```html
<script src="https://unpkg.com/kind-js/kind.js"></script>
<script>
    kind.of( [] );        // "Array"
    kind( [], 'Array' );  // true
</script>
```

## Usage

```js
// CommonJS
const kind = require( 'kind-js' );

// ES modules
import kind from 'kind-js';
import { is, of } from 'kind-js';
```

```js
kind.of( [] );                 // "Array"
kind.of( null );               // "Null"
kind.of( 1n );                 // "BigInt"
kind.of( async function(){} ); // "AsyncFunction"

kind( [] );                    // "Array"  (same as kind.of)
kind( [], 'Array' );           // true     (same as kind.is)
kind.is( [], 'Array' );        // true
kind.is.array( [] );           // true
kind.is.number.finite( 1 );    // true
kind.is.object.plain( {} );    // true
```

`kind.of` and `kind.is` are the same functions exposed as properties, so all three
call styles below are equivalent:

```js
kind( value );
kind.of( value );

kind( value, kindName );
kind.is( value, kindName );
```

### Feature detection

```js
kind.supports( 'map' );   // true in any modern host
kind.supports();          // every detected feature as an object
```

### Checkers

| Checker | True for |
| --- | --- |
| `kind.is.arguments` | Arguments objects |
| `kind.is.array` | Arrays |
| `kind.is.arrayBuffer` | ArrayBuffers |
| `kind.is.arrayLike` | Arrays, strings, typed arrays, Arguments and other length-bearing values |
| `kind.is.asyncFunction` | Async functions |
| `kind.is.asyncGenerator` | Async generator objects |
| `kind.is.asyncGeneratorFunction` | Async generator functions |
| `kind.is.asyncIterable` | Values exposing `Symbol.asyncIterator` |
| `kind.is.bigInt` | BigInt primitives |
| `kind.is.boolean` | Boolean primitives |
| `kind.is.dataView` | DataViews |
| `kind.is.date` | Dates |
| `kind.is.empty` | Empty strings, arrays, buffers, Maps, Sets and objects without own enumerable properties |
| `kind.is.error` | Errors, including subclasses |
| `kind.is.finalizationRegistry` | FinalizationRegistry instances |
| `kind.is.function` | Functions, including async and generator functions |
| `kind.is.generator` | Generator objects |
| `kind.is.generatorFunction` | Generator functions |
| `kind.is.host` | Non-primitive values (objects and functions) |
| `kind.is.iterable` | Values exposing `Symbol.iterator`, including strings |
| `kind.is.map` | Maps |
| `kind.is.nan` | `NaN` |
| `kind.is.node` | DOM Nodes, or node-shaped objects |
| `kind.is.node.comment` | Comment nodes |
| `kind.is.node.document` | Document nodes |
| `kind.is.node.documentFragment` | DocumentFragment nodes |
| `kind.is.node.element` | Element nodes |
| `kind.is.node.text` | Text nodes |
| `kind.is.null` | `null` |
| `kind.is.number` | Finite Numbers (see note below) |
| `kind.is.number.finite` | Alias of `kind.is.number` |
| `kind.is.number.integer` | Integer Numbers |
| `kind.is.number.safe` | Safe integer Numbers |
| `kind.is.numeric` | Numbers, BigInts and values `parseFloat` can convert |
| `kind.is.object` | Objects and functions |
| `kind.is.object.plain` | Plain objects, null-prototype objects and cross-realm plain objects |
| `kind.is.primitive` | Primitive values |
| `kind.is.promise` | Promises and promise-like thenables that expose `catch` |
| `kind.is.regExp` | Regular expressions |
| `kind.is.set` | Sets |
| `kind.is.string` | String primitives |
| `kind.is.symbol` | Symbol primitives |
| `kind.is.thenable` | Values with a callable `then` |
| `kind.is.typedArray` | Typed arrays, including BigInt typed arrays |
| `kind.is.undefined` | `undefined` |
| `kind.is.weakMap` | WeakMaps |
| `kind.is.weakRef` | WeakRefs |
| `kind.is.weakSet` | WeakSets |

### Behavior notes

- `kind.is.number` deliberately excludes `Infinity`, `-Infinity` and `NaN`, while
  `kind.of` reports them as `"Number"`. Use `kind.is.nan` or
  `kind.is.number.finite` when those values matter. This split is kept for
  backwards compatibility and is a candidate for the next major release.
- `kind.is.empty` uses `size` for Maps and Sets, `byteLength` for buffers, and
  own enumerable properties for other objects. Weak collections and registries
  cannot be inspected, so they are never considered empty.
- `kind.is.object.plain` checks the prototype, so `Object.create( null )` and
  plain objects from another realm are included. Arguments objects, class
  instances and boxed primitives are not.
- `kind.is.host` returns `true` for every non-primitive value. It exists for
  historical reasons and is effectively the same as `kind.is.object`.
- Checkers avoid throwing on hostile inputs such as revoked proxies and objects
  with throwing `Symbol.toPrimitive` or `Symbol.toStringTag` hooks.

Full API documentation lives in [docs/api.md](docs/api.md).

## Compatibility

- Node.js 18 and newer; every modern browser.
- UMD: CommonJS, AMD, ES modules (via the included wrapper) and browser globals.
- The library source stays ES5-compatible so it can be loaded by older hosts; the
  tests and tooling use modern JavaScript.
- TypeScript declarations cover the callable API and every checker.

## Development

```sh
npm install
npm test           # node:test suite
npm run typecheck  # TypeScript declarations
npm run test:coverage
```

The behavior table in `test/expectations.js` is checked against every fixture in
`test/constants.js`; adding a fixture or checker is a matter of updating those
files.

## License

[Apache-2.0](LICENSE) © Jeff Rose

See [CHANGELOG.md](CHANGELOG.md) for release notes.
