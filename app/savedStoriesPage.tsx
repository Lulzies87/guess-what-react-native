import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, View } from "react-native";

export default function SavedStories() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Saved Stories Page</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
