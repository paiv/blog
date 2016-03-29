
(function () {

  function setUpNeuronWidget(container) {
    var sizeUnit = 1;
    var ratio = 1.618;
    function scale(n) { return sizeUnit * Math.pow(ratio, n); }

    var svg = SVG.create(container);
    svg.attr('viewBox', '0 0 300 ' + 480 * scale(-1));

    var defs = svg.defs();
    var arrowMarker = defs.marker(6, 5).ref(0, 2)
    arrowMarker.path('M0,0L5,2L0,4Z');

    var n1 = node(1, 1);
    var n2 = node(1, 2);
    var n3 = node(1, 3);
    var n4 = node(3, 2, 'y');

    handleToggle(n2);
    handleToggle(n3);

    arrowLink(n1, n4);
    arrowLink(n2, n4);
    arrowLink(n3, n4);

    var slider1 = slider(n1);
    var slider2 = slider(n2);
    var slider3 = slider(n3);

    var activatorText = svg.text('y = S(...)').moveTo(scale(2), scale(7));

    var ttable = svg.group().translate(scale(11), scale(9));
    var ttn1 = tnode(ttable, 0, 0);
    var ttn2 = tnode(ttable, 1, 0);
    var ttn3 = tnode(ttable, 0, 1);
    var ttn4 = tnode(ttable, 1, 1);

    function node(x, y, text) {
      var n = svg.circle(scale(7)).move(x * scale(9) - scale(7), y * scale(9)).attr('class', 'node');
      if (text)
        svg.text(text).moveTo(n.x - scale(2), n.y + scale(3));

      Object.defineProperty(n, 'active', {
        get: function () { return n.node.classList.contains('true'); },
        set: function (v) { return v ? n.node.classList.add('true') : n.node.classList.remove('true'); }
      });
      return n;
    }

    function tnode(g, x, y) {
      var n = g.circle(scale(4)).move(x * scale(7), y * scale(7));
      n.classList.add('node');
      n.classList.add('tnode');

      Object.defineProperty(n, 'active', {
        get: function () { return n.node.classList.contains('true'); },
        set: function (v) { return v ? n.node.classList.add('true') : n.node.classList.remove('true'); }
      });
      return n;
    }

    function arrowLink(a, b) {
      var marker = 8;
      var dx = b.x - a.x;
      var dy = b.y - a.y;
      var h = Math.sqrt(dx * dx + dy * dy);
      var x1 = a.x + a.r * dx / h;
      var y1 = a.y + a.r * dy / h;
      var x2 = b.x - (b.r + marker) * dx / h;
      var y2 = b.y - (b.r + marker) * dy / h;

      var el = svg.line(x1, y1, x2, y2).attr('class', 'link').attr('marker-end', 'url(#' + arrowMarker.id + ')');
      a.node.parentNode.insertBefore(el.node, a.node);
      return el;
    }

    function slider(a, value) {
      var g = svg.group().translate(a.x, a.y);
      var r = g.rect(0, scale(3), scale(9), scale(6)).attr('class', 'slider-rect');
      var inner = g.group().translate(r.x + 0.5, r.y + 0.5);
      var b = inner.rect(0, 0, r.width - 1, r.height - 1).scale(0.5, 1).attr('class', 'slider-bar');
      var t = g.text('00').moveTo(r.width * 0.4, r.height).style('pointer-events', 'none');

      handleScrolls(b, r.node);
      handleScrolls(b, b.node);

      Object.defineProperty(b, 'rawValue', {
        get: function () { return b.sliderValue; },
        set: function (value) {
          b.sliderValue = value;
          b.scale((value + 1) / 2, 1);
          value = Math.round(value * 10);
          t.text = '' + value;
        }
      });

      Object.defineProperty(b, 'value', {
        get: function () { return Math.round(b.rawValue * 10) / 10; },
        set: function (v) { b.rawValue = v; }
      });

      if (value !== undefined)
        b.value = value;
      return b;
    }

    function handleToggle(n) {
      n.node.addEventListener('click', handler);
      n.node.addEventListener('touchend', handler);
      function handler(event) {
        event.preventDefault();
        n.active = !n.active;
        activateOutput();
      }
    }

    function handleScrolls(slider, node) {

      function handleStart (event) {
        slider.sliderLastPos = event.pageX;
        event.preventDefault();
      }

      function handleEnd (event) {
        slider.sliderLastPos = undefined;
      }

      function handleMove (event) {
        var lastPos = slider.sliderLastPos;
        if (lastPos !== undefined && (event.buttons || event.changedTouches)) {
          var dx = event.pageX - lastPos;
          slider.sliderLastPos = event.pageX;
          var value = Math.min(1, Math.max(-1, slider.rawValue + dx / slider.width)) || 0;
          event.preventDefault();
          slider.rawValue = value;
          activateOutput();
        }
      }

      node.addEventListener('touchstart', handleStart);
      node.addEventListener('touchmove', handleMove);
      node.addEventListener('touchend', handleEnd);
      node.addEventListener('touchcancel', handleEnd);

      node.addEventListener('mousedown', handleStart);
      node.addEventListener('mousemove', handleMove);
      node.addEventListener('mouseup', handleEnd);
    }

    function activatorFunc(w1, w2, w3, x1, x2, x3) {
      var z = x1 * w1 + x2 * w2 + x3 * w3;
      return sigma(z) >= 0.5;
    }

    function sigma (x) {
      return 1 / (1 + Math.exp(-x));
    }

    function activateOutput() {
      var x1 = n1.active, x2 = n2.active, x3 = n3.active;
      var w1 = slider1.value, w2 = slider2.value, w3 = slider3.value;
      n4.active = activatorFunc(w1, w2, w3, x1, x2, x3);
      activatorText.text = formatActivatorText(w1, w2, w3, x1, x2, x3);
      displayTruthTable(activatorFunc.bind(null, w1, w2, w3, x1));
    }

    Math.sign = Math.sign || function (x) { return x < 0 ? -1 : x > 0 ? 1 : 0; }

    function formatActivatorText(w1, w2, w3, x1, x2, x3) {
      function format(x, w, sign) {
        var res = '';
        var s = Math.sign(w);
        if (s >= 0 && sign) res = '+';
        else if (s < 0) res = '-';
        if (sign && res) res += ' ';
        return res + (+x) + '*' + Math.abs(w * 10);
      }
      function formats(x, w) {
        return format(x, w, true);
      }
      var sum = Math.round((x1 * w1 + x2 * w2 + x3 * w3) * 10);
      return 'y = S(' + format(x1,w1) + ' ' + formats(x2,w2) + ' ' + formats(x3,w3) + ')' +
        ' = S(' + sum + ')' +
        ' = ' + Math.round(sigma(sum) * 100) / 100;
    }

    function displayTruthTable(func) {
      ttn1.active = func (0, 0);
      ttn2.active = func (0, 1);
      ttn3.active = func (1, 0);
      ttn4.active = func (1, 1);
    }

    n1.active = true;
    n1.node.classList.add('truec');

    slider1.value = -0.3;
    slider2.value = 0.0;
    slider3.value = 0.0;
    activateOutput();
  }

  function loader () {
    var widget = document.createElement('div');
    widget.classList.add('neuron-widget');

    setUpNeuronWidget(widget);

    var thisScript = document.querySelector('#neuronwidget');
    thisScript.parentNode.insertBefore(widget, thisScript);
  }

  window.addEventListener('load', loader);
})();
