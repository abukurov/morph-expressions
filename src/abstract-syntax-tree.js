import { types } from './tokenizer/types';

/**
 * Get object deep propery
 * @return {Function} compiled node
 * @private
 */
function get(resource, path) {
  const parts = path.split('.');
  let current = resource;

  parts.forEach((part) => {
    if (part in current) {
      return (current = current[part]);
    }

    return false;
  });

  return current;
}

/**
 * Create constant tree node
 * @return {Function} compiled node
 * @private
 */
export function createConstantNode(constant) {
  return () => constant;
}

/**
 * Create identifier tree node
 * @return {Function} compiled node
 * @private
 */
function createIdentifierNode(propertyName) {
  return scope => get(scope, propertyName);
}

/**
 * Create operator tree node
 * @return {Function} compiled node
 * @private
 */
function createOperatorNode(operand, nodes = []) {
  return (scope, opts) => {
    const args = nodes.map(node => node(scope, opts));

    if (typeof operand === 'function') {
      return operand(...args);
    }

    const operator = get(opts.functions, operand);

    if (!operator) {
      throw new ReferenceError(`Unregistered function ${operand}`);
    }

    return operator(...args);
  };
}

/**
 * Process logical OR operator
 * @return {Function} compiled node
 * @private
 */
function processLogicalOr(tokens, scope) {
  let node = processLogicalAnd(tokens, scope);
  let token = tokens[0];

  while (token && token.match(types.LOGICAL_OR)) {
    tokens.shift();
    node = createOperatorNode(token.value, [node, processLogicalAnd(tokens, scope)]);
    token = tokens[0];
  }

  return node;
}

/**
 * Process logical AND operator
 * @return {Function} compiled node
 * @private
 */
function processLogicalAnd(tokens, scope) {
  let node = processLogicalEquality(tokens, scope);
  let token = tokens[0];

  while (token && token.match(types.LOGICAL_AND)) {
    tokens.shift();
    node = createOperatorNode(token.value, [node, processLogicalEquality(tokens, scope)]);
    token = tokens[0];
  }

  return node;
}

/**
 * Process logical equality operators
 * @return {Function} compiled node
 * @private
 */
function processLogicalEquality(tokens, scope) {
  let node = processLogicalCondition(tokens, scope);
  let token = tokens[0];

  while (token && token.match(types.LOGICAL_EQUALITY)) {
    tokens.shift();
    node = createOperatorNode(token.value, [node, processLogicalCondition(tokens, scope)]);
    token = tokens[0];
  }

  return node;
}

/**
 * Process logical equality operators
 * @return {Function} compiled node
 * @private
 */
function processLogicalCondition(tokens, scope) {
  let node = processAddSubtract(tokens, scope);
  let token = tokens[0];

  while (token && token.match(types.LOGICAL_CONDITION)) {
    tokens.shift();
    node = createOperatorNode(token.value, [node, processAddSubtract(tokens, scope)]);
    token = tokens[0];
  }

  return node;
}

/**
 * Process math Add or Subtract operators
 * @return {Function} compiled node
 * @private
 */
function processAddSubtract(tokens, scope) {
  let node = processMultiplyDivide(tokens, scope);
  let token = tokens[0];

  while (token && token.match(types.ADD_SUBTRACT)) {
    tokens.shift();
    node = createOperatorNode(token.value, [node, processMultiplyDivide(tokens, scope)]);
    token = tokens[0];
  }

  return node;
}

/**
 * Process math Multiply, Divide or Modulus operators
 * @return {Function} compiled node
 * @private
 */
function processMultiplyDivide(tokens, scope) {
  let node = processUnary(tokens, scope);
  let token = tokens[0];

  while (token && token.match(types.MULTIPLY_DIVIDE)) {
    tokens.shift();
    node = createOperatorNode(token.value, [node, processUnary(tokens, scope)]);
    token = tokens[0];
  }

  return node;
}

/**
 * Process Unary plus and minus, and negation operators
 * @return {Function} compiled node
 * @private
 */
function processUnary(tokens, scope) {
  const token = tokens[0];
  const unaryAddSubtract = {
    '-': value => -value,
    '+': value => value
  };

  if (token && token.match(types.ADD_SUBTRACT)) {
    tokens.shift();
    return createOperatorNode(unaryAddSubtract[token.lexeme], [processUnary(tokens, scope)]);
  }

  if (token && (token.match(types.INCREASE_DECREASE) || token.match(types.LOGICAL_NEGATION))) {
    tokens.shift();
    return createOperatorNode(token.value, [processUnary(tokens, scope)]);
  }

  return processIdentifiers(tokens, scope);
}

/**
 * Process custom identifiers and functions
 * @return {Function} compiled node
 * @private
 */
function processIdentifiers(tokens, scope) {
  let token = tokens[0];
  let params = [];

  if (token && token.match(types.IDENTIFIER)) {
    const identifier = token.value;

    tokens.shift();
    token = tokens[0];

    if (!(token && token.match(types.OPEN_PARENTHESES))) {
      scope.identifiers.push(identifier);

      return createIdentifierNode(identifier);
    }

    params = [];
    tokens.shift();
    token = tokens[0];

    if (!(token && token.match(types.CLOSE_PARENTHESES))) {
      params.push(processLogicalOr(tokens, scope));
      token = tokens[0];

      while (token && token.match(types.DELIMITER)) {
        tokens.shift();
        params.push(processLogicalOr(tokens, scope));
        token = tokens[0];
      }
    }

    token = tokens[0];
    if (!token && token.match(types.CLOSE_PARENTHESES)) {
      throw new SyntaxError('Parenthesis ) expected');
    }

    tokens.shift();
    return createOperatorNode(identifier, params);
  }

  return processConstants(tokens, scope);
}

/**
 * Process numeric, and string, and predefined constants
 * @return {Function} compiled node
 * @private
 */
function processConstants(tokens, scope) {
  const token = tokens[0];

  if (token && token.match(types.CONSTANT)) {
    tokens.shift();
    return createConstantNode(token.value);
  }

  return processParentheses(tokens, scope);
}

/**
 * Process parentheses expressions
 * @return {Function} compiled node
 * @private
 */
function processParentheses(tokens = [], scope) {
  let token = tokens[0];

  if (token && token.match(types.CLOSE_PARENTHESES)) {
    throw new SyntaxError('Unexpected end of expression');
  }

  if (token && token.match(types.OPEN_PARENTHESES)) {
    tokens.shift();
    const node = processLogicalOr(tokens, scope);
    token = tokens[0];

    if (!(token && token.match(types.CLOSE_PARENTHESES))) {
      throw new SyntaxError('Unexpected end of expression');
    }

    tokens.shift();
    return node;
  }

  throw new SyntaxError('Unexpected end of expression');
}

export default processLogicalOr;
