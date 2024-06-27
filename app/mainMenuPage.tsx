import SettingsModal from "@/components/SettingsModal";
import { ThemedText } from "@/components/ThemedText";
import { getRandomStoryNumber, stories } from "@/stories/stories";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function MainMenu() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onLogout = () => {
    router.replace("/loginPage");
  };

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
              router.navigate(
                `/createChallengePage?id=${getRandomStoryNumber(stories)}`
              );
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
              setIsModalVisible(true);
            }}
          >
            Settings
          </ThemedText>
        </Pressable>
      </View>
      <View style={styles.footer}>
        <Pressable>
          <ThemedText type="link" onPress={onLogout}>
            Logout
          </ThemedText>
        </Pressable>
      </View>

      <SettingsModal isVisible={isModalVisible} onClose={onModalClose}>
        <View style={styles.settingsContainer}>
          <ThemedText>Setting 1</ThemedText>
          <ThemedText>Setting 2</ThemedText>
          <ThemedText>Setting 3</ThemedText>
        </View>
      </SettingsModal>
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
    flex: 8,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  settingsContainer: {
    flex: 1,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  footer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
