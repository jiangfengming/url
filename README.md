# Url.js
Tiny cross-platform URL utility

## Why?
Another npm package https://www.npmjs.com/package/url is fine, but just too big(~47kb including dependencies). So I wrote this, the source code is about 3kb.

## Installing

```
npm install x-url --save
```

## Including
This is a UMD module, so you can include it in many ways.

Webpack:

```js
import url from 'x-url'
```

Via `<script>` tag:
```html
<script src="dist/url.js"></script>
```

## API

### url.parse(urlString)
Parses a URL string and returns a URL object. Query string is parsed into an object of key-value pairs.

If the string begins with `//`, the token after `//` and before next `/` will be interpreted as the `host`.

It's basically the same as [url.parse(urlString, true, true)]((https://nodejs.org/api/url.html#url_url_parse_urlstring_parsequerystring_slashesdenotehost)) of the built-in node.js url module.

The parse function is based on [parseUri](http://blog.stevenlevithan.com/archives/parseuri) by Steven Levithan.

```js
url.parse('https://user:pass@www.example.com:444/foo/bar.html?a=1&a=2&c#d')
/* ->
{
  "href": "https://user:pass@www.example.com:444/foo/bar.html?a=1&a=2&c#d",
  "protocol": "https:",
  "auth": "user:pass",
  "username": "user",
  "password": "pass",
  "host": "www.example.com:444",
  "hostname": "www.example.com",
  "port": "444",
  "path": "/foo/bar.html?a=1&a=2&c",
  "pathname": "/foo/bar.html",
  "search": "?a=1&a=2&c",
  "hash": "#d",
  "query": {
    "a": [
      "1",
      "2"
    ],
    "c": ""
  }
}
*/


url.parse('//www.example.com/foo/bar.html')
/* ->
{
  "href": "//www.example.com/foo/bar.html",
  "protocol": "",
  "auth": "",
  "username": "",
  "password": "",
  "host": "www.example.com",
  "hostname": "www.example.com",
  "port": "",
  "path": "/foo/bar.html",
  "pathname": "/foo/bar.html",
  "search": "",
  "hash": "",
  "query": {}
}
*/


url.parse('/foo/bar.html')
/* ->
{
  "href": "/foo/bar.html",
  "protocol": "",
  "auth": "",
  "username": "",
  "password": "",
  "host": "",
  "hostname": "",
  "port": "",
  "path": "/foo/bar.html",
  "pathname": "/foo/bar.html",
  "search": "",
  "hash": "",
  "query": {}
}
*/


url.parse('https://www.example.com')
/* ->
{
  "href": "https://www.example.com",
  "protocol": "https:",
  "auth": "",
  "username": "",
  "password": "",
  "host": "www.example.com",
  "hostname": "www.example.com",
  "port": "",
  "path": "/",
  "pathname": "/",
  "search": "",
  "hash": "",
  "query": {}
}
*/
```

### url.format(urlObject)
Takes a urlObject(as returned by `url.parse()`), returns a formatted URL string. Basically the same as [url.format(urlObject)](https://nodejs.org/api/url.html#url_url_format_urlobject) of the built-in node.js url module.

```js
url.format({
  "protocol": "https:",
  "username": "user",
  "password": "pass",
  "hostname": "www.example.com",
  "port": "444",
  "pathname": "/foo/bar.html",
  "hash": "#d",
  "query": {
    "a": [
      "1",
      "2"
    ],
    "c": ""
  }
})
// -> "https://user:pass@www.example.com:444/foo/bar.html?a=1&a=2&c#d"


url.format({
  "host": "www.example.com",
  "path": "/foo/bar.html"
})
// -> "//www.example.com/foo/bar.html"


url.format({ pathname: '/foo/bar.html' })
// -> "/foo/bar.html"


url.format({ protocol: 'https:', host: 'www.example.com' })
// -> "https://www.example.com/"
```

### url.resolve(from, to)
Resolves a target URL relative to a base URL in a manner similar to that of a Web browser resolving an anchor tag HREF. Basically the same as [](https://nodejs.org/api/url.html#url_url_resolve_from_to) of the built-in node.js url module.

```js
url.resolve('/one/two/three', 'four')
// -> "/one/two/four"

url.resolve('http://example.com/one', '/two')
// -> "http://example.com/two"

url.resolve('https://www.example.com/foo', '//www.google.com/bar')
// -> "https://www.google.com/bar"
```

### url.parseQuery(queryString)
Parses a URL query string into a collection of key and value pairs. Basically the same as [querystring.parse(str)](https://nodejs.org/api/querystring.html#querystring_querystring_parse_str_sep_eq_options) of the built-in node.js querystring module.

```js
url.parseQuery('foo=bar&abc=xyz&abc=123')
/* ->
{
  "foo": "bar",
  "abc": [
    "xyz",
    "123"
  ]
}
*/
```


### url.formatQuery(queryObject)
Takes a queryObject(as returned by url.parseQuery(queryString)), returns a query string. Basically the same as [querystring.stringify(obj)](https://nodejs.org/dist/latest-v7.x/docs/api/querystring.html#querystring_querystring_stringify_obj_sep_eq_options) of the built-in node.js querystring module.

```js
url.formatQuery({ foo: 'bar', baz: ['qux', 'quux'], corge: '' })
// -> "foo=bar&baz=qux&baz=quux&corge"

url.formatQuery({ w: '中文', foo: 'bar' })
// -> "w=%E4%B8%AD%E6%96%87&foo=bar"
```

## License
[MIT](LICENSE)
