import { ThemedText } from "@/components/ThemedText";
import { Button, StyleSheet, View } from "react-native";
import { router } from "expo-router";

export default function Friends() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Friends Page
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
