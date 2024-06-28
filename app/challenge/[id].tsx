import { ThemedText } from "@/components/ThemedText";
import { Challenge, Word } from "@/models/challenge.model";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Image,
  TextInput,
  Button,
} from "react-native";
import server from "../api-client";

export default function TakeChallenge() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userGuess, setUserGuess] = useState("");
  const [words, setWords] = useState<Word[]>([]);

  const handleNext = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setUserGuess("");
    }
  };

  const getChallengeData = async (id: string) => {
    try {
      const res = await server.get(`/challenge/${id}`);
      const data = res.data;
      setChallenge(data);
      const wordsArray = Object.values(data.chosenWords) as Word[];
      setWords(wordsArray);
    } catch (error) {
      console.error("Failed to fetch challenge data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof id === "string") {
      getChallengeData(id);
    }
  }, [id]);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!challenge) {
    return (
      <View>
        <ThemedText>No challenge data available</ThemedText>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Take Challenge Page
      </ThemedText>
      <Image
        source={{
          uri: `http://192.168.50.237:3000/images/${currentWord.imageName}`,
        }}
        style={styles.image}
      />
      <ThemedText>
        Description: {currentWord.description.wordType}{" "}
        {currentWord.description.wordNumber}
      </ThemedText>

      <TextInput
        style={styles.input}
        placeholder="Guess the word"
        value={userGuess}
        onChangeText={setUserGuess}
      />

      <Button
        title="Next"
        onPress={handleNext}
        disabled={currentWordIndex >= words.length - 1}
      />
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
  image: {
    // backgroundColor: "red",
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 20,
    width: "100%",
  },
});
