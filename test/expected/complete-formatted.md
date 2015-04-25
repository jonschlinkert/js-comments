### [.parser](#L29)

Set a parser that can later be used to parse any given string.

**Params**

* `name` **{String}**
* `arr` **{Object|Array}**: Object or array of replacement patterns to associate.
* `returns` **{Strings}**: to allow chaining

**Examples**

```js
strings.parser (name, replacements)
```

```js
{%= docs("example-parser.md") %}
```