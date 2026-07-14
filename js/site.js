/* dawg4037.com — faceplate port readout.
   Hovering a port reports its link state, the way a switch would. */

(function () {
  var out = document.getElementById('fp-out');
  if (!out) return;

  var idle = out.textContent;
  var ports = document.querySelectorAll('.port');

  ports.forEach(function (port) {
    var label = port.getAttribute('data-label');
    var negotiating = !!port.querySelector('.led-amber');
    var state = negotiating
      ? 'negotiating · no timeout set'
      : 'link up · 1000baseT · full-duplex';

    function show() {
      out.textContent = 'eth' + port.querySelector('.port-no').textContent +
                        ' [' + label + '] — ' + state;
    }
    function clear() { out.textContent = idle; }

    port.addEventListener('mouseenter', show);
    port.addEventListener('mouseleave', clear);
    port.addEventListener('focus', show);
    port.addEventListener('blur', clear);
    port.setAttribute('tabindex', '0');
  });
})();
