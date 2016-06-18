
function split (path) {
  var parts = []
  foreach(path.split(/[\.\[\]]/), function (part) {
    if (part !== '') {
      parts.push(part)
    }
  })
  return parts
}

function Scope (object, parent, isComponent) {
  var scope = observable(this)

  scope.parent = parent
  scope.children = []
  
  if (parent) {
    parent.children.push(scope)
  } else {
    scope.templates = {}
    scope.components = {}
  }
  
  scope.componentScope = function () {
    if (isComponent) {
      return scope
    }
    var component = scope
    while (true) {
      if (!component.parent) {
        return
      }
      component = component.parent
    }
    return component
  }

  scope.object = function (newObject) {
    if (!arguments.length) {
      return object
    }
    object = newObject
    foreach(pathObservers, function (pathObserver) {
      pathObserver.observe(object)
    })
  }

  scope.root = function () {
    if (!parent) {
      return scope
    }
    var root = scope
    while (true) {
      if (!root.parent) {
        break
      }
      root = root.parent
    }
    return root
  }

  function get (path) {
    var current = scope
    var object = scope.object()
    var parts = split(path)
    var part
    while ((part = parts.shift())) {
      if (part === '$object') {
        object = current.object()
        continue
      }
      if (part === '$root') {
        current = current.root()
        object = current.object()
        continue
      }
      if (part === '$parent') {
        if (!current.parent) {
          return
        }
        current = current.parent
        object = current.object()
        continue
      }
      if (!isObject(object)) {
        if (this[part] !== undefined) {
          object = this
        } else {
          return
        }
      }
      if (object[part] === undefined) {
        if (this[part] !== undefined) {
          object = this
        } else {
          return
        }
      }
      // if (!isObject(object)) {
        // return
      // }
      // if (object[part] === undefined) {
        // return
      // }
      object = object[part]
    }
    return object
  }

  function set (path, value) {
    var parts = split(path)
    var key = parts.pop()
    var object = get(parts.join('.'))
    if (!isObject(object)) {
      return
    }
    if (object.isObservableObject) {
      object.prop(key, value)
    } else {
      object[key] = value
    }
  }

  scope.val = function (path, value) {
    if (value === undefined) {
      return get(path)
    }
    set(path, value)
    return scope
  }

  scope.valFn = function (path) {
    var parts = split(path)
    var key = parts.pop()
    var object = get(parts.join('.'))
    if (!isObject(object) && typeof object !== 'function') {
      return function () {}
    }
    return function () {
      if (!(object[key] instanceof Function)) {
        return
      }
      return object[key].apply(object, arguments)
    }
  }

  var pathObservers = []

  scope.observe = function (path, callback) {
    pathObservers.push(new PathObserver(path, callback).observe(object))
  }

  scope.paths = function (expression) {
    var paths = []
    expression.replace(/(?:\)\.)?[a-z_$#][a-z_$0-9]*(?:(?:\.[a-z_$][a-z_$0-9]*)|(?:\[\d+\]))*|['"](?:\\['"]|[^'"])*['"]/ig, function (path) {
      if (/^['"]|\)\./.test(path)) {
        return
      }
      paths.push(path)
    })
    return paths
  }

  scope.observeExpr = function (expression, callback) {
    var paths = scope.paths(expression)
    foreach(paths, function (path) {
      scope.observe(path, callback)
    })
    return scope
  }

  function replace (expression) {
    var replaced = 'return(' + expression.replace(/(?:\)\.)?[a-z_$#][a-z_$0-9]*(?:(?:\.[a-z_$][a-z_$0-9]*)|(?:\[\d+\]))*(\()?|['"](?:\\['"]|[^'"])*['"]/ig, function (path, fn) {
      if (/^['"]|\)\./.test(path)) {
        return path
      }
      if (fn) {
        return 's.valFn("' + path.substr(0, path.length - 1) + '")('
      }
      return 's.val("' + path + '")'
    }) + ')'
    return replaced
  }

  scope.compile = function (expression) {
    var fn = new Function('s', replace(expression))
    return function () {
      return fn(scope)
    }
  }
  
  scope.on('destroy', function () {
    foreach(pathObservers, function (pathObserver) {
      pathObserver.destroy()
    })
    foreach(scope.children, function (child) {
      child.destroy()
    })
    scope.children = null
    scope.templates = null
    scope.components = null
    scope.parent = null
    parent = null
    object = null
    scope = null
  })
}

function KeyObserver (key, next) {
  var keyObserver = this
  var object

  var change = function (message) {
    if (message.key === key) {
      next.observe(object[key])
    }
  }

  keyObserver.observe = function (newObject) {
    if (object && object.isObservableObject) {
      object.off('change', change)
    }
    object = newObject
    if (object && object.isObservableObject) {
      object.on('change', change)
    }
    next.observe(object ? object[key] : undefined)
  }
  
  keyObserver.destroy = function () {
    next.destroy()
    if (object && object.isObservableObject) {
      object.off('change', change)
    }
    object = null
  }
}

var global = this

function PathObserver (path, callback) {
  var pathObserver = this
  var parts = split(path)
  var initialized
  var key = parts[0]

  var keyObserver = new KeyObserver(parts.pop(), {
    observe: function (object) {
      if (initialized) {
        callback(object)
      } else {
        initialized = true
      }
    },
    destroy: function () {}
  })

  while (parts.length) {
    keyObserver = new KeyObserver(parts.pop(), keyObserver)
  }

  pathObserver.observe = function (object) {
    if (global[key] !== undefined) {
      if (object === undefined || (isObject(object) && object[key] === undefined)) {
        keyObserver.observe(global)
        return pathObserver
      }
    }
    keyObserver.observe(object)
    return pathObserver
  }
  
  pathObserver.destroy = function () {
    keyObserver.destroy()
    keyObserver = null
  }
}
