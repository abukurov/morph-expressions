import * as token from './token';
import LexemeTree from './lexeme_tree';

const KEYWORDS = [
  ['true', token.CONSTANT, true],
  ['false', token.CONSTANT, false],
  ['!', token.LOGICAL_NEGATION, value => !value],
  ['--', token.INCREASE_DECREASE, value => --value],
  ['++', token.INCREASE_DECREASE, value => ++value],
  ['||', token.LOGICAL_OR, (left, right) => left || right],
  ['&&', token.LOGICAL_AND, (left, right) => left && right],
  ['>', token.LOGICAL_CONDITION, (left, right) => left > right],
  ['>=', token.LOGICAL_CONDITION, (left, right) => left >= right],
  ['<', token.LOGICAL_CONDITION, (left, right) => left < right],
  ['<=', token.LOGICAL_CONDITION, (left, right) => left <= right],
  ['==', token.LOGICAL_EQUALITY, (left, right) => left === right],
  ['!=', token.LOGICAL_EQUALITY, (left, right) => left !== right],
  ['-', token.ADD_SUBTRACT, (left, right) => left - right],
  ['+', token.ADD_SUBTRACT, (left, right) => left + right],
  ['*', token.MULTIPLY_DIVIDE, (left, right) => left * right],
  ['/', token.MULTIPLY_DIVIDE, (left, right) => left / right],
  ['%', token.MULTIPLY_DIVIDE, (left, right) => left % right],
  ['(', token.OPEN_PARENTHESES],
  [')', token.CLOSE_PARENTHESES],
  [',', token.DELIMITER],
  [';', token.DELIMITER]
];

const keywordsTree = new LexemeTree();

KEYWORDS.forEach(([lexeme, tokenType, value]) =>
  keywordsTree.add(lexeme, token.create(tokenType, lexeme, value)));

export default keywordsTree;
