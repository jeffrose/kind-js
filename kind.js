/*
 * kind.js — a simple checking utility
 * https://github.com/jeffrose/kind-js
 *
 * Copyright Jeff Rose
 * Licensed under the Apache License, Version 2.0.
 */
( function( root, factory ){
    // Simple feature detection. globalThis covers browsers, workers and Node;
    // the older fallbacks keep pre-globalThis hosts working.
    var features = {};

    if( root ){
        features = {
            'arraybuffer'               : 'ArrayBuffer'         in root,
            'array-isarray'             : 'isArray'             in Array,
            'comment'                   : 'Comment'             in root,
            'dataview'                  : 'DataView'            in root,
            'document'                  : 'Document'            in root,
            'documentfragment'          : 'DocumentFragment'    in root,
            'element'                   : 'Element'             in root,
            'finalizationregistry'      : 'FinalizationRegistry' in root,
            'map'                       : 'Map'                 in root,
            'node'                      : 'Node'                in root,
            'number-isfinite'           : 'isFinite'            in Number,
            'number-isinteger'          : 'isInteger'           in Number,
            'number-isnan'              : 'isNaN'               in Number,
            'number-issafeinteger'      : 'isSafeInteger'       in Number,
            'number-max_safe_integer'   : 'MAX_SAFE_INTEGER'    in Number,
            'number-min_safe_integer'   : 'MIN_SAFE_INTEGER'    in Number,
            'promise'                   : 'Promise'             in root,
            'set'                       : 'Set'                 in root,
            'symbol'                    : 'Symbol'              in root,
            'text'                      : 'Text'                in root,
            'weakmap'                   : 'WeakMap'             in root,
            'weakref'                   : 'WeakRef'             in root,
            'weakset'                   : 'WeakSet'             in root
        };
    }

    function has( id ){
        return typeof id !== 'undefined' ?
            features[ id ] :
            features;
    }

    if( typeof define === 'function' && define.amd ){
        define( function(){
            return factory( has );
        } );
    } else if( typeof exports !== 'undefined' && typeof module !== 'undefined' ){
        module.exports = factory( has );
    } else {
        root.kind = factory( has );
    }
} )(
    typeof globalThis !== 'undefined' ? globalThis :
        typeof self !== 'undefined' ? self :
            typeof window !== 'undefined' ? window :
                typeof global !== 'undefined' ? global : this,
    function( has ){
    'use strict';

    var
        hasOwnProperty  = Object.prototype.hasOwnProperty,
        toString        = Object.prototype.toString,
        getPrototypeOf  = Object.getPrototypeOf,

        /**
         * @const
         */
        KIND_REGEX = /^\[object (.*)\]$/,

        /**
         * @const
         * Tags reported by Object.prototype.toString for typed arrays. Used as a
         * fallback when ArrayBuffer.isView is unavailable.
         */
        TYPED_ARRAY_TAGS = {
            'BigInt64Array'     : true,
            'BigUint64Array'    : true,
            'Float16Array'      : true,
            'Float32Array'      : true,
            'Float64Array'      : true,
            'Int8Array'         : true,
            'Int16Array'        : true,
            'Int32Array'        : true,
            'Uint8Array'        : true,
            'Uint8ClampedArray' : true,
            'Uint16Array'       : true,
            'Uint32Array'       : true
        },

        /**
         * @const
         */
        MAX_SAFE_INTEGER = has( 'number-max_safe_integer' ) ?
            Number.MAX_SAFE_INTEGER :
            Math.pow( 2, 53 ) - 1,

        /**
         * @const
         */
        MIN_SAFE_INTEGER = has( 'number-min_safe_integer' ) ?
            Number.MIN_SAFE_INTEGER :
            -( MAX_SAFE_INTEGER );

    // Duck typing ES6 Map
    function isMapAPI( value ){
        return isWeakMapAPI( value ) && isIterableCollection( value );
    }

    function isBooleanType( value ){
        return value === !!value;
    }

    function isBigIntType( value ){
        return typeof value === 'bigint';
    }

    function isNumberType( value ){
        return typeof value === 'number';
    }

    function isStringType( value ){
        return typeof value === 'string';
    }

    function isSymbolType( value ){
        return typeof value === 'symbol';
    }

    // Validity check for .length and .size properties
    function isSafeSize( size ){
        return kind.is.number( size ) && size >= 0 && kind.is.number.safe( size );
    }

    // instanceof throws for revoked proxies and hostile Symbol.hasInstance hooks
    function isInstance( value, Constructor ){
        try {
            return value instanceof Constructor;
        } catch( error ){
            return false;
        }
    }

    // Node type reads can throw for hostile proxies
    function isNodeType( value, type ){
        try {
            return kind.is.node( value ) && value.nodeType === type;
        } catch( error ){
            return false;
        }
    }

    // Duck typing ES6 Set
    function isSetAPI( value ){
        return isWeakSetAPI( value ) && isIterableCollection( value );
    }

    // Duck typing for non-Weak ES6 collections
    function isIterableCollection( value ){
        return kind.is.iterable( value ) && kind.is[ 'function' ]( value.clear ) && kind.is[ 'function' ]( value.entries ) && kind.is[ 'function' ]( value.forEach ) && kind.is[ 'function' ]( value.keys ) && kind.is[ 'function' ]( value.values ) && isSafeSize( value.size );
    }

    // Duck typing ES6 WeakMap
    function isWeakMapAPI( value ){
        return kind.is.object( value ) && kind.is[ 'function' ]( value[ 'delete' ] ) && kind.is[ 'function' ]( value.get ) && kind.is[ 'function' ]( value.has ) && kind.is[ 'function' ]( value.set );
    }

    // Duck typing ES6 WeakSet
    function isWeakSetAPI( value ){
        return kind.is.object( value ) && kind.is[ 'function' ]( value.add ) && kind.is[ 'function' ]( value[ 'delete' ] ) && kind.is[ 'function' ]( value.has );
    }

    /**
     * @function
     * @param {*} value
     * @param {String} [kind]
     * @returns {Boolean|String}
     *
     */
    function kind( value, kind ){
        return arguments.length > 1 ?
            kindIs( value, kind ) :
            kindOf( value );
    }

    /**
     * @function
     * @param {*} value
     * @param {String} kind
     * @returns {Boolean}
     */
    function kindIs( value, kind ){
        return kindOf( value ) === kind;
    }

    /**
     * @function
     * @param {*} value
     * @returns {String} The kind of value, e.g. "String", "Number", etc.
     */
    function kindOf( value ){
        var kind;

        if( value === null ){
            kind = 'Null';
        } else if( value === undefined ){
            kind = 'undefined';
        } else {
            try {
                kind = KIND_REGEX.exec( toString.call( value ) )[ 1 ];
            } catch( error ){
                // A hostile @@toStringTag getter must not make kind() throw.
                kind = 'Object';
            }
        }

        return kind;
    }

    kind.is = kindIs;
    kind.of = kindOf;

    /**
     * @function
     * @param {String} [id]
     * @returns {Boolean|Object} Whether the host supports a feature, or all
     * features when no id is supplied. Intended to be treated as read-only.
     */
    kind.supports = has;

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is an Arguments object.
     *
     * Defined with defineProperty because non-strict functions carry a
     * non-configurable "arguments" property that silently swallows assignment.
     */
    Object.defineProperty( kind.is, 'arguments', {
        value: function( value ){
            // The tag check is safe for strict-mode Arguments objects, whose
            // .callee is a poison pill. Objects that merely expose .callee are
            // no longer mistaken for Arguments.
            return kind.is( value, 'Arguments' );
        },
        writable: true,
        enumerable: true,
        configurable: true
    } );

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is an Array.
     */
    kind.is.array = function( value ){
        try {
            return has( 'array-isarray' ) ?
                Array.isArray( value ) :
                kind.is( value, 'Array' );
        } catch( error ){
            return false;
        }
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is an ArrayBuffer.
     */
    kind.is.arrayBuffer = function( value ){
        if( has( 'arraybuffer' ) ){
            return isInstance( value, ArrayBuffer ) || kind.is( value, 'ArrayBuffer' );
        }

        if( !kind.is.object( value ) ){
            return false;
        }

        try {
            return isSafeSize( value.byteLength ) && kind.is[ 'function' ]( value.slice );
        } catch( error ){
            return false;
        }
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is array-like. Strings are
     * array-like in modern JavaScript and are included here.
     */
    kind.is.arrayLike = function( value ){
        // Functions have a length property and must be explicitly excluded
        if( kind.is.string( value ) ){
            return true;
        }

        if( !kind.is.object( value ) || kind.is[ 'function' ]( value ) ){
            return false;
        }

        try {
            return isSafeSize( value.length );
        } catch( error ){
            return false;
        }
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is an async function.
     */
    kind.is.asyncFunction = function( value ){
        return kindOf( value ) === 'AsyncFunction';
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is an async generator object.
     */
    kind.is.asyncGenerator = function( value ){
        return kindOf( value ) === 'AsyncGenerator';
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is an async generator function.
     */
    kind.is.asyncGeneratorFunction = function( value ){
        return kindOf( value ) === 'AsyncGeneratorFunction';
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is async iterable.
     */
    kind.is.asyncIterable = function( value ){
        if( kind.is.null( value ) || kind.is.undefined( value ) ){
            return false;
        }

        if( has( 'symbol' ) && kind.is.symbol( Symbol.asyncIterator ) ){
            try {
                return kind.is[ 'function' ]( value[ Symbol.asyncIterator ] );
            } catch( error ){
                return false;
            }
        }

        return kind.is.object( value ) && kind.is[ 'function' ]( value[ '@@asyncIterator' ] );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a BigInt primitive.
     */
    kind.is.bigInt = function( value ){
        return isBigIntType( value );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a Boolean primitive.
     */
    kind.is.boolean = function( value ){
        return isBooleanType( value );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a DataView.
     */
    kind.is.dataView = function( value ){
        if( has( 'dataview' ) ){
            return isInstance( value, DataView ) || kind.is( value, 'DataView' );
        }

        if( !kind.is.object( value ) ){
            return false;
        }

        try {
            var dataView = kind.is.arrayBuffer( value.buffer );

            // Only check the methods if it meets the properties criteria
            if( dataView ){
                var typedArrayTypes = 'Float32 Float64 Int8 Int16 Int32 Uint8 Uint16 Uint32'.split( ' ' );
                for( var i = 0, l = typedArrayTypes.length; i < l && dataView; i++ ){
                    dataView = kind.is[ 'function' ]( value[ 'get' + typedArrayTypes[ i ] ] ) && kind.is[ 'function' ]( value[ 'set' + typedArrayTypes[ i ] ] );
                }
            }

            return dataView;
        } catch( error ){
            return false;
        }
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a Date.
     */
    kind.is.date = function( value ){
        if( isInstance( value, Date ) ){
            return true;
        }

        if( !kind.is( value, 'Date' ) ){
            return false;
        }

        try {
            return kind.is[ 'function' ]( value.getTime );
        } catch( error ){
            return false;
        }
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is empty. Maps and Sets are empty
     * when their size is 0; buffers are empty when their byteLength is 0.
     * WeakMap, WeakSet and WeakRef values are never considered empty because
     * their contents cannot be inspected.
     */
    kind.is.empty = function( value ){
        if( kind.is.null( value ) || kind.is.undefined( value ) ){
            return false;
        }

        if( kind.is.string( value ) || kind.is.arrayLike( value ) ){
            try {
                return !value.length;
            } catch( error ){
                return false;
            }
        }

        if( kind.is.map( value ) || kind.is.set( value ) ){
            try {
                return value.size === 0;
            } catch( error ){
                return false;
            }
        }

        if( kind.is.weakMap( value ) || kind.is.weakSet( value ) || kind.is.weakRef( value ) || kind.is.finalizationRegistry( value ) ){
            return false;
        }

        if( kind.is.arrayBuffer( value ) || kind.is.dataView( value ) ){
            try {
                return value.byteLength === 0;
            } catch( error ){
                return false;
            }
        }

        if( kind.is.object( value ) || kind.is[ 'function' ]( value ) ){
            try {
                for( var key in value ){
                    if( hasOwnProperty.call( value, key ) ){
                        return false;
                    }
                }

                return true;
            } catch( error ){
                return false;
            }
        }

        return false;
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is an Error.
     */
    kind.is.error = function( value ){
        return isInstance( value, Error ) || kind.is( value, 'Error' );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a FinalizationRegistry.
     */
    kind.is.finalizationRegistry = function( value ){
        return has( 'finalizationregistry' ) ?
            isInstance( value, FinalizationRegistry ) || kind.is( value, 'FinalizationRegistry' ) :
            kind.is.object( value ) && kind.is[ 'function' ]( value.register ) && kind.is[ 'function' ]( value.unregister );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a Function.
     */
    kind.is[ 'function' ] = function( value ){
        return typeof value === 'function';
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a generator object.
     */
    kind.is.generator = function( value ){
        return kindOf( value ) === 'Generator';
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a generator function.
     */
    kind.is.generatorFunction = function( value ){
        return kindOf( value ) === 'GeneratorFunction';
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a host object, i.e. any
     * non-primitive value. Primitives, null and undefined return false.
     */
    kind.is.host = function( value ){
        return !kind.is.primitive( value );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is iterable. Strings are iterable.
     */
    kind.is.iterable = function( value ){
        if( kind.is.null( value ) || kind.is.undefined( value ) ){
            return false;
        }

        if( has( 'symbol' ) && kind.is.symbol( Symbol.iterator ) ){
            try {
                return kind.is[ 'function' ]( value[ Symbol.iterator ] );
            } catch( error ){
                return false;
            }
        }

        return kind.is.object( value ) && ( kind.is[ 'function' ]( value[ '@@iterator' ] ) || kind.is[ 'function' ]( value.iterator ) );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a Map.
     */
    kind.is.map = function( value ){
        return has( 'map' ) ?
            isInstance( value, Map ) || kind.is( value, 'Map' ) :
            isMapAPI( value );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is NaN.
     */
    kind.is.nan = function( value ){
        return has( 'number-isnan' ) ?
            Number.isNaN( value ) :
            isNumberType( value ) && isNaN( value );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a Node. Nodes from another
     * realm are recognised by their nodeName/nodeType shape.
     */
    kind.is.node = function( value ){
        if( has( 'node' ) && isInstance( value, Node ) ){
            return true;
        }

        if( !kind.is.object( value ) ){
            return false;
        }

        try {
            return kind.is.string( value.nodeName ) && isNumberType( value.nodeType );
        } catch( error ){
            return false;
        }
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a Comment node.
     */
    kind.is.node.comment = function( value ){
        return has( 'comment' ) && isInstance( value, Comment ) || isNodeType( value, 8 );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a Document node.
     */
    kind.is.node.document = function( value ){
        return has( 'document' ) && isInstance( value, Document ) || isNodeType( value, 9 );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a DocumentFragment node.
     */
    kind.is.node.documentFragment = function( value ){
        return has( 'documentfragment' ) && isInstance( value, DocumentFragment ) || isNodeType( value, 11 );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is an Element node.
     */
    kind.is.node.element = function( value ){
        return has( 'element' ) && isInstance( value, Element ) || isNodeType( value, 1 );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a Text node.
     */
    kind.is.node.text = function( value ){
        return has( 'text' ) && isInstance( value, Text ) || isNodeType( value, 3 );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is null.
     */
    kind.is.null = function( value ){
        return value === null;
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a Number. Infinity and NaN
     * are deliberately excluded; use kind.is.nan or kind.is.number.finite when
     * those values matter.
     */
    kind.is.number = function( value ){
        // Exclude Infinity and NaN from being numbers.
        return has( 'number-isfinite' ) ?
            Number.isFinite( value ) :
            isNumberType( value ) && isFinite( value );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is finite.
     */
    kind.is.number.finite = function( value ){
        // Since kind.is.number() excludes Infinity and NaN, this is just an alias.
        return kind.is.number( value );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is an integer.
     */
    kind.is.number.integer = function( value ){
        return has( 'number-isinteger' ) ?
            Number.isInteger( value ) :
            kind.is.number( value ) && Math.floor( value ) === value;
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is safe.
     */
    kind.is.number.safe = function( value ){
        return has( 'number-issafeinteger' ) ?
            Number.isSafeInteger( value ) :
            kind.is.number( value ) && value <= MAX_SAFE_INTEGER && value >= MIN_SAFE_INTEGER;
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is numeric. Symbols are never
     * numeric; BigInts always are. Conversion failures return false instead of
     * throwing.
     */
    kind.is.numeric = function( value ){
        if( isSymbolType( value ) ){
            return false;
        }

        if( isBigIntType( value ) ){
            return true;
        }

        try {
            return kind.is.number( parseFloat( value ) );
        } catch( error ){
            return false;
        }
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is an Object.
     */
    kind.is.object = function( value ){
        return ( typeof value === 'object' || isInstance( value, Object ) ) && !kind.is.null( value );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a plain Object. Objects with a
     * null prototype and plain objects from another realm are included.
     */
    kind.is.object.plain = function( value ){
        if( !kind.is.object( value ) || kind.is[ 'arguments' ]( value ) ){
            return false;
        }

        try {
            var prototype = getPrototypeOf( value );

            if( prototype === null || prototype === Object.prototype ){
                return true;
            }

            // Plain objects from another realm have that realm's Object.prototype,
            // whose own constructor is named "Object" and whose prototype is null.
            var constructor = hasOwnProperty.call( prototype, 'constructor' ) ?
                prototype.constructor :
                null;

            return kind.is[ 'function' ]( constructor ) &&
                constructor.name === 'Object' &&
                getPrototypeOf( prototype ) === null;
        } catch( error ){
            return false;
        }
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a primitive.
     */
    kind.is.primitive = function( value ){
        return  kind.is.null( value )       ||
                kind.is.undefined( value )  ||
                isBooleanType( value )      ||
                isBigIntType( value )       ||
                isNumberType( value )       ||
                isStringType( value )       ||
                isSymbolType( value );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a Promise. Promise-like
     * thenables that also expose catch are accepted for compatibility.
     */
    kind.is.promise = function( value ){
        if( has( 'promise' ) && isInstance( value, Promise ) ){
            return true;
        }

        if( kind.is( value, 'Promise' ) ){
            try {
                return kind.is[ 'function' ]( value.then );
            } catch( error ){
                return false;
            }
        }

        if( kind.is.thenable( value ) ){
            try {
                return kind.is[ 'function' ]( value[ 'catch' ] );
            } catch( error ){
                return false;
            }
        }

        return false;
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a RegExp. Objects that merely
     * look like a RegExp are no longer accepted.
     */
    kind.is.regExp = function( value ){
        if( isInstance( value, RegExp ) ){
            return true;
        }

        if( !kind.is( value, 'RegExp' ) ){
            return false;
        }

        try {
            return kind.is[ 'function' ]( value.test ) && kind.is[ 'function' ]( value.exec );
        } catch( error ){
            return false;
        }
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a Set.
     */
    kind.is.set = function( value ){
        return has( 'set' ) ?
            isInstance( value, Set ) || kind.is( value, 'Set' ) :
            isSetAPI( value );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a String primitive.
     */
    kind.is.string = function( value ){
        return isStringType( value );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a Symbol primitive. Boxed
     * symbols are objects and return false, matching boolean/number/string.
     */
    kind.is.symbol = function( value ){
        return isSymbolType( value );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is thenable.
     */
    kind.is.thenable = function( value ){
        if( !kind.is.object( value ) ){
            return false;
        }

        try {
            return kind.is[ 'function' ]( value.then );
        } catch( error ){
            return false;
        }
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a TypedArray. BigInt typed
     * arrays are included and DataView is excluded.
     */
    kind.is.typedArray = function( value ){
        if( kind.is.null( value ) || kind.is.undefined( value ) ){
            return false;
        }

        if( typeof ArrayBuffer !== 'undefined' && kind.is[ 'function' ]( ArrayBuffer.isView ) ){
            return ArrayBuffer.isView( value ) && kindOf( value ) !== 'DataView';
        }

        var kindName = kindOf( value );
        return hasOwnProperty.call( TYPED_ARRAY_TAGS, kindName );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is undefined.
     */
    kind.is.undefined = function( value ){
        return value === undefined;
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a WeakMap.
     */
    kind.is.weakMap = function( value ){
        return has( 'weakmap' ) ?
            isInstance( value, WeakMap ) || kind.is( value, 'WeakMap' ) :
            isWeakMapAPI( value );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a WeakRef.
     */
    kind.is.weakRef = function( value ){
        return has( 'weakref' ) ?
            isInstance( value, WeakRef ) || kind.is( value, 'WeakRef' ) :
            kind.is.object( value ) && kind.is[ 'function' ]( value.deref );
    };

    /**
     * @function
     * @param {*} value
     * @returns {Boolean} Whether or not value is a WeakSet.
     */
    kind.is.weakSet = function( value ){
        return has( 'weakset' ) ?
            isInstance( value, WeakSet ) || kind.is( value, 'WeakSet' ) :
            isWeakSetAPI( value );
    };

    return kind;
} );
