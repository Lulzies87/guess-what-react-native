import { ThemedText } from "@/components/ThemedText";
import { getRandomStoryNumber, stories } from "@/stories/stories";
import { Link } from "expo-router";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";

export default function CreateChallenge() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Create Challenge Page
      </ThemedText>
      <Story randomStoryNumber={getRandomStoryNumber(stories)} />
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
        <Link key={index} href={`/createChallengePage/wordNumber${keywordIndex}`} asChild>
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
});
