interface TreeNode<D> {
  search: (key: number, includeAllThatComeAfter: boolean) => D[];
  insert: (order: number, key: number, data: D) => [number, TreeNode<D>] | [];
  delete: (order: number, key: number) => boolean;
  keysN: number;
  minKey: number;
  printableFormat: object;
}

type LeafEntry<D> = {
  key: number;
  data: D;
};

class Leaf<D> implements TreeNode<D> {
  entries: LeafEntry<D>[];
  nextLeaf: Leaf<D> | undefined;

  constructor(entries: LeafEntry<D>[] = []) {
    this.entries = entries;
  }

  get keysN(): number {
    return this.entries.length;
  }

  get minKey(): number {
    return this.entries[0]!.key;
  }

  get printableFormat(): object {
    return { keys: this.entries.map((entry) => entry.key) };
  }

  search(key: number, includeAllThatComeAfter: boolean): D[] {
    if (includeAllThatComeAfter) {
      const entries = this.entries.filter((entry) => entry.key >= key);
      return [...entries, ...this.allThatComeAfter].map((entry) => entry.data);
    }

    const entries = this.entries.filter((entry) => entry.key === key);
    return entries.map((entry) => entry.data);
  }

  private get allThatComeAfter(): LeafEntry<D>[] {
    return this.nextLeaf
      ? [...this.nextLeaf.entries, ...this.nextLeaf.allThatComeAfter]
      : [];
  }

  insert(order: number, key: number, data: D): [number, Leaf<D>] | [] {
    let i = 0;
    while (i < this.keysN && this.entries[i]!.key <= key) i++;
    this.entries.splice(i, 0, { key, data });

    const maxEntriesN = order - 1;
    if (this.keysN > maxEntriesN) {
      return this.split();
    }

    return [];
  }

  private split(): [number, Leaf<D>] {
    const mid = Math.floor(this.keysN / 2);
    const newNodeEntries = this.entries.splice(mid);
    const newNode = new Leaf(newNodeEntries);
    const newKey = newNodeEntries[0]!.key;
    this.nextLeaf = newNode;
    return [newKey, newNode];
  }

  delete(_order: number, key: number): boolean {
    const i = this.entries.findIndex((entry) => entry.key === key);
    if (i !== -1) {
      this.entries.splice(i, 1);
      return true;
    }
    return false;
  }
}

class InternalNode<D> implements TreeNode<D> {
  keys: number[];
  children: TreeNode<D>[];

  constructor(keys: number[] = [], children: TreeNode<D>[] = []) {
    this.keys = keys;
    this.children = children;
  }

  get keysN(): number {
    return this.keys.length;
  }

  get minKey(): number {
    return this.children[0]!.minKey;
  }

  get printableFormat(): object {
    return {
      keys: this.keys,
      children: this.children.map((child) => child.printableFormat),
    };
  }

  search(key: number, includeAllThatComeAfter: boolean): D[] {
    let i = 0;
    while (i < this.keysN && this.keys[i]! <= key) i++;
    /* Ideally I must found all the childs which holds the key, not only the last one */
    return this.children[i]!.search(key, includeAllThatComeAfter);
  }

  insert(order: number, key: number, data: D): [number, InternalNode<D>] | [] {
    let i = 0;
    while (i < this.keysN && (this.keys[i] as number) <= key) i++;
    const [newKey, newNode] = this.children[i]!.insert(order, key, data);

    if (newKey === undefined || newNode === undefined) {
      return [];
    }

    this.keys.splice(i, 0, newKey);
    this.children.splice(i + 1, 0, newNode);

    const maxKeysN = order - 1;
    if (this.keysN > maxKeysN) {
      return this.split();
    }

    return [];
  }

  private split(): [number, InternalNode<D>] {
    const mid = Math.floor(this.keysN / 2);
    const newNodeKeys = this.keys.splice(mid);
    const newKey = newNodeKeys[0] as number;
    const newNodeChildren = this.children.splice(mid + 1);
    const newNode = new InternalNode(newNodeKeys.slice(1), newNodeChildren);
    return [newKey, newNode];
  }

  delete(order: number, key: number): boolean {
    let i = 0;
    while (i < this.keysN && this.keys[i]! <= key) i++;

    const child = this.children[i]!;
    if (!child.delete(order, key)) {
      return false;
    }

    const minKeysN = Math.floor((order - 1) / 2);
    if (child.keysN < minKeysN) {
      const leftSibling = this.children[i - 1];
      const rightSibling = this.children[i + 1];
      if (rightSibling) {
        if (rightSibling.keysN > minKeysN) {
          this.borrowFromRight(i);
        } else {
          this.mergeWithRight(i);
        }
      } else if (leftSibling) {
        if (leftSibling.keysN > minKeysN) {
          this.borrowFromLeft(i);
        } else {
          this.mergeWithRight(i - 1);
        }
      }
    } else {
      if (i > 0 && this.keys[i - 1]! === key) {
        this.keys[i - 1] = child.minKey;
      }
    }

    return true;
  }

  private borrowFromLeft(childI: number) {
    const child = this.children[childI]!;
    const left = this.children[childI - 1]!;

    if (left instanceof Leaf && child instanceof Leaf) {
      child.entries.unshift(left.entries.pop()!);
      this.keys[childI - 1] = child.entries[0]!.key;
    } else if (left instanceof InternalNode && child instanceof InternalNode) {
      child.keys.unshift(this.keys[childI - 1]!);
      this.keys[childI - 1] = left.keys.pop()!;
      child.children.unshift(left.children.pop()!);
    }
  }

  private borrowFromRight(childI: number) {
    const child = this.children[childI]!;
    const right = this.children[childI + 1]!;

    if (right instanceof Leaf && child instanceof Leaf) {
      child.entries.push(right.entries.shift()!);
      if (childI > 0) this.keys[childI - 1] = child.entries[0]!.key;
      this.keys[childI] = right.entries[0]!.key;
    } else if (right instanceof InternalNode && child instanceof InternalNode) {
      child.keys.push(this.keys[childI]!);
      this.keys[childI] = right.keys.shift()!;
      child.children.push(right.children.shift()!);
    }
  }

  private mergeWithRight(i: number) {
    const child = this.children[i]!;
    const right = this.children[i + 1]!;

    if (child instanceof Leaf && right instanceof Leaf) {
      child.nextLeaf = right.nextLeaf;
      child.entries.push(...right.entries);
      this.keys.splice(i, 1);
      this.children.splice(i + 1, 1);
    } else if (child instanceof InternalNode && right instanceof InternalNode) {
      this.keys.splice(i + 1, 0, ...right.keys);
      this.keys.splice(i, 0, ...child.keys);
      this.children.splice(i, 2, ...child.children, ...right.children);
    }
  }
}

class BPlusTree<D> {
  private root: TreeNode<D>;
  private order: number;

  constructor(order: number) {
    this.root = new Leaf();
    this.order = order;
  }

  search(key: number, includeAllThatComeAfter: boolean): D[] {
    return this.root.search(key, includeAllThatComeAfter);
  }

  insert(key: number, data: D) {
    const [newKey, newNode] = this.root.insert(this.order, key, data);

    if (newKey === undefined || newNode === undefined) {
      return;
    }

    const newRoot = new InternalNode([newKey], [this.root, newNode]);

    this.root = newRoot;
  }

  delete(key: number) {
    this.root.delete(this.order, key);
  }

  print(depth: number = 5) {
    console.dir(this.root.printableFormat, { depth });
  }
}

export { BPlusTree, InternalNode, Leaf };
