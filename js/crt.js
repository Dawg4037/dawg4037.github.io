/* dawg4037.com — CRT terminal driver.
   Reads its boot script from a <script type="application/json"> block inside
   the .crt element, so the same code can drive different screens.

   Script format: [ [text, class, speed], ... ]
     class: "" | "dim" | "warn" | "hi"
     speed: ms per character; 0 prints the line instantly
*/

(function () {
  document.querySelectorAll('.crt').forEach(setupCRT);

  function setupCRT(crt) {
    var screen = crt.querySelector('.screen');
    var out    = crt.querySelector('.screen-inner');
    var pwr    = crt.querySelector('.pwr');
    var led    = crt.querySelector('.led-pwr');
    var data   = crt.querySelector('script[type="application/json"]');
    if (!screen || !out || !data) return;

    var SCRIPT;
    try { SCRIPT = JSON.parse(data.textContent); }
    catch (e) { return; }

    var reduce  = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var timers  = [];
    var LOOP_MS = parseInt(crt.dataset.loop || '6000', 10);

    function clearTimers() { timers.forEach(clearTimeout); timers = []; }
    function wait(ms, fn)  { timers.push(setTimeout(fn, ms)); }

    function esc(s) {
      return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function render(done, partial) {
      var html = done.map(function (l) {
        return l.cls ? '<span class="' + l.cls + '">' + esc(l.text) + '</span>' : esc(l.text);
      }).join('\n');

      if (partial) {
        var p = SCRIPT[partial.i];
        var chunk = esc(p[0].slice(0, partial.n));
        html += (done.length ? '\n' : '') +
                (p[1] ? '<span class="' + p[1] + '">' + chunk + '</span>' : chunk);
      }
      out.innerHTML = html + '<span class="cursor"></span>';
      out.scrollTop = out.scrollHeight;
    }

    function run() {
      clearTimers();
      out.innerHTML = '';
      screen.classList.remove('booting');
      void screen.offsetWidth;            // reflow, so the degauss replays
      screen.classList.add('booting');

      var done = [];

      if (reduce) {                        // no motion: print it all at once
        SCRIPT.forEach(function (l) { done.push({ text: l[0], cls: l[1] }); });
        render(done, null);
        return;
      }

      function line(i) {
        if (i >= SCRIPT.length) {
          if (LOOP_MS > 0) wait(LOOP_MS, run);
          return;
        }
        var text  = SCRIPT[i][0];
        var cls   = SCRIPT[i][1];
        var speed = SCRIPT[i][2];

        if (!speed || text === '') {       // instant line
          done.push({ text: text, cls: cls });
          render(done, null);
          wait(text === '' ? 90 : 150, function () { line(i + 1); });
          return;
        }

        var n = 0;
        (function type() {
          if (n > text.length) {
            done.push({ text: text, cls: cls });
            render(done, null);
            wait(380, function () { line(i + 1); });
            return;
          }
          render(done, { i: i, n: n });
          n++;
          wait(speed, type);
        })();
      }

      wait(900, function () { line(0); }); // let the tube warm up
    }

    if (pwr) {
      var on = true;
      pwr.addEventListener('click', function () {
        on = !on;
        if (on) {
          if (led) led.classList.remove('off');
          run();
        } else {
          clearTimers();
          if (led) led.classList.add('off');
          screen.classList.remove('booting');
          out.innerHTML = '';
        }
      });
    }

    run();
  }
})();
