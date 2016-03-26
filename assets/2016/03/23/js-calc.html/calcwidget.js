'use strict';
(function() {

  var Calc = (function() {
    var Calc = function(node) {
      this.node = node;
      this.hookKeyboard(this.node);
      this.calc = new MathCalc();
      this.state = {};
    };
    var proto = Calc.prototype;

    proto.hookKeyboard = function(node) {
      node.addEventListener('keydown', handleKeyDown.bind(this));
    }

    function handleKeyDown(event) {
      switch (event.keyCode) {
        case 13:
          event.preventDefault();
          this.evalLastEntry();
          break;
        case 76:
          if (event.ctrlKey === true && !(event.altKey || event.metaKey)) {
            this.clear();
          }
          break;
      }
    }

    proto.evalLastEntry = function() {
      var lines = this.node.value.split(/\n/);
      var lastLine = lines[lines.length - 1];
      lastLine = lastLine.replace(/^> /, '');

      function logError(err) {
        if (err.pos >= 0)
          lines.push(Array(3 + err.pos).join(' ') + '^');
        lines.push(err.text);
      }

      if (lastLine !== undefined && lastLine.trim().length > 0) {
        var expr = this.calc.parse(lastLine);
        expr.scope = this.state;

        if (expr.error) {
          logError(expr.error);
        }
        else {
          var ret = expr.eval();
          if (expr.scope.runtimeError)
            logError(expr.scope.runtimeError);
          else
            lines.push(formatValue(ret));
        }

        lines.push('> ');
        this.node.value = lines.join('\n');
        this.node.scrollTop = this.node.scrollHeight;
      }
    }

    function formatValue(v) {
      return Array.isArray(v) ? JSON.stringify(v)
        : (typeof v === 'function') ? 'function ' + v.name + '()'
        : '' + v;
    }

    proto.clear = function() {
      this.node.value = '> ';
    };

    return Calc;
  })();


  function loader() {
    var widget = document.createElement('div');
    widget.classList.add('calcwidget', 'highlighter-rouge');

    var input = document.createElement('textarea');
    input.classList.add('highlight', 'console');
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('autocorrect', 'off');
    input.setAttribute('autocapitalize', 'off');

    input.value = '> 2+2';
    widget.appendChild(input);

    var calc = new Calc(input);

    var thisScript = document.querySelector('#calcwidget');
    thisScript.parentNode.insertBefore(widget, thisScript);
  }
  window.addEventListener('load', loader);
})();
