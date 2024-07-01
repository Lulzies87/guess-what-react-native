import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, FlatList, Text, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { router, useLocalSearchParams } from "expo-router";
import server from "../app/api-client";

export default function Friends() {
  const [friendsList, setFriendsList] = useState<{ id: string; username: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { userId } = useLocalSearchParams();

  useEffect(() => {
    const fetchFriendsList = async () => {
      try {
        const response = await server.get<{ id: string; username: string }[]>("/getFriendsList", {
          params: { userId },
        });
        if (response.status === 200) {
          setFriendsList(response.data);
        } else {
          console.error("Failed to fetch friends list:", response.data);
        }
      } catch (error) {
        console.error("Error fetching friends list:", error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriendsList();
  }, [userId]);

  const renderFriend = ({ item }: { item: { id: string; username: string } }) => (
    <TouchableOpacity style={styles.friendContainer} onPress={() => {}}>
      <ThemedText style={styles.friendName} type="link">{item.username}</ThemedText>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.title} type="title">
          Loading...
        </ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.title} type="title">
          Error loading friends
        </ThemedText>
        <Text>{error.message}</Text>
        <Button
        title="Home"
        onPress={() => {
          router.replace("/");
        }}
      />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Friends Page
      </ThemedText>
      <FlatList
        data={friendsList}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <ThemedText style={styles.noFriendsText} type="defaultSemiBold">
            No friends found.
          </ThemedText>
        }
      />
      <Button
        title="Home"
        onPress={() => {
          router.replace("/");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: "20%",
  },
  title: {
    paddingVertical: 20,
  },
  friendContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  friendName: {
    fontSize: 16,
  },
  noFriendsText: {
    textAlign: "center",
    paddingVertical: 20,
  },
});