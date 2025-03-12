import { BPlusTree } from "./b+tree";
import { hashName } from "./hashName";

type Data = {
  name: string;
  phone: string;
  hash: number;
};

class Phonebook {
  private bPlusTree: BPlusTree<Data>;

  constructor(treeOdrer: number) {
    this.bPlusTree = new BPlusTree(treeOdrer);
  }

  search(name: string, includeAllThatComeAfter: boolean = false) {
    const hash = hashName(name);
    return this.bPlusTree.search(hash, includeAllThatComeAfter);
  }

  insert(name: string, phone: string) {
    const hash = hashName(name);
    this.bPlusTree.insert(hash, { name, phone, hash });
  }

  delete(name: string) {
    const hash = hashName(name);
    this.bPlusTree.delete(hash);
  }
}

export { Phonebook };
