
var sources = 'util.js event-util.js class-util.js observable.js scope.js bind.js exports.js'.split(' ')
var scripts = document.scripts || document.getElementsByTagName('script')
var base    = scripts[scripts.length - 1].src.replace(/[^\/]+$/, '')

for (var i in sources) {
  document.write('<script src="' + base + sources[i] + '"></script>')
}
