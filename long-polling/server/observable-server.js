
function observableServer () {

  var server = {}
  var observers = {}

  server.on = function (type, callback) {
    if (!observers[type]) {
      observers[type] = []
    }
    observers[type].push(callback)
    return server
  }

  server.notify = function (message) {
    if (observers[message.type]) {
      var callbacks = observers[message.type]
      var callback
      while (callback = callbacks.shift()) {
        callback(message)
      }
    }
    return server
  }

  return server
}

module.exports = observableServer
