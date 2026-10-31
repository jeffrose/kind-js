// ESM wrapper. The UMD source is loaded as a module: Node exposes its
// module.exports as the default binding, while browsers fall back to the global
// that the UMD wrapper installs.
const loaded = await import( './kind.js' );
const kind = loaded.default || globalThis.kind;

export default kind;
export const is = kind.is;
export const of = kind.of;
export const supports = kind.supports;
