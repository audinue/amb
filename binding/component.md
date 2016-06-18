
# Component

```html
<div data-component="hello-world">
  Hello world!
</div>
<div data-is="hello-world"></div>
<div data-is="hello-world"></div>
<div data-is="hello-world"></div>
```

Output:

```html
<div>Hello world!</div>
<div>Hello world!</div>
<div>Hello world!</div>
```

<div data-component="hi">
  <p>Hello <span data-text="name"></span>!</p>
  <script type="component-init">
component.prop({
  name: 'John Doe'
})
  </script>
</div>
