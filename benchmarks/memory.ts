import { MediaType } from '../dist/media-type.js';

const gc = globalThis.gc;

if (gc === undefined) {
	throw new Error('Run this benchmark with --expose-gc');
}

const collectHeap = (): number => {
	for (let pass = 0; pass < 3; pass++) { gc() }
	return process.memoryUsage().heapUsed;
};

const parseLargeEscapedValue = (): MediaType => {
	return new MediaType(`text/plain;data="\\a${'x'.repeat(1024 * 1024)}"`);
};

new MediaType('text/plain;data="warmup"');

const measureLiveResult = (): number => {
	const baseline = collectHeap();
	const parsed = parseLargeEscapedValue();

	if (parsed.parameters.get('data')?.length !== 1024 * 1024 + 1) {
		throw new Error('Unexpected escaped parameter output');
	}

	return collectHeap() - baseline;
};

const parseAndDiscardLargeEscapedValue = (): void => {
	const valueLength = parseLargeEscapedValue().parameters.get('data')?.length;

	if (valueLength !== 1024 * 1024 + 1) {
		throw new Error('Unexpected escaped parameter output');
	}
};

const liveResult = measureLiveResult();
const baseline = collectHeap();
parseAndDiscardLargeEscapedValue();
const discardedResult = collectHeap() - baseline;

console.log('\nPost-GC retained heap');
console.log(`live 1 MiB escaped result: ${(liveResult / 1024 / 1024).toFixed(2)} MiB`);
console.log(`discarded escaped result: ${(discardedResult / 1024 / 1024).toFixed(2)} MiB`);