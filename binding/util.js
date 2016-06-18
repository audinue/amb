
function isObject (value) {
  return typeof value === 'object' && value !== null
}

function toString(value) {
  return value === undefined || value === null ? '' : value
}

function foreach (array, callback) {
  if (!array || array.length === undefined) {
    return array
  }
  for (var i = 0, length = array.length; i < length; i++) {
    if (callback(array[i], i) === false) {
      break
    }
  }
  return array
}

function keyOf (array, value) {
  var key = -1
  foreach(array, function (currentValue, currentKey) {
    if (currentValue === value) {
      key = currentKey
      return false
    }
  })
  return key
}

function copyOf (collection) {
  var array = []
  foreach(collection, function (item) {
    array.push(item)
  })
  return array
}

function map(array, callback) {
  for (var i = 0, length = array.length; i < length; i++) {
    array[i] = callback(array[i], i)
  }
  return array
}

function setText (node, value) {
  if (node.textContent !== undefined) {
    node.textContent = value
  } else {
    node.innerText = value
  }
}
