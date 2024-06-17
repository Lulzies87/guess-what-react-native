import { ThemedText } from "@/components/ThemedText";
import { StyleSheet, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">Home Page</ThemedText>
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
