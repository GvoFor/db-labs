import { readFileSync } from "node:fs";
import { Phonebook } from "./phonebook";

const PATH_TO_INITIAL_PHONEBOOK_DATA = "data/phonebook.csv";
const TREE_ORDER = 4;

const file = readFileSync(PATH_TO_INITIAL_PHONEBOOK_DATA);
const initialData = file
  .toString()
  .split(/\r?\n/)
  .map((line) => line.split(/\s*,\s*/));

const phonebook = new Phonebook(TREE_ORDER);

for (const [name, phone] of initialData) {
  if (name !== undefined && phone !== undefined) {
    phonebook.insert(name, phone);
  }
}

console.log(phonebook.search("Васи", true));
