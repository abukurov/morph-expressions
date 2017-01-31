import { types } from './tokenizer/types';

/**
 * Get object deep propery
 * @return {Function} compiled node
 * @private
 */
function get(resource, path) {
  const [head, ...tail] = path.split('.');

  return resource && head ? get(resource[head], tail.join('.')) : resource;
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
      throw new ReferenceError(`Function '${operand}' isn't declared`);
    }

    return operator(...args);
  };
}

/**
 * Process logical OR operator
 * @return {Function} compiled node
 * @private
 */
function processLogicalOr(tokenizer, scope) {
  let node = processLogicalAnd(tokenizer, scope);

  while (tokenizer.token.match(types.LOGICAL_OR)) {
    node = createOperatorNode(tokenizer.token.value, [node, processLogicalAnd(tokenizer.skipToken(), scope)]);
  }

  return node;
}

/**
 * Process logical AND operator
 * @return {Function} compiled node
 * @private
 */
function processLogicalAnd(tokenizer, scope) {
  let node = processLogicalEquality(tokenizer, scope);

  while (tokenizer.token.match(types.LOGICAL_AND)) {
    node = createOperatorNode(tokenizer.token.value, [node, processLogicalEquality(tokenizer.skipToken(), scope)]);
  }

  return node;
}

/**
 * Process logical equality operators
 * @return {Function} compiled node
 * @private
 */
function processLogicalEquality(tokenizer, scope) {
  let node = processLogicalCondition(tokenizer, scope);

  while (tokenizer.token.match(types.LOGICAL_EQUALITY)) {
    node = createOperatorNode(tokenizer.token.value, [node, processLogicalCondition(tokenizer.skipToken(), scope)]);
  }

  return node;
}

/**
 * Process logical equality operators
 * @return {Function} compiled node
 * @private
 */
function processLogicalCondition(tokenizer, scope) {
  let node = processAddSubtract(tokenizer, scope);

  while (tokenizer.token.match(types.LOGICAL_CONDITION)) {
    node = createOperatorNode(tokenizer.token.value, [node, processAddSubtract(tokenizer.skipToken(), scope)]);
  }

  return node;
}

/**
 * Process math Add or Subtract operators
 * @return {Function} compiled node
 * @private
 */
function processAddSubtract(tokenizer, scope) {
  let node = processMultiplyDivide(tokenizer, scope);

  while (tokenizer.token.match(types.ADD_SUBTRACT)) {
    node = createOperatorNode(tokenizer.token.value, [node, processMultiplyDivide(tokenizer.skipToken(), scope)]);
  }

  return node;
}

/**
 * Process math Multiply, Divide or Modulus operators
 * @return {Function} compiled node
 * @privateR
 */
function processMultiplyDivide(tokenizer, scope) {
  let node = processUnary(tokenizer, scope);

  while (tokenizer.token.match(types.MULTIPLY_DIVIDE)) {
    node = createOperatorNode(tokenizer.token.value, [node, processUnary(tokenizer.skipToken(), scope)]);
  }

  return node;
}

/**
 * Process Unary plus and minus, and negation operators
 * @return {Function} compiled node
 * @private
 */
function processUnary(tokenizer, scope) {
  const unaryAddSubtract = {
    '-': value => -value,
    '+': value => value
  };

  if (tokenizer.token.match(types.ADD_SUBTRACT)) {
    return createOperatorNode(unaryAddSubtract[tokenizer.token.lexeme], [processUnary(tokenizer.skipToken(), scope)]);
  }

  if (tokenizer.token.match(types.INCREASE_DECREASE) || tokenizer.token.match(types.LOGICAL_NEGATION)) {
    return createOperatorNode(tokenizer.token.value, [processUnary(tokenizer.skipToken(), scope)]);
  }

  return processIdentifiers(tokenizer, scope);
}

/**
 * Process custom identifiers and functions
 * @return {Function} compiled node
 * @private
 */
function processIdentifiers(tokenizer, scope) {
  let params = [];

  if (tokenizer.token.match(types.IDENTIFIER)) {
    const identifier = tokenizer.token.value;

    tokenizer.skipToken();

    if (!tokenizer.token.match(types.OPEN_PARENTHESES)) {
      scope.identifiers.push(identifier);

      return createIdentifierNode(identifier);
    }

    params = [];
    tokenizer.skipToken();
    if (!tokenizer.token.match(types.CLOSE_PARENTHESES)) {
      params.push(processLogicalOr(tokenizer, scope));

      while (tokenizer.token.match(types.DELIMITER)) {
        params.push(processLogicalOr(tokenizer.skipToken(), scope));
      }
    }

    if (!tokenizer.token.match(types.CLOSE_PARENTHESES)) {
      throw new SyntaxError('Unexpected end of expression');
    }

    tokenizer.skipToken();
    return createOperatorNode(identifier, params);
  }

  return processConstants(tokenizer, scope);
}

/**
 * Process numeric, and string, and predefined constants
 * @return {Function} compiled node
 * @private
 */
function processConstants(tokenizer, scope) {
  if (tokenizer.token.match(types.CONSTANT)) {
    const node = createConstantNode(tokenizer.token.value);
    tokenizer.skipToken();
    return node;
  }

  return processParentheses(tokenizer, scope);
}

/**
 * Process parentheses expressions
 * @return {Function} compiled node
 * @private
 */
function processParentheses(tokenizer, scope) {
  if (tokenizer.token.match(types.CLOSE_PARENTHESES)) {
    throw new SyntaxError('Unexpected end of expression');
  }

  if (tokenizer.token.match(types.OPEN_PARENTHESES)) {
    const node = processLogicalOr(tokenizer.skipToken(), scope);

    if (!tokenizer.token.match(types.CLOSE_PARENTHESES)) {
      throw new SyntaxError('Unexpected end of expression');
    }

    tokenizer.skipToken();
    return node;
  }

  throw new SyntaxError('Unexpected end of expression');
}

export default processLogicalOr;
