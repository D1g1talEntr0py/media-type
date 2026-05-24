// Registers CDN resolution/load hooks before the benchmark module loads.
// Used via: node --import ./benchmarks/cdn-preload.ts benchmarks/benchmark.ts
import { registerHooks } from 'node:module';
import { load, resolve } from './cdn-loader.ts';

registerHooks({ resolve, load });
