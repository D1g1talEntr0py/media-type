import MediaTypeParameters from '../src/media-type-parameters.js';
import { jest, describe, it } from '@jest/globals';

describe('MediaTypeParameters', () => {
	describe('constructor', () => {
		it('should create a new instance', () => {
			const parameters = new MediaTypeParameters();

			expect(parameters).toBeInstanceOf(MediaTypeParameters);
		});
	});

	describe('has', () => {
		it('should return true if the parameter exists', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			expect(parameters.has('foo')).toBe(true);
		});

		it('should return false if the parameter does not exist', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			expect(parameters.has('baz')).toBe(false);
		});
	});

	describe('get', () => {
		it('should return the parameter value if the parameter exists', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			expect(parameters.get('foo')).toBe('bar');
		});

		it('should return undefined if the parameter does not exist', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			expect(parameters.get('baz')).toBeUndefined();
		});
	});

	describe('set', () => {
		it('should set the parameter value if the parameter exists', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			parameters.set('foo', 'baz');

			expect(parameters.get('foo')).toBe('baz');
		});

		it('should throw an error if passed an invalid parameter name', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			expect(() => parameters.set('🤣', 'bar')).toThrow();
		});

		it('should throw an error if passed invalid parameter', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			expect(() => parameters.set('foo', '🤣')).toThrow();
		});
	});

	describe('delete', () => {
		it('should delete the parameter if the parameter exists', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			parameters.delete('foo');

			expect(parameters.has('foo')).toBe(false);
		});

		it('should return false if the parameter does not exist', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			expect(parameters.delete('baz')).toEqual(false);
		});
	});

	// TODO - Add `toString()` method
	// describe('toString', () => {
	// 	it('should return the parameters as a string', () => {
	// 		const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

	// 		expect(parameters.toString()).toBe('foo=bar;bar=baz');
	// 	});
	// });

	describe('forEach', () => {
		it('should iterate over each parameter', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);
			const callback = jest.fn();

			parameters.forEach(callback);

			expect(callback).toHaveBeenCalledTimes(2);
		});
	});

	describe('Symbol.iterator', () => {
		it('should return an iterator', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(parameters[Symbol.iterator]()).toBeInstanceOf(Object);
		});

		it('should return the parameter entries', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(Array.from(parameters[Symbol.iterator]())).toEqual([[ 'foo', 'bar' ], [ 'bar', 'baz' ]]);
		});
	});

	describe('Symbol.toStringTag', () => {
		it('should return the string tag', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(parameters[Symbol.toStringTag]()).toBe('MediaTypeParameters');
		});
	});

	describe('entries', () => {
		it('should return an iterator', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(parameters.entries()).toBeInstanceOf(Object);
		});

		it('should return the parameter entries', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(Array.from(parameters.entries())).toEqual([[ 'foo', 'bar' ], [ 'bar', 'baz' ]]);
		});
	});

	describe('keys', () => {
		it('should return an iterator', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(parameters.keys()).toBeInstanceOf(Object);
		});

		it('should return the parameter names', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(Array.from(parameters.keys())).toEqual([ 'foo', 'bar' ]);
		});
	});

	describe('values', () => {
		it('should return an iterator', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(parameters.values()).toBeInstanceOf(Object);
		});

		it('should return the parameter values', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(Array.from(parameters.values())).toEqual([ 'bar', 'baz' ]);
		});
	});

	describe('size', () => {
		it('should return the number of parameters', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(parameters.size).toBe(2);
		});
	});

	describe('clear', () => {
		it('should remove all parameters', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			parameters.clear();

			expect(parameters.size).toBe(0);
		});
	});
});