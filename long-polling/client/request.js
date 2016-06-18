
var request = {
  get: function (url, callback) {
    var xhr = new (window.ActiveXObject || window.XMLHttpRequest)('Microsoft.XMLHTTP')
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          callback(JSON.parse(xhr.responseText))
        }
      }
    }
    xhr.open('GET', url, true)
    xhr.send('')
  },
  post: function (url, data) {
    var xhr = new (window.ActiveXObject || window.XMLHttpRequest)('Microsoft.XMLHTTP')
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(data))
  }
}
