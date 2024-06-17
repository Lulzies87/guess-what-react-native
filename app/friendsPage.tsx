import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, View } from "react-native";

export default function Friends() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Friends Page</ThemedText>
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
