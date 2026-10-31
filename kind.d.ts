/**
 * Type definitions for kind.js (npm package: kind-js).
 * The runtime is a UMD/CommonJS module with an ESM wrapper.
 */

export type KindName = string;

/** A predicate that checks a single value. */
export interface Checker {
    ( value: unknown ): boolean;
}

export interface NumberChecker extends Checker {
    finite: Checker;
    integer: Checker;
    safe: Checker;
}

export interface NodeChecker extends Checker {
    comment: Checker;
    document: Checker;
    documentFragment: Checker;
    element: Checker;
    text: Checker;
}

export interface ObjectChecker extends Checker {
    plain: Checker;
}

export interface IsCheckers {
    arguments: Checker;
    array: Checker;
    arrayBuffer: Checker;
    arrayLike: Checker;
    asyncFunction: Checker;
    asyncGenerator: Checker;
    asyncGeneratorFunction: Checker;
    asyncIterable: Checker;
    bigInt: Checker;
    boolean: Checker;
    dataView: Checker;
    date: Checker;
    empty: Checker;
    error: Checker;
    finalizationRegistry: Checker;
    function: Checker;
    generator: Checker;
    generatorFunction: Checker;
    host: Checker;
    iterable: Checker;
    map: Checker;
    nan: Checker;
    node: NodeChecker;
    null: Checker;
    number: NumberChecker;
    numeric: Checker;
    object: ObjectChecker;
    primitive: Checker;
    promise: Checker;
    regExp: Checker;
    set: Checker;
    string: Checker;
    symbol: Checker;
    thenable: Checker;
    typedArray: Checker;
    undefined: Checker;
    weakMap: Checker;
    weakRef: Checker;
    weakSet: Checker;
}

/** The callable kind.is namespace. */
export interface KindIs extends IsCheckers {
    ( value: unknown, kind: string ): boolean;
}

export interface Supports {
    /** Returns every detected host feature. */
    (): Record<string, boolean>;
    /** Returns whether a single host feature is available. */
    ( id: string ): boolean;
}

export interface Kind {
    /** Returns the kind of a value, e.g. "Array" or "Null". */
    ( value: unknown ): KindName;
    /** Compares the kind of a value. */
    ( value: unknown, kind: string ): boolean;
    is: KindIs;
    of: ( value: unknown ) => KindName;
    supports: Supports;
}

declare const kind: Kind;

export as namespace kind;
export default kind;
export declare const is: KindIs;
export declare const of: Kind['of'];
export declare const supports: Supports;
