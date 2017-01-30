import * as token from './token';
import keywordsTree from './keywords_tree';

const isQuotes = ch => (ch === '"' || ch === '\'');
const isWhitespace = ch => ' \f\n\r\t\v\u00A0\u2028\u2029'.indexOf(ch) !== -1;
const isDigit = ch => /\d/.test(ch);
const isNumberSymbols = ch => isDigit(ch) || ch === '.';
const isAlphabetic = ch => /[A-ZА-Я]/i.test(ch);
const isIdentifierStart = ch => isAlphabetic(ch) || ch === '_' || ch === '$';
const isIdentifierContinue = ch => isIdentifierStart(ch) || isDigit(ch) || ch === '.';

function skipWhitespaces(ch, text, index, next) {
  while (index < text.length) {
    if (!isWhitespace(text.charAt(index))) {
      next(null, index);
      break;
    }

    ++index;
  }
}

function readString(ch, text, index, next) {
  const start = ++index;

  while (index < text.length) {
    if (ch === text.charAt(index)) {
      const lexeme = text.slice(start, index);

      return next(token.create(token.CONSTANT, lexeme, lexeme), ++index);
    }

    ++index;
  }

  throw new SyntaxError(`Unterminated quote ${ch} at ${start}`);
}

function readIdentifier(ch, text, index, next) {
  const start = index;

  ++index;
  while (index < text.length) {
    if (!isIdentifierContinue(text.charAt(index))) {
      break;
    }

    ++index;
  }

  const lexeme = text.slice(start, index);
  next(token.create(token.IDENTIFIER, lexeme, lexeme), index);
}

function readNumber(ch, text, index, next) {
  const start = index;

  ++index;
  while (index < text.length) {
    if (!isNumberSymbols(text.charAt(index))) {
      break;
    }

    ++index;
  }

  const lexeme = text.slice(start, index);
  const number = Number(lexeme);

  if (isNaN(number)) {
    throw new SyntaxError(`Invalid number at ${start}`);
  }

  next(token.create(token.CONSTANT, lexeme, number), index);
}

function readKeyword(ch, text, index, next) {
  const start = index;
  let currentNode = keywordsTree;
  let found = null;

  while (index < text.length) {
    currentNode = currentNode.getAt(text.charAt(index));

    if (!currentNode) {
      break;
    }

    found = currentNode.value ? currentNode : found;
    ++index;
  }

  return found ? next(found.value, start + found.lexeme.length) : next(null);
}

const TOKENIZERS = [
  [isWhitespace, skipWhitespaces],
  [isQuotes, readString],
  [isDigit, readNumber],
  [isIdentifierStart, readIdentifier]
];

export default function tokenize(expression) {
  const tokens = [];
  let index = 0;

  while (index < expression.length) {
    const ch = expression.charAt(index);

    readKeyword(ch, expression, index, (token, skip) => {
      if (token) {
        token && tokens.push(token);
        return (index = skip);
      }

      const tokenizer = TOKENIZERS.find(tokenizer => tokenizer[0](ch));
      const evaluate = tokenizer && tokenizer[1];

      if (!evaluate) {
        throw new SyntaxError(`Unknown character ${ch} at ${index}`);
      }

      evaluate(ch, expression, index, (token, skip) => {
        token && tokens.push(token);
        index = skip;
      });
    });
  }

  return tokens;
}
