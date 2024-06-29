import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import server from "../app/api-client";
import { Word } from "@/models/Challenge.model";
import { ThemedText } from "./ThemedText";

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
  const [storyPlot, setStoryPlot] = useState<string | undefined>(undefined);

  const getStoryPlot = async (id: string) => {
    try {
      const res = await server.get(`/story/${id}`);
      setStoryPlot(res.data);
    } catch (error) {
      console.error("Failed to fetch story plot:", error);
    }
  };

  useEffect(() => {
    getStoryPlot(storyId);
  });

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

  const calculateScore = () => {
    let score = 0;
    guessedWords.forEach((word, index) => {
      if (word === correctWords[index].word) {
        score += 25;
      }
    });
    return score;
  };

  const score: number = calculateScore();

  return (
    <View style={styles.container}>
      <ThemedText type="title">Your Story</ThemedText>
      <ThemedText style={styles.content}>
        {storyPlot ? renderStory(storyPlot) : "No story found"}
      </ThemedText>
      <ThemedText type="subtitle">Your Score: {score} / 100</ThemedText>
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
