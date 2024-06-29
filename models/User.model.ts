export type User = {
  _id: string;
  username: string;
  timeRegistered: Date;
  points: number;
  friends: string[];
  pendingChallenges: string[];
};
