import { ThemedText } from "@/components/ThemedText";
import { stories } from "@/stories/stories";
import { StyleSheet, View } from "react-native";

export default function CreateChallenge() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Create Challenge Page
      </ThemedText>
      <Story randomStoryNumber={0} />
    </View>
  );
}

type StoryProps = {
  randomStoryNumber: number;
};

function Story({ randomStoryNumber }: StoryProps) {
  return (
    <View style={styles.storyContainer}>
      <ThemedText>{stories[randomStoryNumber].plot}</ThemedText>
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
  storyContainer: {
    padding: 20,
  },
});
