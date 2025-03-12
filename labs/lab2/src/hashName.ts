class HashError extends Error {
  constructor(message: string) {
    super(message);
  }
}

const RAW_DICTIONARY: Array<[string, number]> = [
  ["аб", 1],
  ["вгд", 2],
  ["еєжз", 3],
  ["иіїй", 4],
  ["клмн", 5],
  ["опр", 6],
  ["сту", 7],
  ["фхцчшщь", 8],
  ["юя", 9],
];

const DICTIONARY = new Map(
  RAW_DICTIONARY.flatMap(([letters, value]) =>
    letters.split("").map((letter) => [letter, value])
  )
);

const MAX_NAME_LENGTH = 16;

const hashName = (name: string): number => {
  if (name.length > MAX_NAME_LENGTH) {
    throw new HashError(
      `Name length should be less than or equal ${MAX_NAME_LENGTH}!`
    );
  }

  const trailingZeros = new Array(MAX_NAME_LENGTH - name.length).fill(0);

  const hash = Number(
    name
      .toLocaleLowerCase()
      .split("")
      .map((letter) => {
        const code = DICTIONARY.get(letter);
        if (code === undefined) {
          throw new HashError(
            `Name contains letter '${letter}' which is not supported!`
          );
        }

        return code;
      })
      .concat(...trailingZeros)
      .join("")
  );

  return hash;
};

export { hashName };
