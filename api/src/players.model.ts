import { Schema, model } from "mongoose";
import { challengeSchema } from "./challenges.model";

type Player = {
  username: string;
  password: string;
  timeRegistered: Date;
  points: number;
  friends: string[];
  pendingChallenges: Object[];
};

const playerSchema = new Schema<Player>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  timeRegistered: { type: Schema.Types.Date, default: () => new Date() },
  points: { type: Number, required: true, default: 0 },
  friends: { type: [String], required: true, default: [] },
  pendingChallenges: { type: [challengeSchema], required: false },
});

export const Player = model<Player>("Player", playerSchema, "players");
