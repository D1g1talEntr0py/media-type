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
	it('accepts an object', () => {
		const mediaType = new MediaType({type: 'text', subtype: 'html'});
		expect(mediaType.toString()).toEqual('text/html');
	});

	it('throws on unparsable media types', () => {
		expect(() => new MediaType('asdf')).toThrow();
		expect(() => new MediaType('text/html™')).toThrow();
	});
});

describe('static parse() behavior', () => {
	it('parses media types', () => {
		const mediaType = MediaType.parse('Text/HTML;Charset="utf-8"');
		expect(mediaType.toString()).toEqual('text/html;charset=utf-8');
	});

	it('throws error on unparsable media types', () => {
		expect(() => MediaType.parse('asdf')).toThrow(Error);
		expect(() => MediaType.parse('text/html™')).toThrow(Error);
	});
});

describe('type manipulation', () => {
	let mediaType;
	beforeEach(() => {
		mediaType = new MediaType('application/xml;foo=bar');
	});

	it('responds to type being set', () => {
		mediaType.type = 'text';
		expect(mediaType.type).toEqual('text');
		expect(mediaType.essence).toEqual('text/xml');
		expect(mediaType.toString()).toEqual('text/xml;foo=bar');
	});

	it('ASCII-lowercases incoming type strings', () => {
		mediaType.type = 'TeXT';
		expect(mediaType.type).toEqual('text');
		expect(mediaType.essence).toEqual('text/xml');
		expect(mediaType.toString()).toEqual('text/xml;foo=bar');
	});

	it('converts the value set to a string', () => {
		mediaType.type = {
			toString() {
				return 'TeXT';
			}
		};
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

	it('responds to type being set', () => {
		mediaType.subtype = 'pdf';
		expect(mediaType.subtype).toEqual('pdf');
		expect(mediaType.essence).toEqual('application/pdf');
		expect(mediaType.toString()).toEqual('application/pdf;foo=bar');
	});

	it('ASCII-lowercases incoming type strings', () => {
		mediaType.subtype = 'PdF';
		expect(mediaType.subtype).toEqual('pdf');
		expect(mediaType.essence).toEqual('application/pdf');
		expect(mediaType.toString()).toEqual('application/pdf;foo=bar');
	});

	it('converts the value set to a string', () => {
		mediaType.subtype = {
			toString() {
				return 'PdF';
			}
		};
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

describe('Group-testing functions', () => {
	test('isHTML', () => {
		expect((new MediaType('text/html')).isHTML()).toBe(true);
		expect((new MediaType('text/html;charset=utf-8')).isHTML()).toBe(true);
		expect((new MediaType('text/html;charset=utf-8;foo=bar')).isHTML()).toBe(true);

		expect((new MediaType('text/xhtml')).isHTML()).toBe(false);
		expect((new MediaType('application/html')).isHTML()).toBe(false);
		expect((new MediaType('application/xhtml+xml')).isHTML()).toBe(false);
	});

	test('isXML', () => {
		expect((new MediaType('application/xml')).isXML()).toBe(true);
		expect((new MediaType('application/xml;charset=utf-8')).isXML()).toBe(true);
		expect((new MediaType('application/xml;charset=utf-8;foo=bar')).isXML()).toBe(true);

		expect((new MediaType('text/xml')).isXML()).toBe(true);
		expect((new MediaType('text/xml;charset=utf-8')).isXML()).toBe(true);
		expect((new MediaType('text/xml;charset=utf-8;foo=bar')).isXML()).toBe(true);

		expect((new MediaType('text/svg+xml')).isXML()).toBe(true);
		expect((new MediaType('text/svg+xml;charset=utf-8')).isXML()).toBe(true);
		expect((new MediaType('text/svg+xml;charset=utf-8;foo=bar')).isXML()).toBe(true);

		expect((new MediaType('application/xhtml+xml')).isXML()).toBe(true);
		expect((new MediaType('application/xhtml+xml;charset=utf-8')).isXML()).toBe(true);
		expect((new MediaType('application/xhtml+xml;charset=utf-8;foo=bar')).isXML()).toBe(true);

		expect((new MediaType('text/xhtml')).isXML()).toBe(false);
		expect((new MediaType('text/svg')).isXML()).toBe(false);
		expect((new MediaType('application/html')).isXML()).toBe(false);
		expect((new MediaType('application/xml+xhtml')).isXML()).toBe(false);
	});

	test('isJavaScript', () => {
		expect((new MediaType('application/ecmascript')).isJavaScript()).toBe(true);
		expect((new MediaType('application/javascript')).isJavaScript()).toBe(true);
		expect((new MediaType('application/x-ecmascript')).isJavaScript()).toBe(true);
		expect((new MediaType('application/x-javascript')).isJavaScript()).toBe(true);
		expect((new MediaType('text/ecmascript')).isJavaScript()).toBe(true);
		expect((new MediaType('text/javascript1.0')).isJavaScript()).toBe(true);
		expect((new MediaType('text/javascript1.1')).isJavaScript()).toBe(true);
		expect((new MediaType('text/javascript1.2')).isJavaScript()).toBe(true);
		expect((new MediaType('text/javascript1.3')).isJavaScript()).toBe(true);
		expect((new MediaType('text/javascript1.4')).isJavaScript()).toBe(true);
		expect((new MediaType('text/javascript1.5')).isJavaScript()).toBe(true);
		expect((new MediaType('text/jscript')).isJavaScript()).toBe(true);
		expect((new MediaType('text/livescript')).isJavaScript()).toBe(true);
		expect((new MediaType('text/x-ecmascript')).isJavaScript()).toBe(true);
		expect((new MediaType('text/x-javascript')).isJavaScript()).toBe(true);

		expect((new MediaType('text/javascript')).isJavaScript()).toBe(true);

		expect((new MediaType('text/javascript;charset=utf-8')).isJavaScript()).toBe(true);
		expect((new MediaType('text/javascript;charset=utf-8')).isJavaScript({ prohibitParameters: true })).toBe(false);
		expect((new MediaType('text/javascript;charset=utf-8')).isJavaScript({})).toBe(true);
		expect((new MediaType('text/javascript;charset=utf-8')).isJavaScript({ prohibitParameters: true })).toBe(false);

		expect((new MediaType('text/javascript;charset=utf-8;goal=script')).isJavaScript()).toBe(true);
		expect((new MediaType('text/javascript;charset=utf-8;goal=script')).isJavaScript({ prohibitParameters: true }))
			.toBe(false);

		expect((new MediaType('text/javascript;goal=module')).isJavaScript()).toBe(true);
		expect((new MediaType('text/javascript;goal=module')).isJavaScript({ prohibitParameters: true })).toBe(false);
	});
});
