'use strict';

// Fixture values used by the behavior table in test/expectations.js.
// Every key here is checked against every kind.is.* checker.

class ExampleClass {}

const CONSTANTS = {
    // Typed arrays
    FLOAT32_ARRAY_EMPTY       : new Float32Array(),
    FLOAT64_ARRAY_EMPTY       : new Float64Array(),
    INT8_ARRAY_EMPTY          : new Int8Array(),
    INT16_ARRAY_EMPTY         : new Int16Array(),
    INT32_ARRAY_EMPTY         : new Int32Array(),
    UINT8_ARRAY_EMPTY         : new Uint8Array(),
    UINT8_CLAMPED_ARRAY_EMPTY : new Uint8ClampedArray(),
    UINT16_ARRAY_EMPTY        : new Uint16Array(),
    UINT32_ARRAY_EMPTY        : new Uint32Array(),
    BIGINT64_ARRAY_EMPTY      : new BigInt64Array(),
    BIGUINT64_ARRAY_EMPTY     : new BigUint64Array(),
    INT8_ARRAY_NONEMPTY       : new Int8Array( [ 1, 2, 3 ] ),
    UINT8_ARRAY_NONEMPTY      : new Uint8Array( [ 1, 2, 3 ] ),

    // Buffers and views
    ARRAY_BUFFER_EMPTY   : new ArrayBuffer( 0 ),
    ARRAY_BUFFER_NONEMPTY: new ArrayBuffer( 8 ),
    DATA_VIEW_EMPTY      : new DataView( new ArrayBuffer( 0 ) ),
    DATA_VIEW_NONEMPTY   : new DataView( new ArrayBuffer( 8 ) ),

    // Strings
    STRING_EMPTY               : '',
    STRING_NONEMPTY            : 'a string',
    STRING_WHITESPACE          : ' ',
    STRING_VIA_CONSTRUCTOR     : new String( 'constructed' ),
    STRING_NEGATIVE_INTEGER    : '-10',
    STRING_POSITIVE_INTEGER    : '5',
    STRING_OCTAL_LITERAL       : '040',
    STRING_HEX_LITERAL         : '0xFF',
    STRING_POSITIVE_FLOAT      : '4.5385',
    STRING_NEGATIVE_FLOAT      : '-5.592',
    STRING_EXPONENTIAL         : '123e4',
    STRING_NEGATIVE_EXPONENTIAL: '-83e-6',
    STRING_BEGIN_NUMBER        : '10abcdef',
    STRING_END_NUMBER          : 'abcdef10',
    STRING_WRAP_NUMBER         : '10abcd10',
    STRING_WRAPPED_NUMBER      : 'abc10def',

    // Numbers
    NUMBER_ZERO                : 0,
    NUMBER_NEGATIVE_ZERO       : -0,
    NUMBER_POSITIVE            : 1000,
    NUMBER_NEGATIVE            : -1000,
    NUMBER_FLOAT_POSITIVE      : 1.5,
    NUMBER_FLOAT_NEGATIVE      : -3.6,
    NUMBER_EXPONENTIAL_POSITIVE: 1.2e3,
    NUMBER_EXPONENTIAL_NEGATIVE: -1.2e3,
    NUMBER_HEX_POSITIVE        : 0xAB,
    NUMBER_HEX_NEGATIVE        : -0xCC,
    NUMBER_INFINITY            : Infinity,
    NUMBER_NEGATIVE_INFINITY   : -Infinity,
    NUMBER_MAX_SAFE_INTEGER    : Number.MAX_SAFE_INTEGER,
    NUMBER_MIN_SAFE_INTEGER    : Number.MIN_SAFE_INTEGER,
    NUMBER_UNSAFE_INTEGER      : Number.MAX_SAFE_INTEGER + 2,
    NUMBER_VIA_CONSTRUCTOR     : new Number( 5 ),
    NAN                        : NaN,

    // BigInts
    BIGINT_ZERO          : 0n,
    BIGINT_POSITIVE      : 1000n,
    BIGINT_NEGATIVE      : -1000n,
    BIGINT_VIA_CONSTRUCTOR: Object( 1n ),

    // Booleans
    BOOLEAN_TRUE           : true,
    BOOLEAN_FALSE          : false,
    BOOLEAN_VIA_CONSTRUCTOR: new Boolean( true ),

    // Null and undefined
    NULL     : null,
    UNDEFINED: undefined,

    // Thenables and promises
    THENABLE               : { constructor: function Thenable(){}, then: function(){} },
    THENABLE_CATCHLESS     : { then: function(){} },
    THENABLE_WITH_CATCH    : { then: function(){}, catch: function(){} },
    PROMISE_NONNATIVE      : new NonNativePromise(),
    PROMISE_NATIVE         : Promise.resolve( 1 ),
    PROMISE_PENDING        : new Promise( function(){} ),

    // Regular expressions, dates and errors
    REGEXP                 : /regexp/,
    REGEXP_VIA_CONSTRUCTOR : new RegExp( 'regexp_via_constructor' ),
    OBJECT_REGEXP_LIKE     : { test: function(){}, exec: function(){}, ignoreCase: false },
    DATE                   : new Date(),
    DATE_INVALID           : new Date( NaN ),
    ERROR                  : new Error( 'an error' ),
    ERROR_TYPE             : new TypeError( 'a type error' ),

    // Functions
    FUNCTION                                 : function(){},
    FUNCTION_CONSTRUCTOR                     : function(){},
    FUNCTION_VIA_CONSTRUCTOR                 : new Function( 'return true' ),
    FUNCTION_CONSTRUCTOR_WITH_PROPERTY_ONLY  : function( p ){ this.prop = p; },
    FUNCTION_CONSTRUCTOR_WITH_PROTOTYPE_ONLY : function(){},
    ASYNC_FUNCTION                           : async function(){},
    GENERATOR_FUNCTION                       : function*(){},
    ASYNC_GENERATOR_FUNCTION                 : async function*(){},

    // Generator objects
    GENERATOR      : ( function*(){} )(),
    ASYNC_GENERATOR: ( async function*(){} )(),

    // Symbols
    SYMBOL                : Symbol( 'kind' ),
    SYMBOL_VIA_CONSTRUCTOR: Object( Symbol( 'boxed' ) ),

    // Arrays and arguments
    ARRAY_LITERAL_EMPTY : [],
    ARRAY_LITERAL_NUMBER: [ 1, 2, 3 ],
    ARRAY_LITERAL_STRING: [ 'a', 'b', 'c' ],
    ARRAY_NEW_EMPTY     : new Array(),
    ARRAY_NEW_NONEMPTY  : new Array( 3 ),
    ARGUMENTS           : makeArguments( 1, 2, 3 ),
    ARGUMENTS_EMPTY     : makeArguments(),

    // Objects
    OBJECT_LITERAL_EMPTY                   : {},
    OBJECT_LITERAL_NONEMPTY                : { a: 1, b: 2 },
    OBJECT_USER_DEFINED_EMPTY              : new PlaceholderConstructor(),
    OBJECT_USER_DEFINED_PROTOTYPE_ONLY     : new PrototypeOnlyConstructor(),
    OBJECT_USER_DEFINED                    : new PrototypeOnlyConstructor(),
    OBJECT_NULL_PROTOTYPE                  : Object.create( null ),
    OBJECT_NULL_PROTOTYPE_WITH_PROPERTY    : Object.assign( Object.create( null ), { a: 1 } ),
    OBJECT_CONSTRUCTOR_OVERRIDDEN          : { constructor: null },
    CLASS_CONSTRUCTOR                      : ExampleClass,
    CLASS_INSTANCE                         : new ExampleClass(),
    ARRAY_LIKE_OBJECT                      : { 0: 'a', 1: 'b', length: 2 },
    ARRAY_LIKE_NEGATIVE                    : { length: -1 },
    ARRAY_LIKE_STRING_LENGTH               : { length: '2' },

    // Collections
    MAP_EMPTY        : new Map(),
    MAP_NONEMPTY     : new Map( [ [ 'a', 1 ] ] ),
    SET_EMPTY        : new Set(),
    SET_NONEMPTY     : new Set( [ 1 ] ),
    WEAK_MAP_EMPTY   : new WeakMap(),
    WEAK_MAP_NONEMPTY: new WeakMap( [ [ {}, 1 ] ] ),
    WEAK_SET_EMPTY   : new WeakSet(),
    WEAK_SET_NONEMPTY: new WeakSet( [ {} ] ),
    WEAK_REF         : new WeakRef( {} ),
    FINALIZATION_REGISTRY: new FinalizationRegistry( function(){} ),

    // Iterables
    ITERABLE_OBJECT      : { [ Symbol.iterator ]: function(){ return [][ Symbol.iterator ](); } },
    ASYNC_ITERABLE_OBJECT: {
        [ Symbol.asyncIterator ]: function(){
            return {
                next: function(){
                    return Promise.resolve( { done: true, value: undefined } );
                }
            };
        }
    },

    // DOM-like nodes (duck-typed fallback shape, no browser required)
    NODE_ELEMENT          : { nodeName: 'DIV', nodeType: 1 },
    NODE_TEXT             : { nodeName: '#text', nodeType: 3 },
    NODE_COMMENT          : { nodeName: '#comment', nodeType: 8 },
    NODE_DOCUMENT         : { nodeName: '#document', nodeType: 9 },
    NODE_DOCUMENT_FRAGMENT: { nodeName: '#document-fragment', nodeType: 11 }
};

// Constructor functions used by the fixtures above. Declared after CONSTANTS
// so they can be referenced while the object literal is being built.

function NonNativePromise(){}
NonNativePromise.prototype.then = NonNativePromise.prototype[ 'catch' ] = function(){};

function PlaceholderConstructor(){}
PlaceholderConstructor.prototype.aMethod = function(){};
PlaceholderConstructor.prototype.aProperty = 'protoPropValue';

function PrototypeOnlyConstructor(){}
PrototypeOnlyConstructor.prototype.aMethod = function(){};
PrototypeOnlyConstructor.prototype.aProperty = 'protoPropValue';

function PropertyConstructor( p ){ this.prop = p; }

function makeArguments(){
    return arguments;
}

// Derived fixtures. These need a constructor reference or instance wiring, so
// they are assigned after the literal is created.
CONSTANTS.OBJECT_USER_DEFINED_WITH_PROPERTIES = new PropertyConstructor( 'propertyValue' );
CONSTANTS.OBJECT_USER_DEFINED_EMPTY = new PlaceholderConstructor();
CONSTANTS.OBJECT_USER_DEFINED_PROTOTYPE_ONLY = new PrototypeOnlyConstructor();
CONSTANTS.OBJECT_USER_DEFINED = new PrototypeOnlyConstructor();
CONSTANTS.OBJECT_USER_DEFINED.aProperty = 'propValue';

module.exports = CONSTANTS;
