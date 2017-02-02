import Tokenizer from './tokenizer/tokenizer';
import { types } from './tokenizer/types';
import createAbstractSyntaxTree from './abstract-syntax-tree';

export default class Parser {
  constructor() {
    this.functions = {};
    this.properties = {};
  }

  registerFunction(name, handler) {
    if (this.functions[name]) {
      throw new SyntaxError(`Function '${name}' has already been declared`);
    }

    this.functions[name] = handler;
  }

  unRegisterFunction(name) {
    delete this.functions[name];
  }

  registerProperty(name, handler) {
    if (this.properties[name]) {
      throw new SyntaxError(`Property '${name}' has already been declared`);
    }

    this.properties[name] = handler;
  }

  unRegisterProperty(name) {
    delete this.properties[name];
  }

  parse(expression) {
    const options = { identifiers: [] };
    const tokenizer = new Tokenizer(expression);
    const compiled = createAbstractSyntaxTree(tokenizer, options);

    if (!tokenizer.token.match(types.EOF)) {
      throw new SyntaxError('Unexpected end of expression');
    }

    return Object.assign({}, options, {
      eval: scope => compiled(scope, {
        functions: this.functions,
        properties: this.properties
      })
    });
  }

  parseAndEval(expression, scope = {}) {
    return this.parse(expression).eval(scope);
  }
}
