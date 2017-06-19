export default class TokenType {
  constructor(type, lexeme, value) {
    this.lexeme = lexeme;
    this.value = value;
    this.type = type;
  }

  match(...types) {
    return (types.findIndex(type => this.type === type) !== -1);
  }
}

export const types = {
  EOF: '@type/eof',
  DOT: '@type/dot',
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

  OPEN_SQUARE_BRACKET: '@type/open-square-bracket',
  CLOSE_SQUARE_BRACKET: '@type/close-square-bracket',

  DELIMITER: '@type/delimiter'
};
