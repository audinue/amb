
var http = require('http')

function route (rules, options) {
  var defaults = {
    host: '0.0.0.0',
    port: 80
  }
  for (var key in (options || {})) {
    defaults[key] = options[key]
  }
  var map = {
    GET: [],
    POST: []
  }
  for (var pattern in rules) {
    var match = pattern.match(/^(GET|POST)\s+(.+)$/)
    map[match[1]].push({
      pattern: new RegExp('^' + match[2] + '$'),
      callback: rules[pattern]
    })
  }
  http.createServer(function (request, response) {
    try {
      var rules = map[request.method]
      for (var i = 0, length = rules.length; i < length; i++) {
        var rule = rules[i]
        var match = rule.pattern.exec(request.url)
        if (match) {
          rule.callback(request, response, match)
          return
        }
      }
      route.notFound(request, response)
    } catch (error) {
      route.error(request, response, error)
    }
  }).listen(defaults.port, defaults.host)
}

route.notFound = function (request, response) {
  response.writeHead(404, {'Content-Type': 'text/html'})
  response.end('Not found.')
}

route.error = function (request, response, error) {
  response.writeHead(500, {'Content-Type': 'text/html'})
  response.end('Error: ' + error.message)
}

module.exports = route
