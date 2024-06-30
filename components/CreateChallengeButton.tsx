import React, { useState, useEffect } from "react";
import { Pressable, View, Text, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import server from "../app/api-client";
import CustomModal from "./CustomModal";

interface ChallengeButtonProps {
  userId: string;
}

export default function ChallengeButton({ userId }: ChallengeButtonProps) {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [friendsList, setFriendsList] = useState<{ id: string; username: string }[]>([]);

  useEffect(() => {
    const fetchFriendsList = async () => {
      try {
        const response = await server.get('/getFriendsList', { params: { userId } });
        if (response.status === 200) {
          setFriendsList(response.data);
        } else {
          console.error("Failed to fetch friends list:", response.data);
        }
      } catch (error) {
        console.error("Error fetching friends list:", error);
      }
    };

    fetchFriendsList();
  }, [userId]);

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

  const handleFriendSelection = async (friendId: string) => {
    const randomStory = await fetchRandomStory();
    if (randomStory) {
      router.push(`/createChallengePage?id=${randomStory._id}&target=${friendId}&creator=${userId}`);
      setIsModalVisible(false);
    } else {
      console.error("Failed to fetch a random story");
    }
  };

  return (
    <>
      <Pressable onPress={() => setIsModalVisible(true)}>
        <ThemedText type="link">
          Create a Challenge
        </ThemedText>
      </Pressable>

      <CustomModal
        title="Select a Friend"
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        {friendsList.map((friend) => (
          <TouchableOpacity
            key={friend.id}
            onPress={() => handleFriendSelection(friend.id)}
          >
            <ThemedText type="link">{friend.username}</ThemedText>
          </TouchableOpacity>
        ))}
      </CustomModal>
    </>
  );
}