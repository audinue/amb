
# Component

1. Scripts
2. `component` variable
3. `data-id` attribute

## Scripts

Component definition can contain two scripts:

1. `component-init` is executed when the component instance is initialized and
2. `component-load` is executed when the component instance is loaded

### `component-init`

`component-init` is executed when the component instance is initialized. The element is already converted to `ChangeObservable` and available through `component` variable. Often, `component-init` is used for assigning default component properties.

```html
<!-- Definition -->
<div data-component="say-hello">
  Hello <span data-text="name"></span>!
  <script type="component-init`">
    component.prop({
      name: 'no one'
    })
  </script>
</div>

<!-- Instance -->
<div data-is="say-hello"></div>

<!-- Result -->
<div>Hello no one!</div>
```

### `component-load`

`component-load` is executed when the component instance is loaded. The contents of component instance is already moved to `component.prevContents` and the contents of component definition is already copied to component instance. The component instance element is already bound to itself and available through `component` variable.

## `component` variable

`component` variable is an instance of `HTMLElement`. It represents *component instance* and only available inside `component-init` and `component-load` scripts.

`component` variable has the following additional properties:

- `definition` is referring to component definition element and
- `prevContents` is an array containing the previous contents of the component instance

### `definition`

`definition` is referring to component definition element.

`definition` property has the following additional properties:

- `parent` is the parent of the component definition and
- `baseURL` is the base URL for the definition element

