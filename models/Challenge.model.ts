export type Word = {
  word: string;
  description: {
    wordType: "verb" | "noun" | "adjective";
    wordNumber: "singular" | "plural";
  };
  imageName: string;
};

export type Challenge = {
  storyId: string;
  challengeCreatorId: string;
  chosenWords: {
    firstWord: Word;
    secondWord: Word;
    thirdWord: Word;
    fourthWord: Word;
  };
};
