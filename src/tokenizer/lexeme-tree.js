export default class LexemeTree {
  constructor() {
    this.childNodes = {};
  }

  add(lexeme, value) {
    let index = 0;
    let currentNode = this;

    while (index < lexeme.length) {
      const ch = lexeme.charAt(index);
      const nextNode = currentNode.getAt(ch);

      currentNode = nextNode || currentNode.addChildNode(ch);
      index += 1;
    }

    currentNode.lexeme = lexeme;
    currentNode.value = value;
    return this;
  }

  addChildNode(ch) {
    return (this.childNodes[ch] = new LexemeTree());
  }

  getAt(ch) {
    return (this.childNodes[ch] || null);
  }
}
