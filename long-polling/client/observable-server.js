
function observableServer (options) {

  var server = {}
  var observers = {}

  var poll = function () {
    request.get(options.url, function (message) {
      if (observers[message.type]) {
        var callbacks = observers[message.type].slice(0)
        for(var i in callbacks) {
          callbacks[i](message)
        }
      }
      poll()
    })
  }

  poll()

  server.on = function (type, callback) {
    if (!observers[type]) {
      observers[type] = []
    }
    observers[type].push(callback)
    return server
  }

  server.notify = function (message) {
    request.post(options.url, message)
    return server
  }

  return server
}
