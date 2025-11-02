# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- **Complete TypeScript conversion**: Converted all source and test files from JavaScript to TypeScript
- **Test framework**: Migrated from Jest to Vitest with coverage support
- Updated ESLint to modern flat config format
- Enhanced README with badges, features, and migration guide
- Updated package.json with proper TypeScript exports

### Added
- Native TypeScript type definitions with strict compiler options
- TypeScript interfaces: `MediaTypeComponent`, `ParsedMediaType`
- tsconfig.json with isolated declarations
- Vitest configuration with UI and coverage (`@vitest/coverage-v8`, `@vitest/ui`)
- `@types/node` dev dependency
- Comprehensive CHANGELOG
- Automated version script for releases

## [5.0.2] - 2023-XX-XX

### Fixed
- Maintenance release with dependency updates

## [5.0.0] - 2023-11-11

### Changed
- Switched to pnpm for package management
- Switched license from MIT to ISC
- Refactored `MediaTypeParameters` to extend Map directly (instead of wrapping)
- Refactored parser to use class with static methods
- Moved serializer functionality into `MediaType.toString()`
- Changed package manager from npm/yarn to pnpm
- Removed `esbuild-library` dependency in favor of simpler TypeScript compilation

#### API Changes - BREAKING CHANGES

##### Renamed Classes
- **`MIMEType` → `MediaType`**: Main class renamed to reflect WHATWG terminology
- **`MIMETypeParameters` → `MediaTypeParameters`**: Parameters class renamed accordingly

##### Removed Methods
The following methods have been **removed** from the `MediaType` class:
- `isHTML()` - Removed (was marked as speculative in original package)
- `isXML()` - Removed (was marked as speculative in original package)
- `isJavaScript({ prohibitParameters })` - Removed (was marked as speculative in original package)

**Migration Guide**: If you were using these methods, you'll need to implement your own checks:

```typescript
// Old (v4.x with whatwg-mimetype)
if (mimeType.isHTML()) { /* ... */ }

// New (v5.x with @d1g1tal/media-type)
if (mediaType.essence === 'text/html') { /* ... */ }
// or for more comprehensive HTML MIME type checking:
const htmlTypes = ['text/html', 'application/xhtml+xml'];
if (htmlTypes.includes(mediaType.essence)) { /* ... */ }
```

##### New Methods
- **`matches(mediaType: MediaType | string): boolean`**: New method to check if media type matches a specified type
  - Accepts either a `MediaType` instance or a string
  - For strings: checks if the essence includes the string (e.g., `mediaType.matches('html')`)
  - For `MediaType` instances: performs exact type/subtype comparison

##### Constructor Changes
- **Constructor signature change**: Now accepts optional second parameter for overriding parameters
  ```typescript
  // New in v5.0
  const mediaType = new MediaType('text/html;charset=iso-8859-1', { charset: 'utf-8' });
  // Results in: text/html;charset=utf-8
  ```
- **Removed object-only constructor**: Can no longer pass just an object to constructor
  - Old: `new MIMEType({ type: 'text', subtype: 'html' })` ❌
  - New: Must pass string as first parameter ✅

##### Internal Architecture Changes
- **`MediaTypeParameters` now extends `Map`**: Previously wrapped a Map, now directly extends it
  - Reduces file size and complexity
  - All Map methods directly available
  - Still maintains media type-specific validation (case-insensitive parameter names, HTTP token validation)

- **Parser refactored to class**: Module with exported functions converted to `MediaTypeParser` class with static methods
- **Serializer merged**: Separate serializer module removed, `serialize` functionality moved into `MediaType.toString()`
- **Utility optimizations**: Util functions moved directly into classes where used only once

#### Module System Changes
- Pure ES Modules (ESM) - no CommonJS support
- Updated exports structure in package.json
- Import extensions required: `.js` extensions must be used in TypeScript imports

#### Properties Made Private
- Internal `_type`, `_subtype`, and `_parameters` properties are now properly private
- Access only through public getters
- `type` and `subtype` are now read-only (getter-only)

#### Development Experience
- Added comprehensive ESLint configuration with TypeScript support
- Added `eslint-plugin-jsdoc` for JSDoc validation
- Improved test coverage with Vitest
- Added coverage reporting with `@vitest/coverage-v8`
- Web Platform Tests integration maintained and updated

#### License Change
- **License changed from MIT to ISC**
- Maintainer changed to Jason DiMeo

### Added
- `matches()` method for media type comparison
- Second constructor parameter for parameter overrides
- Full TypeScript type definitions
- Vitest UI support for interactive testing

### Changed
- Package name: `whatwg-mimetype` → `@d1g1tal/media-type`
- License: MIT → ISC
- Build system: esbuild-library → tsbuild
- Test framework: Jest → Vitest
- Package manager: npm/yarn → pnpm
- Module system: CommonJS → Pure ESM

### Removed
- `isHTML()` method
- `isXML()` method
- `isJavaScript()` method
- Object-only constructor signature
- CommonJS support
- Separate serializer module
- `esbuild-library` dependency
- `minipass-fetch` dev dependency (replaced with built-in fetch API)
- `rimraf` dev dependency (tsbuild handles cleaning)

## [4.x.x] - Previous versions

See the original [whatwg-mimetype](https://github.com/jsdom/whatwg-mimetype) repository for version 4.x.x and earlier history.

---

## Original Package Information

This package is a fork of [`whatwg-mimetype`](https://github.com/jsdom/whatwg-mimetype) by Domenic Denicola and contributors. The original package was licensed under MIT. This fork has been substantially rewritten with breaking changes and is licensed under ISC.

**Original Author**: Domenic Denicola <d@domenic.me> (https://domenic.me/)
**Current Maintainer**: Jason DiMeo <jason.dimeo@gmail.com>

The original package contributors and their excellent work are acknowledged with gratitude.
