import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export default function MainMenu() {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText type="title">Main Manu Page</ThemedText>
      </View>

      <View style={styles.buttonsContainer}>
        <Pressable>
          <ThemedText
            type="link"
            onPress={() => {
              router.navigate("/createChallengePage");
            }}
          >
            Create a Challenge
          </ThemedText>
        </Pressable>

        <Pressable>
          <ThemedText
            type="link"
            onPress={() => {
              router.navigate("/takeChallengePage");
            }}
          >
            My Challenges
          </ThemedText>
        </Pressable>

        <Pressable>
          <ThemedText
            type="link"
            onPress={() => {
              router.navigate("/friendsPage");
            }}
          >
            Friends
          </ThemedText>
        </Pressable>

        <Pressable>
          <ThemedText
            type="link"
            onPress={() => {
              router.navigate("/savedStoriesPage");
            }}
          >
            My Saved Stories
          </ThemedText>
        </Pressable>

        <Pressable>
          <ThemedText
            type="link"
            onPress={() => {
              console.log("Open settings modal");
            }}
          >
            Settings
          </ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
  },
  buttonsContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
});
