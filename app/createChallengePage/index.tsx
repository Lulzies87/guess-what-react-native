import { ThemedText } from "@/components/ThemedText";
import WordsModal from "@/components/WordsModal";
import { stories } from "@/stories/stories";
import { Link, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Pressable,
} from "react-native";

export default function CreateChallenge() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const  params  = useLocalSearchParams(); 
  console.log("id = " + params.id)

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Create Challenge Page
      </ThemedText>
      <Story randomStoryNumber={Number(params.id)} />
      <Pressable>
        <ThemedText
          type="link"
          onPress={() => {
            setIsModalVisible(true);
          }}
        >
          Settings
        </ThemedText>
      </Pressable>
      <WordsModal isVisible={isModalVisible} onClose={onModalClose} wordNumber={1}>
        <View style={styles.wordsModalContainer}>
          <ThemedText>Setting 1</ThemedText>
          <ThemedText>Setting 2</ThemedText>
          <ThemedText>Setting 3</ThemedText>
        </View>
      </WordsModal>
    </View>
  );
}

type StoryProps = {
  randomStoryNumber: number;
};

function Story({ randomStoryNumber }: StoryProps) {
  const plot = stories[randomStoryNumber].plot;
  const content = replacePlaceholdersWithLinks(plot);

  return (
    <View style={styles.storyContainer}>
      <ThemedText type="default">{content}</ThemedText>
    </View>
  );
}

function replacePlaceholdersWithLinks(plot: string): JSX.Element[] {
  const parts = plot.split(/(\$\d+)/g);
  return parts.map((part, index) => {
    const match = part.match(/\$(\d+)/);
    if (match) {
      const keywordIndex = parseInt(match[1], 10) + 1;
      return (
        <Link
          key={index}
          href={`/createChallengePage/chosenWord#${keywordIndex}`}
          asChild
        >
          <TouchableOpacity>
            <Text style={styles.link}>WORD{keywordIndex}</Text>
          </TouchableOpacity>
        </Link>
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
});
