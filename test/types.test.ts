import kind, { is, of, supports } from 'kind-js';
import type { Kind, KindIs } from 'kind-js';

const kindName: string = kind( {} );
const compared: boolean = kind( [], 'Array' );
const isArray: boolean = is.array( [] );
const isFiniteNumber: boolean = kind.is.number.finite( 1 );
const isPlain: boolean = kind.is.object.plain( {} );
const isSymbol: boolean = kind.is.symbol( Symbol( 'x' ) );
const feature: boolean = supports( 'map' );
const features: Record<string, boolean> = supports();
const kindValue: Kind = kind;
const kindIs: KindIs = kind.is;
const viaOf: string = of( 1n );

// @ts-expect-error - kind.is requires a kind argument
kind.is( [] );

// @ts-expect-error - supports only accepts strings or no argument
supports( 1 );

void [ kindName, compared, isArray, isFiniteNumber, isPlain, isSymbol, feature, features, kindValue, kindIs, viaOf ];
