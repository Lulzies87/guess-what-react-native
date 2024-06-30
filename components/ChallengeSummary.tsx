import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import server from "../app/api-client";
import { router } from "expo-router";
import { Word } from "@/models/Challenge.model";
import { ThemedText } from "./ThemedText";
import { User } from "@/models/User.model";
import { fetchUserData } from "@/functions/functions";

type ChallengeSummaryProps = {
  storyId: string;
  guessedWords: string[];
  correctWords: Word[];
};

export default function ChallengeSummary({
  storyId,
  guessedWords,
  correctWords,
}: ChallengeSummaryProps) {
  const [userData, setUserData] = useState<User | null>(null);
  const [storyPlot, setStoryPlot] = useState<string | undefined>(undefined);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data);
      } catch (error) {
        console.error("Couldn't fetch user data:", error);
      }
    };

    loadData();
  }, []);

  const getStoryPlot = async (id: string) => {
    try {
      const res = await server.get(`/story/${id}`);
      setStoryPlot(res.data);
    } catch (error) {
      console.error("Failed to fetch story plot:", error);
    }
  };

  const calculateScore = () => {
    let points = 0;
    guessedWords.forEach((word, index) => {
      if (word === correctWords[index].word) {
        points += 25;
      }
      setScore(points);
    });
  };

  useEffect(() => {
    getStoryPlot(storyId);
    calculateScore();
  }, []);

  const renderStory = (storyPlot: string) => {
    const parts = storyPlot.split(/(\$\d+)/g);

    return parts.map((part, index) => {
      if (part.startsWith("$")) {
        const wordIndex = parseInt(part.slice(1), 10);
        const isCorrect =
          guessedWords[wordIndex] === correctWords[wordIndex].word;
        const wordStyle = isCorrect ? styles.correctWord : styles.incorrectWord;
        return (
          <ThemedText key={index} style={wordStyle}>
            {guessedWords[wordIndex]}
          </ThemedText>
        );
      }
      return <ThemedText key={index}>{part}</ThemedText>;
    });
  };

  const handleDone = async () => {
    try {
      await server.patch("/score", {
        userId: userData?._id,
        pointsToAdd: score,
      });
      router.navigate("/mainMenuPage");
    } catch (error) {
      console.error("Couldn't update player score:", error);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title">Your Story</ThemedText>
      <ThemedText style={styles.content}>
        {storyPlot ? renderStory(storyPlot) : "No story found"}
      </ThemedText>
      <ThemedText type="subtitle">Your Score: {score} / 100</ThemedText>

      <Button title="Done" onPress={handleDone} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    paddingVertical: 20,
  },
  content: {
    paddingVertical: 20,
    textAlign: "center",
  },
  correctWord: {
    color: "green",
  },
  incorrectWord: {
    color: "red",
  },
});
