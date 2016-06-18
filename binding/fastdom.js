
var measurements = []
var mutations = []

var raf = function (callback) { setTimeout(callback, 16) }

function update () {
  var callback
  while ((callback = measurements.shift())) {
    callback()
  }
  while ((callback = mutations.shift())) {
    callback()
  }
  raf(update)
}

raf(update)

function measure (callback) {
  measurements.push(callback)
}

function mutate (callback) {
  mutations.push(callback)
}
