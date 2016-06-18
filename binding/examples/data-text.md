
# Data-Text Attribute

```html
<element bind-text="expression">
```

Binds `expression` to element `textContent` or `innerText`.

Example:

```html
<p>Hello <span bind-text="name + ' Doe'"></span>!</p>
<script src="binding.js"></script>
<script>
var object = binding.convert({
  name: 'John'
})
binding.bind(object)
</script>
```

Output:

```html
<p>Hello <span>John Doe</span>!</p>
```
