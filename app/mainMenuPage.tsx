import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, View } from "react-native";

export default function MainMenu() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Main Manu Page
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
