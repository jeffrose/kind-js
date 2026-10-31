'use strict';

const { describe, it } = require( 'node:test' );
const assert = require( 'node:assert/strict' );
const fs = require( 'node:fs' );
const path = require( 'node:path' );
const vm = require( 'node:vm' );

const kind = require( '../kind.js' );
const source = fs.readFileSync( path.join( __dirname, '..', 'kind.js' ), 'utf8' );

describe( 'public API', function(){
    it( 'exports a callable function', function(){
        assert.equal( typeof kind, 'function' );
        assert.equal( kind( 10 ), 'Number' );
        assert.equal( kind( 10, 'Number' ), true );
        assert.equal( kind( 10, 'String' ), false );
        assert.equal( kind(), 'undefined' );
        assert.equal( kind( 10, undefined ), false );
    } );

    it( 'exposes of and is as the callable forms', function(){
        assert.equal( typeof kind.of, 'function' );
        assert.equal( typeof kind.is, 'function' );
        assert.equal( kind.of( [] ), 'Array' );
        assert.equal( kind.is( [], 'Array' ), true );
        assert.equal( kind.is( [], 'Object' ), false );
        assert.equal( kind( [] ), kind.of( [] ) );
        assert.equal( kind( [], 'Array' ), kind.is( [], 'Array' ) );
    } );

    it( 'exposes reserved-word checkers through both notations', function(){
        assert.equal( kind.is[ 'function' ]( function(){} ), true );
        assert.equal( kind.is.function( function(){} ), true );
        assert.equal( kind.is[ 'arguments' ]( ( function(){ return arguments; } )() ), true );
        assert.equal( kind.is.arguments( [] ), false );
    } );

    it( 'reports modern kinds', function(){
        const cases = [
            [ null, 'Null' ],
            [ undefined, 'undefined' ],
            [ NaN, 'Number' ],
            [ Infinity, 'Number' ],
            [ 1n, 'BigInt' ],
            [ Object( 1n ), 'BigInt' ],
            [ Symbol( 'x' ), 'Symbol' ],
            [ new Map(), 'Map' ],
            [ new Set(), 'Set' ],
            [ new WeakMap(), 'WeakMap' ],
            [ new WeakSet(), 'WeakSet' ],
            [ Promise.resolve( 1 ), 'Promise' ],
            [ new ArrayBuffer( 0 ), 'ArrayBuffer' ],
            [ new DataView( new ArrayBuffer( 0 ) ), 'DataView' ],
            [ new Uint8Array(), 'Uint8Array' ],
            [ async function(){}, 'AsyncFunction' ],
            [ function*(){}, 'GeneratorFunction' ],
            [ async function*(){}, 'AsyncGeneratorFunction' ],
            [ ( function*(){} )(), 'Generator' ],
            [ ( async function*(){} )(), 'AsyncGenerator' ],
            [ new TypeError(), 'Error' ],
            [ /x/, 'RegExp' ],
            [ new Date(), 'Date' ],
            [ ( function(){ return arguments; } )(), 'Arguments' ],
            [ Object.create( null ), 'Object' ]
        ];

        for( const [ value, expected ] of cases ){
            assert.equal( kind.of( value ), expected );
        }
    } );

    it( 'keeps the deliberate number/Number split for non-finite values', function(){
        assert.equal( kind.is( Infinity, 'Number' ), true );
        assert.equal( kind.is.number( Infinity ), false );
        assert.equal( kind.is( NaN, 'Number' ), true );
        assert.equal( kind.is.number( NaN ), false );
    } );

    it( 'exposes feature detection through kind.supports', function(){
        const features = kind.supports();

        assert.equal( typeof features, 'object' );
        assert.equal( features.map, true );
        assert.equal( kind.supports( 'map' ), true );
        assert.equal( kind.supports( 'symbol' ), true );
        assert.ok( !kind.supports( 'not-a-real-feature' ) );
    } );
} );

describe( 'module formats', function(){
    it( 'loads through CommonJS', function(){
        const required = require( '../kind.js' );

        assert.equal( required, kind );
        assert.equal( required.of( 'value' ), 'String' );
    } );

    it( 'loads through the ESM wrapper', async function(){
        const esm = await import( '../kind.mjs' );

        assert.equal( esm.default, kind );
        assert.equal( esm.is, kind.is );
        assert.equal( esm.of, kind.of );
        assert.equal( esm.supports, kind.supports );
        assert.equal( esm.of( 10n ), 'BigInt' );
    } );

    it( 'registers a global when no module system is present', function(){
        const sandbox = {};

        vm.runInNewContext( source, sandbox, { filename: 'kind.js' } );

        assert.equal( typeof sandbox.kind, 'function' );
        assert.equal( sandbox.kind.of( [] ), 'Array' );
        assert.equal( sandbox.kind.is.symbol( Symbol( 'x' ) ), true );
    } );

    it( 'registers through AMD when define.amd exists', function(){
        let amdExport;
        const sandbox = {};

        sandbox.define = function( factory ){
            amdExport = factory();
        };
        sandbox.define.amd = true;

        vm.runInNewContext( source, sandbox, { filename: 'kind.js' } );

        assert.equal( typeof amdExport, 'function' );
        assert.equal( amdExport.of( {} ), 'Object' );
        assert.equal( sandbox.kind, undefined );
    } );
} );
