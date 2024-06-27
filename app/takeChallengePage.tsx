import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import server from "./api-client";

export default function TakeChallenge() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const res = await server.get("/loadChallenge");
        console.log("Image URL:", res.data.imageUrl);
        setImageUrl(res.data.imageUrl);
      } catch (error) {
        console.error("Failed to fetch image URL:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImageUrl();
  }, []);

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Take Challenge Page
      </ThemedText>

      {imageUrl ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <TextInput></TextInput>
        </View>
      ) : (
        <ThemedText style={styles.title} type="title">
          No image available
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    paddingVertical: 20,
  },
  imageContainer: {
    width: "100%",
    flex: 1,
  },
  image: {
    height: "70%",
    resizeMode: "contain",
  },
});
