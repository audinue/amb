
function on (target, type, callback) {
  if (target.attachEvent) {
    target.attachEvent('on' + type, callback)
  } else if (target.addEventListener) {
    target.addEventListener(type, callback, false)
  }
}

function off (target, type, callback) {
  if (target.detachEvent) {
    target.detachEvent('on' + type, callback)
  } else if (target.addEventListener) {
    target.removeEventListener(type, callback, false)
  }
}

function once (target, type, callback) {
  var once = function () {
    off(target, type, callback)
    off(target, type, once)
  }
  on(target, type, callback)
  on(target, type, once)
}
