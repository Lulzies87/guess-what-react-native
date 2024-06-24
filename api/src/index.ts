import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import { json } from "body-parser";
import { initConnection } from "./dbConnection";
import { Player } from "./players.model";
import path from "path";
import fs from "fs";

const app = express();

app.use(cors());
app.use(json());

app.get("/check", (_, res) => {
  res.status(200).json("Hello");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Both username and password are required" });
  }

  try {
    const userData = await Player.findOne({ username: username });
    if (!userData) {
      return res
        .status(401)
        .json({ error: "Username / Password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Username / Password is incorrect" });
    }

    const { password: userPassword, ...user } = userData.toObject();

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Both username and password are required" });
    }

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

app.post("/upload", (req, res) => {
  const imageData = req.body.imageData;
  const buffer = Buffer.from(imageData, "base64");
  const fileName = `image_${Date.now()}.jpg`;
  const filePath = path.join(__dirname, "public", "images", fileName);

  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error("Error saving image:", err);
      return res.status(500).json({ error: "Failed to save image" });
    }

    console.log("Image saved successfully");
    res.status(200).json({ fileName });
  });
});

async function init() {
  await initConnection();

  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

init();
