import { Schema, model } from "mongoose";
import { Story, storySchema } from "./stories.model";

type Player = {
  username: string;
  password: string;
  timeRegistered: Date;
  points: number;
  friends: string[];
  savedStories: Story[];
};

const playerSchema = new Schema<Player>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  timeRegistered: { type: Schema.Types.Date, default: () => new Date() },
  points: { type: Number, required: true, default: 0 },
  friends: { type: [String], required: true, default: [] },
  savedStories: { type: [storySchema], required: false },
});

export const Player = model<Player>("Player", playerSchema, "players");
