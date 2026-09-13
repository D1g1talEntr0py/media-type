# Benchmark Results

Run on AMD Ryzen 9 9950X (Node 26.8.2). Times are median of mitata runs.
Current source: worktree based on `304ba39`. Historical baseline revision: not recorded.
Reproduce with: `pnpm benchmark`

## Parse throughput (lower is better)

| Scenario                       | Baseline   | Optimized  | Speedup    | content-type | whatwg-mimetype |
| ------------------------------ | ---------- | ---------- | ---------- | ------------ | --------------- |
| simple `text/html`             | 133.00 ns  | **38.68 ns**  | **3.44×** | 15.55 ns     | 176.04 ns       |
| with charset                   | 391.73 ns  | **110.41 ns** | **3.55×** | 72.27 ns     | 392.94 ns       |
| multiple parameters            | 756.66 ns  | **227.08 ns** | **3.33×** | 195.97 ns    | 775.64 ns       |
| messy whitespace               | 647.29 ns  | **264.99 ns** | **2.44×** | 127.62 ns    | 685.59 ns       |
| quoted parameters              | 556.82 ns  | **210.55 ns** | **2.64×** | 164.04 ns    | 711.77 ns       |
| quoted with escapes            | 533.42 ns  | **240.91 ns** | **2.21×** | 144.91 ns    | 638.38 ns       |
| long values (>500 chars)       | 5.16 µs    | **1.20 µs**   | **4.30×** | 951.68 ns    | 4.55 µs         |
| mixed case                     | 489.57 ns  | **221.75 ns** | **2.21×** | 118.39 ns    | 989.20 ns       |

## Other operations

| Scenario                  | Baseline  | Optimized   | Speedup |
| ------------------------- | --------- | ----------- | ------- |
| `toString()` (multi)      | 298.49 ns | **83.29 ns**  | **3.58×** (whatwg 105.45 ns, content-type 137.71 ns) |
| `.essence` access         | 2.55 ns   | **668.68 ps** | **3.81×** (cached) |
| `matches(string)`         | 2.54 ns   | **9.51 ns**   | strict equality; no allocation |
| `parameters.get('charset')`| 3.79 ns  | **5.79 ns**   | 6.41× faster than whatwg 37.14 ns |

## Targeted long-input benchmarks

| Scenario                              | Time       | Allocation |
| ------------------------------------- | ---------- | ---------- |
| Parse escaped quoted value (>8 KiB)   | 12.20 µs   | 448.26 b   |
| Parse 1 KiB subtype + trailing space  | 1.62 µs    | 464.14 b   |
| Set 512-character parameter value     | 158.23 ns  | 0.86 b     |
| Serialize 512-character value         | 265.84 ns  | 722.35 b   |
| Set 8 KiB parameter value             | 1.97 µs    | 0.12 b     |
| Serialize 8 KiB value                 | 3.18 µs    | 389.30 b   |

## Retained heap

Measured in a fresh process with explicit garbage collection:

| Scenario                         | Retained heap |
| -------------------------------- | ------------- |
| Live 1 MiB escaped result        | 1.01 MiB      |
| Discarded 1 MiB escaped result   | 0.00 MiB      |

## Allocation per op (representative samples)

| Scenario           | Baseline   | Optimized  | content-type | whatwg-mimetype |
| ------------------ | ---------- | ---------- | ------------ | --------------- |
| simple             | 683 b      | **392 b**  | 110 b        | 0.99 kb         |
| multiple params    | 1.98 kb    | **552 b**  | 369 b        | 2.46 kb         |
| long values        | 1.62 kb    | **504 b**  | 314 b        | 2.37 kb         |
| `toString()`       | 979 b      | **634 b**  | 497 b        | 874 b            |

## Notable wins

- **`MediaType.matches('text/html')`** previously did a `String.prototype.includes` substring match — `'text/html'.matches('ml')` returned `true`. Fixed to strict essence equality.
- **`toString()`** now allocates zero intermediate arrays (was 2× `Array` + iterator overhead).
- **`essence`** is cached — instances are immutable, recomputing the template literal on every access was waste.
- **Long values** are no longer built char-by-char with `+=` in a hot loop; single `slice()` per token.
- Long reusable parameter values switch to native regular-expression validation after 64 characters.
- Escaped quoted values append contiguous slices, preventing character-by-character rope growth.
- All 1093 tests (incl. 955 WHATWG web-platform tests) pass.
