import { Schema, model } from "mongoose";

type Player = {
  username: string;
  password: string;
  timeRegistered: Date;
  points: number;
  friends: string[];
  pendingChallenges: string[];
};

const playerSchema = new Schema<Player>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  timeRegistered: { type: Schema.Types.Date, default: () => new Date() },
  points: { type: Number, required: true, default: 0 },
  friends: { type: [String], required: true, default: [] },
  pendingChallenges: { type: [String], required: false },
});

export const Player = model<Player>("Player", playerSchema, "players");
