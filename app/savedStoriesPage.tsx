import { ThemedText } from "@/components/ThemedText";
import { Button, StyleSheet, View } from "react-native";
import { router } from "expo-router";

export default function SavedStories() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Saved Stories Page
      </ThemedText>
      <Button
        title="Home"
        onPress={() => {
          router.replace("/");
        }}
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
});
