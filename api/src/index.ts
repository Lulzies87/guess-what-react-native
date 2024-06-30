import "dotenv/config";

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import bodyParser, { json } from "body-parser";
import { initConnection } from "./dbConnection";
import { Player } from "./players.model";
import { Challenge } from "./challenges.model";
import { Story } from "./stories.model";
import { getUserDataById } from "./functions";

const app = express();

app.use(bodyParser.json());
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

interface AuthRequest extends Request {
  user?: { id: string; username: string };
}

const authenticationToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get(
  "/userData",
  authenticationToken,
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      const userData = await getUserDataById(req.user.id);

      if (!userData) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

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
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return res.status(200).json(token);
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
      points: 0,
      friends: [],
      pendingChallenges: [],
    });

    await newPlayer.save();

    const token = jwt.sign(
      { id: newPlayer._id, username: newPlayer.username },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.status(201).json(token);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/upload", upload.array("images", 4), (req, res) => {
  try {
    console.log("Image uploaded successfully");
    res.status(200).json({ message: "image uploaded" });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

app.post("/challenge", async (req, res) => {
  try {
    const { storyId, challengeCreatorId, chosenWords } = req.body;

    if (!storyId || !challengeCreatorId || !chosenWords) {
      throw new Error("Missing required fields");
    }

    if (
      Object.keys(chosenWords).length !== 4 ||
      !chosenWords.firstWord ||
      !chosenWords.secondWord ||
      !chosenWords.thirdWord ||
      !chosenWords.fourthWord ||
      !chosenWords.firstWord.word ||
      !chosenWords.secondWord.word ||
      !chosenWords.thirdWord.word ||
      !chosenWords.fourthWord.word ||
      !chosenWords.firstWord.imageName ||
      !chosenWords.secondWord.imageName ||
      !chosenWords.thirdWord.imageName ||
      !chosenWords.fourthWord.imageName
    ) {
      throw new Error("Invalid chosenWords structure");
    }

    const newChallenge = new Challenge({
      storyId,
      challengeCreatorId,
      chosenWords: {
        firstWord: {
          word: chosenWords.firstWord.word,
          description: chosenWords.firstWord.description,
          imageName: chosenWords.firstWord.imageName,
        },
        secondWord: {
          word: chosenWords.secondWord.word,
          description: chosenWords.secondWord.description,
          imageName: chosenWords.secondWord.imageName,
        },
        thirdWord: {
          word: chosenWords.thirdWord.word,
          description: chosenWords.thirdWord.description,
          imageName: chosenWords.thirdWord.imageName,
        },
        fourthWord: {
          word: chosenWords.fourthWord.word,
          description: chosenWords.fourthWord.description,
          imageName: chosenWords.fourthWord.imageName,
        },
      },
    });

    const savedChallenge = await newChallenge.save();

    console.log("New challenge created:", savedChallenge);
    res.status(201).json({
      message: "Challenge created successfully",
      newChallenge: savedChallenge,
    });
  } catch (error) {
    console.error("Error creating challenge:", error);
    res.status(500).json({ error: "Failed to create challenge" });
  }
});

app.post("/upload", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      throw new Error("File upload failed");
    }
    console.log("Image uploaded!", req.file);
    res.status(200).json({ fileName: req.file!.filename });
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
