# kind.js API

The npm package is named `kind-js`; the file and the global are `kind.js` /
`kind`. The exported value is a callable function with `of`, `is` and
`supports` properties.

```js
const kind = require( 'kind-js' );
```

## Checking kinds

### kind.of

#### `kind.of( value ) -> String`

Returns the kind of a value. The value is classified with
`Object.prototype.toString`, so boxed primitives, cross-realm built-ins and
modern object tags are reported accurately. `null` and `undefined` are special
cased as `"Null"` and `"undefined"`.

```javascript
kind.of( [ 1, 2, 3 ] );       // "Array"
kind.of( new Map() );         // "Map"
kind.of( null );              // "Null"
kind.of( undefined );         // "undefined"
kind.of( 1n );                // "BigInt"
kind.of( async function(){} );// "AsyncFunction"
kind.of( ( function*(){} )() );// "Generator"
```

### kind( value ) -> String

Alias of `kind.of`.

```javascript
kind( [ 1, 2, 3 ] );   // "Array"
```

## Comparing kinds

### kind.is

#### `kind.is( value, kind ) -> Boolean`

Compares the kind of a value with a string. It is strict about the reported
kind, so `kind.is( null, 'Object' )` is `false`.

```javascript
kind.is( [ 1, 2, 3 ], 'Array' );   // true
kind.is( [ 1, 2, 3 ], 'Object' );  // false
```

### kind( value, kind ) -> Boolean

Alias of `kind.is`.

```javascript
kind( [ 1, 2, 3 ], 'Array' );   // true
```

## Feature detection

### kind.supports

#### `kind.supports( [ id ] ) -> Boolean | Object`

With an id, reports whether the host provides a detected feature. Without an
id, returns the whole feature map. Treat the returned map as read-only.

```javascript
kind.supports( 'map' );   // true
kind.supports();          // { 'arraybuffer': true, 'map': true, ... }
```

Detected ids include `arraybuffer`, `array-isarray`, `comment`, `dataview`,
`document`, `documentfragment`, `element`, `finalizationregistry`, `map`,
`node`, `number-isfinite`, `number-isinteger`, `number-isnan`,
`number-issafeinteger`, `number-max_safe_integer`, `number-min_safe_integer`,
`promise`, `set`, `symbol`, `text`, `weakmap`, `weakref` and `weakset`.

## Primitive checkers

### kind.is.boolean

#### `kind.is.boolean( value ) -> Boolean`

True only for Boolean primitives. Boxed booleans are objects.

```javascript
kind.is.boolean( true );                // true
kind.is.boolean( new Boolean( true ) ); // false
```

### kind.is.bigInt

#### `kind.is.bigInt( value ) -> Boolean`

True only for BigInt primitives. Boxed BigInts are objects.

```javascript
kind.is.bigInt( 1n );          // true
kind.is.bigInt( Object( 1n ) );// false
```

### kind.is.number

#### `kind.is.number( value ) -> Boolean`

True for finite Numbers. `Infinity`, `-Infinity` and `NaN` are deliberately
excluded; `kind.of` still reports them as `"Number"`. Use `kind.is.nan` or
`kind.is.number.finite` when those values matter. Boxed numbers are objects.

```javascript
kind.is.number( 1.5 );                 // true
kind.is.number( Infinity );            // false
kind.is.number( NaN );                 // false
kind.is.number( new Number( 5 ) );     // false
```

### kind.is.number.finite

#### `kind.is.number.finite( value ) -> Boolean`

Alias of `kind.is.number`.

### kind.is.number.integer

#### `kind.is.number.integer( value ) -> Boolean`

```javascript
kind.is.number.integer( 10 );      // true
kind.is.number.integer( 1.5 );     // false
kind.is.number.integer( Infinity );// false
```

### kind.is.number.safe

#### `kind.is.number.safe( value ) -> Boolean`

True for integers within the safe integer range.

```javascript
kind.is.number.safe( Number.MAX_SAFE_INTEGER );      // true
kind.is.number.safe( Number.MAX_SAFE_INTEGER + 2 );  // false
```

### kind.is.string

#### `kind.is.string( value ) -> Boolean`

True only for String primitives. Boxed strings are objects.

```javascript
kind.is.string( 'text' );              // true
kind.is.string( new String( 'text' ) );// false
```

### kind.is.symbol

#### `kind.is.symbol( value ) -> Boolean`

True only for Symbol primitives. Boxed symbols are objects.

```javascript
kind.is.symbol( Symbol( 'x' ) );          // true
kind.is.symbol( Object( Symbol( 'x' ) ) );// false
```

### kind.is.null

#### `kind.is.null( value ) -> Boolean`

```javascript
kind.is.null( null );   // true
kind.is.null( {} );     // false
```

### kind.is.undefined

#### `kind.is.undefined( value ) -> Boolean`

```javascript
kind.is.undefined( undefined );   // true
kind.is.undefined( null );        // false
```

### kind.is.primitive

#### `kind.is.primitive( value ) -> Boolean`

True for `null`, `undefined`, Booleans, Numbers (including non-finite ones),
BigInts, Strings and Symbols. Objects, functions and boxed primitives are not
primitives.

```javascript
kind.is.primitive( 'text' );   // true
kind.is.primitive( 1n );       // true
kind.is.primitive( {} );       // false
```

### kind.is.nan

#### `kind.is.nan( value ) -> Boolean`

```javascript
kind.is.nan( NaN ); // true
kind.is.nan( 10 );  // false
```

### kind.is.numeric

#### `kind.is.numeric( value ) -> Boolean`

True for finite Numbers, BigInts and values that `parseFloat` converts to a
finite Number. Symbols are never numeric. Conversion failures return `false`
instead of throwing.

```javascript
kind.is.numeric( 10 );       // true
kind.is.numeric( '4.5' );    // true
kind.is.numeric( 1n );       // true
kind.is.numeric( 'abc' );    // false
kind.is.numeric( Symbol() ); // false
```

## Object checkers

### kind.is.object

#### `kind.is.object( value ) -> Boolean`

True for objects and functions. `null`, primitives and boxed primitives are
handled as expected: boxed primitives are objects.

```javascript
kind.is.object( {} );                   // true
kind.is.object( function(){} );         // true
kind.is.object( new Boolean( true ) );  // true
kind.is.object( null );                 // false
kind.is.object( false );                // false
```

### kind.is.object.plain

#### `kind.is.object.plain( value ) -> Boolean`

True for plain objects: object literals, `Object.create( null )` and plain
objects created in another realm. Class instances, arrays, Maps, Arguments
objects and boxed primitives are not plain.

```javascript
kind.is.object.plain( {} );                 // true
kind.is.object.plain( Object.create( null ) ); // true
kind.is.object.plain( [] );                 // false
kind.is.object.plain( new Map() );          // false
```

### kind.is.host

#### `kind.is.host( value ) -> Boolean`

True for non-primitive values. It is kept for historical reasons and is
effectively the same as `kind.is.object`.

```javascript
kind.is.host( {} );    // true
kind.is.host( 'text' );// false
kind.is.host( null );  // false
```

### kind.is.empty

#### `kind.is.empty( value ) -> Boolean`

- Strings, arrays, typed arrays and array-like values are empty when their
  `length` is `0`.
- Maps and Sets are empty when their `size` is `0`.
- ArrayBuffers and DataViews are empty when their `byteLength` is `0`.
- Other objects and functions are empty when they have no own enumerable
  properties.
- WeakMap, WeakSet, WeakRef and FinalizationRegistry values cannot be inspected
  and are never considered empty.
- Primitives, `null` and `undefined` return `false`.

```javascript
kind.is.empty( [] );                     // true
kind.is.empty( {} );                     // true
kind.is.empty( '' );                     // true
kind.is.empty( [ 1, 2, 3 ] );            // false
kind.is.empty( new Map() );              // true
kind.is.empty( new Map( [ [ 'a', 1 ] ] ) );// false
kind.is.empty( new ArrayBuffer( 8 ) );   // false
kind.is.empty( null );                   // false
```

## Function checkers

### kind.is.function

#### `kind.is.function( value ) -> Boolean`

True for functions, including async and generator functions and classes.

```javascript
kind.is.function( function(){} );      // true
kind.is.function( async function(){} );// true
kind.is.function( class Foo {} );      // true
kind.is.function( [ 1, 2, 3 ] );       // false
```

### kind.is.asyncFunction

#### `kind.is.asyncFunction( value ) -> Boolean`

```javascript
kind.is.asyncFunction( async function(){} ); // true
kind.is.asyncFunction( function(){} );       // false
```

### kind.is.generatorFunction

#### `kind.is.generatorFunction( value ) -> Boolean`

```javascript
kind.is.generatorFunction( function*(){} );      // true
kind.is.generatorFunction( async function*(){} );// false
```

### kind.is.asyncGeneratorFunction

#### `kind.is.asyncGeneratorFunction( value ) -> Boolean`

```javascript
kind.is.asyncGeneratorFunction( async function*(){} ); // true
```

### kind.is.generator

#### `kind.is.generator( value ) -> Boolean`

True for generator objects, not generator functions.

```javascript
kind.is.generator( ( function*(){} )() );      // true
kind.is.generator( function(){} );             // false
```

### kind.is.asyncGenerator

#### `kind.is.asyncGenerator( value ) -> Boolean`

True for async generator objects.

```javascript
kind.is.asyncGenerator( ( async function*(){} )() ); // true
```

## Collection checkers

### kind.is.array

#### `kind.is.array( value ) -> Boolean`

```javascript
kind.is.array( [ 1, 2, 3 ] );        // true
kind.is.array( new Int8Array() );    // false
kind.is.array( {} );                 // false
```

### kind.is.arrayLike

#### `kind.is.arrayLike( value ) -> Boolean`

True for strings, arrays, typed arrays, Arguments objects and any non-function
object with a safe, non-negative integer `length`.

```javascript
kind.is.arrayLike( [ 1, 2, 3 ] );        // true
kind.is.arrayLike( 'text' );             // true
kind.is.arrayLike( ( function(){ return arguments; } )() ); // true
kind.is.arrayLike( new Int8Array() );    // true
kind.is.arrayLike( function( a, b ){} ); // false
```

### kind.is.arguments

#### `kind.is.arguments( value ) -> Boolean`

True for Arguments objects, including strict-mode Arguments objects. The check
uses the object tag and never reads the poison-pill `callee` property.

```javascript
( function(){
    kind.is.arguments( arguments );   // true
} )();

kind.is.arguments( [ 1, 2, 3 ] );      // false
kind.is.arguments( { length: 1, callee: function(){} } ); // false
```

### kind.is.arrayBuffer

#### `kind.is.arrayBuffer( value ) -> Boolean`

```javascript
kind.is.arrayBuffer( new ArrayBuffer( 8 ) );   // true
kind.is.arrayBuffer( new Uint8Array() );       // false
```

### kind.is.dataView

#### `kind.is.dataView( value ) -> Boolean`

```javascript
kind.is.dataView( new DataView( new ArrayBuffer( 8 ) ) ); // true
kind.is.dataView( new Uint8Array() );                     // false
```

### kind.is.typedArray

#### `kind.is.typedArray( value ) -> Boolean`

True for typed arrays, including BigInt typed arrays. DataViews are excluded.

```javascript
kind.is.typedArray( new Uint8Array() );    // true
kind.is.typedArray( new BigInt64Array() ); // true
kind.is.typedArray( new DataView( new ArrayBuffer( 8 ) ) ); // false
kind.is.typedArray( [] );                  // false
```

### kind.is.map

#### `kind.is.map( value ) -> Boolean`

```javascript
kind.is.map( new Map() );   // true
kind.is.map( [ 1, 2, 3 ] ); // false
```

### kind.is.set

#### `kind.is.set( value ) -> Boolean`

```javascript
kind.is.set( new Set() );   // true
kind.is.set( [ 1, 2, 3 ] ); // false
```

### kind.is.weakMap

#### `kind.is.weakMap( value ) -> Boolean`

```javascript
kind.is.weakMap( new WeakMap() ); // true
kind.is.weakMap( new Map() );     // false
```

### kind.is.weakSet

#### `kind.is.weakSet( value ) -> Boolean`

```javascript
kind.is.weakSet( new WeakSet() ); // true
```

### kind.is.weakRef

#### `kind.is.weakRef( value ) -> Boolean`

```javascript
kind.is.weakRef( new WeakRef( {} ) ); // true
```

### kind.is.finalizationRegistry

#### `kind.is.finalizationRegistry( value ) -> Boolean`

```javascript
kind.is.finalizationRegistry( new FinalizationRegistry( function(){} ) ); // true
```

### kind.is.iterable

#### `kind.is.iterable( value ) -> Boolean`

True for values with a callable `Symbol.iterator`. Strings are iterable. Async
generators are not synchronously iterable.

```javascript
kind.is.iterable( [ 1, 2, 3 ] );     // true
kind.is.iterable( 'text' );          // true
kind.is.iterable( new Map() );       // true
kind.is.iterable( new WeakMap() );   // false
```

### kind.is.asyncIterable

#### `kind.is.asyncIterable( value ) -> Boolean`

True for values with a callable `Symbol.asyncIterator`.

```javascript
kind.is.asyncIterable( ( async function*(){} )() ); // true
kind.is.asyncIterable( 'text' );                    // false
```

## Promise checkers

### kind.is.promise

#### `kind.is.promise( value ) -> Boolean`

True for native and cross-realm Promises, and for thenables that also expose a
callable `catch`.

```javascript
kind.is.promise( Promise.resolve( 1 ) );          // true
kind.is.promise( { then(){}, catch(){} } );       // true
kind.is.promise( { then(){} } );                  // false
```

### kind.is.thenable

#### `kind.is.thenable( value ) -> Boolean`

True for any object with a callable `then`.

```javascript
kind.is.thenable( { then(){} } ); // true
```

## Date, RegExp and Error checkers

### kind.is.date

#### `kind.is.date( value ) -> Boolean`

```javascript
kind.is.date( new Date() ); // true
kind.is.date( {} );         // false
```

### kind.is.regExp

#### `kind.is.regExp( value ) -> Boolean`

True for RegExp instances, including cross-realm instances. Objects that merely
look like a RegExp are not accepted.

```javascript
kind.is.regExp( /test/i );  // true
kind.is.regExp( { test(){}, exec(){}, ignoreCase: false } ); // false
```

### kind.is.error

#### `kind.is.error( value ) -> Boolean`

```javascript
kind.is.error( new Error() );       // true
kind.is.error( new TypeError() );   // true
kind.is.error( '' );                // false
```

## Node checkers

Node checks work in browsers and also accept duck-typed objects with a string
`nodeName` and a numeric `nodeType`, which covers cross-realm and server-side
values.

### kind.is.node

#### `kind.is.node( value ) -> Boolean`

```javascript
kind.is.node( document );       // true
kind.is.node( document.body );  // true
kind.is.node( { nodeName: 'DIV', nodeType: 1 } ); // true
kind.is.node( {} );             // false
```

### kind.is.node.comment

#### `kind.is.node.comment( value ) -> Boolean`

### kind.is.node.document

#### `kind.is.node.document( value ) -> Boolean`

### kind.is.node.documentFragment

#### `kind.is.node.documentFragment( value ) -> Boolean`

### kind.is.node.element

#### `kind.is.node.element( value ) -> Boolean`

### kind.is.node.text

#### `kind.is.node.text( value ) -> Boolean`

```javascript
kind.is.node.element( { nodeName: 'DIV', nodeType: 1 } ); // true
kind.is.node.text( { nodeName: '#text', nodeType: 3 } );  // true
```

## Behavior notes

- Checkers return booleans and avoid throwing on hostile inputs, including
  revoked proxies and objects with throwing `Symbol.toPrimitive` or
  `Symbol.toStringTag` hooks.
- Cross-realm built-ins are detected through object tags in addition to
  `instanceof`, so values from iframes, workers and `node:vm` contexts work.
- `kind.is.host` is equivalent to `kind.is.object` for all non-primitive values
  and remains for backwards compatibility.
- `kind.is.number` excludes non-finite values while `kind.of` reports them as
  `"Number"`. This deliberate split is documented above and is a candidate for
  the next major release.
