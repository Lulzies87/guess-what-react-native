import { ThemedText } from "@/components/ThemedText";
import { ValueOfKey, WordDescription, Words } from "@/components/Words";
import { MaterialIcons } from "@expo/vector-icons";
import WordsModal from "@/components/WordsModal";
import { stories } from "@/stories/stories";
import { Dropdown } from "react-native-element-dropdown";
import { Link, useLocalSearchParams } from "expo-router";
import { SetStateAction, useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";

export default function CreateChallenge() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedKeywordIndex, setSelectedKeywordIndex] = useState<
    keyof Words | null
  >(null);
  const [words, setWords] = useState<Words>({
    firstWord: { word: "", description: { wordType: "verb" }, picture: "" },
    secondWord: { word: "", description: { wordType: "verb" }, picture: "" },
    thirdWord: { word: "", description: { wordType: "verb" }, picture: "" },
    fourthWord: { word: "", description: { wordType: "verb" }, picture: "" },
  });
  const [currentWord, setCurrentWord] = useState("");
  const params = useLocalSearchParams();
  const [selectedWordType, setSelectedWordType] =
    useState<ValueOfKey<WordDescription, "wordType">>("verb");
  const [selectedWordNumber, setSelectedWordNumber] =
    useState<ValueOfKey<WordDescription, "number">>(undefined);

  useEffect(() => {
    console.log("Updated words state:", words);
  }, [words]);

  const onModalClose = () => {
    useExitModal(
      setIsModalVisible,
      setSelectedKeywordIndex,
      setCurrentWord,
      setSelectedWordType,
      setSelectedWordNumber
    );
  };

  const onModalSave = () => {
    if (selectedKeywordIndex !== null) {
      const updatedWords = {
        ...words,
        [selectedKeywordIndex]: {
          ...words[selectedKeywordIndex],
          word: currentWord,
          description: {
            ...words[selectedKeywordIndex].description,
            wordType: selectedWordType,
            number: selectedWordNumber,
          },
        },
      };
      setWords(updatedWords);
    }
    useExitModal(
      setIsModalVisible,
      setSelectedKeywordIndex,
      setCurrentWord,
      setSelectedWordType,
      setSelectedWordNumber
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
          <Dropdown
            style={[styles.selector, styles.input]}
            data={[
              { label: 'Verb', value: 'verb' },
              { label: 'Noun', value: 'noun' },
              { label: 'Adjective', value: 'adjective' },
            ]}
            labelField="label"
            valueField="value"
            value={selectedWordType}
            onChange={item => {
              setSelectedWordType(item.value as "verb" | "noun" | "adjective");
            }}
          />
          <Dropdown
            style={[styles.selector, styles.input]}
            data={[
              { label: '', value: 'undefined' },
              { label: 'Singular', value: 'singular' },
              { label: 'Plural', value: 'plural' },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Select Word Number"
            value={selectedWordNumber}
            onChange={item => {
              setSelectedWordNumber(item.value as "singular" | "plural" | undefined);
            }}
          />
          <Link style={[styles.centered]} href="/takePicturePage" asChild>
            <Pressable>
              <MaterialIcons name="camera-alt" color="black" size={30} />
              <ThemedText>Take pic</ThemedText>
            </Pressable>
          </Link>
        </View>
      </WordsModal>
    </View>
    </ScrollView>
  );
}

type StoryProps = {
  randomStoryNumber: number;
  setIsModalVisible: (visible: boolean) => void;
  setSelectedKeywordIndex: (index: keyof Words | null) => void;
  setCurrentWord: (word: string) => void;
  words: Words;
};

function useExitModal(
  setIsModalVisible: (value: SetStateAction<boolean>) => void,
  setSelectedKeywordIndex: (value: SetStateAction<keyof Words | null>) => void,
  setCurrentWord: (value: SetStateAction<string>) => void,
  setSelectedWordType: (
    value: SetStateAction<"verb" | "noun" | "adjective">
  ) => void,
  setSelectedWordNumber: (
    value: SetStateAction<"singular" | "plural" | undefined>
  ) => void
) {
  setIsModalVisible(false);
  setSelectedKeywordIndex(null);
  setCurrentWord("");
  setSelectedWordType("verb");
  setSelectedWordNumber(undefined);
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
  setSelectedKeywordIndex: (index: keyof Words | null) => void,
  setCurrentWord: (word: string) => void,
  words: Words
): JSX.Element[] {
  const keywordMapping: (keyof Words)[] = [
    "firstWord",
    "secondWord",
    "thirdWord",
    "fourthWord",
  ];
  const parts = plot.split(/(\$\d+)/g);

  return parts.map((part, index) => {
    const match = part.match(/\$(\d+)/);
    if (match) {
      const keywordIndex = parseInt(match[1], 10);
      const keywordKey = keywordMapping[keywordIndex];

      if (keywordKey in words) {
        const chosenWord = words[keywordKey].word || `____${keywordIndex + 1}`;
        return (
          <Pressable
            key={index}
            onPress={() => {
              setSelectedKeywordIndex(keywordKey);
              setCurrentWord(words[keywordKey].word || "");
              setIsModalVisible(true);
            }}
          >
            <Text style={styles.link}>{chosenWord}</Text>
          </Pressable>
        );
      } else {
        return <Text key={index}>Invalid Keyword</Text>;
      }
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
  selector: {
    height: 50,
    width: 150,
  },
  centered: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
  },
});
