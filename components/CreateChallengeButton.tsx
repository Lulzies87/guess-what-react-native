import React from "react";
import { Pressable, Text } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";

export default function ChallengeButton() {
  const router = useRouter();

  const fetchRandomStory = async () => {
    try {
      const response = await fetch("http://10.100.102.77:3000/randomStory");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const randomStory = await response.json();
      return randomStory;
    } catch (error) {
      console.error("Error fetching random story:", error);
      return null;
    }
  };

  const handlePress = async () => {
    const randomStory = await fetchRandomStory();
    if (randomStory) {
      router.navigate(`/createChallengePage?id=${randomStory._id}&plot=${encodeURIComponent(randomStory.plot)}`); 
    } else {
      console.error("Failed to fetch a random story");
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <ThemedText type="link">
        Create a Challenge
      </ThemedText>
    </Pressable>
  );
}