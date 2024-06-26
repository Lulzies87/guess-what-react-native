import { ThemedText } from "@/components/ThemedText";
import WordsModal from "@/components/WordsModal";
import { stories } from "@/stories/stories";
import { Link, useLocalSearchParams } from "expo-router";
import { SetStateAction, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Pressable,
  TextInput,
} from "react-native";

export default function CreateChallenge() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedKeywordIndex, setSelectedKeywordIndex] = useState<
    number | null
  >(null);
  const [words, setWords] = useState(["", "", "", ""]);
  const [currentWord, setCurrentWord] = useState("");
  const params = useLocalSearchParams();

  const onModalClose = () => {
    useExitModal(setIsModalVisible, setSelectedKeywordIndex, setCurrentWord);
  };

  const onModalSave = () => {
    if (selectedKeywordIndex !== null) {
      const updatedWords = [...words];
      updatedWords[selectedKeywordIndex] = currentWord;
      setWords(updatedWords);
    }
    useExitModal(setIsModalVisible, setSelectedKeywordIndex, setCurrentWord);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Create Challenge Page
      </ThemedText>
      <Link href={`/`} asChild>
        <TouchableOpacity>
          <Text style={styles.link}>Home</Text>
        </TouchableOpacity>
      </Link>
      <Story
        randomStoryNumber={Number(params.id)}
        setIsModalVisible={setIsModalVisible}
        setSelectedKeywordIndex={setSelectedKeywordIndex}
        setCurrentWord={setCurrentWord}
        words={words}
      />
      <WordsModal
        isVisible={isModalVisible}
        onClose={onModalClose}
        onSave={onModalSave}
        wordNumber={selectedKeywordIndex}
      >
        <View style={styles.wordsModalContainer}>
          <ThemedText type="defaultSemiBold">Choose Word</ThemedText>
          <TextInput
            id="chosenWord"
            value={currentWord}
            onChangeText={setCurrentWord}
            style={styles.input}
          />
        </View>
      </WordsModal>
    </View>
  );
}

type StoryProps = {
  randomStoryNumber: number;
  setIsModalVisible: (visible: boolean) => void;
  setSelectedKeywordIndex: (index: number | null) => void;
  setCurrentWord: (word: string) => void;
  words: string[];
};

function useExitModal(
  setIsModalVisible: {
    (value: SetStateAction<boolean>): void;
    (arg0: boolean): void;
  },
  setSelectedKeywordIndex: {
    (value: SetStateAction<number | null>): void;
    (arg0: null): void;
  },
  setCurrentWord: {
    (value: SetStateAction<string>): void;
    (arg0: string): void;
  }
) {
  setIsModalVisible(false);
  setSelectedKeywordIndex(null);
  setCurrentWord("");
}

function Story({
  randomStoryNumber,
  setIsModalVisible,
  setSelectedKeywordIndex,
  setCurrentWord,
  words,
}: StoryProps) {
  const plot = stories[randomStoryNumber].plot;
  const content = replacePlaceholdersWithLinks(
    plot,
    setIsModalVisible,
    setSelectedKeywordIndex,
    setCurrentWord,
    words
  );

  return (
    <View style={styles.storyContainer}>
      <ThemedText type="default">{content}</ThemedText>
    </View>
  );
}

function replacePlaceholdersWithLinks(
  plot: string,
  setIsModalVisible: (visible: boolean) => void,
  setSelectedKeywordIndex: (index: number | null) => void,
  setCurrentWord: (word: string) => void,
  words: string[]
): JSX.Element[] {
  const parts = plot.split(/(\$\d+)/g);
  return parts.map((part, index) => {
    const match = part.match(/\$(\d+)/);
    if (match) {
      const keywordIndex = parseInt(match[1], 10);
      const chosenWord = words[keywordIndex] || `____${keywordIndex + 1}`;
      return (
        <Pressable
          key={index}
          onPress={() => {
            setSelectedKeywordIndex(keywordIndex);
            setCurrentWord(words[keywordIndex] || "");
            setIsModalVisible(true);
          }}
        >
          <Text style={styles.link}>{chosenWord}</Text>
        </Pressable>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    paddingVertical: 20,
  },
  storyContainer: {
    padding: 20,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
    fontWeight: "800",
  },
  wordsModalContainer: {
    flex: 1,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    padding: 8,
    marginTop: 8,
    width: "100%",
  },
});
