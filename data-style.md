
# `data-style` Attribute

`data-style` attribute binds element's style property to an expression.

```html
<element data-style="property-name: expression [; ...]">
```

Example:

```html
<!-- data-style-example.html -->
<html>
  <head>
    <title>data-style Example</title>
  </head>
  <body>
    <div data-style="fontSize: size + 'pt'">Hello world!</div>
    <script src="binding.js"></script>
    <script>
binding.bind({
  size: 16
})
    </script>
  </body>
</html>
```
