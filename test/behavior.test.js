'use strict';

const { describe, it } = require( 'node:test' );
const assert = require( 'node:assert/strict' );

const kind = require( '../kind.js' );
const CONSTANTS = require( './constants.js' );
const EXPECTATIONS = require( './expectations.js' );

const CHECKER_NAMES = Object.keys( EXPECTATIONS );
const CONSTANT_NAMES = Object.keys( CONSTANTS );

function resolveChecker( name ){
    return name.split( '.' ).reduce( function( node, part ){
        return node[ part ];
    }, kind.is );
}

function flattenCheckers(){
    const names = [];

    for( const key of Object.keys( kind.is ) ){
        const checker = kind.is[ key ];

        if( typeof checker !== 'function' ){
            continue;
        }

        names.push( key );

        for( const subKey of Object.keys( checker ) ){
            if( typeof checker[ subKey ] === 'function' ){
                names.push( key + '.' + subKey );
            }
        }
    }

    return names;
}

describe( 'behavior table', function(){
    for( const name of CHECKER_NAMES ){
        it( 'kind.is.' + name + ' matches expectations', function(){
            const checker = resolveChecker( name );
            const expectedKeys = EXPECTATIONS[ name ].pass;
            const mismatches = [];

            assert.equal( typeof checker, 'function', name + ' should be a function' );

            for( const key of CONSTANT_NAMES ){
                const expected = expectedKeys.indexOf( key ) !== -1;
                const actual = checker( CONSTANTS[ key ] );

                if( typeof actual !== 'boolean' ){
                    mismatches.push( key + ': expected a boolean, got ' + typeof actual );
                } else if( actual !== expected ){
                    mismatches.push( key + ': expected ' + expected + ', got ' + actual );
                }
            }

            assert.deepEqual( mismatches, [] );
        } );
    }
} );

describe( 'behavior table metadata', function(){
    it( 'every expectation resolves to a checker', function(){
        const missing = CHECKER_NAMES.filter( function( name ){
            return typeof resolveChecker( name ) !== 'function';
        } );

        assert.deepEqual( missing, [] );
    } );

    it( 'every checker has an expectation', function(){
        const covered = new Set( CHECKER_NAMES );
        const uncovered = flattenCheckers().filter( function( name ){
            return !covered.has( name );
        } );

        assert.deepEqual( uncovered, [] );
    } );

    it( 'every expectation key exists in the fixtures', function(){
        const unknown = [];

        for( const name of CHECKER_NAMES ){
            for( const key of EXPECTATIONS[ name ].pass ){
                if( !Object.prototype.hasOwnProperty.call( CONSTANTS, key ) ){
                    unknown.push( name + ' -> ' + key );
                }
            }
        }

        assert.deepEqual( unknown, [] );
    } );

    it( 'expectation lists contain no duplicates', function(){
        const duplicates = [];

        for( const name of CHECKER_NAMES ){
            const seen = new Set();

            for( const key of EXPECTATIONS[ name ].pass ){
                if( seen.has( key ) ){
                    duplicates.push( name + ' -> ' + key );
                }

                seen.add( key );
            }
        }

        assert.deepEqual( duplicates, [] );
    } );

    it( 'primitives and non-primitives partition the fixtures', function(){
        const primitives = EXPECTATIONS.primitive.pass;
        const overlap = primitives.filter( function( key ){
            return CONSTANT_NAMES.indexOf( key ) === -1;
        } );
        const nonPrimitives = CONSTANT_NAMES.filter( function( key ){
            return primitives.indexOf( key ) === -1;
        } );
        const combined = primitives.concat( nonPrimitives ).sort();

        assert.deepEqual( overlap, [] );
        assert.deepEqual( combined, CONSTANT_NAMES.slice().sort() );
        assert.deepEqual( EXPECTATIONS.host.pass, nonPrimitives );
        assert.deepEqual( EXPECTATIONS.object.pass, nonPrimitives );
    } );
} );
