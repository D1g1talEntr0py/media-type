# Parse, serialize, and manipulate media types

[![npm version](https://img.shields.io/npm/v/@d1g1tal/media-type?color=blue)](https://www.npmjs.com/package/@d1g1tal/media-type)
[![npm downloads](https://img.shields.io/npm/dm/@d1g1tal/media-type)](https://www.npmjs.com/package/@d1g1tal/media-type)
[![CI](https://github.com/D1g1talEntr0py/media-type/actions/workflows/ci.yml/badge.svg)](https://github.com/D1g1talEntr0py/media-type/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/D1g1talEntr0py/media-type/graph/badge.svg)](https://codecov.io/gh/D1g1talEntr0py/media-type)
[![License: ISC](https://img.shields.io/github/license/D1g1talEntr0py/media-type?cacheSeconds=0)](https://github.com/D1g1talEntr0py/media-type/blob/main/LICENSE)
[![Node.js](https://img.shields.io/node/v/@d1g1tal/media-type)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

> **Note**: This is a TypeScript rewrite and fork of the original [`whatwg-mimetype`](https://github.com/jsdom/whatwg-mimetype) package. See [CHANGELOG.md](./CHANGELOG.md) for migration information.

This package will parse [MIME types](https://mimesniff.spec.whatwg.org/#understanding-mime-types) (also known as media types) into a structured format, which can then be manipulated and serialized according to the WHATWG MIME Sniffing Standard.

## Features

- ✅ **WHATWG Standard Compliant**: Implements the [WHATWG MIME Sniffing Standard](https://mimesniff.spec.whatwg.org/)
- ✅ **Full TypeScript Support**: Written in TypeScript with complete type definitions
- ✅ **Pure ES Modules**: Modern ESM-only package
- ✅ **Zero Dependencies**: No runtime dependencies
- ✅ **Extensive Testing**: Includes WHATWG web platform tests
- ✅ **Lightweight**: Minimal bundle size

## Installation

```bash
npm install @d1g1tal/media-type
```

```bash
pnpm add @d1g1tal/media-type
```

```bash
yarn add @d1g1tal/media-type
```

## Usage

```js
import { MediaType } from '@d1g1tal/media-type';

const mediaType = new MediaType('Text/HTML;Charset="utf-8"');

console.assert(mediaType.toString() == 'text/html;charset=utf-8');

console.assert(mediaType.type == 'text');
console.assert(mediaType.subtype == 'html');
console.assert(mediaType.essence == 'text/html');
console.assert(mediaType.parameters.get('charset') == 'utf-8');

mediaType.parameters.set('charset', 'windows-1252');
console.assert(mediaType.parameters.get('charset') == 'windows-1252');
console.assert(mediaType.toString() == 'text/html;charset=windows-1252');
// Still considering changing this to maybe 'includes' or 'contains'
console.assert(mediaType.matches('html') == true);
console.assert(mediaType.matches('xml') == false);
```

Parsing is a fairly complex process; see [the specification](https://mimesniff.spec.whatwg.org/#parsing-a-mime-type) for details (and similarly [for serialization](https://mimesniff.spec.whatwg.org/#serializing-a-mime-type)).

This package's algorithms conform to those of the WHATWG [MIME Sniffing Standard](https://mimesniff.spec.whatwg.org/), and is aligned up to commit [8e9a7dd](https://github.com/whatwg/mimesniff/commit/8e9a7dd90717c595a4e4d982cd216e4411d33736).

## Migration from whatwg-mimetype

If you're migrating from the original `whatwg-mimetype` package, please review the [CHANGELOG.md](./CHANGELOG.md) for breaking changes. Key changes include:

- **Class renamed**: `MIMEType` → `MediaType`
- **Removed methods**: `isHTML()`, `isXML()`, `isJavaScript()` - implement your own checks using the `essence` property
- **New method**: `matches(mediaType)` for flexible type matching
- **Properties now read-only**: `type` and `subtype` can only be read via getters
- **Constructor change**: Optional second parameter to override parsed parameters
- **Pure ESM**: No CommonJS support

### Quick Migration Example

```typescript
// Old (whatwg-mimetype v4.x)
import MIMEType from 'whatwg-mimetype';
const mimeType = new MIMEType('text/html');
if (mimeType.isHTML()) { /* ... */ }

// New (@d1g1tal/media-type v5.x)
import { MediaType } from '@d1g1tal/media-type';
const mediaType = new MediaType('text/html');
if (mediaType.essence === 'text/html' || mediaType.matches('html')) { /* ... */ }
```

## `MediaType` API

This package's main module's export is a class, `MediaType`. Its constructor takes a string which it will attempt to parse into a media type; if parsing fails, an `Error` will be thrown.

### The `parse()` static factory method

As an alternative to the constructor, you can use `MediaType.parse(string)`. The only difference is that `parse()` will return `null` on failed parsing, whereas the constructor will throw. It thus makes the most sense to use the constructor in cases where unparsable MIME types would be exceptional, and use `parse()` when dealing with input from some unconstrained source.

### Properties

- `type`: the media type's [type](https://mimesniff.spec.whatwg.org/#mime-type-type), e.g. `'text'`
- `subtype`: the media type's [subtype](https://mimesniff.spec.whatwg.org/#mime-type-subtype), e.g. `'html'`
- `essence`: the media type's [essence](https://mimesniff.spec.whatwg.org/#mime-type-essence), e.g. `'text/html'`
- `parameters`: an instance of `MediaTypeParameters`, containing this media type's [parameters](https://mimesniff.spec.whatwg.org/#mime-type-parameters)

`type` and `subtype` can be changed. They will be validated to be non-empty and only contain [HTTP token code points](https://mimesniff.spec.whatwg.org/#http-token-code-point).

`essence` is only a getter, and cannot be changed.

`parameters` is also a getter, but the contents of the `MediaTypeParameters` object are mutable, as described below.

### Methods

- **`toString()`**: Serializes the media type to a string
- **`matches(mediaType: MediaType | string)`**: Checks if the media type matches the specified type
  - When passed a string: checks if the essence includes that string (e.g., `mediaType.matches('html')` returns `true` for `text/html`)
  - When passed a `MediaType` instance: performs exact type/subtype comparison

## `MediaTypeParameters` API

The `MediaTypeParameters` class, instances of which are returned by `MediaType.parameters`, extends a [JavaScript `Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) with both the keys and values being strings. The keys are parameter names, and the values are parameter values.

However, `MediaTypeParameters` methods will always interpret their arguments as appropriate for media types, so e.g. parameter names will be lowercased, and attempting to set invalid characters will throw.

Some examples:

```js
const mediaType = new MediaType(`x/x;a=b;c=D;E='F'`);

// Logs:
// a b
// c D
// e F
for (const [ name, value ] of mediaType.parameters) {
  console.log(name, value);
}

console.assert(mediaType.parameters.has('a'));
console.assert(mediaType.parameters.has('A'));
console.assert(mediaType.parameters.get('A') === 'b');

mediaType.parameters.set('Q', 'X');
console.assert(mediaType.parameters.get('q') === 'X');
console.assert(mediaType.toString() === 'x/x;a=b;c=d;e=F;q=X');

// Throws:
mediaType.parameters.set('@', 'x');
```

## Additional Exports

In addition to the main `MediaType` class, this package also exports:

- **`MediaTypeParameters`**: The parameters class (extends `Map<string, string>`)
- **`MediaTypeParser`**: Low-level parser with static methods
- **Type exports**: `MediaTypeComponent`, `ParsedMediaType` (TypeScript types)

```typescript
import {
  MediaType,
  MediaTypeParameters,
  MediaTypeParser,
  type MediaTypeComponent,
  type ParsedMediaType
} from '@d1g1tal/media-type';
```

## Browser Support

This package uses modern ES features and is designed for:
- Modern browsers with ES6 module support
- Maintained Node.js versions (see `browserslist` in package.json)

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Build the package
pnpm build

# Lint
pnpm lint
```

## About This Fork

This project is a fork and substantial rewrite of the excellent [`whatwg-mimetype`](https://github.com/jsdom/whatwg-mimetype) package by Domenic Denicola and contributors.

**Why fork?**
- Complete TypeScript rewrite for better type safety
- Modernize build tooling and dependencies
- Optimize bundle size and performance
- Maintain WHATWG standard compliance

**Original Author**: Domenic Denicola
**Current Maintainer**: Jason DiMeo

The original contributors' excellent work is acknowledged with gratitude. This fork maintains the same commitment to WHATWG standards compliance while providing a modern TypeScript-first experience.

## License

ISC License - see [LICENSE](./LICENSE) file for details.

The original `whatwg-mimetype` package was licensed under MIT.

## Contributing

Contributions are welcome! Please ensure:
- All tests pass (`pnpm test`)
- Code follows the ESLint configuration
- TypeScript types are properly defined
- Changes are documented in the CHANGELOG

## Resources

- [WHATWG MIME Sniffing Standard](https://mimesniff.spec.whatwg.org/)
- [Original whatwg-mimetype package](https://github.com/jsdom/whatwg-mimetype)
- [Issue Tracker](https://github.com/D1g1talEntr0py/media-type/issues)