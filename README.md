# Parse, serialize, and manipulate media types

This package will parse [MIME types](https://mimesniff.spec.whatwg.org/#understanding-mime-types) into a structured format, which can then be manipulated and serialized:

This version is using ES Modules instead of commonJS.

```js
import { MediaType } from '@d1g1tal/mime-type';

const mediaType = new MediaType(`Text/HTML;Charset="utf-8"`);

console.assert(mediaType.toString() === "text/html;charset=utf-8");

console.assert(mediaType.type === "text");
console.assert(mediaType.subtype === "html");
console.assert(mediaType.essence === "text/html");
console.assert(mediaType.parameters.get("charset") === "utf-8");

mediaType.parameters.set("charset", "windows-1252");
console.assert(mediaType.parameters.get("charset") === "windows-1252");
console.assert(mediaType.toString() === "text/html;charset=windows-1252");

console.assert(mediaType.isHTML() === true);
console.assert(mediaType.isXML() === false);
```

Parsing is a fairly complex process; see [the specification](https://mimesniff.spec.whatwg.org/#parsing-a-mime-type) for details (and similarly [for serialization](https://mimesniff.spec.whatwg.org/#serializing-a-mime-type)).

This package's algorithms conform to those of the WHATWG [MIME Sniffing Standard](https://mimesniff.spec.whatwg.org/), and is aligned up to commit [8e9a7dd](https://github.com/whatwg/mimesniff/commit/8e9a7dd90717c595a4e4d982cd216e4411d33736).

## `MediaType` API

This package's main module's export is a class, `MediaType`. Its constructor takes a string which it will attempt to parse into a media type; if parsing fails, an `Error` will be thrown.

### The `parse()` static factory method

As an alternative to the constructor, you can use `MediaType.parse(string)`. The only difference is that `parse()` will return `null` on failed parsing, whereas the constructor will throw. It thus makes the most sense to use the constructor in cases where unparsable MIME types would be exceptional, and use `parse()` when dealing with input from some unconstrained source.

### Properties

- `type`: the media type's [type](https://mimesniff.spec.whatwg.org/#mime-type-type), e.g. `"text"`
- `subtype`: the media type's [subtype](https://mimesniff.spec.whatwg.org/#mime-type-subtype), e.g. `"html"`
- `essence`: the media type's [essence](https://mimesniff.spec.whatwg.org/#mime-type-essence), e.g. `"text/html"`
- `parameters`: an instance of `MediaTypeParameters`, containing this media type's [parameters](https://mimesniff.spec.whatwg.org/#mime-type-parameters)

`type` and `subtype` can be changed. They will be validated to be non-empty and only contain [HTTP token code points](https://mimesniff.spec.whatwg.org/#http-token-code-point).

`essence` is only a getter, and cannot be changed.

`parameters` is also a getter, but the contents of the `MediaTypeParameters` object are mutable, as described below.

### Methods

- `toString()` serializes the media type to a string
- `isHTML()`: returns true if this instance represents [a HTML media type](https://mimesniff.spec.whatwg.org/#html-mime-type)
- `isXML()`: returns true if this instance represents [an XML media type](https://mimesniff.spec.whatwg.org/#xml-mime-type)
- `isJavaScript({ prohibitParameters })`: returns true if this instance represents [a JavaScript media type](https://html.spec.whatwg.org/multipage/scripting.html#javascript-mime-type). `prohibitParameters` can be set to true to disallow any parameters, i.e. to test if the media type's serialization is a [JavaScript media type essence match](https://mimesniff.spec.whatwg.org/#javascript-mime-type-essence-match).

_Note: the `isHTML()`, `isXML()`, and `isJavaScript()` methods are speculative, and may be removed or changed in future major versions. See [whatwg/mimesniff#48](https://github.com/whatwg/mimesniff/issues/48) for brainstorming in this area. Currently we implement these mainly because they are useful in jsdom._

## `MediaTypeParameters` API

The `MediaTypeParameters` class, instances of which are returned by `MediaType.parameters`, has equivalent surface API to a [JavaScript `Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

However, `MediaTypeParameters` methods will always interpret their arguments as appropriate for media types, so e.g. parameter names will be lowercased, and attempting to set invalid characters will throw.

Some examples:

```js
const mediaType = new MediaType(`x/x;a=b;c=D;E="F"`);

// Logs:
// a b
// c D
// e F
for (const [name, value] of mediaType.parameters) {
  console.log(name, value);
}

console.assert(mediaType.parameters.has("a"));
console.assert(mediaType.parameters.has("A"));
console.assert(mediaType.parameters.get("A") === "b");

mediaType.parameters.set("Q", "X");
console.assert(mediaType.parameters.get("q") === "X");
console.assert(mediaType.toString() === "x/x;a=b;c=d;e=F;q=X");

// Throws:
mediaType.parameters.set("@", "x");
```

## Raw parsing/serialization APIs

If you want primitives on which to build your own API, you can get direct access to the parsing and serialization algorithms as follows:

```js
import { parse } from '@d1g1tal/media-type';
import { serialize } from '@d1g1tal/media-type';
```

`parse(string)` returns an object containing the `type` and `subtype` strings, plus `parameters`, which is a `Map`. This is roughly our equivalent of the spec's [MIME type record](https://mimesniff.spec.whatwg.org/#mime-type). If parsing fails, it instead returns `null`.

`serialize(record)` operates on the such an object, giving back a string according to the serialization algorithm.