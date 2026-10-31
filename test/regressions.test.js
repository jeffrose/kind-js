'use strict';

const { describe, it } = require( 'node:test' );
const assert = require( 'node:assert/strict' );
const vm = require( 'node:vm' );

const kind = require( '../kind.js' );

describe( 'regressions', function(){
    describe( 'kind.is.host', function(){
        it( 'does not throw because of the former local shadowing bug', function(){
            const primitives = [ undefined, null, false, 0, NaN, '', Symbol( 's' ), 1n ];

            for( const value of primitives ){
                assert.doesNotThrow( function(){ kind.is.host( value ); } );
                assert.equal( kind.is.host( value ), false );
            }

            for( const value of [ {}, [], function(){}, new Number( 1 ), new Map() ] ){
                assert.equal( kind.is.host( value ), true );
            }
        } );
    } );

    describe( 'kind.is.numeric', function(){
        it( 'never throws for Symbols or BigInts', function(){
            assert.equal( kind.is.numeric( Symbol( 's' ) ), false );
            assert.equal( kind.is.numeric( Object( Symbol( 's' ) ) ), false );
            assert.equal( kind.is.numeric( 1n ), true );
            assert.equal( kind.is.numeric( Object( 1n ) ), true );
            assert.equal( kind.is.numeric( { [ Symbol.toPrimitive ]: function(){ throw new Error( 'boom' ); } } ), false );
        } );
    } );

    describe( 'kind.is.typedArray', function(){
        it( 'handles null-prototype array-likes without throwing', function(){
            const arrayLike = Object.assign( Object.create( null ), { length: 1 } );

            assert.doesNotThrow( function(){ kind.is.typedArray( arrayLike ); } );
            assert.equal( kind.is.typedArray( arrayLike ), false );
            assert.equal( kind.is.typedArray( null ), false );
            assert.equal( kind.is.typedArray( undefined ), false );
            assert.equal( kind.is.typedArray( [] ), false );
            assert.equal( kind.is.typedArray( new DataView( new ArrayBuffer( 0 ) ) ), false );
        } );

        it( 'recognises BigInt and Float16 typed arrays when available', function(){
            assert.equal( kind.is.typedArray( new BigInt64Array() ), true );
            assert.equal( kind.is.typedArray( new BigUint64Array() ), true );

            if( typeof Float16Array !== 'undefined' ){
                assert.equal( kind.is.typedArray( new Float16Array() ), true );
            }
        } );
    } );

    describe( 'kind.is.arguments', function(){
        it( 'handles strict-mode Arguments without touching .callee', function(){
            const strictArguments = ( function(){ 'use strict'; return arguments; } )( 1, 2 );

            assert.doesNotThrow( function(){ kind.is.arguments( strictArguments ); } );
            assert.equal( kind.is.arguments( strictArguments ), true );
            assert.equal( kind.is.arguments( ( function(){ return arguments; } )() ), true );
            assert.equal( kind.is.arguments( [] ), false );
            assert.equal( kind.is.arguments( { length: 1, callee: function(){} } ), false );
        } );
    } );

    describe( 'kind.is.empty', function(){
        it( 'honours Map and Set size', function(){
            assert.equal( kind.is.empty( new Map() ), true );
            assert.equal( kind.is.empty( new Map( [ [ 'a', 1 ] ] ) ), false );
            assert.equal( kind.is.empty( new Set() ), true );
            assert.equal( kind.is.empty( new Set( [ 1 ] ) ), false );
        } );

        it( 'treats weak collections and registries as never empty', function(){
            assert.equal( kind.is.empty( new WeakMap() ), false );
            assert.equal( kind.is.empty( new WeakSet() ), false );
            assert.equal( kind.is.empty( new WeakRef( {} ) ), false );
            assert.equal( kind.is.empty( new FinalizationRegistry( function(){} ) ), false );
        } );

        it( 'honours buffer byteLength', function(){
            assert.equal( kind.is.empty( new ArrayBuffer( 0 ) ), true );
            assert.equal( kind.is.empty( new ArrayBuffer( 8 ) ), false );
            assert.equal( kind.is.empty( new DataView( new ArrayBuffer( 0 ) ) ), true );
            assert.equal( kind.is.empty( new DataView( new ArrayBuffer( 8 ) ) ), false );
        } );
    } );

    describe( 'kind.is.object.plain', function(){
        it( 'accepts null-prototype and cross-realm plain objects', function(){
            assert.equal( kind.is.object.plain( Object.create( null ) ), true );
            assert.equal( kind.is.object.plain( { constructor: null } ), true );
            assert.equal( kind.is.object.plain( vm.runInNewContext( '({ a: 1 })' ) ), true );
        } );

        it( 'rejects non-plain objects', function(){
            const Custom = class Custom {};

            assert.equal( kind.is.object.plain( new Custom() ), false );
            assert.equal( kind.is.object.plain( new Map() ), false );
            assert.equal( kind.is.object.plain( [] ), false );
            assert.equal( kind.is.object.plain( new Number( 1 ) ), false );
            assert.equal( kind.is.object.plain( ( function(){ return arguments; } )() ), false );
            assert.equal( kind.is.object.plain( Object.create( Object.create( null ) ) ), false );
        } );
    } );

    describe( 'kind.is.arrayLike', function(){
        it( 'treats strings as array-like but not functions', function(){
            assert.equal( kind.is.arrayLike( 'abc' ), true );
            assert.equal( kind.is.arrayLike( new String( 'abc' ) ), true );
            assert.equal( kind.is.arrayLike( function( a, b ){} ), false );
            assert.equal( kind.is.arrayLike( { length: 2 } ), true );
            assert.equal( kind.is.arrayLike( { length: -1 } ), false );
            assert.equal( kind.is.arrayLike( { length: '2' } ), false );
            assert.equal( kind.is.arrayLike( null ), false );
        } );
    } );

    describe( 'kind.is.iterable', function(){
        it( 'handles strings, collections and revoked proxies', function(){
            const revoked = Proxy.revocable( {}, {} );
            revoked.revoke();

            assert.equal( kind.is.iterable( 'abc' ), true );
            assert.equal( kind.is.iterable( new Map() ), true );
            assert.equal( kind.is.iterable( new Set() ), true );
            assert.equal( kind.is.iterable( new WeakMap() ), false );
            assert.equal( kind.is.iterable( ( function*(){} )() ), true );
            assert.equal( kind.is.iterable( ( async function*(){} )() ), false );
            assert.equal( kind.is.iterable( null ), false );
            assert.equal( kind.is.iterable( undefined ), false );
            assert.doesNotThrow( function(){ kind.is.iterable( revoked.proxy ); } );
            assert.equal( kind.is.iterable( revoked.proxy ), false );
        } );
    } );

    describe( 'kind.is.asyncIterable', function(){
        it( 'handles async generators and revoked proxies', function(){
            const revoked = Proxy.revocable( {}, {} );
            revoked.revoke();

            assert.equal( kind.is.asyncIterable( ( async function*(){} )() ), true );
            assert.equal( kind.is.asyncIterable( ( function*(){} )() ), false );
            assert.equal( kind.is.asyncIterable( 'abc' ), false );
            assert.equal( kind.is.asyncIterable( null ), false );
            assert.doesNotThrow( function(){ kind.is.asyncIterable( revoked.proxy ); } );
            assert.equal( kind.is.asyncIterable( revoked.proxy ), false );
        } );
    } );

    describe( 'cross-realm built-ins', function(){
        it( 'recognises built-ins from another realm', function(){
            assert.equal( kind.is.arrayBuffer( vm.runInNewContext( 'new ArrayBuffer(0)' ) ), true );
            assert.equal( kind.is.dataView( vm.runInNewContext( 'new DataView(new ArrayBuffer(0))' ) ), true );
            assert.equal( kind.is.date( vm.runInNewContext( 'new Date()' ) ), true );
            assert.equal( kind.is.error( vm.runInNewContext( 'new TypeError("x")' ) ), true );
            assert.equal( kind.is.map( vm.runInNewContext( 'new Map()' ) ), true );
            assert.equal( kind.is.set( vm.runInNewContext( 'new Set()' ) ), true );
            assert.equal( kind.is.weakMap( vm.runInNewContext( 'new WeakMap()' ) ), true );
            assert.equal( kind.is.weakSet( vm.runInNewContext( 'new WeakSet()' ) ), true );
            assert.equal( kind.is.promise( vm.runInNewContext( 'Promise.resolve(1)' ) ), true );
            assert.equal( kind.is.regExp( vm.runInNewContext( '/x/' ) ), true );
            assert.equal( kind.is.symbol( vm.runInNewContext( 'Symbol("x")' ) ), true );
            assert.equal( kind.is.bigInt( vm.runInNewContext( '1n' ) ), true );
            assert.equal( kind.is.typedArray( vm.runInNewContext( 'new Uint8Array()' ) ), true );
        } );
    } );

    describe( 'kind.is.regExp', function(){
        it( 'rejects objects that only look like a RegExp', function(){
            assert.equal( kind.is.regExp( { test: function(){}, exec: function(){}, ignoreCase: false } ), false );
            assert.equal( kind.is.regExp( /x/ ), true );
            assert.equal( kind.is.regExp( vm.runInNewContext( '/x/' ) ), true );
        } );
    } );

    describe( 'kind.of', function(){
        it( 'does not throw for a hostile @@toStringTag getter', function(){
            const hostile = {};
            Object.defineProperty( hostile, Symbol.toStringTag, {
                get: function(){ throw new Error( 'boom' ); }
            } );

            assert.doesNotThrow( function(){ kind.of( hostile ); } );
            assert.equal( kind.of( hostile ), 'Object' );
        } );
    } );

    describe( 'hostile inputs', function(){
        it( 'no checker throws on revoked proxies or throwing accessors', function(){
            const revoked = Proxy.revocable( {}, {} );
            revoked.revoke();

            const hostileTag = {};
            Object.defineProperty( hostileTag, Symbol.toStringTag, {
                get: function(){ throw new Error( 'toStringTag' ); }
            } );

            const hostileLength = {};
            Object.defineProperty( hostileLength, 'length', {
                get: function(){ throw new Error( 'length' ); }
            } );

            const hostileThen = {};
            Object.defineProperty( hostileThen, 'then', {
                get: function(){ throw new Error( 'then' ); }
            } );

            const hostileCatch = {
                then: function(){},
                get catch(){ throw new Error( 'catch' ); }
            };

            const hostilePrototype = new Proxy( {}, {
                getPrototypeOf: function(){ throw new Error( 'prototype' ); }
            } );

            const hostilePrimitive = {
                [ Symbol.toPrimitive ]: function(){ throw new Error( 'toPrimitive' ); }
            };

            const hostileDateTag = {
                [ Symbol.toStringTag ]: 'Date',
                get getTime(){ throw new Error( 'getTime' ); }
            };

            const hostileRegExpTag = {
                [ Symbol.toStringTag ]: 'RegExp',
                get test(){ throw new Error( 'test' ); },
                exec: function(){}
            };

            const hostileMapTag = {
                [ Symbol.toStringTag ]: 'Map',
                get size(){ throw new Error( 'size' ); }
            };

            const hostileBufferTag = {
                [ Symbol.toStringTag ]: 'ArrayBuffer',
                get byteLength(){ throw new Error( 'byteLength' ); }
            };

            const inputs = [
                revoked.proxy,
                hostileTag,
                hostileLength,
                hostileThen,
                hostileCatch,
                hostilePrototype,
                hostilePrimitive,
                hostileDateTag,
                hostileRegExpTag,
                hostileMapTag,
                hostileBufferTag
            ];

            const checkers = [];

            for( const key of Object.keys( kind.is ) ){
                const checker = kind.is[ key ];

                if( typeof checker !== 'function' ){
                    continue;
                }

                checkers.push( checker );

                for( const subKey of Object.keys( checker ) ){
                    if( typeof checker[ subKey ] === 'function' ){
                        checkers.push( checker[ subKey ] );
                    }
                }
            }

            for( const input of inputs ){
                for( const checker of checkers ){
                    assert.doesNotThrow( function(){ checker( input ); } );
                }
            }
        } );
    } );

    describe( 'feature detection', function(){
        it( 'is populated when loaded as CommonJS in Node', function(){
            assert.equal( kind.supports( 'map' ), true );
            assert.equal( kind.supports( 'symbol' ), true );
            assert.equal( kind.supports( 'number-isnan' ), true );
            assert.equal( kind.is.symbol( Symbol( 'x' ) ), true );
        } );
    } );

    describe( 'kind.is.node', function(){
        it( 'recognises duck-typed nodes without a DOM', function(){
            assert.equal( kind.is.node( { nodeName: 'DIV', nodeType: 1 } ), true );
            assert.equal( kind.is.node( { nodeName: 'DIV' } ), false );
            assert.equal( kind.is.node( { nodeType: 1 } ), false );
            assert.equal( kind.is.node( {} ), false );
            assert.equal( kind.is.node.document( { nodeName: '#document', nodeType: 9 } ), true );
        } );
    } );

    describe( 'kind.is.promise', function(){
        it( 'separates promises from plain thenables', function(){
            assert.equal( kind.is.promise( Promise.resolve( 1 ) ), true );
            assert.equal( kind.is.promise( { then: function(){}, catch: function(){} } ), true );
            assert.equal( kind.is.promise( { then: function(){} } ), false );
        } );
    } );
} );
