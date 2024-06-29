import "dotenv/config";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import multer from "multer";
import path from "path";
import fs from "fs";
import bodyParser, { json } from "body-parser";
import { initConnection } from "./dbConnection";
import { Player } from "./players.model";
import { Challenge } from "./challenges.model";
import { Story } from "./stories.model";

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

app.get("/check", (_, res) => {
  res.json({ message: "Server is up and running" });
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
      pendingChallenges: [],
    });

    await newPlayer.save();
    res.status(201).json({ message: "Player registered!" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// app.post("/challenge", upload.array("images", 4), async (req, res) => {
//   try {
//     const { storyId, challengeCreatorId, chosenWords } = req.body;

//     if (!storyId || !challengeCreatorId || !chosenWords) {
//       throw new Error("Missing required fields");
//     }

//     if (
//       Object.keys(chosenWords).length !== 4 ||
//       !chosenWords.firstWord ||
//       !chosenWords.secondWord ||
//       !chosenWords.thirdWord ||
//       !chosenWords.fourthWord
//     ) {
//       throw new Error("Invalid chosenWords structure");
//     }

//     const images = req.files as Express.Multer.File[];
//     if (images.length !== 4) {
//       throw new Error("Exactly 4 images are required");
//     }

//     const mappedWords = [
//       { word: chosenWords.firstWord, image: images[0]?.filename },
//       { word: chosenWords.secondWord, image: images[1]?.filename },
//       { word: chosenWords.thirdWord, image: images[2]?.filename },
//       { word: chosenWords.fourthWord, image: images[3]?.filename },
//     ];

//     const newChallenge = new ChallengeModel({
//       storyId,
//       challengeCreatorId,
//       chosenWords: {
//         firstWord: {
//           ...mappedWords[0].word,
//           imageName: mappedWords[0].image,
//         },
//         secondWord: {
//           ...mappedWords[1].word,
//           imageName: mappedWords[1].image,
//         },
//         thirdWord: {
//           ...mappedWords[2].word,
//           imageName: mappedWords[2].image,
//         },
//         fourthWord: {
//           ...mappedWords[3].word,
//           imageName: mappedWords[3].image,
//         },
//       },
//     });

//     const savedChallenge = await newChallenge.save();

//     console.log("New challenge created:", savedChallenge);
//     res.status(201).json({
//       message: "Challenge created successfully",
//       newChallenge: savedChallenge,
//     });
//   } catch (error) {
//     console.error("Error creating challenge:", error);
//     res.status(500).json({ error: "Failed to create challenge" });
//   }
// });

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

async function init() {
  await initConnection();

  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

init();
