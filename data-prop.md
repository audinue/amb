
# `data-prop` Attribute

`data-prop` attribute binds element property to an expression.

```html
<element data-prop="property-name: expression [; ...]">
```

Example:

```html
<!-- data-prop-example.html -->
<html>
  <head>
    <title>data-prop Example</title>
  </head>
  <body>
    <div data-prop="innerHTML: message"></div>
    <script src="binding.js"></script>
    <script>
binding.bind({
  message: 'Hello <b>world</b>!'
})
    </script>
  </body>
</html>
```
