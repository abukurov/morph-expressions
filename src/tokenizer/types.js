export default class TokenType {
  constructor(type, lexeme, value) {
    this.lexeme = lexeme;
    this.value = value;
    this.type = type;
  }

  match(type) {
    return (this.type === type);
  }
}

export const types = {
  CONSTANT: '@type/constant',
  IDENTIFIER: '@type/identifier',
  LOGICAL_EQUALITY: '@type/logical-equality',
  LOGICAL_CONDITION: '@type/logical-condition',
  LOGICAL_OR: '@type/logical-or',
  LOGICAL_AND: '@type/logical-and',
  LOGICAL_NEGATION: '@type/logical-negation',
  ADD_SUBTRACT: '@type/add-subtract',
  INCREASE_DECREASE: '@type/increase-decrease',
  MULTIPLY_DIVIDE: '@type/multiply-divide',
  OPEN_PARENTHESES: '@type/open-parentheses',
  CLOSE_PARENTHESES: '@type/close-parentheses',
  DELIMITER: '@type/delimiter'
};
