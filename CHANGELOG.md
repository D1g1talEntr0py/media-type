## [6.0.8](https://github.com/D1g1talEntr0py/media-type/compare/v6.0.7...v6.0.8) (2026-04-07)

### Bug Fixes

* **deps:** run fresh install to get the most up to date transient dependencies to finally address CVE-2026-39363 (c44a3ff727a06703013f59a9413d36440d7b46c5)

## [6.0.7](https://github.com/D1g1talEntr0py/media-type/compare/v6.0.6...v6.0.7) (2026-04-07)

### Bug Fixes

* update vitest to resolve Vite vulnerability (b0366f57a7ab577139d6f2df4bf7a399213ebcfa)
Bumps vitest and related testing packages to resolve a security vulnerability (CVE-2026-39363) in the transitive vite dependency.


### Build System

* migrate to TypeScript 6 and update tooling (6d68916842f5c4960311c6040508bd744a47d269)
Upgrades TypeScript to v6 and updates associated tooling (eslint, tsbuild, etc.) to their latest compatible versions. Also refines tsconfig.json and semantic-release configurations.

## [6.0.6](https://github.com/D1g1talEntr0py/media-type/compare/v6.0.5...v6.0.6) (2026-03-18)

### Bug Fixes

* **release:** added --no-git-checks flag to ensure build is published (a9fe03c0a57b082207ff4dbcc1528ea27c7f78ab)

## [6.0.5](https://github.com/D1g1talEntr0py/media-type/compare/v6.0.4...v6.0.5) (2026-03-18)

### Bug Fixes

* **deps:** update dependencies to resolve CVE-2026-32141 (c6adc5b382b3a177ce1cbe7dd19d50305256bcba)
Updates development dependencies and patches the pnpm lockfile to remediate the identified security vulnerability.

Fixes CVE-2026-32141


### Documentation

* update license from ISC to MIT (9d7a3d00cf16ada234781a9a9bfa8aee8b4d1de3)
Transitions the overarching software license to MIT across the project text and supporting package metadata.


### Continuous Integration

* update workflows and semantic release configuration (8a2ec6ce64ee5faa98eda3528f748de592a40294)
Bumps GitHub Actions to their latest major versions and updates semantic-release configuration to use pnpm commands for publishing.

## [6.0.4](https://github.com/D1g1talEntr0py/media-type/compare/v6.0.3...v6.0.4) (2026-03-07)

### Bug Fixes

* bump eslint to address security vulnerability (efc758fa369a2987b64297a09cc955ad076ce78e)
Updates eslint to 10.0.3 which includes a security fix, along with
its internal sub-packages (@eslint/core, @eslint/config-array,
@eslint/config-helpers, @eslint/object-schema, @eslint/plugin-kit,
eslint-scope, espree) to their corresponding patch releases.

Also bumps @types/node to pick up the latest type definitions.


### Miscellaneous Chores

* replace whatwg-encoding with @exodus/bytes (14f73e922b6c0fe8cc70b28fb74434e5294586ad)
Switches the encoding label lookup dependency from the deprecated
whatwg-encoding to @exodus/bytes, which is faster and more
spec-conformant.

Updates the test code to use the new import path and adjusts the
calling convention to pass an empty string fallback, matching the
new API.

## [6.0.3](https://github.com/D1g1talEntr0py/media-type/compare/v6.0.2...v6.0.3) (2026-03-02)

### Bug Fixes

* add prepublishOnly due to stupid human mistake (8864b012f879a91fe9aa363b6d0c842563d92331)

## [6.0.2](https://github.com/D1g1talEntr0py/media-type/compare/v6.0.1...v6.0.2) (2026-03-02)

### Bug Fixes

* version bump due to Claude mistake. Oops! (1752b078a6fe162e3f7837cdf02af4d62c9f3d05)

### Documentation

* fixed license file (e52439d82791806dac633ffae1e7c6891677e40e)
* fixed license file, again (44dd9ccc6e6be8cb8b2ea29c7bb44f6daebf98fc)

## [6.0.1](https://github.com/D1g1talEntr0py/media-type/compare/v6.0.0...v6.0.1) (2026-03-01)

### Bug Fixes

* **ci:** add workflow_dispatch trigger, correct tarball glob, and add type-check script (a46c2c19baf6c49b3b4e57da3e36de08a6df9e1f)

### Code Refactoring

* **parser:** simplify component collection API (681e8f275b46cc39a6f146f1bcdddd85a277136a)
Replaces the options-object-based filterComponent method with a
straighter collect function returning a tuple, eliminating unnecessary
parameter grouping and making call sites easier to read.

Switches the whitespace character lookup from an array (O(n) includes)
to a Set (O(1) has) for a small but consistent performance gain.


### Documentation

* update README badges and fix minor formatting (51cf9457fc604cccde032c060ecb86bf876a9713)
Replaces static badge URLs with dynamic ones that show live npm download
counts and the new CI/Codecov status badges, giving visitors an
immediate signal of project health.

Fixes trailing-whitespace and import-block formatting issues.


### Miscellaneous Chores

* **release:** 5.1.0 [skip ci] (f3c6cbffe6ed87a59a5c7b321fc69d269ac61d28)
## [5.1.0](https://github.com/D1g1talEntr0py/media-type/compare/v5.0.0...v5.1.0) (2026-03-01)

### Features

* convert to TypeScript (06901a60aa3d0643815e5f3c53d934f2dae0b361)

### Code Refactoring

* **parser:** simplify component collection API (681e8f275b46cc39a6f146f1bcdddd85a277136a)
Replaces the options-object-based filterComponent method with a
straighter collect function returning a tuple, eliminating unnecessary
parameter grouping and making call sites easier to read.

Switches the whitespace character lookup from an array (O(n) includes)
to a Set (O(1) has) for a small but consistent performance gain.

### Documentation

* update README badges and fix minor formatting (51cf9457fc604cccde032c060ecb86bf876a9713)
Replaces static badge URLs with dynamic ones that show live npm download
counts and the new CI/Codecov status badges, giving visitors an
immediate signal of project health.

Fixes trailing-whitespace and import-block formatting issues.

### Miscellaneous Chores

* upgrade dev dependencies to latest versions (6b54d8b1cddf7dbc824dba54fd5933570b66a262)
Bumps eslint to v10, typescript-eslint to 8.56, vitest/coverage-v8/ui
to 4.0.18, @types/node to 25, @types/web to 0.0.338, and several
transitive deps (esbuild, rollup, vite, acorn, ajv, etc.).

Adds @d1g1tal/tsbuild as the project build tool, replacing the previous
build setup, and introduces a type-check script. Removes the duplicate
coverage script alias. Sets the minimum Node.js engine to >=20.16.0.

Updates .gitignore to track .tsbuild/ output directory.

### Build System

* add semantic-release config and release docs (1cdaab0d9db81c363cf1d81e8ae36e758b2b7c57)
Adds a .releaserc.json that configures semantic-release with the
conventionalcommits preset, custom release rules (refactor triggers a
patch bump), grouped changelog sections, npm pack + publish with
provenance, and a git commit of CHANGELOG.md and package.json after
each release.

Adds a release-process.md guide explaining how to author commits,
open PRs, merge to main, and verify the automated release, including
a dry-run section and a troubleshooting FAQ.

### Continuous Integration

* add GitHub Actions workflows for CI and release (4ad266f7984742e7c5dd722340dc3c0786e4c7c9)
Adds a CI workflow that runs lint, type-check, tests with coverage, and
build across Node.js 20, 22, and 24 on every push and pull request to
main. Coverage is uploaded to Codecov from the Node 24 run only.

Adds a release workflow powered by semantic-release that triggers on
merges to main and fully automates versioning, changelog generation, npm
publish with provenance, and GitHub Release creation.

Adds a commit-msg git hook that enforces Conventional Commits format so
that semantic-release can reliably determine version bumps.

* add packageManager field for pnpm/action-setup (ee441628159346a66013bb429bf30e583d687b03)
* trigger actions (836151dd5d4e73e3bf51f2a6d5b11f462eef25a8)
* trigger actions (c415c4a08169fa103acbaaa9a1268485df6eb4e0)
* trigger actions (fc350c91e7e2546604361aade7f0f55530095b38)

* **release:** 5.1.1 [skip ci] (f4d1336e1031a2d42ff9e2f091019ae0bb90d5f5)
## [5.1.1](https://github.com/D1g1talEntr0py/media-type/compare/v5.1.0...v5.1.1) (2026-03-01)

### Bug Fixes

* **ci:** add workflow_dispatch trigger, correct tarball glob, and add type-check script (a46c2c19baf6c49b3b4e57da3e36de08a6df9e1f)

### Tests

* removed web-platform-tests from .gitignore (db2fbdd787928e9b5ac2661bd4a738221f084280)

### Continuous Integration

* added missing test data (12d03ca176a8c4407610774e599325df7790e0bc)

* restore correct version and revert bad 5.1.1 changelog entry (c47f3bf32826152f6f6b363e4ed63a9d61ea61dd)
* upgrade dev dependencies to latest versions (6b54d8b1cddf7dbc824dba54fd5933570b66a262)
Bumps eslint to v10, typescript-eslint to 8.56, vitest/coverage-v8/ui
to 4.0.18, @types/node to 25, @types/web to 0.0.338, and several
transitive deps (esbuild, rollup, vite, acorn, ajv, etc.).

Adds @d1g1tal/tsbuild as the project build tool, replacing the previous
build setup, and introduces a type-check script. Removes the duplicate
coverage script alias. Sets the minimum Node.js engine to >=20.16.0.

Updates .gitignore to track .tsbuild/ output directory.


### Tests

* removed web-platform-tests from .gitignore (db2fbdd787928e9b5ac2661bd4a738221f084280)

### Build System

* add semantic-release config and release docs (1cdaab0d9db81c363cf1d81e8ae36e758b2b7c57)
Adds a .releaserc.json that configures semantic-release with the
conventionalcommits preset, custom release rules (refactor triggers a
patch bump), grouped changelog sections, npm pack + publish with
provenance, and a git commit of CHANGELOG.md and package.json after
each release.

Adds a release-process.md guide explaining how to author commits,
open PRs, merge to main, and verify the automated release, including
a dry-run section and a troubleshooting FAQ.


### Continuous Integration

* add GitHub Actions workflows for CI and release (4ad266f7984742e7c5dd722340dc3c0786e4c7c9)
Adds a CI workflow that runs lint, type-check, tests with coverage, and
build across Node.js 20, 22, and 24 on every push and pull request to
main. Coverage is uploaded to Codecov from the Node 24 run only.

Adds a release workflow powered by semantic-release that triggers on
merges to main and fully automates versioning, changelog generation, npm
publish with provenance, and GitHub Release creation.

Adds a commit-msg git hook that enforces Conventional Commits format so
that semantic-release can reliably determine version bumps.

* add packageManager field for pnpm/action-setup (ee441628159346a66013bb429bf30e583d687b03)
* added missing test data (12d03ca176a8c4407610774e599325df7790e0bc)
* trigger actions (836151dd5d4e73e3bf51f2a6d5b11f462eef25a8)
* trigger actions (c415c4a08169fa103acbaaa9a1268485df6eb4e0)
* trigger actions (fc350c91e7e2546604361aade7f0f55530095b38)

## [5.1.0](https://github.com/D1g1talEntr0py/media-type/compare/v5.0.0...v5.1.0) (2026-03-01)

### Features

* convert to TypeScript (06901a60aa3d0643815e5f3c53d934f2dae0b361)

### Code Refactoring

* **parser:** simplify component collection API (681e8f275b46cc39a6f146f1bcdddd85a277136a)
Replaces the options-object-based filterComponent method with a
straighter collect function returning a tuple, eliminating unnecessary
parameter grouping and making call sites easier to read.

Switches the whitespace character lookup from an array (O(n) includes)
to a Set (O(1) has) for a small but consistent performance gain.


### Documentation

* update README badges and fix minor formatting (51cf9457fc604cccde032c060ecb86bf876a9713)
Replaces static badge URLs with dynamic ones that show live npm download
counts and the new CI/Codecov status badges, giving visitors an
immediate signal of project health.

Fixes trailing-whitespace and import-block formatting issues.


### Miscellaneous Chores

* upgrade dev dependencies to latest versions (6b54d8b1cddf7dbc824dba54fd5933570b66a262)
Bumps eslint to v10, typescript-eslint to 8.56, vitest/coverage-v8/ui
to 4.0.18, @types/node to 25, @types/web to 0.0.338, and several
transitive deps (esbuild, rollup, vite, acorn, ajv, etc.).

Adds @d1g1tal/tsbuild as the project build tool, replacing the previous
build setup, and introduces a type-check script. Removes the duplicate
coverage script alias. Sets the minimum Node.js engine to >=20.16.0.

Updates .gitignore to track .tsbuild/ output directory.


### Build System

* add semantic-release config and release docs (1cdaab0d9db81c363cf1d81e8ae36e758b2b7c57)
Adds a .releaserc.json that configures semantic-release with the
conventionalcommits preset, custom release rules (refactor triggers a
patch bump), grouped changelog sections, npm pack + publish with
provenance, and a git commit of CHANGELOG.md and package.json after
each release.

Adds a release-process.md guide explaining how to author commits,
open PRs, merge to main, and verify the automated release, including
a dry-run section and a troubleshooting FAQ.


### Continuous Integration

* add GitHub Actions workflows for CI and release (4ad266f7984742e7c5dd722340dc3c0786e4c7c9)
Adds a CI workflow that runs lint, type-check, tests with coverage, and
build across Node.js 20, 22, and 24 on every push and pull request to
main. Coverage is uploaded to Codecov from the Node 24 run only.

Adds a release workflow powered by semantic-release that triggers on
merges to main and fully automates versioning, changelog generation, npm
publish with provenance, and GitHub Release creation.

Adds a commit-msg git hook that enforces Conventional Commits format so
that semantic-release can reliably determine version bumps.

* add packageManager field for pnpm/action-setup (ee441628159346a66013bb429bf30e583d687b03)
* trigger actions (836151dd5d4e73e3bf51f2a6d5b11f462eef25a8)
* trigger actions (c415c4a08169fa103acbaaa9a1268485df6eb4e0)
* trigger actions (fc350c91e7e2546604361aade7f0f55530095b38)

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [6.0.0] - 2024-06-15

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
