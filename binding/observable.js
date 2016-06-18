
function observable (object) {
  if (!isObject(object) || object.isObservable) {
    return object
  }

  var observers = {}

  object.isObservable = function () {}

  object.on = function (types, callback) {
    foreach(types.split(' '), function (type) {
      if (observers[type] === undefined) {
        observers[type] = []
      }
      observers[type].push(callback)
    })
    return object
  }

  object.off = function (types, callback) {
    if (types === undefined) {
      observers = {}
      return object
    }
    foreach(types.split(' '), function (type) {
      if (observers[type] === undefined) {
        return
      }
      var key = keyOf(observers[type], callback)
      if (key > -1) {
        observers[type].splice(key, 1)
      }
    })
    return object
  }

  object.once = function (types, callback) {
    var once = function () {
      object.off(types, callback).off(types, once)
    }
    return object.on(types, callback).on(types, once)
  }

  object.notify = function (message) {
    if (observers[message.type] === undefined) {
      return object
    }
    foreach(observers[message.type].slice(0), function (callback) {
      callback(message)
    })
    return object
  }

  object.destroy = function () {
    if (object) {
      object.notify({ type: 'destroy' })
      object.isObservable = null
      object.on           = null
      object.off          = null
      object.once         = null
      object.notify       = null
      observers = null
      object = null
    }
  }

  return object
}

function observableObject (object) {
  if (!isObject(object) || object.isObservableObject) {
    return object
  }

  observable(object)

  var props = {}

  object.isObservableObject = function () {}

  object.prop = function (key, value) {
    if (value === undefined) {
      if (typeof key === 'string') {
        return object[key]
      }
      for (var i in key) {
        object.prop(i, key[i])
      }
      return object
    }
    if (object[key] !== value) {
      object[key] = value
      props[key] = true
      object.notify({ type: 'change', key: key })
    }
    return object
  }

  object.removeProp = function (key) {
    if (key in object) {
      delete object[key]
      delete props[key]
      object.notify({ type: 'change', key: key })
    }
    return object
  }

  object.on('destroy', function () {
    if (object) {
      for (var i in props) {
        props[i] = null
      }
      object.isObservableObject = null
      object.prop               = null
      object.removeProp         = null
      object = null
    }
  })

  return object
}

function observableArray (object) {
  if (!isObject(object) || object.isObservableArray) {
    return object
  }

  observableObject(object)

  object.isObservableArray = function () {}

  object.append = function (value) {
    object.push(value)
    return object
      .notify({ type: 'append', value: value })
      .notify({ type: 'change', key: 'length' })
  }

  object.prepend = function (value) {
    object.unshift(value)
    object
      .notify({ type: 'prepend', value: value })
      .notify({ type: 'change', key: 'length' })
    for (var i = 1, length = object.length; i < length; i++) {
      object.notify({ type: 'change', key: i })
    }
    return object
  }

  object.removeAt = function (key) {
    if (key > -1 && key < object.length) {
      var value = object[key]
      object.splice(key, 1)
      object
        .notify({ type: 'remove', key: key, value: value })
        .notify({ type: 'change', key: 'length' })
      for (var i = key, length = object.length; i < length; i++) {
        object.notify({ type: 'change', key: i })
      }
    }
    return object
  }

  object.each = function (callback) {
    return each(object, callback)
  }

  object.keyOf = function (value) {
    return keyOf(object, value)
  }

  object.remove = function (value) {
    var key = object.keyOf(value)
    if (key > -1) {
      object.removeAt(key)
    }
    return object
  }

  object.clear = function () {
    object.splice(0)
    return object.notify({ type: 'clear' })
  }

  object.reset = function (values) {
    object.splice(0)
    object.concat(values)
    return object.notify({ type: 'reset' })
  }

  object.on('destroy', function () {
    if (object) {
      object.isObservableArray = null
      object.append            = null
      object.prepend           = null
      object.removeAt          = null
      object.each              = null
      object.keyOf             = null
      object.remove            = null
      object.clear             = null
      object.reset             = null
      object = null
    }
  })

  return object
}

function convert (object, deep) {
  if (!isObject(object)) {
    return object
  }

  if (object instanceof Array) {
    object = observableArray(object)
  } else {
    object = observableObject(object)
  }

  if (deep) {
    for (var i in object) {
      if (object[i] instanceof Function) {
        continue
      }
      object[i] = convert(object[i], deep)
    }
  }

  return object
}
