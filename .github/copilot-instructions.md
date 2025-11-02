# Copilot Instructions for media-type

This is a WHATWG MIME Sniffing Standard-compliant media type parsing library written in TypeScript with full type safety.

## Architecture Overview

**Core Components:**
- `MediaType` - Main class for parsing/manipulating media types (`src/media-type.ts`)
- `MediaTypeParameters` - Extends Map for parameter management (`src/media-type-parameters.ts`)
- `MediaTypeParser` - Low-level parsing logic (`src/media-type-parser.ts`)
- `utils.ts` - HTTP token validation regex and utility functions

**Key Pattern**: Full TypeScript implementation with strict compiler options and isolated declarations for optimal type inference.

## Development Workflow

**Build System:**
```bash
pnpm build          # TypeScript compilation using tsbuild
pnpm test           # Vitest test runner
pnpm test:watch     # Vitest in watch mode
pnpm test:ui        # Vitest with interactive UI
pnpm test:coverage  # Vitest with coverage reports using @vitest/coverage-v8
pnpm coverage       # Alias for test:coverage
pnpm lint           # ESLint with TypeScript support
```

**Pre-test Hook:** Automatically fetches latest WHATWG web platform tests before running tests via `tests/scripts/get-latest-platform-tests.ts`.

## Project-Specific Conventions

**Module System:**
- Pure ES Modules (`"type": "module"` in package.json)
- Import extensions required: `.js` extensions must be used in imports (TypeScript convention)
- No CommonJS support

**TypeScript Strategy:**
- Full TypeScript source code with strict compiler options
- Isolated declarations enabled for better type inference
- Single bundled declaration file: `dist/media-type.d.ts`
- No JSDoc needed - use TypeScript types directly

**API Design Patterns:**
- Constructor throws on invalid input, static `parse()` returns null
- Immutable essence property, mutable type/subtype properties
- Parameters extend Map with case-insensitive access (names lowercased)
- All parameter operations validate against HTTP token code points

**Testing Structure:**
- Web Platform Tests integration (`tests/web-platform-tests/`)
- Test files use `@src/` alias for imports
- API tests mirror README examples exactly
- Coverage reports generated in `tests/coverage/`

**Dependencies:**
- TypeScript with tsbuild for compilation
- Vitest for testing with modern ES module support
- ESLint with TypeScript plugins for linting

## Critical Integration Points

**WHATWG Compliance:** Parser strictly follows MIME Sniffing Standard algorithms. Web platform tests are maintained in `tests/web-platform-tests/` and synchronized with the official spec.

**Export Strategy:**
- Main export: `"."` points to `./dist/media-type.js` with TypeScript definitions
- Single compiled bundle with source maps
- Type definitions: `./dist/media-type.d.ts`

**Build Output:** 
- Generates `media-type.js` bundle in `dist/` directory
- Includes TypeScript declaration file (`media-type.d.ts`)
- Source maps for debugging (`media-type.js.map`, `media-type.d.ts.map`)

**Testing:**
- Vitest as test runner (replaced Jest)
- Web Platform Tests integration for WHATWG compliance
- Coverage reports via @vitest/coverage-v8
- UI mode available for interactive testing

**Key TypeScript Compiler Options:**
- `strict: true` - All strict checks enabled
- `isolatedDeclarations: true` - Better type inference
- `verbatimModuleSyntax: true` - Explicit import/export syntax
- `target: "ESNext"` - Latest JavaScript features
- `module: "Preserve"` - Preserve ES module syntax

When implementing features, ensure:
1. WHATWG spec compliance
2. Full TypeScript type safety
3. Web platform tests pass
4. ESLint rules followed
5. All exports properly typed