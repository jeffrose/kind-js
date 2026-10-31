# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.0] - 2026-10-31

Prepared for release. Not yet published to npm.

### Added

- Modern checkers: `kind.is.bigInt`, `kind.is.asyncFunction`,
  `kind.is.asyncGenerator`, `kind.is.asyncGeneratorFunction`,
  `kind.is.asyncIterable`, `kind.is.generator`, `kind.is.generatorFunction`,
  `kind.is.weakRef` and `kind.is.finalizationRegistry`.
- `kind.supports( [ id ] )` exposes the host feature detection table.
- ES module entry point (`kind.mjs`) with default and named exports, while the
  original UMD/CommonJS file remains the `require` entry.
- TypeScript declarations (`kind.d.ts`) covering the callable API and all
  checkers.
- Cross-realm detection for ArrayBuffers, DataViews, Dates, Errors, Maps, Sets,
  WeakMaps, WeakSets, Promises, RegExps, Symbols, BigInts and typed arrays.
- Expanded test suite (83 tests) using the built-in `node:test` runner, with a
  behavior table covering 122 fixtures across 48 checkers.
- GitHub Actions CI for Node.js 20, 22 and 24, plus type declaration checking.
- `CHANGELOG.md` and this release's documentation updates.

### Changed

- npm package name is now `kind-js`; the GitHub repository moved to
  `jeffrose/kind-js` and the default branch moved from `master` to `main`.
- Development tooling replaced gulp 3, mocha 2, chai 2 and istanbul with the
  built-in Node.js test runner and coverage reporter. The package now has zero
  runtime dependencies.
- `kind.is.arrayLike` now treats strings as array-like.
- `kind.is.object.plain` now checks the prototype chain, so null-prototype and
  cross-realm plain objects are included; Arguments objects, class instances
  and boxed primitives are excluded.
- `kind.is.empty` now honours Map/Set `size`, buffer `byteLength`, and treats
  weak collections and registries as never empty.
- `kind.is.numeric` accepts BigInts, rejects Symbols and never throws on failed
  conversions.
- `kind.is.host` is now documented as "non-primitive" and returns a boolean for
  every input instead of throwing.
- `kind.is.arguments` now uses the object tag only; objects that merely expose a
  `callee` property are no longer treated as Arguments.
- `kind.is.regExp` no longer accepts objects that only look like a RegExp.
- `kind.is.node.*` recognises cross-realm and duck-typed nodes by
  `nodeName`/`nodeType` when `instanceof` fails.
- `kind.is.arrayBuffer` no longer reports typed arrays as ArrayBuffers. The
  previous false positive came from the broken Node feature detection.
- `kind.is.iterable` now correctly reports arrays, typed arrays and strings as
  iterable in Node. The previous false negatives came from the same bug.
- `kind.is.typedArray` uses `ArrayBuffer.isView`, includes BigInt typed arrays,
  and no longer throws on null-prototype array-likes.
- The source is now parsed in strict mode internally, while remaining
  ES5-compatible for old hosts.

### Fixed

- `kind.is.host()` threw for every input because a local variable shadowed the
  `kind` function.
- `kind.is.arguments` was silently never installed: non-strict functions carry a
  non-configurable `arguments` property that swallowed assignment. It is now
  defined with `Object.defineProperty`.
- Feature detection used `this` as the UMD root, so every feature was reported
  as missing when loaded as CommonJS in Node. It now prefers `globalThis`.
- The DataView feature id was misspelled (`dataView` vs `dataview`).
- `kind.is.numeric()` threw for Symbols; `kind.is.typedArray()` threw for
  null-prototype array-likes; strict-mode Arguments objects could throw when
  `.callee` was read.
- `kind.is.object.plain()` returned false for null-prototype and cross-realm
  plain objects.
- `kind.of()` threw when a value's `Symbol.toStringTag` getter threw.
- All checkers now return `false` instead of throwing for revoked proxies and
  objects with throwing `Symbol.toStringTag`, `Symbol.toPrimitive`, `length`,
  `then` or `catch` accessors.
- Missing semicolon after `kind.is.symbol`.

### Removed

- `bower.json` (the Bower registry is discontinued).
- `gulpfile.js` and the old build dependencies.
- The `.callee` duck-typing fallback in `kind.is.arguments` and the
  RegExp-lookalike fallback in `kind.is.regExp`.

### Compatibility

- The public API and call styles are unchanged: `kind( value )`,
  `kind( value, kindName )`, `kind.of`, `kind.is` and every existing checker are
  still available.
- The library remains UMD and works in CommonJS, AMD, browsers and ES modules.
- `kind.is.number` still excludes `Infinity`/`NaN`, and `kind.is.host` remains
  available; both are kept for compatibility.

## Earlier versions

Versions 0.4.0 and earlier predate this changelog. See the git history for
details.
