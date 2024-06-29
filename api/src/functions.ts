import { Player } from "./players.model";

export async function getUserDataById(id: string) {
  try {
    const user = await Player.findById(id).select("-password");
    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw new Error("Internal server error");
  }
}
