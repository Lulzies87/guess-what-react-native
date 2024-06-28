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
        return (
          <ThemedText key={index} style={styles.guessedWord}>
            {guessedWords[wordIndex]}
          </ThemedText>
        );
      }
      return (
        <ThemedText key={index} style={styles.storyText}>
          {part}
        </ThemedText>
      );
    });
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title">Your Story</ThemedText>
      <ThemedText style={styles.content}>
        {storyPlot ? renderStory(storyPlot) : "No story found"}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    paddingVertical: 20,
  },
  content: {
    paddingVertical: 20,
    textAlign: "center",
  },
  storyText: {
    fontSize: 16,
    color: "#000",
  },
  guessedWord: {
    fontSize: 16,
    color: "blue",
    fontWeight: "bold",
  },
});
