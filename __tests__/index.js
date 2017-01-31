import chai from 'chai';
import Parser from '../src';

const expect = chai.expect;
const parser = new Parser();

describe('Morph expressions', function () {
  describe('constant', function () {
    it('should parse predefined constants', function () {
      expect(parser.parseAndEval('true')).to.be.true;
      expect(parser.parseAndEval('false')).to.be.false;
    });
  });

  describe('number', function () {
    describe('when number is valid', function () {
      it('should parse valid numbers', function () {
        expect(parser.parseAndEval('0')).to.equal(0);
        expect(parser.parseAndEval('5')).to.equal(5);
        expect(parser.parseAndEval('5.4')).to.equal(5.4);
        expect(parser.parseAndEval('.4')).to.equal(.4);
        expect(parser.parseAndEval('005.4')).to.equal(5.4);
        expect(parser.parseAndEval('005.400')).to.equal(5.4);
        expect(parser.parseAndEval('2.')).to.equal(2);
      });
    });

    describe('when number is not valid', function () {
      it('should throw an SyntaxError', function () {
        expect(() => parser.parseAndEval('3.2.1')).to.throw(SyntaxError, 'Invalid number \'3.2.1\'');
      });
    });
  });

  describe('string', function () {
    describe('when string is valid', function () {
      it('should parse a string', function () {
        expect(parser.parseAndEval('"string"')).to.equal('string');
        expect(parser.parseAndEval('\'string\'')).to.equal('string');
      });
    });

    describe('when string is not valid', function () {
      it('should throw an SyntaxError', function () {
        expect(() => parser.parseAndEval('"string')).to.throw(SyntaxError, 'Unterminated quote "');
        expect(() => parser.parseAndEval('string"')).to.throw(SyntaxError, 'Unterminated quote "');
        expect(() => parser.parseAndEval('\'string"')).to.throw(SyntaxError, 'Unterminated quote \'');
        expect(() => parser.parseAndEval('"string\'')).to.throw(SyntaxError, 'Unterminated quote "');
      });
    });
  });

  describe('operators', function () {
    describe('Addition operator "+"', function () {
      it('should parse and eval operator', function () {
        expect(parser.parseAndEval('1 + 2')).to.equal(3);
        expect(parser.parseAndEval('1 + 2 + 4')).to.equal(7);
      });

      it('should eval in precedence order', function () {
        expect(parser.parseAndEval('1 + 2 * 4')).to.equal(9);
      });

      it('should parse and eval unary variant', function () {
        expect(parser.parseAndEval('+2')).to.equal(2);
      });
    });

    describe('Increase operator "++"', function () {
      it('should parse and eval operator', function () {
        expect(parser.parseAndEval('++2')).to.equal(3);
        expect(parser.parseAndEval('1 + ++2')).to.equal(4);
      });
    });

    describe('Subtract operator "-"', function () {
      it('should parse and eval operator', function () {
        expect(parser.parseAndEval('1 - 2')).to.equal(-1);
        expect(parser.parseAndEval('1 - 1 - 1')).to.equal(-1);
      });

      it('should eval in precedence order', function () {
        expect(parser.parseAndEval('1 - 2 * 4')).to.equal(-7);
      });

      it('should parse and eval unary variant', function () {
        expect(parser.parseAndEval('-2')).to.equal(-2);
      });
    });

    describe('Decrease operator "--"', function () {
      it('should parse and eval operator', function () {
        expect(parser.parseAndEval('--2')).to.equal(1);
        expect(parser.parseAndEval('1 - --2')).to.equal(0);
      });
    });

    describe('Multiply operator "*"', function () {
      it('should parse and eval operator', function () {
        expect(parser.parseAndEval('4 * 2')).to.equal(8);
        expect(parser.parseAndEval('2 * 2 * 2')).to.equal(8);
      });

      it('should eval in precedence order', function () {
        expect(parser.parseAndEval('2 * -2')).to.equal(-4);
        expect(parser.parseAndEval('-2 * 2')).to.equal(-4);
      });
    });

    describe('Divide operator "/"', function () {
      it('should parse and eval operator', function () {
        expect(parser.parseAndEval('4 / 2')).to.equal(2);
        expect(parser.parseAndEval('8 / 2 / 2')).to.equal(2);
      });

      it('should eval in precedence order', function () {
        expect(parser.parseAndEval('2 / -2')).to.equal(-1);
        expect(parser.parseAndEval('-2 / 2')).to.equal(-1);
      });
    });

    describe('Mod operator "%"', function () {
      it('should parse and eval operator', function () {
        expect(parser.parseAndEval('8 % 3')).to.equal(2);
      });

      it('should eval in precedence order', function () {
        expect(parser.parseAndEval('5 % -2')).to.equal(1);
        expect(parser.parseAndEval('-5 % 2')).to.equal(-1);
      });
    });

    describe('Equal operator "=="', function () {
      it('should parse and eval operator', function () {
        expect(parser.parseAndEval('2 == 3')).to.be.false;
        expect(parser.parseAndEval('2 == 2')).to.be.true;
      });

      it('should eval in precedence order', function () {
        expect(parser.parseAndEval('true == 2 > 1')).to.be.true;
        expect(parser.parseAndEval('2 > 1 == true')).to.be.true;
      });
    });

    describe('Not equal operator "!="', function () {
      it('should parse and eval operator', function () {
        expect(parser.parseAndEval('2 != 2')).to.be.false;
        expect(parser.parseAndEval('2 != 3')).to.be.true;
      });

      it('should eval in precedence order', function () {
        expect(parser.parseAndEval('true != 1 > 2')).to.be.true;
        expect(parser.parseAndEval('1 > 2 != true')).to.be.true;
      });
    });

    describe('Greater operator ">"', function () {
      it('should parse and eval operator', function () {
        expect(parser.parseAndEval('2 > 3')).to.be.false;
        expect(parser.parseAndEval('2 > 2')).to.be.false;
        expect(parser.parseAndEval('2 > 1')).to.be.true;
      });

      it('should eval in precedence order', function () {
        expect(parser.parseAndEval('1 > 2 - 3')).to.be.true;
        expect(parser.parseAndEval('4 - 2 > 1')).to.be.true;
      });
    });

    describe('Greater or equal operator ">="', function () {
      it('should parse and eval operator', function () {
        expect(parser.parseAndEval('2 >= 3')).to.be.false;
        expect(parser.parseAndEval('2 >= 2')).to.be.true;
        expect(parser.parseAndEval('2 >= 1')).to.be.true;
      });

      it('should eval in precedence order', function () {
        expect(parser.parseAndEval('1 >= 2 - 1')).to.be.true;
      });
    });

    describe('Less operator "<"', function () {
      it('should parse and eval operator', function () {
        expect(parser.parseAndEval('2 < 3')).to.be.true;
        expect(parser.parseAndEval('2 < 2')).to.be.false;
        expect(parser.parseAndEval('2 < 1')).to.be.false;
      });

      it('should eval in precedence order', function () {
        expect(parser.parseAndEval('1 < 2 - 1')).to.be.false;
        expect(parser.parseAndEval('5 - 3 < 3')).to.be.true;
      });
    });

    describe('Less or equal operator "<="', function () {
      it('should parse and eval operator', function () {
        expect(parser.parseAndEval('2 <= 3')).to.be.true;
        expect(parser.parseAndEval('2 <= 2')).to.be.true;
        expect(parser.parseAndEval('2 <= 1')).to.be.false;
      });

      it('should eval in precedence order', function () {
        expect(parser.parseAndEval('1 <= 2 - 1')).to.be.true;
        expect(parser.parseAndEval('2 - 1 <= 1')).to.be.true;
      });
    });

    describe('Logical OR operator "||"', function () {
      it('should parse and eval operator', function () {
        expect(parser.parseAndEval('2 || 3')).to.equal(2);
        expect(parser.parseAndEval('2 || 0')).to.equal(2);
        expect(parser.parseAndEval('true || true')).to.be.true;
        expect(parser.parseAndEval('true || false')).to.be.true;
        expect(parser.parseAndEval('false || true')).to.be.true;
        expect(parser.parseAndEval('false || false')).to.be.false;
      });

      it('should eval in precedence order', function () {
        expect(parser.parseAndEval('false || 0 == 0')).to.be.true;
      });
    });

    describe('Logical AND operator "&&"', function () {
      it('should parse and eval operator', function () {
        expect(parser.parseAndEval('2 && 3')).to.equal(3);
        expect(parser.parseAndEval('2 && 0')).to.equal(0);
        expect(parser.parseAndEval('true && true')).to.be.true;
        expect(parser.parseAndEval('true && false')).to.be.false;
        expect(parser.parseAndEval('false && true')).to.be.false;
        expect(parser.parseAndEval('false && false')).to.be.false;
      });

      it('should eval in precedence order', function () {
        expect(parser.parseAndEval('true && 0 == 0')).to.be.true;
      });
    });

    describe('Logical NOT operator "!"', function () {
      it('should parse and eval operator', function () {
        expect(parser.parseAndEval('!1')).to.be.false;
        expect(parser.parseAndEval('!0')).to.be.true;
        expect(parser.parseAndEval('!!0')).to.be.false;
        expect(parser.parseAndEval('!true')).to.be.false;
        expect(parser.parseAndEval('!false')).to.be.true;
      });
    });
  });

  describe('variables', function () {
    describe('when variable is defined', function () {
      it('should parse variable', function () {
        expect(parser.parseAndEval('x', { x: 5 })).to.equal(5);
      });

      it('should parse nested variable', function () {
        expect(parser.parseAndEval('x.y', { x: { y: 5 } })).to.equal(5);
      });

      it('should return list of used variables', function () {
        expect(parser.parse('x.y + z').identifiers).to.deep.equal(['x.y', 'z']);
      });
    });
  });

  describe('functions', function () {
    describe('when function is defined', function () {
      beforeEach(function () {
        parser.registerFunction('sqr', value => value * value);
        parser.registerFunction('constant', () => 'constant');
        parser.registerFunction('sum', (x1, x2, x3) => x1 + x2 + x3);
      });

      afterEach(function () {
        parser.unRegisterFunction('sqr');
        parser.unRegisterFunction('constant');
        parser.unRegisterFunction('sum');
      });
      
      it('should throw an SyntaxError when function has been already declared', function () {
        expect(() => parser.registerFunction('sqr', value => value * value))
          .to.throw(SyntaxError, 'Function \'sqr\' has already been declared');
      });

      it('should throw an ReferenceError when function has not been already declared', function () {
        expect(() => parser.parseAndEval('fooBar()')).to.throw(ReferenceError, 'Function \'fooBar\' isn\'t declared');
      });

      it('should throw an SyntaxError when function does not contains close parentheses', function () {
        expect(() => parser.parseAndEval('sqr(2')).to.throw(SyntaxError, 'Unexpected end of expression');
      });

      it('should parse and eval function without parameters', function () {
        expect(parser.parseAndEval('constant()')).to.equal('constant');
      });

      it('should parse and eval function with parameters', function () {
        expect(parser.parseAndEval('sqr(2)')).to.equal(4);
      });

      it('should parse and eval nested functions', function () {
        expect(parser.parseAndEval('sqr(sqr(2))')).to.equal(16);
      });

      it('should parse and eval function with multiply arguments', function () {
        expect(parser.parseAndEval('sum(1,2,3)')).to.equal(6);
      });
    });

    describe('when function definition does not contains close parentheses', function () {
      it('should throw an SyntaxError', function () {
        expect(() => parser.parseAndEval('unRegistered(')).to.throw(SyntaxError, 'Unexpected end of expression');
      });
    });
  });

  describe('parentheses', function () {
    it('should parse parentheses overriding the default precedence', function () {
      expect(parser.parseAndEval('1 - (1 - 1)')).to.equal(1);
      expect(parser.parseAndEval('1 - ((2 - 3) - 4)')).to.equal(6);
      expect(parser.parseAndEval('3 * (2 + 1)')).to.equal(9);
      expect(parser.parseAndEval('(2 + 1) * 3')).to.equal(9);
    });

    it('should throw an SyntaxError when expression does not contains close parentheses', function () {
      expect(() => parser.parseAndEval('3 * (1 + 2')).to.throw(SyntaxError, 'Unexpected end of expression');
    });

    it('should throw an SyntaxError when expression does not contains open parentheses', function () {
      expect(() => parser.parseAndEval('1 + 2)')).to.throw(SyntaxError, 'Unexpected end of expression');
      expect(() => parser.parseAndEval('(1 + 2)) - 2')).to.throw(SyntaxError, 'Unexpected end of expression');
      expect(() => parser.parseAndEval(')')).to.throw(SyntaxError, 'Unexpected end of expression');
    });
  });
});
