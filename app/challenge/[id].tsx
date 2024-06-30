import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import server from "../api-client";
import { Challenge, Word } from "@/models/Challenge.model";
import ChallengeSummary from "@/components/ChallengeSummary";

export default function TakeChallenge() {
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState<string | undefined>(undefined);
  const [guessedWords, setGuessedWords] = useState<string[]>([]);
  const [isDone, setIsDone] = useState<boolean>(false);

  const currentWord = words[currentWordIndex];

  const handleNext = () => {
    if (!userInput?.trim()) {
      return;
    }

    setGuessedWords([...guessedWords, userInput.trim().toLowerCase()]);

    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setUserInput(undefined);
    }
  };

  const getChallengeData = async (id: string) => {
    try {
      const res = await server.get(`/challenge/${id}`);
      const challengeData = res.data.challengeData;
      const storyData = res.data.storyData;
      setChallenge(challengeData);
      const wordsArray = Object.values(challengeData.chosenWords) as Word[];
      setWords(wordsArray);
    } catch (error) {
      console.error("Failed to fetch challenge data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!userInput?.trim()) {
      return;
    }

    setGuessedWords([...guessedWords, userInput.trim().toLowerCase()]);
    setIsDone(true);
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

  if (isDone && typeof id === "string") {
    return (
      <ChallengeSummary
        challengeId={id}
        storyId={challenge.storyId}
        guessedWords={guessedWords}
        correctWords={words}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: `http://192.168.50.237:3000/images/${currentWord.imageName}`,
          }}
          style={styles.image}
        />
      </View>

      <View style={styles.inputContainer}>
        <ThemedText>
          {currentWord.description.wordType}
          {currentWord.description.wordNumber
            ? `, ${currentWord.description.wordNumber}`
            : ""}
        </ThemedText>

        <TextInput
          style={styles.inputField}
          placeholder="Guess the word"
          placeholderTextColor="#888"
          value={userInput}
          onChangeText={setUserInput}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => {
            router.replace("/");
          }}
        >
          <ThemedText type="link">Home</ThemedText>
        </TouchableOpacity>
        {currentWordIndex < words.length - 1 ? (
          <TouchableOpacity onPress={handleNext}>
            <ThemedText type="link">Next</ThemedText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleSubmit}>
            <ThemedText type="link">Sumbit</ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: "20%",
  },
  imageContainer: {
    width: "100%",
    flex: 8,
  },
  image: {
    height: "100%",
    marginBottom: 20,
    resizeMode: "contain",
  },
  inputContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 8,
  },
  inputField: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 28,
    borderColor: "#eee",
    shadowOffset: {
      width: -4,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowColor: "darkgray",
  },
  footer: {
    width: "80%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
