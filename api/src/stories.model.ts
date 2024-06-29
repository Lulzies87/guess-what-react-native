import { Schema, model } from "mongoose";

export type Story = {
  plot: string;
};

export const storySchema = new Schema<Story>({
  plot: { type: String, required: true },
});

export const Story = model("Story", storySchema, "stories");
