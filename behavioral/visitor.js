/**
 * Visitor (behavioral)
 * Add new operations to a set of object types without changing those types.
 *
 * Modern JS: without method overloading, double dispatch is done with an
 * `accept` method that calls `visitor[node.type]`. For plain data trees, a
 * `switch` on a `type` field is the lighter-weight equivalent.
 */

// A file-system tree. The node classes stay fixed; operations come from outside.
export class File {
  type = 'file';
  constructor(name, bytes) { Object.assign(this, { name, bytes }); }
  accept(visitor) { return visitor.file(this); }
}

export class Folder {
  type = 'folder';
  constructor(name, children = []) { Object.assign(this, { name, children }); }
  accept(visitor) { return visitor.folder(this); }
}

// Each visitor is one operation across every node type.
export const sizeVisitor = {
  file: (file) => file.bytes,
  folder(folder) {
    return folder.children.reduce((sum, child) => sum + child.accept(this), 0);
  },
};

export const listingVisitor = (indent = '') => ({
  file: (file) => [`${indent}${file.name}`],
  folder: (folder) => [
    `${indent}${folder.name}/`,
    ...folder.children.flatMap((child) => child.accept(listingVisitor(`${indent}  `))),
  ],
});
