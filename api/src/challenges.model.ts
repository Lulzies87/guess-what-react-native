import { Schema, model, Types, Document } from "mongoose";

type Word = {
  word: string;
  description: {
    wordType: "verb" | "noun" | "adjective";
    wordNumber: "singular" | "plural";
  };
  imageName: string;
};

export interface Challenge extends Document {
  storyId: Types.ObjectId;
  challengeCreatorId: Types.ObjectId;
  chosenWords: {
    firstWord: Word;
    secondWord: Word;
    thirdWord: Word;
    fourthWord: Word;
  };
}

export const challengeSchema = new Schema<Challenge>({
  storyId: { type: Schema.Types.ObjectId, ref: "Story", required: true },
  challengeCreatorId: { type: Schema.Types.ObjectId, ref: "Player", required: true },
  chosenWords: {
    firstWord: {
      word: { type: String, required: true },
      description: {
        wordType: { type: String, enum: ["verb", "noun", "adjective"], required: true },
        wordNumber: { type: String, enum: ["singular", "plural"], required: true },
      },
      imageName: { type: String, required: true },
    },
    secondWord: {
      word: { type: String, required: true },
      description: {
        wordType: { type: String, enum: ["verb", "noun", "adjective"], required: true },
        wordNumber: { type: String, enum: ["singular", "plural"], required: true },
      },
      imageName: { type: String, required: true },
    },
    thirdWord: {
      word: { type: String, required: true },
      description: {
        wordType: { type: String, enum: ["verb", "noun", "adjective"], required: true },
        wordNumber: { type: String, enum: ["singular", "plural"], required: true },
      },
      imageName: { type: String, required: true },
    },
    fourthWord: {
      word: { type: String, required: true },
      description: {
        wordType: { type: String, enum: ["verb", "noun", "adjective"], required: true },
        wordNumber: { type: String, enum: ["singular", "plural"], required: true },
      },
      imageName: { type: String, required: true },
    },
  },
});

export const ChallengeModel = model<Challenge>("Challenge", challengeSchema, "challenges");