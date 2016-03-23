// author: Pavel Ivashkov, github.com/paiv
'use strict';

var MathCalc = (function(module) {
  var MathCalc = function() {
    this.parser = new MathExpression();
  };
  var mathcalc = MathCalc.prototype;


  var Logger = (function() {
    var Logger = function(prefix, level, out) {
      this.prefix = (prefix || '') + ':';
      this.level = level || Logger.NONE;
      this.out = out || (window.console && window.console.log.bind(window.console));

      this.warn = this.log.bind(this, Logger.WARN);
      this.info = this.log.bind(this, Logger.INFO);
      this.debug = this.log.bind(this, Logger.DEBUG);
    };
    var proto = Logger.prototype;

    Logger.DEBUG = 1;
    Logger.INFO = 2;
    Logger.WARN = 3;
    Logger.NONE = 4;

    proto.log = function(level, text) {
      if (level >= this.level && typeof(this.out) === 'function') {
        var args = [];
        for (var i = 2, len = arguments.length; i < len; i++) {
          args.push(arguments[i]);
        }
        args = [this.prefix + text].concat(args);
        this.out.apply(this, args);
      }
    };

    return Logger;
  })();


  var MathExpression = (function() {
    var logger = new Logger('PARSER', Logger.NONE);
    var emitLogger = new Logger('EMIT', Logger.NONE);
    var MathExpression = function() {};
    var proto = MathExpression.prototype;

    proto.parse = function(content) {
      var tokens = lexer(content);
      var ast = parser(tokens);
      return emitter(ast);
    };

    function emitter(ast) {
      if (ast !== undefined) {
        emitLogger.debug('%s', ast.id);
        switch (ast.id) {
          case 'Expr':
            return emitter(ast.expr);
          case 'Sums':
          case 'Prod':
          case 'Power':
            return ast.expr ? emitter(ast.expr) : emit_binary_op(ast.op, ast.left, ast.right);
          case 'Unary':
            return ast.expr ? emitter(ast.expr) : emit_unary_op(ast.op, ast.right);
          case 'Parens':
            return emitter(ast.expr);
          case 'Value':
            return emitter(ast.token);
          case 'PI':
          case 'E':
          case 'INF':
          case 'Number':
            return function() { return ast.value; };
          case 'Var':
            return function(x) { return x; };
        }
      }
      return function() {};
    }

    function emit_unary_op(op, right) {
      right = emitter(right);
      switch (op.id) {
        case 'Plus': return function() { return right.apply(this, arguments); };
        case 'Minus': return function() { return -right.apply(this, arguments); };
      }
      logger.warn('No emitter for %o', op);
      return function() {};
    }

    function emit_binary_op(op, left, right) {
      left = emitter(left);
      right = emitter(right);
      var self = undefined;

      function bifunc(op) {
        return op(left.apply(this, arguments), right.apply(this, arguments)); }

      switch (op.id) {
        case 'Plus': return bifunc.bind(self, function(x,y) { return +x + y; });
        case 'Minus': return bifunc.bind(self, function(x,y) { return x - y; });
        case 'Mul': return bifunc.bind(self, function(x,y) { return x * y; });
        case 'Div': return bifunc.bind(self, function(x,y) { return x / y; });
        case 'Mod': return bifunc.bind(self, function(x,y) { return x % y; });
        case 'Pow': return bifunc.bind(self, function(x,y) { return Math.pow(x, y); });
      }
      logger.warn('No emitter for %o', op);
      return function() {};
    }

    var DONE = 0;
    var SHIFT = 1;
    var REDUCE = 2;

    var ShiftReduce = {};

    // expr: sum
    // sum: sum + product | product
    // product: product * pow | pow
    // pow: unary ^ pow | unary
    // unary: - unary | parens
    // parens: ( expr ) | value
    // value: number | constant | variable

    add(SHIFT, ['(empty)', 'Plus', 'Minus', 'Mul', 'Div', 'Mod', 'Pow', 'LParen'], ['Plus', 'Minus', 'LParen', 'Number', 'PI', 'E', 'INF', 'Var']);
    add(SHIFT, ['Sums'], ['Plus', 'Minus']);
    add(SHIFT, ['Prod'], ['Mul', 'Div', 'Mod']);
    add(SHIFT, ['Unary'], ['Pow']);
    add(SHIFT, ['Expr'], ['RParen']);
    add(REDUCE, ['Number', 'PI', 'E', 'INF', 'Var', 'Value', 'RParen', 'Parens', 'Unary', 'Power', 'Prod'], ['Plus', 'Minus']);
    add(REDUCE, ['Number', 'PI', 'E', 'INF', 'Var', 'Value', 'RParen', 'Parens', 'Unary', 'Power'], ['Mul', 'Div', 'Mod']);
    add(REDUCE, ['Number', 'PI', 'E', 'INF', 'Var', 'Value', 'RParen', 'Parens'], ['Pow']);
    add(REDUCE, ['Number', 'PI', 'E', 'INF', 'Var', 'Value', 'RParen', 'Parens', 'Unary', 'Power', 'Prod', 'Sums'], ['RParen', '(eof)']);
    add(DONE, ['(empty)', 'Expr'], ['(eof)']);

    function add(action, fro, to) {
      for (var i = 0, len = fro.length; i < len; i++)
      for (var j = 0, jlen = to.length; j < jlen; j++) {
        var key = fro[i] + ':' + to[j];
        ShiftReduce[key] = action;
      }
    }


    function parser(tokens) {
      var stack = [];

      for (var pos = 0, len = tokens.length, done = false; !done && pos <= len; ) {
        var token = tokens[pos];
        var top = stack[stack.length - 1];

        var key = (top ? top.id : '(empty)') + ':' + (token ? token.id : '(eof)');
        var action = ShiftReduce[key];

        switch (action) {
          case SHIFT:
            logger.debug('shift %s %o', key, debug_stack(stack));
            stack = parser_shift(stack, token);
            pos++;
            break;
          case REDUCE:
            logger.debug('reduce %s %o', key, debug_stack(stack));
            stack = parser_reduce(stack, token);
            break;
          case DONE:
            logger.debug('done %s %o', key, debug_stack(stack));
            done = true;
            break;
          default:
            if (token !== undefined)
              logger.warn('Unexpected token "%s" at %d (%s)', token.string, token.pos, key);
            else
              logger.warn('Unexpected eof (%s)', key);
            done = true;
        }
      }
      return stack.pop();
    }

    function debug_stack(stack) {
      if (logger.level >= Logger.DEBUG)
        return stack.map(function(x) { return x.id; });
      return '';
    }

    function parser_shift(stack, token) {
      stack = stack.slice();
      stack.push(token);
      return stack;
    }

    function parser_reduce(stack, token) {
      var top = stack[stack.length - 1];
      switch (top.id) {
        case 'Sums':
          return parser_reduce_expr(stack);
        case 'Prod':
          return parser_reduce_sums(stack);
        case 'Power':
        case 'Unary':
          return parser_reduce_power(stack);
        case 'Parens':
          return parser_reduce_unary_op(stack);
        case 'Value':
        case 'RParen':
          return parser_reduce_parens(stack);
        case 'Number':
        case 'PI':
        case 'E':
        case 'INF':
        case 'Var':
          return parser_reduce_value(stack);
      }
      return stack;
    }

    function parser_reduce_expr(stack) {
      var top = stack[stack.length - 1];
      var expr = {
        id: 'Expr',
        expr: top,
      };
      return parser_splice(stack, 1, expr);
    }

    function parser_reduce_sums(stack) {
      return parser_reduce_binary_op(stack, ['Plus', 'Minus'], 'Sums');
    }

    function parser_reduce_product(stack) {
      return parser_reduce_binary_op(stack, ['Mul', 'Div', 'Mod'], 'Prod');
    }

    function parser_reduce_binary_op(stack, ops, id) {
      var left = stack[stack.length - 3];
      var oper = stack[stack.length - 2];
      var right = stack[stack.length - 1];
      var expr = { id: id };

      if (oper !== undefined && ops.indexOf(oper.id) !== -1) {
        expr.op = oper;
        expr.left = left;
        expr.right = right;
        return parser_splice(stack, 3, expr);
      }

      expr.expr = right;
      return parser_splice(stack, 1, expr);
    }

    function parser_reduce_power(stack) {
      var oper = stack[stack.length - 2];
      var top = stack[stack.length - 1];

      if (top !== undefined && top.id === 'Unary') {
        var unary = parser_reduce_unary_op(stack, false);
        if (unary) return unary;

        var expr = { id: 'Power', expr: top };
        return parser_splice(stack, 1, expr);
      }

      if (top !== undefined && top.id === 'Power' && oper !== undefined && oper.id === 'Pow') {
        return parser_reduce_binary_op(stack, ['Pow'], 'Power');
      }

      return parser_reduce_product(stack);
    }

    var UNARY_LEFT_TERMS = ['Pow', 'Mul', 'Div', 'Mod', 'Plus', 'Minus', 'LParen'];

    function parser_reduce_unary_op(stack, optional) {
      var left = stack[stack.length - 3];
      var oper = stack[stack.length - 2];
      var right = stack[stack.length - 1];
      var expr = { id: 'Unary' };

      if (oper !== undefined && (oper.id === 'Minus' || oper.id === 'Plus') &&
          (left === undefined || UNARY_LEFT_TERMS.indexOf(left.id) !== -1)) {
        expr.op = oper;
        expr.right = right;
        return parser_splice(stack, 2, expr);
      }

      if (optional !== false) {
        expr.expr = right;
        return parser_splice(stack, 1, expr);
      }
    }

    function parser_reduce_parens(stack) {
      var left = stack[stack.length - 3];
      var middle = stack[stack.length - 2];
      var right = stack[stack.length - 1];
      var expr = { id: 'Parens' };

      if (right.id === 'RParen') {
        if (left.id !== 'LParen') {
          logger.warn('Unmatched paren at %d', right.pos);
          return;
        }
        expr.expr = middle;
        return parser_splice(stack, 3, expr);
      }

      expr.expr = right;
      return parser_splice(stack, 1, expr);
    }

    function parser_reduce_value(stack) {
      var top = stack[stack.length - 1];
      var expr = {
        id: 'Value',
        token: top,
      };
      return parser_splice(stack, 1, expr);
    }

    function parser_splice(stack, ntop, item) {
      stack = stack.slice();
      stack.splice(stack.length - ntop, ntop, item);
      return stack;
    }


    function lexer(content) {
      var tokens = [];
      var pos = 0;
      var token;
      while ((token = tokenizer(content, pos)) !== undefined) {
        if (token.id !== 'Space') {
          tokens.push(token);
        }
        pos = token.end;
      }
      return tokens;
    }

    var Tokens = /^(?:(\s+)|((?:\d+e[-+]?\d+|\d+(?:\.\d*)?|\d*\.\d+))|(\+)|(\-)|(\*)|(\/)|(%)|(\^)|(\()|(\))|(pi)\b|(e)\b|(inf)\b|([a-zA-Z]\w*))/i;
    var TokenIds = ['Space', 'Number', 'Plus', 'Minus', 'Mul', 'Div', 'Mod', 'Pow', 'LParen', 'RParen', 'PI', 'E', 'INF', 'Var'];

    function tokenizer(content, pos) {
      var s = content.slice(pos);
      if (s.length === 0) return;

      var match = Tokens.exec(s);
      if (match === null) {
        logger.warn('Unparsed string "%s"', s);
        return;
      }

      for (var i = 0, len = TokenIds.length; i < len; i++) {
        var token = match[i + 1];
        if (token !== undefined) {
          return {
            id: TokenIds[i],
            string: token,
            pos: pos,
            end: pos + token.length,
            value: evalToken(TokenIds[i], token)
          };
        }
      }
    }

    var parseNumber = Number.parseFloat || parseFloat;

    function evalToken(id, s) {
      switch (id) {
        case 'Number': return parseNumber(s);
        case 'PI': return Math.PI;
        case 'E': return Math.E;
        case 'INF': return Number.POSITIVE_INFINITY;
        default: return s;
      }
    }

    return MathExpression;
  })();


  mathcalc.parse = function(content) {
    var func = this.parser.parse(content);
    return {
      eval: function(state) { return func(); }
    };
  }

  return MathCalc;
})(MathCalc || {});
