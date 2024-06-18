import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { json } from "body-parser";
import { getConnection, initConnection } from "./dbConnection";
import { Player } from "./players.model";

const app = express();

app.use(cors());
app.use(json());

app.get("/check", (_, res) => {
  res.status(200).json("Hello");
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Both username and password are required" });
    }

    const connection = getConnection();
    const existingUser = await Player.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newPlayer = new Player({
      username,
      password: hashedPassword,
      timeRegistered: new Date(),
      point: 0,
      friends: [],
      savedStories: [],
    });

    await newPlayer.save();
    res.status(201).json({ message: "Player registered!" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function init() {
  await initConnection();

  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

init();
