
function currentStyleOf (element, name) {
  if (element.currentStyle) {
    return element.currentStyle[name]
  } else if (window.getComputedStyle) {
    return window.getComputedStyle(element, null).getPropertyValue(name)
  }
}

function getAttr (node, name) {
  if (node.getAttribute) {
    return node.getAttribute('data-' + name)
  }
  return null
}

function removeAttr (node, name) {
  if (node.removeAttribute) {
    node.removeAttribute('data-' + name)
  }
}

function getCSS(style) {
  if (style.styleSheet) {
    return style.styleSheet.cssText
  }
  return style.innerHTML
}

function compileScoped(css) {
  css = css
    .replace(/[\r\n]/g, '\\n')
    .replace(/"/g, '\\"')
    .replace(/[^\{\}]+\{/g, function (all) {
      return map(all.split(/,/), function (value) {
        if (/\:scope/.test(value)) {
          return value.replace(/\:scope/g, function () {
            return '#"+i+"'
          })
        }
        return '#"+i+" ' + value
      }).join(',')
    })
  return new Function('i', 'return"' + css + '"')
}

function createStyle (css) {
  var style = document.createElement('style')
  if (style.styleSheet !== undefined) {
    style.type = 'text/css'
    style.styleSheet.cssText = css
  } else {
    style.appendChild(document.createTextNode(css))
  }
  return style
}

function parseDefinition (definition, name, scope) {
  var template = document.createDocumentFragment()
  var inits = []
  var loads = []
  var styles = []
  foreach (definition.childNodes, function (node) {
    if (node.nodeName === 'SCRIPT') {
      var type = node.getAttribute('type')
      var text = node.text || node.textContent
      if (type === 'component-init') {
        inits.push(new Function('component', text))
      } else if (type === 'component-load') {
        loads.push(new Function('component', text))
      } else if (type === 'component-style') {
        styles.push(compileScoped(text))
      }
      return
    }
    template.appendChild(node.cloneNode(true))
  })
  definition.template = template
  definition.inits = inits
  definition.loads = loads
  definition.styles = styles
}

function getHead() {
  var head = document.getElementsByTagName('head')
  if (!head.length) {
    head = document.createElement('head')
    if (document.documentElement.firstChild) {
      document.documentElement.insertBefore(head, document.documentElement.firstChild)
    } else {
      document.documentElement.appendChild(head)
    }
  } else {
    head = head[0]
  }
  return head
}

var generatedId = 1

function parseInstance (instance, name, scope) {
  var definition = scope.root().components[name]
  instance.definition = definition
  var prevContents = document.createDocumentFragment()
  while (instance.firstChild) {
    prevContents.appendChild(instance.firstChild)
  }
  instance.prevContents = prevContents
  instance.appendChild(definition.template.cloneNode(true))
  if (!instance.id) {
    instance.id = 'component-' + generatedId++
  }
  var head = getHead()
  foreach(definition.styles, function (style) {
    head.appendChild(createStyle(style(instance.id)))
  })
  var componentScope = new Scope(instance, scope, true)
  traverse(instance, componentScope)
  instance.getElement = function (id) {
    return instance['#' + id]
  }
  foreach(definition.loads, function (load) {
    load(instance)
  })
}

var global2 = this

function read (file) {
  var xhr = new (global2.ActiveXObject || global2.XMLHttpRequest)('Microsoft.XMLHTTP')
  xhr.open('GET', file, false)
  xhr.send('')
  return xhr.responseText
}

function traverse (node, scope) {
  var document = node.ownerDocument
  var halt = false
  var update
  var fn
  var definition
  // import
  var _import = getAttr(node, 'import')
  if (_import !== null) {
    removeAttr(node, 'import')
    var div = document.createElement('div')
    div.innerHTML = 'x<div>' + read(_import) + '</div>'
    div = div.lastChild
    var scripts = []
    var fragment = document.createDocumentFragment()
    foreach(copyOf(div.childNodes), function (node) {
      if (node.nodeName === 'LINK'
          || node.nodeName === 'STYLE'
          || node.nodeName === 'SCRIPT'
          || (node.getAttribute && node.getAttribute('data-component') !== null)
          || (node.getAttribute && node.getAttribute('data-import') !== null)) {
        if (node.nodeName === 'SCRIPT'
            && node.getAttribute('type') !== 'component-init'
            && node.getAttribute('type') !== 'component-load') {
          scripts.push(node)
        }
        fragment.appendChild(node)
      }
    })
    traverse(fragment, scope)
    foreach(copyOf(scripts), function (script) {
      var src = script.getAttribute('src')
      var type = script.getAttribute('type')
      if (type !== null && type !== '') {
        if (type !== 'text/javascript'
          && type !== 'text/javascript'
          && type !== 'application/javascript') {
          return
        }
      }
      var head = getHead()
      var copy = document.createElement('script')
      if (src !== null && src !== '') {
        copy.text = copy.textContent = read(src)
      } else {
        copy.text = script.text
        copy.textContent = script.textContent
      }
      head.appendChild(copy)
      script.parentNode.removeChild(script)
    })
    node.parentNode.replaceChild(fragment, node)
    fragment = null
    div = null
    node = null
    document = null
    return
  }
  // component
  var component = getAttr(node, 'component')
  if (component !== null) {
    removeAttr(node, 'component')
    node.parentNode.removeChild(node)
    parseDefinition(node, component, scope)
    scope.root().components[component] = node
    return
  }
  // is
  var is = getAttr(node, 'is')
  if (is !== null) {
    removeAttr(node, 'is')
    convert(node)
    definition = scope.root().components[is]
    foreach(definition.inits, function (init) {
      init(node)
    })
    halt = true
  }
  // with
  var _with = getAttr(node, 'with')
  if (_with !== null) {
    removeAttr(node, 'with')
    var fn2 = scope.compile(_with)
    var sub = new Scope(null, scope)
    update = function () {
      sub.object(fn2())
    }
    scope.observeExpr(_with, update)
    traverse(node, sub)
    update()
    return
  }
  // template
  var template = getAttr(node, 'template')
  if (template !== null) {
    removeAttr(node, 'template')
    node.parentNode.removeChild(node)
    scope.root().templates[template] = node
    return
  }
  // apply
  var apply = getAttr(node, 'apply')
  if (apply !== null) {
    removeAttr(node, 'apply')
    template = scope.root().templates[apply].cloneNode(true)
    traverse(template, scope)
    node.parentNode.replaceChild(template, node)
    return
  }
  // id
  var id = getAttr(node, 'id')
  if (id !== null) {
    removeAttr(node, 'id')
    scope.componentScope().object()['#' + id] = node
  }
  // if
  var _if = getAttr(node, 'if')
  if (_if !== null) {
    removeAttr(node, 'if')
    fn = scope.compile(_if)
    var parent = node.parentNode
    var comment = node.ownerDocument.createElement('div')
    var value = true
    update = function () {
      var current = !!fn()
      if (value !== current) {
        value = current
        if (value) {
          parent.replaceChild(node, comment)
        } else {
          parent.replaceChild(comment, node)
        }
      }
    }
    scope.observe(_if, update)
    update()
  }
  // foreach
  var _foreach = getAttr(node, 'foreach')
  if (_foreach !== null) {
    removeAttr(node, 'foreach')
    fn = scope.compile(_foreach)
    template = document.createDocumentFragment()
    var scopes = []
    while (node.firstChild) {
      template.appendChild(node.firstChild)
    }
    var add = function (value) {
      var instance = template.cloneNode(true)
      var subScope = new Scope(value, scope)
      scopes.push(subScope)
      traverse(instance, subScope)
      node.appendChild(instance)
    }
    var append = function (message) {
      add(message.value)
    }
    var prepend = function (message) {
      var instance = template.cloneNode(true)
      var subScope = new Scope(message.value, scope)
      scopes.unshift(subScope)
      traverse(instance, subScope)
      if (node.firstChild) {
        node.insertBefore(instance, node.firstChild)
      } else {
        node.appendChild(instance)
      }
    }
    var remove = function (message) {
      var length = template.childNodes.length
      var min = message.key * length
      var max = min + length
      for (var i = min; i < max; i++) {
        node.removeChild(node.childNodes[min])
      }
      scopes[message.key].destroy()
      scopes.splice(message.key, 1)
    }
    var clear = function () {
      foreach(scopes, function (scope) {
        scope.destroy()
      })
      scopes = []
      node.innerHTML = ''
    }
    var reset = function () {
      clear()
      foreach(current, add)
    }
    var current
    update = function () {
      var value = fn()
      if (current && current.isObservableArray) {
        current
          .off('append', append)
          .off('prepend', prepend)
          .off('remove', remove)
          .off('clear', clear)
          .off('reset', reset)
      }
      current = value
      if (current && current.isObservableArray) {
        current
          .on('append', append)
          .on('prepend', prepend)
          .on('remove', remove)
          .on('clear', clear)
          .on('reset', reset)
      }
      if (current instanceof Array) {
        foreach(value, add)
      } else if (typeof current === 'number') {
        for (var i = 0; i < current; i++) {
          add(i)
        }
      }
    }
    scope.observeExpr(_foreach, update)
    update()
    scope.on('destroy', function () {
      if (current && current.isObservableArray) {
        current
          .off('append', append)
          .off('prepend', prepend)
          .off('remove', remove)
          .off('clear', clear)
          .off('reset', reset)
      }
      foreach(scopes, function (scope) {
        scope.destroy()
      })
      add = null
      append = null
      prepend = null
      remove = null
      clear = null
      reset = null
      current = null
      template = null
    })
    halt = true
  }
  // prop
  var prop = getAttr(node, 'prop')
  if (prop !== null) {
    removeAttr(node, 'prop')
    prop.replace(/\s*([^:]+)\s*:\s*([^;]+)\s*;?/g, function (all, key, expression) {
      var fn = scope.compile(expression)
      var update = function () {
        // IE6 throws error when invalid property value is assigned
        try {
          if (node.isObservableObject) {
            node.prop(key, fn())
          } else {
            node[key] = fn()
          }
        } catch (e) {
        }
      }
      scope.observeExpr(expression, update)
      update()
    })
  }
  // style
  var style = getAttr(node, 'style')
  if (style !== null) {
    removeAttr(node, 'style')
    style.replace(/\s*([^:]+)\s*:\s*([^;]+)\s*;?/g, function (all, key, expression) {
      var fn = scope.compile(expression)
      var s = node.style
      var update = function () {
        // IE6 throws error when invalid property value is assigned
        try {
          s[key] = fn()
        } catch (e) {
        }
      }
      scope.observeExpr(expression, update)
      update()
    })
  }
  // attr
  var attr = getAttr(node, 'attr')
  if (attr !== null) {
    removeAttr(node, 'attr')
    attr.replace(/\s*([^:]+)\s*:\s*([^;]+)\s*;?/g, function (all, key, expression) {
      var fn = scope.compile(expression)
      var update = function () {
        node.setAttribute(key, toString(fn()))
      }
      scope.observeExpr(expression, update)
      update()
      scope.on('destroy', function () {
        update = null
        fn = null
      })
    })
  }
  // class
  var _class = getAttr(node, 'class')
  if (_class !== null) {
    removeAttr(node, 'class')
    _class.replace(/\s*([^:]+)\s*:\s*([^;]+)\s*;?/g, function (all, key, expression) {
      var fn = scope.compile(expression)
      var update = function () {
        if (fn()) {
          addClass(node, key)
        } else {
          removeClass(node, key)
        }
      }
      scope.observeExpr(expression, update)
      update()
    })
  }
  // visible
  var visible = getAttr(node, 'visible')
  if (visible !== null) {
    removeAttr(node, 'visible')
    fn = scope.compile(visible)
    var display = currentStyleOf(node, 'display')
    update = function () {
      if (fn()) {
        node.style.display = display
      } else {
        node.style.display = 'none'
      }
    }
    scope.observeExpr(visible, update)
    update()
  }
  // text
  var text = getAttr(node, 'text')
  if (text !== null) {
    removeAttr(node, 'text')
    fn = scope.compile(text)
    update = function () {
      setText(node, toString(fn()))
    }
    scope.observeExpr(text, update)
    update()
    halt = true
  }
  // html
  var html = getAttr(node, 'html')
  if (html !== null) {
    removeAttr(node, 'html')
    fn = scope.compile(html)
    update = function () {
      node.innerHTML = toString(fn())
    }
    scope.observeExpr(html, update)
    update()
    halt = true
  }
  // value
  var _value = getAttr(node, 'value')
  if (_value !== null) {
    removeAttr(node, 'value')
    update = function () {
      if (node.value !== scope.val(_value)) {
        node.value = toString(scope.val(_value))
      }
    }
    scope.observe(_value, update)
    update()
    var change = function () {
      scope.val(_value, node.value)
    }
    on(node, 'change', change)
    on(node, 'keyup', change)
    scope.on('destroy', function () {
      off(node, 'click', change)
      off(node, 'change', change)
    })
    if (node.nodeName === 'TEXTAREA') {
      halt = true
    }
  }
  // checked
  var _checked = getAttr(node, 'checked')
  if (_checked !== null) {
    removeAttr(node, 'checked')
    var nodeValue2
    update = function () {
      if (node.checked !== nodeValue2) {
        nodeValue2 = node.checked = scope.val(_checked)
      }
    }
    scope.observe(_checked, update)
    update()
    change = function () {
      scope.val(_checked, nodeValue2 = node.checked)
    }
    on(node, 'click', change)
    on(node, 'change', change)
    scope.on('destroy', function () {
      off(node, 'click', change)
      off(node, 'change', change)
    })
  }
  // on
  var _on = getAttr(node, 'on')
  if (_on !== null) {
    _on.replace(/\s*([^:]+)\s*:\s*([^;]+)\s*;?/g, function (all, keys, path) {
      foreach(keys.split(' '), function (key) {
        var handler = function (e) {
          return scope.valFn(path)(e || window.event, scope.object())
        }
        on(node, key, handler)
        scope.on('destroy', function () {
          off(node, key, handler)
        })
      })
    })
  }
  if (is !== null) {
    parseInstance(node, is, scope)
  }
  scope.on('destroy', function () {
    fn = null
    update = null
    node = null
    document = null
  })
  if (halt) {
    return
  }
  foreach(copyOf(node.childNodes), function (childNode) {
    traverse(childNode, scope)
  })
}

convert(document)

document.getElement = function (id) {
  return document['#' + id]
}

var scope = new Scope(document, null, true)

once(window, 'load', function () {
  traverse(document, scope)
})

once(window, 'unload', function () {
  scope.destroy()
  scope = null
  document.destroy() 
  this.b = null
  this.binding = null
})
