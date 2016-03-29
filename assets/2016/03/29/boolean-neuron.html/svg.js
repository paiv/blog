var SVG = (function (SVG) {

  SVG.ns = 'http://www.w3.org/2000/svg';
  SVG.xlink = 'http://www.w3.org/1999/xlink';

  function _extends(child, parent) {
    Object.getOwnPropertyNames(parent).forEach(function(n) { child[n] = parent[n]; });
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child._super = parent.prototype;
    return child;
  }

  function sliceArguments(args, n) {
    var res = [];
    for (var i = n, len = args.length; i < len; i++)
      res.push(args[i]);
    return res;
  }

  var IDseq = 0;


  SVG.create = function (selector) {
    var parent = (typeof selector === 'string') ? document.querySelector(selector) : selector;
    if (parent !== undefined && parent.tag === 'svg') {
      return new SVG.SvgElement(parent);
    }
    var svg = new SVG.SvgElement();
    if (parent !== undefined)
      parent.appendChild(svg.node);
    return svg;
  };


  SVG.Element = (function () {
    var Element = function(node) {
      this.node = node || this.createElement();
      this.id = 'gid' + (++IDseq);
    };
    var proto = Element.prototype;

    proto.declareAttribute = function (name, attr) {
      if (attr === undefined) attr = name;
      Object.defineProperty(this, name, {
        get: function() { return +this.attr(attr); },
        set: function(v) { return this.attr(attr, v); }
      });
    };

    proto.attr = function (name, value) {
      if (value !== undefined) {
        this.node.setAttribute(name, value);
        return this;
      }
      return this.node.getAttribute(name);
    };

    proto.stroke = function(v) { return this.attr('stroke', v); };
    proto.strokeWidth = function(v) { return this.attr('stroke-width', v); };

    proto.class = function (name) {
      return this.attr('class', name);
    };

    proto.style = function (obj, value) {
      if (value !== undefined) {
        this.node.style[obj] = value;
        return this;
      }
      if (typeof obj === 'string') {
        this.node.style.cssText = obj;
        return this;
      }
      if (typeof obj === 'object') {
        Object.getOwnPropertyNames(obj).forEach(function(n) {
          this.node.style[n] = obj[n];
        }, this);
        return this;
      }
      return this.node.style[obj];
    };

    proto.createChild = function (ctor, args) {
      args = sliceArguments(args, 0);
      args.unshift(null);
      var child = new (Function.bind.apply(ctor, args))();
      this.node.appendChild(child.node);
      return child;
    };

    proto.remove = function () {
      this.node.parentNode.removeChild(this.node);
    };

    Object.defineProperty(proto, 'classList', { get: function() { return this.node.classList; }});

    proto.moveTo = function (x, y) {
      this.attr('x', x);
      return this.attr('y', y);
    };

    proto.scale = function (x, y) {
      return this.attr('transform', 'scale(' + x + ' ' + y + ')');
    };
    proto.translate = function (x, y) {
      return this.attr('transform', 'translate(' + x + ' ' + y + ')');
    };

    return Element;
  })();


  SVG.Group = (function (superClass) {
    _extends(Group, superClass);
    function Group() {
      Group._super.constructor.call(this);
    }
    var proto = Group.prototype;

    proto.createElement = function () {
      return document.createElementNS(SVG.ns, 'g');
    };

    proto.g = proto.group = function () {
      return this.createChild(SVG.Group, arguments);
    };

    proto.defs = function() {
      return this.createChild(SVG.Defs, arguments);
    };

    proto.path = function () {
      return this.createChild(SVG.Path, arguments);
    };
    proto.circle = function () {
      return this.createChild(SVG.Circle, arguments);
    };
    proto.line = function () {
      return this.createChild(SVG.Line, arguments);
    };
    proto.rect = function () {
      return this.createChild(SVG.Rect, arguments);
    };
    proto.text = function () {
      return this.createChild(SVG.Text, arguments);
    };

    proto.marker = function () {
      return this.createChild(SVG.Marker, arguments);
    };

    return Group;
  })(SVG.Element);


  SVG.SvgElement = (function (superClass) {
    _extends(SvgElement, superClass);
    function SvgElement() {
      SvgElement._super.constructor.apply(this, arguments);
    }
    var proto = SvgElement.prototype;

    proto.createElement = function () {
      return document.createElementNS(SVG.ns, 'svg');
    };

    proto.styleSheet = function (value) {
      var el = document.createElementNS(SVG.ns, 'style');
      this.node.appendChild(el);
      if (Array.isArray(value)) {
        value.forEach(function(rule){ el.sheet.insertRule(rule, 0); });
      }
      else {
        el.sheet.insertRule(value, 0);
      }
      return this;
    };

    proto.size = function (width, height) {
      this.attr('width', width);
      this.attr('height', height);
      return this;
    };

    return SvgElement;
  })(SVG.Group);


  SVG.Defs = (function (superClass) {
    _extends(Defs, superClass);
    function Defs() {
      Defs._super.constructor.apply(this);
    }
    var proto = Defs.prototype;

    proto.createElement = function () {
      return document.createElementNS(SVG.ns, 'defs');
    };

    return Defs;
  })(SVG.Group);


  SVG.Circle = (function (superClass) {
    _extends(Circle, superClass);
    function Circle(r) {
      Circle._super.constructor.call(this);
      this.attr('r', r);
    }
    var proto = Circle.prototype;

    proto.createElement = function () {
      return document.createElementNS(SVG.ns, 'circle');
    };

    proto.move = function (x, y) {
      this.attr('cx', x);
      this.attr('cy', y);
      return this;
    };

    proto.declareAttribute('x', 'cx');
    proto.declareAttribute('y', 'cy');
    proto.declareAttribute('r');

    return Circle;
  })(SVG.Element);


  SVG.Line = (function (superClass) {
    _extends(Line, superClass);
    function Line(x1, y1, x2, y2) {
      Line._super.constructor.call(this);
      this.attr('x1', x1);
      this.attr('y1', y1);
      this.attr('x2', x2);
      this.attr('y2', y2);
    }
    var proto = Line.prototype;

    proto.createElement = function () {
      return document.createElementNS(SVG.ns, 'line');
    };

    return Line;
  })(SVG.Element);


  SVG.Rect = (function (superClass) {
    _extends(Rect, superClass);
    function Rect(x, y, width, height) {
      Rect._super.constructor.call(this);
      this.attr('x', x);
      this.attr('y', y);
      this.attr('width', width);
      this.attr('height', height);
    }
    var proto = Rect.prototype;

    proto.createElement = function () {
      return document.createElementNS(SVG.ns, 'rect');
    };

    proto.declareAttribute('x');
    proto.declareAttribute('y');
    proto.declareAttribute('width');
    proto.declareAttribute('height');

    return Rect;
  })(SVG.Element);


  SVG.Text = (function (superClass) {
    _extends(Text, superClass);
    function Text(text) {
      Text._super.constructor.call(this);
      this.text = text;
    }
    var proto = Text.prototype;

    proto.createElement = function () {
      return document.createElementNS(SVG.ns, 'text');
    };

    proto.declareAttribute('x');
    proto.declareAttribute('y');

    Object.defineProperty(proto, 'text', {
      get: function () { return this.node.textContent; },
      set: function (v) { return this.node.textContent = v; }
    });

    return Text;
  })(SVG.Element);


  SVG.Marker = (function (superClass) {
    _extends(Marker, superClass);
    function Marker(width, height) {
      Marker._super.constructor.apply(this);
      this.width = width;
      this.height = height;
      this.orient = 'auto';
      this.attr('id', this.id);
    }
    var proto = Marker.prototype;

    proto.createElement = function () {
      return document.createElementNS(SVG.ns, 'marker');
    };

    proto.declareAttribute('width', 'markerWidth');
    proto.declareAttribute('height', 'markerHeight');
    proto.declareAttribute('orient');
    proto.declareAttribute('refX');
    proto.declareAttribute('refY');

    proto.ref = function (x, y) {
      this.refX = x;
      this.refY = y;
      return this;
    };

    return Marker;
  })(SVG.Group);


  SVG.Path = (function (superClass) {
    _extends(Path, superClass);
    function Path(path) {
      Path._super.constructor.call(this);
      this.attr('d', path);
    }
    var proto = Path.prototype;

    proto.createElement = function () {
      return document.createElementNS(SVG.ns, 'path');
    };

    proto.declareAttribute('x');
    proto.declareAttribute('y');

    return Path;
  })(SVG.Element);


  return SVG;
})(SVG || {});
