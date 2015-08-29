var input = document.getElementById('localeInput');

input.addEventListener('keyup', function onkeyup(event) {
  if (event.keyCode == 13) {
    self.port.emit('return', input.value);
  }
}, false);

self.port.on("show", function onShow(currentLocales) {
  input.value = currentLocales;
  input.focus();
  input.select();
});
