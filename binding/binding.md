
# BindingJS

## What's done?

### Observables

#### Observable

- [x] `on (type, callback)`
- [x] `off (type, callback)`
- [x] `once (type, callback)`
- [x] `notify (message)`

#### ChangeObservable

- [x] `prop (key)`
- [x] `prop (key, value)`
- [x] `prop (values)`
- [x] `removeProp (key)`

#### ArrayObservable

- [x] `append (value)`
- [x] `prepend (value)`
- [x] `removeAt (key)`
- [x] `remove (value)`
- [x] `each (callback)`
- [x] `keyOf (value)`
- [x] `clear ()`
- [x] `reset (values)`
- [x] Notify `length` change on `append`
- [x] Notify `length` change on `prepend`
- [x] Notify `length` change on `remove`

### Scope

- [x] `object()`
- [x] `object(newObject)`
- [x] `root()`
- [x] `val(path)`
- [x] `val(path, value)`
- [x] `valFn(path)`
- [x] `observe(path, callback)`
- [x] `paths(expression)`
- [x] `observeExpr(expression, callback)`
- [x] `compile(expression)`
- [x] Enable global variables for `val`
- [x] Enable global variables for `observeExpr`

### Binding

- [x] `<element data-component="component-name">`
- [x] `<element data-is="component-name">`
- [x] `<element data-with="path">`
- [x] `<element data-template="template-name">`
- [x] `<element data-apply="template-name">`
- [x] `<element data-if="expression">`
- [x] `<element data-foreach="expression">`
- [x] `<element data-prop="property-name: expression [; ..]">`
- [x] `<element data-style="property-name: expression [; ..]">`
- [x] `<element data-class="class-name: expression [; ..]">`
- [x] `<element data-text="expression">`
- [x] `<element data-visible="expression">`
- [x] `<element data-html="expression">`
- [x] `<element data-value="path">`
- [x] `<element data-checked="path">`
- [x] `<element data-on="event-type: path [; ...]">`
- [x] `<script type="component-init"></script>`
- [x] `<script type="component-load"></script>`
- [x] `component.definition`
- [x] `component.prevContents`

## What's needs to be done?

#### Observable

- [x] `on (types, callback)` --- Use `types` instead of `type`
- [x] `off (types, callback)` --- Use `types` instead of `type`
- [x] `off ()`
- [x] `once (types, callback)`
- [ ] ~~`off (types)`~~

#### ChangeObservable

- [ ] ~~`prop (keys)`~~
- [ ] ~~`defineProp (key, callback)`~~
- [ ] ~~Use `path` instead of `key`~~

#### ArrayObservable

- [x] Notify keys change message for `prepend`
- [x] Notify keys change message for `remove`
- [x] Notify `clear` messages. (Performance optimization)
- [x] Notify `reset` messages. (Performance optimization)

#### Addition

- [x] Rename `ChangeObservable` to `ObservableObject`
- [x] Rename `ArrayObservable` to `ObservableArray`
- [ ] ~~`ObservableElement` ?~~

### Scope

- [ ] ~~`val (values)`~~
- [ ] Recognize JavaScript keywords such as `new`, `function` 
- [ ] Test for `window` in expression 
- [ ] `isPath (value)` tests whethere the value is a path or an expression
- [ ] Implement `destroy ()` clean up 
- [ ] *Cascade* templates
- [ ] *Cascade* components
- [ ] Implement `$index`
- [ ] Implement `$key`
- [ ] ~~Implement `scope.val('#id')`~~

### Binding

- [x] Accepts number in `<element data-foreach="expression">`
- [x] `<element data-with="expression">` Use expression instead of path
- [x] `<element data-on="event-type [, ...]: expression [; ...]">`
- [x] `<script type="component-style">`
- [x] `<element data-import="file">` 
- [x] Handle `clear` event
- [x] Handle `reset` event
- [x] `<element data-id="id">`
- [ ] Use proper `document` context
- [ ] `<element data-value="expression">` Use expression instead of path
- [ ] `<element data-checked="expression">` Use expression instead of path
- [ ] `<element data-selected="expression">`
- [ ] `component.definition.parent`
- [ ] `component.definition.baseURL`
- [ ] `<script type="component-style" data-src="file">`
- [ ] Organize `traverse (node, scope)`
- [ ] Use asynchronouse import instead of synchronouse one
- [ ] Handle `<script type="component-init" data-src="file">`
- [ ] Handle `<script type="component-load" data-src="file">`
- [ ] `<element data-component="component-name" data-extends="component-name">`
- [ ] Implement `<element data-block="name">`
- [ ] Implement `<element data-block="name" data-mode="replace|append|prepend">`
- [ ] Implement `<element data-decorator="decorator-name">`
- [ ] Implement `<element data-use="decorator-name [; ...]">`
- [ ] ~~`<element data-as="name">`~~
- [ ] ~~Rename `data-visible` to `data-display`~~

### Misc

- [ ] Better error handling
- [ ] Fix memory leak
- [ ] ~~`RestfulObservableObject`~~
- [ ] ~~`RestfulObservableArray`~~
- [ ] ~~`FilteredObservableArray`~~
- [ ] ~~`SharedObservableObject`~~
- [ ] ~~`SharedObservableArray`~~
- [ ] ~~`ObservableServer`~~
