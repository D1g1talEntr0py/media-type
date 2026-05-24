import { bench, group, run, summary } from 'https://esm.run/mitata@1.0.34';
import contentType from 'https://esm.run/content-type@2.0.0';
import { MIMEType as WhatwgMimeType } from 'https://esm.run/whatwg-mimetype@5.0.0';
import { MediaType } from '../dist/media-type.js';

let sink = 0;

/**
 * Consumes a string value by XORing its length into the `sink` variable. This is used to prevent the JavaScript engine's JIT compiler from optimizing away code that produces values we want to benchmark, while still allowing us to read the final result after all benchmarks have run to ensure the operations are not treated as dead code.
 * @param value The string value to consume.
 */
const consumeString = (value: string): void => { sink ^= value.length };
/**
 * Consumes a boolean value by XORing 1 if true or 0 if false into the `sink` variable.
 * @param value The boolean value to consume.
 */
const consumeBoolean = (value: boolean): void => { sink ^= value ? 1 : 0 };
/**
 * Consumes a number value by XORing it into the `sink` variable.
 * @param value The number value to consume.
 */
const consumeNumber = (value: number): void => { sink ^= value };

// ---------------------------------------------------------------------------
// Sample inputs covering realistic shapes
// ---------------------------------------------------------------------------
const simple = 'text/html';
const withCharset = 'text/html;charset=utf-8';
const multipleParams = 'application/json;charset=utf-8;foo=bar;baz=qux';
const messyWhitespace = '   text/html ;  charset=utf-8 ;  foo=bar  ';
const quoted = 'multipart/form-data; boundary="abc123"; name="payload"';
const quotedEscaped = 'multipart/form-data; boundary="a\\"b\\\\c"; name="x"';
const longValue = `text/plain;data=${'x'.repeat(512)};extra=${'y'.repeat(256)}`;
const mixedCase = 'TeXT/HtML;CharSet="UTF-8";Foo=Bar';

// Pre-parsed instances for serialization / matching benches
const sampleMt = new MediaType(multipleParams);
const sampleCt = contentType.parse(multipleParams);
const sampleWhatwg = new WhatwgMimeType(multipleParams);

// ---------------------------------------------------------------------------
// Parse benches
// ---------------------------------------------------------------------------
group('parse - simple "text/html"', () => {
	summary(() => {
		bench('@d1g1tal/media-type', () => {
			const parsed = new MediaType(simple);
			consumeString(parsed.type);
		});
		bench('whatwg-mimetype', () => {
			const parsed = new WhatwgMimeType(simple);
			consumeString(parsed.essence);
		});
		bench('content-type', () => {
			const parsed = contentType.parse(simple);
			consumeString(parsed.type);
		});
	});
});

group('parse - with charset', () => {
	summary(() => {
		bench('@d1g1tal/media-type', () => {
			const parsed = new MediaType(withCharset);
			consumeString(parsed.type);
		});
		bench('whatwg-mimetype', () => {
			const parsed = new WhatwgMimeType(withCharset);
			consumeString(parsed.essence);
		});
		bench('content-type', () => {
			const parsed = contentType.parse(withCharset);
			consumeString(parsed.type);
		});
	});
});

group('parse - multiple parameters', () => {
	summary(() => {
		bench('@d1g1tal/media-type', () => {
			const parsed = new MediaType(multipleParams);
			consumeString(parsed.type);
		});
		bench('whatwg-mimetype', () => {
			const parsed = new WhatwgMimeType(multipleParams);
			consumeString(parsed.essence);
		});
		bench('content-type', () => {
			const parsed = contentType.parse(multipleParams);
			consumeString(parsed.type);
		});
	});
});

group('parse - messy whitespace', () => {
	summary(() => {
		bench('@d1g1tal/media-type', () => {
			const parsed = new MediaType(messyWhitespace);
			consumeString(parsed.type);
		});
		bench('whatwg-mimetype', () => {
			const parsed = new WhatwgMimeType(messyWhitespace);
			consumeString(parsed.essence);
		});
		bench('content-type', () => {
			const parsed = contentType.parse(messyWhitespace);
			consumeString(parsed.type);
		});
	});
});

group('parse - quoted parameters', () => {
	summary(() => {
		bench('@d1g1tal/media-type', () => {
			const parsed = new MediaType(quoted);
			consumeString(parsed.type);
		});
		bench('whatwg-mimetype', () => {
			const parsed = new WhatwgMimeType(quoted);
			consumeString(parsed.essence);
		});
		bench('content-type', () => {
			const parsed = contentType.parse(quoted);
			consumeString(parsed.type);
		});
	});
});

group('parse - quoted with escapes', () => {
	summary(() => {
		bench('@d1g1tal/media-type', () => {
			const parsed = new MediaType(quotedEscaped);
			consumeString(parsed.type);
		});
		bench('whatwg-mimetype', () => {
			const parsed = new WhatwgMimeType(quotedEscaped);
			consumeString(parsed.essence);
		});
		// content-type throws on backslash-escape sequences in some inputs; skip it here.
	});
});

group('parse - long values (>500 chars)', () => {
	summary(() => {
		bench('@d1g1tal/media-type', () => {
			const parsed = new MediaType(longValue);
			consumeString(parsed.type);
		});
		bench('whatwg-mimetype', () => {
			const parsed = new WhatwgMimeType(longValue);
			consumeString(parsed.essence);
		});
		bench('content-type', () => {
			const parsed = contentType.parse(longValue);
			consumeString(parsed.type);
		});
	});
});

group('parse - mixed case', () => {
	summary(() => {
		bench('@d1g1tal/media-type', () => {
			const parsed = new MediaType(mixedCase);
			consumeString(parsed.type);
		});
		bench('whatwg-mimetype', () => {
			const parsed = new WhatwgMimeType(mixedCase);
			consumeString(parsed.essence);
		});
		bench('content-type', () => {
			const parsed = contentType.parse(mixedCase);
			consumeString(parsed.type);
		});
	});
});

// ---------------------------------------------------------------------------
// Serialize benches
// ---------------------------------------------------------------------------
group('serialize (toString) - multiple parameters', () => {
	summary(() => {
		bench('@d1g1tal/media-type', () => consumeString(sampleMt.toString()));
		bench('whatwg-mimetype', () => consumeString(sampleWhatwg.toString()));
		bench('content-type', () => consumeString(contentType.format(sampleCt)));
	});
});

// ---------------------------------------------------------------------------
// Lookups / matches
// ---------------------------------------------------------------------------
group('essence access', () => {
	bench('@d1g1tal/media-type .essence', () => consumeString(sampleMt.essence));
	bench('whatwg-mimetype .essence', () => consumeString(sampleWhatwg.essence));
});

group('matches()', () => {
	bench('@d1g1tal/media-type matches string', () => consumeBoolean(sampleMt.matches('application/json')));
	bench('@d1g1tal/media-type matches MediaType', () => consumeBoolean(sampleMt.matches(sampleMt)));
});

group('parameter lookup (get)', () => {
	bench('@d1g1tal/media-type', () => consumeString(sampleMt.parameters.get('charset') ?? ''));
	bench('whatwg-mimetype', () => consumeString(sampleWhatwg.parameters.get('charset') ?? ''));
});

// ---------------------------------------------------------------------------
// Run with memory tracking enabled
// ---------------------------------------------------------------------------
await run({ format: 'mitata' });

// Read from sink after all runs so JIT cannot fully drop sink updates as dead stores.
consumeNumber(sink);
