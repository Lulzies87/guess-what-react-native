import CreateChallengeButton from "@/components/CreateChallengeButton";
import CustomModal from "@/components/CustomModal";
import { ThemedText } from "@/components/ThemedText";
import { fetchUserData, logout } from "@/functions/functions";
import { User } from "@/models/User.model";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

export default function MainMenu() {
  const [userData, setUserData] = useState<User | null>(null);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isChallengesVisible, setIsChallengesVisible] = useState(false);
  const [pendingChallenges, setPendingChallenges] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data);
        setPendingChallenges(data.pendingChallenges);
      } catch (error) {
        console.error("Couldn't fetch user data:", error);
      }
    };

    loadData();
  }, [userData]);

  const onSettingsClose = () => {
    setIsSettingsVisible(false);
  };

  const onChallengesClose = () => {
    setIsChallengesVisible(false);
  };

  const onChallengePress = (id: string) => {
    setIsChallengesVisible(false);
    router.navigate(`/challenge/${id}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText type="subtitle">Hello {userData?.username}</ThemedText>
        <ThemedText>Your points total is {userData?.points}</ThemedText>
      </View>

      <View style={styles.buttonsContainer}>
        {userData ? <CreateChallengeButton userId={userData._id} /> : ""}
        <Pressable>
          <ThemedText
            type="link"
            onPress={() => {
              setIsChallengesVisible(true);
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
              setIsSettingsVisible(true);
            }}
          >
            Settings
          </ThemedText>
        </Pressable>
      </View>
      <View style={styles.footer}>
        <Pressable>
          <ThemedText type="link" onPress={logout}>
            Logout
          </ThemedText>
        </Pressable>
      </View>

      <CustomModal
        title="Pending Challenges"
        isVisible={isChallengesVisible}
        onClose={onChallengesClose}
      >
        <View style={styles.modalContentContainer}>
          <FlatList
            data={pendingChallenges}
            renderItem={(challenge) => (
              <Pressable
                onPress={() => {
                  onChallengePress(challenge.item);
                }}
              >
                <ThemedText>{challenge.item}</ThemedText>
              </Pressable>
            )}
            keyExtractor={(challenge) => challenge}
          />
        </View>
      </CustomModal>
      <CustomModal
        title="Settings"
        isVisible={isSettingsVisible}
        onClose={onSettingsClose}
      >
        <View style={styles.modalContentContainer}>
          <ThemedText>Setting 1</ThemedText>
          <ThemedText>Setting 2</ThemedText>
          <ThemedText>Setting 3</ThemedText>
        </View>
      </CustomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: "20%",
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
  },
  buttonsContainer: {
    flex: 8,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 40,
  },
  modalContentContainer: {
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
