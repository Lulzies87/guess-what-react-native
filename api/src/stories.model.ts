import { Schema, model } from "mongoose";

export type Story = {
  id: number;
  storyId: string;
  answers: string[];
  points: number;
  date: Date;
};

export const storySchema = new Schema<Story>({
  id: { type: Number, required: true },
  storyId: { type: String, required: true },
  answers: { type: [String], required: true },
  points: { type: Number, required: true },
  date: { type: Schema.Types.Date, required: true },
});

export const StoryModel = model("Story", storySchema, "stories");
