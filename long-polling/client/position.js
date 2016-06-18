function getCursorPosition($element) {
  var position = 0,
      selection;

  if (document.selection) {
    // IE Support
    $element.focus();
    selection = document.selection.createRange();
    selection.moveStart ('character', -$element.value.length);
    position = selection.text.length;
  } else if ($element.selectionStart || $element.selectionStart === 0) {
    position = $element.selectionStart;
  }

  return position;
}

function setCursorPosition($element, position) {
  var selection;

  if (document.selection) {
    // IE Support
    $element.focus ();
    selection = document.selection.createRange();
    selection.moveStart ('character', -$element.value.length);
    selection.moveStart ('character', position);
    selection.moveEnd ('character', 0);
    selection.select ();
  } else if ($element.selectionStart || $element.selectionStart === 0) {
    $element.selectionStart = position;
    $element.selectionEnd = position;
    $element.focus ();
  }
}