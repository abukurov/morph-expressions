import TokenType, { types } from './types';
import LexemeTree from './lexeme-tree';

const KEYWORDS = [
  new TokenType(types.DOT, '.', true),

  new TokenType(types.CONSTANT, 'true', true),
  new TokenType(types.CONSTANT, 'false', false),

  new TokenType(types.LOGICAL_NEGATION, '!', value => !value),
  new TokenType(types.INCREASE_DECREASE, '--', value => value - 1),
  new TokenType(types.INCREASE_DECREASE, '++', value => value + 1),

  new TokenType(types.LOGICAL_OR, '||', (left, right) => left || right),
  new TokenType(types.LOGICAL_AND, '&&', (left, right) => left && right),

  new TokenType(types.LOGICAL_CONDITION, '>', (left, right) => left > right),
  new TokenType(types.LOGICAL_CONDITION, '>=', (left, right) => left >= right),
  new TokenType(types.LOGICAL_CONDITION, '<', (left, right) => left < right),
  new TokenType(types.LOGICAL_CONDITION, '<=', (left, right) => left <= right),

  new TokenType(types.LOGICAL_EQUALITY, '!=', (left, right) => left !== right),
  new TokenType(types.LOGICAL_EQUALITY, '==', (left, right) => left === right),

  new TokenType(types.ADD_SUBTRACT, '-', (left, right) => left - right),
  new TokenType(types.ADD_SUBTRACT, '+', (left, right) => left + right),

  new TokenType(types.MULTIPLY_DIVIDE, '*', (left, right) => left * right),
  new TokenType(types.MULTIPLY_DIVIDE, '/', (left, right) => left / right),
  new TokenType(types.MULTIPLY_DIVIDE, '%', (left, right) => left % right),

  new TokenType(types.OPEN_PARENTHESES, '(', null),
  new TokenType(types.CLOSE_PARENTHESES, ')', null),

  new TokenType(types.OPEN_SQUARE_BRACKET, '[', null),
  new TokenType(types.CLOSE_SQUARE_BRACKET, ']', null),

  new TokenType(types.DELIMITER, ',', null),
  new TokenType(types.DELIMITER, ';', null)
];

const keywordsTree = new LexemeTree();

KEYWORDS.forEach(token => keywordsTree.add(token.lexeme, token));

export default keywordsTree;
