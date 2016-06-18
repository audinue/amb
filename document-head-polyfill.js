function getHead (document) {
  document = document || window.document
  if (document.head) {
    return document.head
  }
  var heads = document.getElementsByTagName('head')
  var head
  var html
  if (heads.length) {
    head = heads[0]
  } else {
    head = document.createElement('head')
    html = document.documentElement
    if (html.firstChild) {
      html.insertBefore(head, html.firstChild)
    } else {
      html.appendChild(head)
    }
  }
  return head
}
