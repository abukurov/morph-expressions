import TokenType, { types } from './types';
import keywordsTree from './keywords-tree';

const isQuotes = ch => (ch === '"' || ch === '\'');
const isWhitespace = ch => ' \f\n\r\t\v\u00A0\u2028\u2029'.indexOf(ch) !== -1;
const isDigit = ch => /\d/.test(ch);
const isNumber = ch => isDigit(ch) || ch === '.';
const isAlphabetic = ch => /[A-ZА-Я]/i.test(ch);
const isIdentifierStart = ch => isAlphabetic(ch) || ch === '_' || ch === '$';
const isIdentifierContinue = ch => isIdentifierStart(ch) || isDigit(ch) || ch === '.';

function skipWhitespaces(expression, index) {
  let skip = 0;

  while (isWhitespace(expression.charAt(index + skip))) {
    skip += 1;
  }

  return skip;
}

function readString(expression, index) {
  const ch = expression.charAt(index);
  const start = index + 1;
  let current = index + 1;

  while (expression.charAt(current) !== ch) {
    current += 1;
    if (current > expression.length) {
      throw new SyntaxError(`Unterminated quote ${ch}`);
    }
  }

  const lexeme = expression.slice(start - 1, current + 1);
  const string = expression.slice(start, current);

  return new TokenType(types.CONSTANT, lexeme, string);
}

function readNumber(expression, index) {
  const start = index;
  let current = index + 1;

  while (isNumber(expression.charAt(current))) {
    current += 1;
  }

  const lexeme = expression.slice(start, current);
  const number = Number(lexeme);

  if (isNaN(number)) {
    throw new SyntaxError(`Invalid number '${lexeme}'`);
  }

  return new TokenType(types.CONSTANT, lexeme, number);
}

function readIdentifier(expression, index) {
  const start = index;
  let current = index + 1;

  while (isIdentifierContinue(expression.charAt(current))) {
    current += 1;
  }

  const lexeme = expression.slice(start, current);
  return new TokenType(types.IDENTIFIER, lexeme, lexeme);
}

function readKeyword(expression, index) {
  let current = index;
  let currentNode = keywordsTree;
  let found = null;

  while (current < expression.length) {
    currentNode = currentNode.getAt(expression.charAt(current));

    if (!currentNode) {
      break;
    }

    found = currentNode.value ? currentNode : found;
    current += 1;
  }

  return found ? found.value : null;
}

const TOKENIZERS = [
  [isQuotes, readString],
  [isNumber, readNumber],
  [isIdentifierStart, readIdentifier]
];

export default class Tokenizer {
  constructor(input) {
    this.input = input;
    this.pos = 0;
    this.skipToken();
  }

  skipToken() {
    if (this.pos >= this.input.length) {
      this.finishToken(new TokenType(types.EOF, '', null));
      return this;
    }

    this.pos += skipWhitespaces(this.input, this.pos);

    this.readToken();
    return this;
  }

  readToken() {
    const ch = this.input.charAt(this.pos);
    const keywordToken = readKeyword(this.input, this.pos);

    if (keywordToken) {
      return this.finishToken(keywordToken);
    }

    // eslint-disable-next-line no-unused-vars
    const [match, handler] = TOKENIZERS.find(tokenizer => tokenizer[0](ch)) || [];

    if (!handler) {
      throw new SyntaxError(`Unknown character '${ch}'`);
    }

    const token = handler(this.input, this.pos);
    return this.finishToken(token);
  }

  finishToken(token) {
    this.token = token;
    this.pos += token.lexeme.length;
  }
}
