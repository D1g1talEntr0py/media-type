import MediaType from '../src/media-type.js';

describe('Smoke tests via README intro example', () => {
	let mediaType;
	beforeEach(() => {
		mediaType = new MediaType('Text/HTML;Charset="utf-8"');
	});

	it('serializes correctly', () => {
		expect(mediaType.toString()).toEqual('text/html;charset=utf-8');
	});

	it('has the correct type, subtype, and essence', () => {
		expect(mediaType.type).toEqual('text');
		expect(mediaType.subtype).toEqual('html');
		expect(mediaType.essence).toEqual('text/html');
	});

	it('has the correct parameters', () => {
		expect(mediaType.parameters.size).toEqual(1);
		expect(mediaType.parameters.has('charset')).toBe(true);
		expect(mediaType.parameters.get('charset')).toEqual('utf-8');
	});

	it('responds to parameter setting', () => {
		mediaType.parameters.set('charset', 'windows-1252');
		expect(mediaType.parameters.get('charset')).toEqual('windows-1252');
		expect(mediaType.toString()).toEqual('text/html;charset=windows-1252');
	});
});

describe('Constructor behavior', () => {
	it('accepts an object for the second parameter', () => {
		const mediaType = new MediaType('text/html;charset=iso-8859-1', { charset: 'utf-8' });
		expect(mediaType.toString()).toEqual('text/html;charset=utf-8');
	});

	it('passed parameter overrides the parsed', () => {
		const mediaType = new MediaType('text/html;charset=iso-8859-1', { charset: 'utf-8' });
		expect(mediaType.toString()).toEqual('text/html;charset=utf-8');
	});

	it('passed parameter overrides the parsed with different case', () => {
		const externalMediaType = 'text/html;charset=ISO-8859-1';
		const mediaType = new MediaType(externalMediaType, { Charset: 'UTF-8' });
		expect(mediaType.toString()).toEqual('text/html;charset=UTF-8');
	});

	it('throws on unparsable media types', () => {
		expect(() => new MediaType('asdf')).toThrow();
		expect(() => new MediaType('text/html™')).toThrow();
	});
});

describe('type manipulation', () => {
	let mediaType;
	beforeEach(() => {
		mediaType = new MediaType('application/xml;foo=bar');
	});

	it('ASCII-lowercases incoming type strings', () => {
		mediaType = new MediaType('TeXT/xml;foo=bar');
		expect(mediaType.type).toEqual('text');
		expect(mediaType.essence).toEqual('text/xml');
		expect(mediaType.toString()).toEqual('text/xml;foo=bar');
	});

	it('throws an error for non-HTTP token code points', () => {
		// not exhaustive; maybe later
		expect(() => {
			mediaType.type = '/';
		}).toThrow();
	});

	it('throws an error for an empty string', () => {
		expect(() => {
			mediaType.type = '';
		}).toThrow();
	});
});

describe('subtype manipulation', () => {
	let mediaType;
	beforeEach(() => {
		mediaType = new MediaType('application/xml;foo=bar');
	});

	it('ASCII-lowercases incoming type strings', () => {
		mediaType = new MediaType('application/PdF;foo=bar');
		expect(mediaType.subtype).toEqual('pdf');
		expect(mediaType.essence).toEqual('application/pdf');
		expect(mediaType.toString()).toEqual('application/pdf;foo=bar');
	});

	it('throws an error for non-HTTP token code points', () => {
		// not exhaustive; maybe later
		expect(() => {
			mediaType.subtype = '/';
		}).toThrow();
	});

	it('throws an error for an empty string', () => {
		expect(() => {
			mediaType.subtype = '';
		}).toThrow();
	});
});

describe('parse', () => {
	it('should parse json', () => {
		const mediaType = MediaType.parse('application/json');
		expect(mediaType.type).toEqual('application');
		expect(mediaType.subtype).toEqual('json');
		expect(mediaType.essence).toEqual('application/json');
		expect(mediaType.toString()).toEqual('application/json');
	});

	it('should parse json with charset', () => {
		const mediaType = MediaType.parse('application/json;charset=utf-8');
		expect(mediaType.type).toEqual('application');
		expect(mediaType.subtype).toEqual('json');
		expect(mediaType.essence).toEqual('application/json');
		expect(mediaType.toString()).toEqual('application/json;charset=utf-8');
	});

	it('should parse json with charset and parameter', () => {
		const mediaType = MediaType.parse('application/json;charset=utf-8;foo=bar');
		expect(mediaType.type).toEqual('application');
		expect(mediaType.subtype).toEqual('json');
		expect(mediaType.essence).toEqual('application/json');
		expect(mediaType.toString()).toEqual('application/json;charset=utf-8;foo=bar');
	});

	it('should parse json with parameter', () => {
		const mediaType = MediaType.parse('application/json;foo=bar');
		expect(mediaType.type).toEqual('application');
		expect(mediaType.subtype).toEqual('json');
		expect(mediaType.essence).toEqual('application/json');
		expect(mediaType.toString()).toEqual('application/json;foo=bar');
	});

	it('should parse json patch', () => {
		const mediaType = MediaType.parse('application/merge-patch+json');
		expect(mediaType.type).toEqual('application');
		expect(mediaType.subtype).toEqual('merge-patch+json');
		expect(mediaType.essence).toEqual('application/merge-patch+json');
		expect(mediaType.toString()).toEqual('application/merge-patch+json');
	});

	it('should return null for an invalid media type', () => {
		expect(MediaType.parse('asdf')).toBeNull();
	});
});

describe('matches', () => {
	it('should match a media type', () => {
		const mediaType = new MediaType('text/html');
		expect(mediaType.matches('text/html')).toBe(true);
	});

	it('should match a media type with parameters', () => {
		const mediaType = new MediaType('text/html; charset=utf-8');
		expect(mediaType.matches('text/html')).toBe(true);
	});

	it('should match a media type with parameters', () => {
		const mediaType = new MediaType('text/html; charset=utf-8');
		expect(mediaType.matches(new MediaType('text/html'))).toBe(true);
	});
});

describe('Symbol.toStringTag', () => {
	it('should return the correct value', () => {
		const mediaType = new MediaType('text/html');
		expect(mediaType[Symbol.toStringTag]).toEqual('MediaType');
	});
});