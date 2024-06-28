import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import { json } from "body-parser";
import { initConnection } from "./dbConnection";
import { Player } from "./players.model";
import { Challenge } from "./challenges.model";
import { Story } from "./stories.model";

const app = express();

app.use(cors());
app.use(json());
app.use("/images", express.static(path.join(__dirname, "public", "images")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "public", "images");
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

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
      pendingChallenges: [],
    });

    await newPlayer.save();
    res.status(201).json({ message: "Player registered!" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      throw new Error("File upload failed");
    }

    const fileName = req.file.filename;
    const filePath = path.join(__dirname, "public", "images", fileName);

    console.log("Image uploaded!", req.file);
    res.status(200).json({ fileName, filePath });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error uploading image:", error.message);
      res.status(500).json({ error: "Failed to upload image" });
    } else {
      console.error("Unexpected error:", error);
      res.status(500).json({ error: "Unexpected error occurred" });
    }
  }
});

app.get("/challenge/:id", async (req, res) => {
  const challengeId = req.params.id;

  if (!challengeId) {
    res.status(400).json({ error: "Challenge ID is required" });
  }

  try {
    const challengeData = await Challenge.findById(challengeId).select("-_id");

    if (!challengeData) {
      return res.status(404).json({ error: "Challenge not found" });
    }

    const storyData = await Story.findById(challengeData.storyId).select(
      "-_id"
    );

    res.status(200).json({ challengeData, storyData });
  } catch (error) {
    console.error("Error fetching challenge data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/story/:id", async (req, res) => {
  const storyId = req.params.id;

  if (!storyId) {
    res.status(400).json({ error: "Story ID is required" });
  }

  try {
    const storyData = await Story.findById(storyId).select("-id");

    res.status(200).json(storyData?.plot);
  } catch (error) {
    console.error("Error fetching story data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function init() {
  await initConnection();

  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

init();
