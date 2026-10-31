'use strict';

// Golden behavior table. Each key maps to the set of fixture constants for
// which the matching kind.is.* checker must return true. Any constant that is
// not listed is expected to return false. A meta-test verifies that every key
// referenced here exists, appears once per list, and that every checker has an
// entry.

const CONSTANTS = require( './constants.js' );

const TYPED_ARRAYS = [
    'FLOAT32_ARRAY_EMPTY',
    'FLOAT64_ARRAY_EMPTY',
    'INT8_ARRAY_EMPTY',
    'INT16_ARRAY_EMPTY',
    'INT32_ARRAY_EMPTY',
    'UINT8_ARRAY_EMPTY',
    'UINT8_CLAMPED_ARRAY_EMPTY',
    'UINT16_ARRAY_EMPTY',
    'UINT32_ARRAY_EMPTY',
    'BIGINT64_ARRAY_EMPTY',
    'BIGUINT64_ARRAY_EMPTY',
    'INT8_ARRAY_NONEMPTY',
    'UINT8_ARRAY_NONEMPTY'
];

const STRINGS = [
    'STRING_EMPTY',
    'STRING_NONEMPTY',
    'STRING_WHITESPACE',
    'STRING_NEGATIVE_INTEGER',
    'STRING_POSITIVE_INTEGER',
    'STRING_OCTAL_LITERAL',
    'STRING_HEX_LITERAL',
    'STRING_POSITIVE_FLOAT',
    'STRING_NEGATIVE_FLOAT',
    'STRING_EXPONENTIAL',
    'STRING_NEGATIVE_EXPONENTIAL',
    'STRING_BEGIN_NUMBER',
    'STRING_END_NUMBER',
    'STRING_WRAP_NUMBER',
    'STRING_WRAPPED_NUMBER'
];

const FINITE_NUMBERS = [
    'NUMBER_ZERO',
    'NUMBER_NEGATIVE_ZERO',
    'NUMBER_POSITIVE',
    'NUMBER_NEGATIVE',
    'NUMBER_FLOAT_POSITIVE',
    'NUMBER_FLOAT_NEGATIVE',
    'NUMBER_EXPONENTIAL_POSITIVE',
    'NUMBER_EXPONENTIAL_NEGATIVE',
    'NUMBER_HEX_POSITIVE',
    'NUMBER_HEX_NEGATIVE',
    'NUMBER_MAX_SAFE_INTEGER',
    'NUMBER_MIN_SAFE_INTEGER',
    'NUMBER_UNSAFE_INTEGER'
];

const INTEGER_NUMBERS = [
    'NUMBER_ZERO',
    'NUMBER_NEGATIVE_ZERO',
    'NUMBER_POSITIVE',
    'NUMBER_NEGATIVE',
    'NUMBER_EXPONENTIAL_POSITIVE',
    'NUMBER_EXPONENTIAL_NEGATIVE',
    'NUMBER_HEX_POSITIVE',
    'NUMBER_HEX_NEGATIVE',
    'NUMBER_MAX_SAFE_INTEGER',
    'NUMBER_MIN_SAFE_INTEGER',
    'NUMBER_UNSAFE_INTEGER'
];

const SAFE_NUMBERS = [
    'NUMBER_ZERO',
    'NUMBER_NEGATIVE_ZERO',
    'NUMBER_POSITIVE',
    'NUMBER_NEGATIVE',
    'NUMBER_EXPONENTIAL_POSITIVE',
    'NUMBER_EXPONENTIAL_NEGATIVE',
    'NUMBER_HEX_POSITIVE',
    'NUMBER_HEX_NEGATIVE',
    'NUMBER_MAX_SAFE_INTEGER',
    'NUMBER_MIN_SAFE_INTEGER'
];

const BIGINTS = [
    'BIGINT_ZERO',
    'BIGINT_POSITIVE',
    'BIGINT_NEGATIVE'
];

const ARRAYS = [
    'ARRAY_LITERAL_EMPTY',
    'ARRAY_LITERAL_NUMBER',
    'ARRAY_LITERAL_STRING',
    'ARRAY_NEW_EMPTY',
    'ARRAY_NEW_NONEMPTY'
];

const PRIMITIVES = [
    ...STRINGS,
    ...FINITE_NUMBERS,
    'NUMBER_INFINITY',
    'NUMBER_NEGATIVE_INFINITY',
    'NAN',
    ...BIGINTS,
    'BOOLEAN_TRUE',
    'BOOLEAN_FALSE',
    'NULL',
    'UNDEFINED',
    'SYMBOL'
];

const NON_PRIMITIVES = Object.keys( CONSTANTS ).filter( function( key ){
    return PRIMITIVES.indexOf( key ) === -1;
} );

const EXPECTATIONS = {
    'arguments': {
        pass: [ 'ARGUMENTS', 'ARGUMENTS_EMPTY' ]
    },

    'array': {
        pass: ARRAYS
    },

    'arrayBuffer': {
        pass: [ 'ARRAY_BUFFER_EMPTY', 'ARRAY_BUFFER_NONEMPTY' ]
    },

    'arrayLike': {
        pass: [
            ...TYPED_ARRAYS,
            ...STRINGS,
            'STRING_VIA_CONSTRUCTOR',
            ...ARRAYS,
            'ARGUMENTS',
            'ARGUMENTS_EMPTY',
            'ARRAY_LIKE_OBJECT'
        ]
    },

    'asyncFunction': {
        pass: [ 'ASYNC_FUNCTION' ]
    },

    'asyncGenerator': {
        pass: [ 'ASYNC_GENERATOR' ]
    },

    'asyncGeneratorFunction': {
        pass: [ 'ASYNC_GENERATOR_FUNCTION' ]
    },

    'asyncIterable': {
        pass: [ 'ASYNC_GENERATOR', 'ASYNC_ITERABLE_OBJECT' ]
    },

    'bigInt': {
        pass: BIGINTS
    },

    'boolean': {
        pass: [ 'BOOLEAN_TRUE', 'BOOLEAN_FALSE' ]
    },

    'dataView': {
        pass: [ 'DATA_VIEW_EMPTY', 'DATA_VIEW_NONEMPTY' ]
    },

    'date': {
        pass: [ 'DATE', 'DATE_INVALID' ]
    },

    'empty': {
        pass: [
            'FLOAT32_ARRAY_EMPTY',
            'FLOAT64_ARRAY_EMPTY',
            'INT8_ARRAY_EMPTY',
            'INT16_ARRAY_EMPTY',
            'INT32_ARRAY_EMPTY',
            'UINT8_ARRAY_EMPTY',
            'UINT8_CLAMPED_ARRAY_EMPTY',
            'UINT16_ARRAY_EMPTY',
            'UINT32_ARRAY_EMPTY',
            'BIGINT64_ARRAY_EMPTY',
            'BIGUINT64_ARRAY_EMPTY',
            'ARRAY_BUFFER_EMPTY',
            'DATA_VIEW_EMPTY',
            'STRING_EMPTY',
            'NUMBER_VIA_CONSTRUCTOR',
            'BIGINT_VIA_CONSTRUCTOR',
            'BOOLEAN_VIA_CONSTRUCTOR',
            'PROMISE_NONNATIVE',
            'PROMISE_NATIVE',
            'PROMISE_PENDING',
            'REGEXP',
            'REGEXP_VIA_CONSTRUCTOR',
            'DATE',
            'DATE_INVALID',
            'ERROR',
            'ERROR_TYPE',
            'FUNCTION',
            'FUNCTION_CONSTRUCTOR',
            'FUNCTION_VIA_CONSTRUCTOR',
            'FUNCTION_CONSTRUCTOR_WITH_PROPERTY_ONLY',
            'FUNCTION_CONSTRUCTOR_WITH_PROTOTYPE_ONLY',
            'ASYNC_FUNCTION',
            'GENERATOR_FUNCTION',
            'ASYNC_GENERATOR_FUNCTION',
            'GENERATOR',
            'ASYNC_GENERATOR',
            'SYMBOL_VIA_CONSTRUCTOR',
            'ARRAY_LITERAL_EMPTY',
            'ARRAY_NEW_EMPTY',
            'ARGUMENTS_EMPTY',
            'OBJECT_LITERAL_EMPTY',
            'OBJECT_USER_DEFINED_EMPTY',
            'OBJECT_USER_DEFINED_PROTOTYPE_ONLY',
            'OBJECT_NULL_PROTOTYPE',
            'CLASS_CONSTRUCTOR',
            'CLASS_INSTANCE',
            'MAP_EMPTY',
            'SET_EMPTY',
            'ITERABLE_OBJECT',
            'ASYNC_ITERABLE_OBJECT'
        ]
    },

    'error': {
        pass: [ 'ERROR', 'ERROR_TYPE' ]
    },

    'finalizationRegistry': {
        pass: [ 'FINALIZATION_REGISTRY' ]
    },

    'function': {
        pass: [
            'FUNCTION',
            'FUNCTION_CONSTRUCTOR',
            'FUNCTION_VIA_CONSTRUCTOR',
            'FUNCTION_CONSTRUCTOR_WITH_PROPERTY_ONLY',
            'FUNCTION_CONSTRUCTOR_WITH_PROTOTYPE_ONLY',
            'ASYNC_FUNCTION',
            'GENERATOR_FUNCTION',
            'ASYNC_GENERATOR_FUNCTION',
            'CLASS_CONSTRUCTOR'
        ]
    },

    'generator': {
        pass: [ 'GENERATOR' ]
    },

    'generatorFunction': {
        pass: [ 'GENERATOR_FUNCTION' ]
    },

    'host': {
        pass: NON_PRIMITIVES
    },

    'iterable': {
        pass: [
            ...TYPED_ARRAYS,
            ...STRINGS,
            'STRING_VIA_CONSTRUCTOR',
            'GENERATOR',
            ...ARRAYS,
            'ARGUMENTS',
            'ARGUMENTS_EMPTY',
            'MAP_EMPTY',
            'MAP_NONEMPTY',
            'SET_EMPTY',
            'SET_NONEMPTY',
            'ITERABLE_OBJECT'
        ]
    },

    'map': {
        pass: [ 'MAP_EMPTY', 'MAP_NONEMPTY' ]
    },

    'nan': {
        pass: [ 'NAN' ]
    },

    'node': {
        pass: [ 'NODE_ELEMENT', 'NODE_TEXT', 'NODE_COMMENT', 'NODE_DOCUMENT', 'NODE_DOCUMENT_FRAGMENT' ]
    },

    'node.comment': {
        pass: [ 'NODE_COMMENT' ]
    },

    'node.document': {
        pass: [ 'NODE_DOCUMENT' ]
    },

    'node.documentFragment': {
        pass: [ 'NODE_DOCUMENT_FRAGMENT' ]
    },

    'node.element': {
        pass: [ 'NODE_ELEMENT' ]
    },

    'node.text': {
        pass: [ 'NODE_TEXT' ]
    },

    'null': {
        pass: [ 'NULL' ]
    },

    'number': {
        pass: FINITE_NUMBERS
    },

    'number.finite': {
        pass: FINITE_NUMBERS
    },

    'number.integer': {
        pass: INTEGER_NUMBERS
    },

    'number.safe': {
        pass: SAFE_NUMBERS
    },

    'numeric': {
        pass: [
            'INT8_ARRAY_NONEMPTY',
            'UINT8_ARRAY_NONEMPTY',
            'STRING_NEGATIVE_INTEGER',
            'STRING_POSITIVE_INTEGER',
            'STRING_OCTAL_LITERAL',
            'STRING_HEX_LITERAL',
            'STRING_POSITIVE_FLOAT',
            'STRING_NEGATIVE_FLOAT',
            'STRING_EXPONENTIAL',
            'STRING_NEGATIVE_EXPONENTIAL',
            'STRING_BEGIN_NUMBER',
            'STRING_WRAP_NUMBER',
            ...FINITE_NUMBERS,
            'NUMBER_VIA_CONSTRUCTOR',
            ...BIGINTS,
            'BIGINT_VIA_CONSTRUCTOR',
            'ARRAY_LITERAL_NUMBER'
        ]
    },

    'object': {
        pass: NON_PRIMITIVES
    },

    'object.plain': {
        pass: [
            'THENABLE',
            'THENABLE_CATCHLESS',
            'THENABLE_WITH_CATCH',
            'OBJECT_REGEXP_LIKE',
            'OBJECT_LITERAL_EMPTY',
            'OBJECT_LITERAL_NONEMPTY',
            'OBJECT_NULL_PROTOTYPE',
            'OBJECT_NULL_PROTOTYPE_WITH_PROPERTY',
            'OBJECT_CONSTRUCTOR_OVERRIDDEN',
            'ARRAY_LIKE_OBJECT',
            'ARRAY_LIKE_NEGATIVE',
            'ARRAY_LIKE_STRING_LENGTH',
            'ITERABLE_OBJECT',
            'ASYNC_ITERABLE_OBJECT',
            'NODE_ELEMENT',
            'NODE_TEXT',
            'NODE_COMMENT',
            'NODE_DOCUMENT',
            'NODE_DOCUMENT_FRAGMENT'
        ]
    },

    'primitive': {
        pass: PRIMITIVES
    },

    'promise': {
        pass: [ 'THENABLE_WITH_CATCH', 'PROMISE_NONNATIVE', 'PROMISE_NATIVE', 'PROMISE_PENDING' ]
    },

    'regExp': {
        pass: [ 'REGEXP', 'REGEXP_VIA_CONSTRUCTOR' ]
    },

    'set': {
        pass: [ 'SET_EMPTY', 'SET_NONEMPTY' ]
    },

    'string': {
        pass: STRINGS
    },

    'symbol': {
        pass: [ 'SYMBOL' ]
    },

    'thenable': {
        pass: [ 'THENABLE', 'THENABLE_CATCHLESS', 'THENABLE_WITH_CATCH', 'PROMISE_NONNATIVE', 'PROMISE_NATIVE', 'PROMISE_PENDING' ]
    },

    'typedArray': {
        pass: TYPED_ARRAYS
    },

    'undefined': {
        pass: [ 'UNDEFINED' ]
    },

    'weakMap': {
        pass: [ 'WEAK_MAP_EMPTY', 'WEAK_MAP_NONEMPTY' ]
    },

    'weakRef': {
        pass: [ 'WEAK_REF' ]
    },

    'weakSet': {
        pass: [ 'WEAK_SET_EMPTY', 'WEAK_SET_NONEMPTY' ]
    }
};

module.exports = EXPECTATIONS;
