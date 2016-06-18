
var http = require('http')
var fs = require('fs')
var observableServer = require('./observable-server')

var server = observableServer()

http.createServer(function (request, response) {
  switch (request.url) {
    case '/index.html':
      response.writeHead(200, {'Content-Type': 'text/html'})
      fs.readFile('../client' + request.url, function (error, buffer) {
        response.write(buffer)
        response.end()
      })
      break
    case '/json2.js':
    case '/request.js':
    case '/observable-server.js':
    case '/position.js':
      response.writeHead(200, {'Content-Type': 'application/javascript'})
      fs.readFile('../client' + request.url, function (error, buffer) {
        response.write(buffer)
        response.end()
      })
      break;
    case '/event':
      switch (request.method) {
        case 'GET':
          server.on('change', function (message) {
            response.writeHead(200, {'Content-Type': 'application/json'})
            response.write(JSON.stringify(message))
            response.end()
          })
          break
        case 'POST':
          var message = ''
          request.on('data', function (data) {
            message += data
          })
          request.on('end', function () {
            server.notify(JSON.parse(message))
          })
          response.writeHead(200)
          response.end()
          break
      }
      break
    default:
      response.writeHead(404)
      response.end()
  }
}).listen(9000)
