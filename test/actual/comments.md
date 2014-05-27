# new Strings()

> Strings constructor method

Instantiate a new instance of Strings, optionally passing a default context to use.

* `return`: {Object} Instance of a Strings object


## .propstring ( name, propstring )

Get or set a propstring.

**Example**

```js
strings.propstring('permalinks', ':destBase/:dirname/:basename/index.:ext');
```

* `name` {String}:
* `propstring` {String}:
* `return`: {Object} Instance of the current Strings object


## .pattern ( name, pattern )

Get or set regular expression or string.

**Example**

```js
strings.pattern('prop', ':([\\w]+)');
```

* `name` {String}:
* `pattern` {String}:
* `return`: {Object} Instance of the current Strings object


## .replacement ( name, replacement )

Get or set a replacement string or function.

**Example**

```js
strings.replacement('prop', function(match) {
  return match.toUpperCase();
});
```

* `name` {String}:
* `replacement` {String}:
* `return`: {Object} Instance of the current Strings object


## .parser ( name, replacement-patterns )

Define a named parser to be used against any given string.

**Example**

Pass an object:

```js
strings.parser('prop', {
  pattern: /:([\\w]+)/,
  replacement: function(match) {
    return match.toUpperCase();
  }
);
```

Or an array

```js
strings.parser('prop', [
  {
    pattern: 'a',
    replacement: 'b'
  },
  {
    pattern: 'c',
    replacement: 'd'
  }
]);
```

* `name` {String}: name of the parser.
* `pairings` {Object|Array}: array of replacement patterns to store with the given name.
* `pattern` {String|RegExp}:
* `replacement` {String|Function}:
* `return`: {Object} Instance of the current Strings object


## .extend ( parser, replacement-patterns )

Define a named extend to be used against any given string.

**Example**

```js
strings.extend('prop', {
  pattern: /:([\\w]+)/,
  replacement: function(match) {
    return match.toUpperCase();
  }
);
```

* `name` {String}: name of the parser to extend.
* `arr` {Object|Array}: array of replacement patterns to store with the given name.
* `pattern` {String|RegExp}:
* `replacement` {String|Function}:
* `return`: {Object} Instance of the current Strings object


## .parsers ( parsers )

Return a list of parsers based on the given list of named
parsers or parser objects.

**Example**

```js
// pass an array of parser names
strings.parsers(['a', 'b', 'c']);

// or a string
strings.parsers('a');
```

* `parsers` {String|Array}: named parsers or parser objects to use.
* `return`: {Array}


## .template ( name, propstring, parsers )

Store, by name, a named propstring and an array of parsers.

**Example**

```js
// strings.template(name string, array);
strings.template('prop', ['prop'], {
  foo: 'aaa',
  bar: 'bbb',
  baz: 'ccc'
});
```

* `name` {String}: The name of the template to store
* `name` {String}: Name of replacement group to use for building the final string
* `context` {Object}: Optional Object to bind to replacement function as `this`
* `return`: {String}


## .transform ( named-propstring, named-parsers, context )

Similar to `.process`, except that the first parameter is the name
of the stored `propstring` to use, rather than any given string.

**Example**

```js
strings.transform('propstring', ['parser'], {
  foo: 'aaa',
  bar: 'bbb',
  baz: 'ccc'
});
```

Or pass an object, `strings.transform({})`:

```js
strings.transform({
  propstring: 'prop',
  parsers: ['prop'],
  context: {
    foo: 'aaa',
    bar: 'bbb',
    baz: 'ccc'
  }
});
```

* `name` {String}: The name of the stored template to use
* `context` {Object}: The optional context object to bind to replacement functions as `this`
* `return`: {String}


## .use ( named-propstring, named-parsers, context )

Similar to `.process`, except that the first parameter is the name
of the stored `propstring` to use, rather than any given string.

**Example**

```js
strings.use('propstring', ['parser'], {
  foo: 'aaa',
  bar: 'bbb',
  baz: 'ccc'
});
```

Or pass an object, `strings.use({})`:

```js
strings.use({
  propstring: 'prop',
  parsers: ['prop'],
  context: {
    foo: 'aaa',
    bar: 'bbb',
    baz: 'ccc'
  }
});
```

* `name` {String}: The name of the stored template to use
* `context` {Object}: The optional context object to bind to replacement functions as `this`
* `return`: {String}


## .process ( str, parsers, context )

Directly process the given string, using a named replacement
pattern or array of named replacement patterns, with the given
context.

**Example**

```js
strings.process(':foo/:bar/:baz', ['a', 'b', 'c'], {
  foo: 'aaa',
  bar: 'bbb',
  baz: 'ccc'
});
```

* `str` {String}: the string to process
* `parsers` {String|Object|Array}: named parsers or parser objects to use when processing.
* `context` {Object}: context to use. optional if a global context is passed.
* `return`: {String}


## .group ( name, propstring, parsers )

Define a named group of propstring/parser mappings, or get a
group if only the name is passed.

**Example**

```js
strings.group('my-group-name', ':foo/:bar/:baz', ['a', 'b', 'c']);
```

To get a group:

```js
strings.group( name );
```

* `name` {String}:
* `propstring` {String}: the name of the propstring to use
* `parsers` {String|Array}: name or array of names of parsers to use
* `return`: {Object} Instance of the current Strings object


## .run ( groupname, context )

Process the specified group using the given context.

**Example**

Set: (`strings.run( string, object )`)

```js
strings.run('my-group-name', {
  foo: 'aaa',
  bar: 'bbb',
  baz: 'ccc'
});
```

* `group` {String}: The group to run.
* `context` {Object}: Optional context object, to bind to replacement function as `this`
* `return`: {String}
