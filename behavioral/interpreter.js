/**
 * Interpreter (behavioral)
 * Represent a small language as a tree of objects that know how to evaluate themselves.
 *
 * Modern JS: for a tiny language, plain objects plus one `evaluate` function
 * with a `switch` are often clearer than a class per node. Classes are used
 * here so each grammar rule is visible.
 */

// Grammar for feature-flag rules:  expr := term ("or" term)*
//                                  term := atom ("and" atom)*
//                                  atom := "not" atom | name
export class Flag {
  constructor(name) { this.name = name; }
  evaluate(context) { return Boolean(context[this.name]); }
}

export class Not {
  constructor(operand) { this.operand = operand; }
  evaluate(context) { return !this.operand.evaluate(context); }
}

export class And {
  constructor(left, right) { Object.assign(this, { left, right }); }
  evaluate(context) { return this.left.evaluate(context) && this.right.evaluate(context); }
}

export class Or {
  constructor(left, right) { Object.assign(this, { left, right }); }
  evaluate(context) { return this.left.evaluate(context) || this.right.evaluate(context); }
}

// A tiny recursive-descent parser turns text into the tree above.
export function parse(source) {
  const tokens = source.trim().split(/\s+/);
  let i = 0;

  const atom = () => {
    const token = tokens[i++];
    if (token === undefined) throw new SyntaxError('Unexpected end of rule');
    return token === 'not' ? new Not(atom()) : new Flag(token);
  };
  const term = () => {
    let node = atom();
    while (tokens[i] === 'and') { i++; node = new And(node, atom()); }
    return node;
  };
  const expr = () => {
    let node = term();
    while (tokens[i] === 'or') { i++; node = new Or(node, term()); }
    return node;
  };

  const tree = expr();
  if (i < tokens.length) throw new SyntaxError(`Unexpected "${tokens[i]}"`);
  return tree;
}
