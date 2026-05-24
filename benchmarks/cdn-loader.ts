/**
 * ESM hook: resolves and loads `https://` import specifiers.
 * Fetches once and caches by URL hash under benchmarks/.cdn-cache/.
 * Handles redirects (e.g. esm.run → cdn.jsdelivr.net) and relative
 * sub-imports from within CDN modules.
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import type { LoadHookSync, ResolveHookSync } from 'node:module';

const cacheDir = new URL('.cdn-cache/', import.meta.url).pathname;
mkdirSync(cacheDir, { recursive: true });

/**
 * Generates a cache file path for a given URL by hashing it.
 * @param url The URL to generate a cache file path for.
 * @returns The cache file path.
 */
const cacheFile = (url: string): string => cacheDir + createHash('sha1').update(url).digest('hex') + '.js';

/**
 * Resolves import specifiers starting with `https://` by short-circuiting the resolution
 * and returning the URL as-is. Also resolves relative imports made by CDN modules.
 *
 * @param specifier The import specifier to resolve.
 * @param context The context of the import, including the parent URL if available.
 * @param nextResolve The next resolver in the chain to call if this resolver does not handle the specifier.
 * @returns An object with `shortCircuit: true` and the resolved URL if handled, or the result of `nextResolve` otherwise.
 */
export const resolve: ResolveHookSync = (specifier, context, nextResolve) => {
	if (specifier.startsWith('https://')) {
		return { shortCircuit: true, url: specifier };
	}

	// Resolve relative imports made by CDN modules (e.g. './foo.js' inside mitata).
	if (context.parentURL?.startsWith('https://') && (specifier.startsWith('./') || specifier.startsWith('../') || specifier.startsWith('/'))) {
		return { shortCircuit: true, url: new URL(specifier, context.parentURL).href };
	}

	return nextResolve(specifier, context);
};

/**
 * Loads modules from `https://` URLs by fetching and caching their source code.
 * If the module has already been cached, it loads from the cache instead of fetching again.
 *
 * @param url The URL of the module to load.
 * @param context The context of the import, including the parent URL if available.
 * @param nextLoad The next loader in the chain to call if this loader does not handle the URL.
 * @returns An object with `shortCircuit: true`, `format: 'module'`, and the module source code if handled, or the result of `nextLoad` otherwise.
 */
export const load: LoadHookSync = (url, context, nextLoad) => {
	if (!url.startsWith('https://')) return nextLoad(url, context);

	const file = cacheFile(url);
	if (existsSync(file)) {
		return { shortCircuit: true, format: 'module', source: readFileSync(file, 'utf8') };
	}

	// Use a sync fetch path so this hook is compatible with module.registerHooks().
	const source = execFileSync('curl', [ '--location', '--fail', '--silent', '--max-time', '30', url ], { encoding: 'utf8' });
	writeFileSync(file, source, 'utf8');

	return { shortCircuit: true, format: 'module', source };
};
