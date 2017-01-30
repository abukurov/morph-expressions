import tokenize from './tokenizer/tokenize';
import createAbstractSyntaxTree from './abstract-syntax-tree';

export default class Parser {
  constructor() {
    this.functions = {};
    this.properties = {};
  }

  registerFunction(name, handler) {
    if (this.functions[name]) {
      throw new Error(`Function ${name} already registered`);
    }

    this.functions[name] = handler;
  }

  unRegisterFunction(name) {
    delete this.functions[name];
  }

  parse(expression) {
    const options = { identifiers: [] };
    const tokens = tokenize(expression);
    const compiled = createAbstractSyntaxTree(tokens, options);

    if (tokens.length !== 0) {
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
