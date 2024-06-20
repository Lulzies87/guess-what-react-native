import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, View } from "react-native";

export default function CreateChallenge() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Create Challenge Page
      </ThemedText>
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
});
