  export type ValueOfKey<T, K extends keyof T> = T[K];

export type WordDescription = {
  wordType: "verb" | "noun" | "adjective";
  number?: "singular" | "plural";
};

export type Word = {
  word: string;
  description: WordDescription;
  picture: string;
};

export type Words = {
  firstWord: Word;
  secondWord: Word;
  thirdWord: Word;
  fourthWord: Word;
};
