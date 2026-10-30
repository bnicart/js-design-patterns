/**
 * Template Method (behavioral)
 * Fix the steps of an algorithm in a base class and let subclasses fill in some of them.
 *
 * Modern JS: passing the varying steps in as functions (or an options
 * object of hooks) gives the same result without inheritance. The class
 * form is shown because frameworks still use it, e.g. lifecycle methods.
 */

export class DataExporter {
  // The template: the order of steps never changes.
  export(rows) {
    const selected = rows.filter((row) => this.include(row));
    return [this.header(), ...selected.map((row) => this.formatRow(row)), this.footer()]
      .filter((part) => part !== null)
      .join('\n');
  }

  // Hooks with defaults: subclasses may override them.
  include() { return true; }
  header() { return null; }
  footer() { return null; }

  // Required step: subclasses must supply it.
  formatRow() {
    throw new Error(`${this.constructor.name} must implement formatRow()`);
  }
}

export class CsvExporter extends DataExporter {
  header() { return 'name,email'; }
  formatRow(row) { return `${row.name},${row.email}`; }
}

export class ActiveUsersMarkdown extends DataExporter {
  include(row) { return row.active; }
  header() { return '| Name |\n| --- |'; }
  formatRow(row) { return `| ${row.name} |`; }
}
