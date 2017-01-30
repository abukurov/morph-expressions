import tokenize from './tokenize';
import createSyntaxTree from './create_syntax_tree';

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

  registerProperty(name, property) {
    if (this.properties[name]) {
      throw new Error(`Computed property ${name} already registered`);
    }

    this.properties[name] = property;
  }

  unregisterFunction(name) {
    delete this.functions[name];
  }

  unregisterProperty(name) {
    delete this.properties[name];
  }

  parse(expression) {
    const tokens = tokenize(expression);
    const options = {};
    const compiled = createSyntaxTree(tokens, options);

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
