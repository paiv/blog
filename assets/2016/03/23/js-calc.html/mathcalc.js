//
// MathCalc: a parser for basic mathematical expressions
// Try it here: https://paiv.github.io/blog/2016/03/23/js-calc.html
//
//
// Copyright (c) 2016, Pavel Ivashkov, github.com/paiv
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
// OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.

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
      this.error = undefined;
      var lex = lexer(content);
      var ast = parser(lex.tokens);
      var func = emitter(ast.root);
      return {
        error: lex.error || ast.error,
        func: func
      };
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
      var state = {
        tokens: tokens,
        pos: 0,
        stack: []
      };

      for (var tokenCount = 0, len = tokens.length, done = false; !done && tokenCount <= len; ) {
        var token = tokens[tokenCount];
        var top = state.stack[state.stack.length - 1];

        var key = (top ? top.id : '(empty)') + ':' + (token ? token.id : '(eof)');
        var action = ShiftReduce[key];

        switch (action) {
          case SHIFT:
            logger.debug('shift %s %o', key, debug_stack(state.stack));
            state = parser_shift(state, token);
            tokenCount++;
            break;
          case REDUCE:
            logger.debug('reduce %s %o', key, debug_stack(state.stack));
            state = parser_reduce(state, token);
            break;
          case DONE:
            logger.debug('done %s %o', key, debug_stack(state.stack));
            done = true;
            break;
          default:
            if (token !== undefined) {
              var error = { pos: token.pos, text: 'Unexpected token "' + token.string + '"' };
              state.error = error;
              logger.warn('%s at %d (%s)', error.text, error.pos, key);
            }
            else {
              var error = { text: 'Unexpected EOF' };
              state.error = error;
              logger.warn('%s (%s)', error.text, key);
            }
            done = true;
        }
      }

      if (!state.error && state.stack.length > 1) {
        var item = getTop(state, 1);
        var pos = item.pos || 0;
        state.error = { pos: pos, text: 'Invalid expression' };
      }

      return {
        root: state.stack.pop(),
        error: state.error
      };
    }

    function debug_stack(stack) {
      if (logger.level >= Logger.DEBUG)
        return stack.map(function(x) { return x.id; });
      return '';
    }

    function parser_shift(state, token) {
      return parser_splice(state, 0, token);
    }

    function parser_splice(state, ntop, item) {
      var stack = state.stack.slice(0, state.stack.length - ntop);
      var pos = state.pos;
      if (item) {
        stack.push(item);
        if (item.pos !== undefined) pos = item.pos;
      }
      return {
        tokens: state.tokens,
        pos: pos,
        stack: stack,
        error: state.error
      };
    }

    function parser_reduce(state, token) {
      var top = getTop(state, 0);
      switch (top.id) {
        case 'Sums':
          return parser_reduce_expr(state);
        case 'Prod':
          return parser_reduce_sums(state);
        case 'Power':
        case 'Unary':
          return parser_reduce_power(state);
        case 'Parens':
          return parser_reduce_unary_op(state);
        case 'Value':
        case 'RParen':
          return parser_reduce_parens(state);
        case 'Number':
        case 'PI':
        case 'E':
        case 'INF':
        case 'Var':
          return parser_reduce_value(state);
      }
      return state;
    }

    function getTop(state, index) {
      if (index === undefined) index = 0;
      return state.stack[state.stack.length - (index + 1)];
    }

    function parser_reduce_expr(state) {
      var top = getTop(state, 0);
      var expr = {
        id: 'Expr',
        expr: top,
      };
      return parser_splice(state, 1, expr);
    }

    function parser_reduce_sums(state) {
      return parser_reduce_binary_op(state, ['Plus', 'Minus'], 'Sums');
    }

    function parser_reduce_product(state) {
      return parser_reduce_binary_op(state, ['Mul', 'Div', 'Mod'], 'Prod');
    }

    function parser_reduce_binary_op(state, ops, id) {
      var left = getTop(state, 2);
      var oper = getTop(state, 1);
      var right = getTop(state, 0);
      var expr = { id: id };

      if (oper !== undefined && ops.indexOf(oper.id) !== -1) {
        expr.op = oper;
        expr.left = left;
        expr.right = right;
        return parser_splice(state, 3, expr);
      }

      expr.expr = right;
      return parser_splice(state, 1, expr);
    }

    function parser_reduce_power(state) {
      var oper = getTop(state, 1);
      var top = getTop(state, 0);

      if (top !== undefined && top.id === 'Unary') {
        var unary = parser_reduce_unary_op(state, false);
        if (unary) return unary;

        var expr = { id: 'Power', expr: top };
        return parser_splice(state, 1, expr);
      }

      if (top !== undefined && top.id === 'Power' && oper !== undefined && oper.id === 'Pow') {
        return parser_reduce_binary_op(state, ['Pow'], 'Power');
      }

      return parser_reduce_product(state);
    }

    var UNARY_LEFT_TERMS = ['Pow', 'Mul', 'Div', 'Mod', 'Plus', 'Minus', 'LParen'];

    function parser_reduce_unary_op(state, optional) {
      var left = getTop(state, 2);
      var oper = getTop(state, 1);
      var right = getTop(state, 0);
      var expr = { id: 'Unary' };

      if (oper !== undefined && (oper.id === 'Minus' || oper.id === 'Plus') &&
          (left === undefined || UNARY_LEFT_TERMS.indexOf(left.id) !== -1)) {
        expr.op = oper;
        expr.right = right;
        return parser_splice(state, 2, expr);
      }

      if (optional !== false) {
        expr.expr = right;
        return parser_splice(state, 1, expr);
      }
    }

    function parser_reduce_parens(state) {
      var left = getTop(state, 2);
      var middle = getTop(state, 1);
      var right = getTop(state, 0);
      var expr = { id: 'Parens' };

      if (right.id === 'RParen') {
        if (left === undefined || left.id !== 'LParen') {
          var error = { pos: right.pos, text: 'Unmatched paren' };
          state.error = error;
          logger.warn('%s at %d', error.text, error.pos);
          return parser_splice(state, 1);
        }
        expr.expr = middle;
        return parser_splice(state, 3, expr);
      }

      expr.expr = right;
      return parser_splice(state, 1, expr);
    }

    function parser_reduce_value(state) {
      var top = getTop(state, 0);
      var expr = {
        id: 'Value',
        token: top,
      };
      return parser_splice(state, 1, expr);
    }


    function lexer(content) {
      var tokens = [];
      var pos = 0;
      var token, error;
      while ((token = tokenizer(content, pos)) !== undefined) {
        if (token.error) {
          error = token.error;
        }
        else if (token.id !== 'Space') {
          tokens.push(token);
        }
        pos = token.end;
      }
      return {
        tokens: tokens,
        error: error
      };
    }

    var Tokens = /^(?:(\s+)|((?:\d+e[-+]?\d+|\d+(?:\.\d*)?|\d*\.\d+))|(\+)|(\-)|(\*)|(\/)|(%)|(\^)|(\()|(\))|(pi)\b|(e)\b|(inf)\b|([a-zA-Z]\w*))/i;
    var TokenIds = ['Space', 'Number', 'Plus', 'Minus', 'Mul', 'Div', 'Mod', 'Pow', 'LParen', 'RParen', 'PI', 'E', 'INF', 'Var'];

    function tokenizer(content, pos) {
      var s = content.slice(pos);
      if (s.length === 0) return;

      var match = Tokens.exec(s);
      if (match === null) {
        var endPos = skipInvalidChars(content, pos);
        var error = { pos: pos, text: 'Unexpected symbol "' + content.slice(pos, endPos) + '"' };
        logger.warn('%s at %d', error.text, error.pos);
        return {
          error: error,
          end: endPos
        };
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

    function skipInvalidChars(content, pos) {
      for (var len = content.length; pos < len; pos++) {
        var s = content.slice(pos);
        if (s.length === 0) break;
        var match = Tokens.exec(s);
        if (match !== null) break;
      }
      return pos;
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
    var result = this.parser.parse(content);
    return {
      error: result.error,
      eval: function(state) { return result.func(); }
    };
  }

  return MathCalc;
})(MathCalc || {});
