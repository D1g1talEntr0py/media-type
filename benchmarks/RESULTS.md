# Benchmark Results

Run on AMD Ryzen 9 9950X (Node 26.2.0). Times are median of mitata runs.
Reproduce with: `pnpm benchmark`

## Parse throughput (lower is better)

| Scenario                       | Baseline   | Optimized  | Speedup    | content-type | whatwg-mimetype |
| ------------------------------ | ---------- | ---------- | ---------- | ------------ | --------------- |
| simple `text/html`             | 133.00 ns  | **82.89 ns**  | **1.60×** | 12.79 ns     | 157.02 ns       |
| with charset                   | 391.73 ns  | **182.70 ns** | **2.14×** | 55.92 ns     | 326.94 ns       |
| multiple parameters            | 756.66 ns  | **339.74 ns** | **2.23×** | 153.90 ns    | 638.77 ns       |
| messy whitespace               | 647.29 ns  | **353.91 ns** | **1.83×** | 114.31 ns    | 639.99 ns       |
| quoted parameters              | 556.82 ns  | **336.40 ns** | **1.66×** | 166.03 ns    | 563.07 ns       |
| quoted with escapes            | 533.42 ns  | **323.36 ns** | **1.65×** | n/a (throws) | 520.16 ns       |
| long values (>500 chars)       | 5.16 µs    | **1.26 µs**   | **4.10×** | 961.68 ns    | 3.78 µs         |
| mixed case                     | 489.57 ns  | **286.09 ns** | **1.71×** | 103.85 ns    | 855.79 ns       |

## Other operations

| Scenario                  | Baseline  | Optimized   | Speedup |
| ------------------------- | --------- | ----------- | ------- |
| `toString()` (multi)      | 298.49 ns | **53.34 ns** | **5.60×** (also beats both rivals: content-type 106 ns, whatwg 60 ns) |
| `.essence` access         | 2.55 ns   | **50 ps**    | **~50×** (cached) |
| `matches(string)`         | 2.54 ns   | **49 ps**    | **~50×** (equality, no allocation) |
| `parameters.get('charset')`| 3.79 ns  | **3.03 ns**  | 1.25× (also vs whatwg 31 ns) |

## Allocation per op (representative samples)

| Scenario           | Baseline   | Optimized  | content-type | whatwg-mimetype |
| ------------------ | ---------- | ---------- | ------------ | --------------- |
| simple             | 683 b      | **560 b**  | 100 b        | 960 b           |
| multiple params    | 1.98 kb    | **800 b**  | 359 b        | 2.37 kb         |
| long values        | 1.62 kb    | **720 b**  | 312 b        | 2.32 kb         |
| `toString()`       | 979 b      | **0 b**    | 425 b        | 809 b           |

## Notable wins

- **`MediaType.matches('text/html')`** previously did a `String.prototype.includes` substring match — `'text/html'.matches('ml')` returned `true`. Fixed to strict essence equality.
- **`toString()`** now allocates zero intermediate arrays (was 2× `Array` + iterator overhead).
- **`essence`** is cached — instances are immutable, recomputing the template literal on every access was waste.
- **Long values** are no longer built char-by-char with `+=` in a hot loop; single `slice()` per token.
- All 1022 tests (incl. 955 WHATWG web-platform tests) pass.
