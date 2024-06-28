import { Schema, model } from "mongoose";

type Word = {
  word: string;
  description: {
    wordType: "verb" | "noun" | "adjective";
    wordNumber: "singular" | "plural";
  };
  imageName: string;
};

type Challenge = {
  storyId: string;
  challengeCreatorId: string;
  chosenWords: {
    firstWord: Word;
    secondWord: Word;
    thirdWord: Word;
    fourthWord: Word;
  };
};

export const challengeSchema = new Schema<Challenge>({
  storyId: { type: String, required: true },
  challengeCreatorId: { type: String, required: true },
  chosenWords: { type: Object, required: true },
});

export const Challenge = model("Challenge", challengeSchema, "challenges");
