
# `data-attr` Attribute

`data-attr` attribute binds element attribute to an expression.

```html
<element data-attr="attribute-name: expression [; ...]">
```

Example:

```html
<!-- data-attr-example.html -->
<html>
  <head>
    <title>data-attr Example</title>
  </head>
  <body>
    <p data-attr="align: alignment">Hello world!</p>
    <script src="binding.js"></script>
    <script>
binding.bind({
  alignment: 'center'
})
    </script>
  </body>
</html>
```
