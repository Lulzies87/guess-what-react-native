import "dotenv/config";

// import { exec } from "child_process";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import { initConnection } from "./dbConnection";
import { Player } from "./players.model";
import { Challenge } from "./challenges.model";
import { Story } from "./stories.model";
import { getUserDataById } from "./functions";

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
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
      process.env.JWT_SECRET!
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
      friends: ["667fa08a7284d4e5e8296d5d"],
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

app.post("/createChallenge", upload.array("images", 4), async (req, res) => {
  try {
    if (!req.files) {
      throw new Error("Files upload failed");
    }

    const files = (req as any).files;
    const imageNames = files.map((file: Express.Multer.File) => file.filename);

    const { storyId, challengeCreatorId, chosenWords, target } = req.body;

    if (!storyId || !challengeCreatorId || !chosenWords || !target) {
      throw new Error("Missing required fields");
    }

    const parsedChosenWords = JSON.parse(chosenWords);

    if (
      Object.keys(parsedChosenWords).length !== 4 ||
      !parsedChosenWords.firstWord ||
      !parsedChosenWords.secondWord ||
      !parsedChosenWords.thirdWord ||
      !parsedChosenWords.fourthWord ||
      !parsedChosenWords.firstWord.word ||
      !parsedChosenWords.secondWord.word ||
      !parsedChosenWords.thirdWord.word ||
      !parsedChosenWords.fourthWord.word
    ) {
      throw new Error("Invalid chosenWords structure");
    }

    const newChallenge = new Challenge({
      storyId,
      challengeCreatorId,
      chosenWords: {
        firstWord: {
          word: parsedChosenWords.firstWord.word,
          description: parsedChosenWords.firstWord.description,
          imageName: imageNames[0],
        },
        secondWord: {
          word: parsedChosenWords.secondWord.word,
          description: parsedChosenWords.secondWord.description,
          imageName: imageNames[1],
        },
        thirdWord: {
          word: parsedChosenWords.thirdWord.word,
          description: parsedChosenWords.thirdWord.description,
          imageName: imageNames[2],
        },
        fourthWord: {
          word: parsedChosenWords.fourthWord.word,
          description: parsedChosenWords.fourthWord.description,
          imageName: imageNames[3],
        },
      },
    });

    const savedChallenge = await newChallenge.save();

    await Player.findByIdAndUpdate(target, {
      $push: { pendingChallenges: savedChallenge._id },
    });

    res.status(201).json({
      message: "Challenge created successfully",
      newChallenge: savedChallenge,
    });

    // const command = "ls -l src/public/images/";
    // exec(command, (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`Error executing the command: ${error.message}`);
    //     return;
    //   }
    //   if (stderr) {
    //     console.error(`Command stderr: ${stderr}`);
    //     return;
    //   }
    //   console.log(`Command output:\n${stdout}`);
    // });
  } catch (error) {
    console.error("Error creating challenge and uploading images:", error);
    res
      .status(500)
      .json({ error: error || "Failed to upload images and create challenge" });
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

    const parsedChallengeData = challengeData.toObject() as {
      chosenWords?: {
        firstWord?: { imageName: string };
        secondWord?: { imageName: string };
        thirdWord?: { imageName: string };
        fourthWord?: { imageName: string };
      };
    };
    const keysToUpdate = [
      "firstWord",
      "secondWord",
      "thirdWord",
      "fourthWord",
    ] as const;

    keysToUpdate.forEach((key) => {
      if (
        parsedChallengeData.chosenWords &&
        parsedChallengeData.chosenWords[key]!.imageName
      ) {
        parsedChallengeData.chosenWords[key]!.imageName = `${
          process.env.SERVER_IMAGES_URL
        }/${parsedChallengeData.chosenWords[key]!.imageName}`;
      }
    });

    res.status(200).json({ parsedChallengeData, storyData });
  } catch (error) {
    console.error("Error fetching challenge data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/pendingChallenge/:id", async (req, res) => {
  const challengeId = req.params.id;
  const { userId } = req.query;

  if (!challengeId) {
    res.status(400).json({ error: "Challenge ID is required" });
  }

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const updatedPlayer = await Player.findByIdAndUpdate(
      userId,
      { $pull: { pendingChallenges: challengeId } },
      { new: true }
    );

    if (!updatedPlayer) {
      return res.status(404).json({ error: "Player not found" });
    }

    res
      .status(200)
      .json({ message: "Pending challenge was deleted from player" });
  } catch (error) {
    console.error("Error deleting challenge:", error);
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

app.get("/randomStory", async (req, res) => {
  try {
    const count = await Story.countDocuments();
    if (count === 0) {
      return res.status(404).json({ error: "No stories found" });
    }

    const random = Math.floor(Math.random() * count);
    const randomStory = await Story.findOne().skip(random);

    if (!randomStory) {
      return res.status(404).json({ error: "Random story not found" });
    }

    res.json(randomStory);
  } catch (error) {
    console.error("Error fetching random story:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/getFriendsList", async (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const user = await Player.findById(userId).select("friends");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const friends = await Player.find({ _id: { $in: user.friends } }).select(
      "username"
    );
    res
      .status(200)
      .json(
        friends.map((friend) => ({ id: friend._id, username: friend.username }))
      );
  } catch (error) {
    console.error("Error fetching friends list:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.patch("/score", async (req, res) => {
  const { userId, pointsToAdd } = req.body;

  if (!userId || typeof pointsToAdd !== "number") {
    return res.status(400).json({ error: "Invalid request data" });
  }

  try {
    const playerToUpdate = await Player.findByIdAndUpdate(
      userId,
      { $inc: { points: pointsToAdd } },
      { new: true }
    );

    if (!playerToUpdate) {
      return res.status(404).json({ error: "Player not found" });
    }

    res.status(200).json({ message: "Player score was updated!" });
  } catch (error) {
    console.error("Error updating points:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

async function init() {
  await initConnection();
  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

init();
