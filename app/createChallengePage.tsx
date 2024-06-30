import React, { useState, useEffect, SetStateAction } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Pressable,
  TextInput,
  Modal,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ValueOfKey, WordDescription, Words } from "@/components/Words";
import { MaterialIcons } from "@expo/vector-icons";
import WordsModal from "@/components/WordsModal";
import { stories } from "@/stories/stories";
import { Dropdown } from "react-native-element-dropdown";
import { Link, useLocalSearchParams } from "expo-router";
import CameraComponent from "@/components/CameraComponent";
import server from "./api-client";

const defaultStoryId = "6677bdc332cb84d89877964e";
const defaultChallengeCreatorId = "667e5415ec930a70467b003d";

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
  const [currentPhotoURI, setCurrentPhotoURI] = useState<string | null>(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);

  const pictureURIArray = [
    words.firstWord.picture,
    words.secondWord.picture,
    words.thirdWord.picture,
    words.fourthWord.picture,
  ];

  const uploadImage = async (uriArr: string[]) => {
    const formData = new FormData();
    const imageNames: string[] = [];

    uriArr.forEach((uri, index) => {
      const imageName = `image_${Date.now()}_${index}.jpg`;
      imageNames.push(imageName);
      formData.append("images", {
        uri,
        type: "image/jpeg",
        name: imageName,
      } as any);
    });

    try {
      const res = await server.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Image uploaded successfully:", res.data);
      return imageNames;
    } catch (error) {
      console.error("Error uploading image:", JSON.stringify(error));
      return null;
    }
  };

  const updateWordsWithImageNames = (imageNames: string[]) => {
    setWords((prevWords) => ({
      ...prevWords,
      firstWord: { ...prevWords.firstWord, picture: imageNames[0] },
      secondWord: { ...prevWords.secondWord, picture: imageNames[1] },
      thirdWord: { ...prevWords.thirdWord, picture: imageNames[2] },
      fourthWord: { ...prevWords.fourthWord, picture: imageNames[3] },
    }));
  };

  useEffect(() => {
    console.log("Updated pictures state:", pictureURIArray);
  }, [pictureURIArray]);

  const onModalClose = () => {
    useExitModal(
      setIsModalVisible,
      setSelectedKeywordIndex,
      setCurrentWord,
      setSelectedWordType,
      setSelectedWordNumber,
      setCurrentPhotoURI
    );
  };

  const onModalSave = () => {
    if (selectedKeywordIndex !== null) {
      const updatedWords = {
        ...words,
        [selectedKeywordIndex]: {
          ...words[selectedKeywordIndex],
          word: currentWord.trim().toLowerCase(),
          description: {
            ...words[selectedKeywordIndex].description,
            wordType: selectedWordType,
            number: selectedWordNumber,
          },
          picture: currentPhotoURI,
        },
      };
      setWords(updatedWords);
    }
    useExitModal(
      setIsModalVisible,
      setSelectedKeywordIndex,
      setCurrentWord,
      setSelectedWordType,
      setSelectedWordNumber,
      setCurrentPhotoURI
    );
  };

  const handlePhotoUriReady = (uri: string | null) => {
    setCurrentPhotoURI(uri);
    setIsCameraVisible(false);
    setIsModalVisible(true);
  };

  const onCloseCamera = () => {
    setIsCameraVisible(false);
    setCurrentPhotoURI(null);
  };

  const prepareChallengeData = (updatedWords: Words) => {
    const data = {
      storyId: defaultStoryId,
      challengeCreatorId: defaultChallengeCreatorId,
      chosenWords: {
        firstWord: {
          word: updatedWords.firstWord.word,
          description: {
            wordType: updatedWords.firstWord.description.wordType,
            wordNumber: updatedWords.firstWord.description.number,
          },
          imageName: updatedWords.firstWord.picture,
        },
        secondWord: {
          word: updatedWords.secondWord.word,
          description: {
            wordType: updatedWords.secondWord.description.wordType,
            wordNumber: updatedWords.secondWord.description.number,
          },
          imageName: updatedWords.secondWord.picture,
        },
        thirdWord: {
          word: updatedWords.thirdWord.word,
          description: {
            wordType: updatedWords.thirdWord.description.wordType,
            wordNumber: updatedWords.thirdWord.description.number,
          },
          imageName: updatedWords.thirdWord.picture,
        },
        fourthWord: {
          word: updatedWords.fourthWord.word,
          description: {
            wordType: updatedWords.fourthWord.description.wordType,
            wordNumber: updatedWords.fourthWord.description.number,
          },
          imageName: updatedWords.fourthWord.picture,
        },
      },
    };

    return data;
  };

  const handlePostChallenge = async () => {
    const imageNames = await uploadImage(pictureURIArray);
    if (imageNames) {
      updateWordsWithImageNames(imageNames);
      setWords((prevWords) => {
        const updatedWords = {
          ...prevWords,
          firstWord: { ...prevWords.firstWord, picture: imageNames[0] },
          secondWord: { ...prevWords.secondWord, picture: imageNames[1] },
          thirdWord: { ...prevWords.thirdWord, picture: imageNames[2] },
          fourthWord: { ...prevWords.fourthWord, picture: imageNames[3] },
        };
        const challengeData = prepareChallengeData(updatedWords);
        console.log("Prepared Challenge Data:", challengeData);
        
        server.post("/challenge", challengeData)
          .then(response => {
            console.log("Challenge created successfully:", response.data);
          })
          .catch(error => {
            console.error("Error creating challenge:", error);
          });
        
        return updatedWords;
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Link href={`/`} asChild>
          <TouchableOpacity>
            <ThemedText type="link">Home</ThemedText>
          </TouchableOpacity>
        </Link>
        <Story
          randomStoryNumber={Number(params.id)}
          setIsModalVisible={setIsModalVisible}
          setSelectedKeywordIndex={setSelectedKeywordIndex}
          setCurrentWord={setCurrentWord}
          words={words}
        />
        <TouchableOpacity onPress={handlePostChallenge}>
        <ThemedText type="link">Send Challenge</ThemedText>
        </TouchableOpacity>
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
                { label: "Verb", value: "verb" },
                { label: "Noun", value: "noun" },
                { label: "Adjective", value: "adjective" },
              ]}
              labelField="label"
              valueField="value"
              value={selectedWordType}
              onChange={(item) => {
                setSelectedWordType(
                  item.value as "verb" | "noun" | "adjective"
                );
              }}
            />
            <Dropdown
              style={[styles.selector, styles.input]}
              data={[
                { label: "", value: "undefined" },
                { label: "Singular", value: "singular" },
                { label: "Plural", value: "plural" },
              ]}
              labelField="label"
              valueField="value"
              placeholder="Select Word Number"
              value={selectedWordNumber}
              onChange={(item) => {
                setSelectedWordNumber(
                  item.value as "singular" | "plural" | undefined
                );
              }}
            />
            <Pressable
              style={[styles.centered]}
              onPress={() => {
                setIsModalVisible(false);
                setIsCameraVisible(true);
              }}
            >
              <MaterialIcons name="camera-alt" color="black" size={30} />
              <ThemedText>Take pic</ThemedText>
            </Pressable>
          </View>
        </WordsModal>
        <Modal visible={isCameraVisible} animationType="slide">
          <CameraComponent
            onPhotoUriReady={handlePhotoUriReady}
            onClose={onCloseCamera}
          />
        </Modal>
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
  ) => void,
  setCurrentPhotoURI: (value: SetStateAction<string | null>) => void
) {
  setIsModalVisible(false);
  setSelectedKeywordIndex(null);
  setCurrentWord("");
  setSelectedWordType("verb");
  setSelectedWordNumber(undefined);
  setCurrentPhotoURI(null);
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
    paddingVertical: "20%",
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
