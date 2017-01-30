export const CONSTANT = 'type/constant';
export const IDENTIFIER = 'type/identifier';
export const LOGICAL_EQUALITY = 'type/logical-equality';
export const LOGICAL_CONDITION = 'type/logical-condition';
export const LOGICAL_OR = 'type/logical-or';
export const LOGICAL_AND = 'type/logical-and';
export const LOGICAL_NEGATION = 'type/logical-negation';
export const ADD_SUBTRACT = 'type/add-subtract';
export const INCREASE_DECREASE = 'type/increase-decrease';
export const MULTIPLY_DIVIDE = 'type/multiply-divide';
export const OPEN_PARENTHESES = 'type/open-parentheses';
export const CLOSE_PARENTHESES = 'type/close-parentheses';
export const DELIMITER = 'type/delimiter';

export function create(tokenType, lexeme, value) {
  return {
    tokenType,
    lexeme,
    value
  };
}

export function match(token, tokenType) {
  return token && (token.tokenType === tokenType);
}
