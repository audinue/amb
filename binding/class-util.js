

function hasClass(element, name) {
  return (' ' + element.className + ' ').indexOf(' ' + name + ' ') > -1
}

function addClass(element, name) {
  if (hasClass(element, name)) {
    return
  }
  element.className = (element.className + ' ' + name)
    .replace(/^ /, '')
}

function removeClass(element, name) {
  element.className = (' ' + element.className)
    .replace(' ' + name, '')
    .substr(1)
}