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

  return (
    <View>
      <ThemedText type="title">Your story</ThemedText>
      <ThemedText>{storyPlot}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({});
