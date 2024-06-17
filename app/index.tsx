import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export default function Home() {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Home Page
      </ThemedText>
      <View style={styles.linksContainer}>
        <Link href={"/loginPage"} asChild>
          <Pressable style={styles.button}>
            <ThemedText style={styles.buttonText}>Login Page</ThemedText>
          </Pressable>
        </Link>

        <Link href={"/mainMenuPage"} asChild>
          <Pressable style={styles.button}>
            <ThemedText style={styles.buttonText}>Main Menu Page</ThemedText>
          </Pressable>
        </Link>

        <Link href={"/friendsPage"} asChild>
          <Pressable style={styles.button}>
            <ThemedText style={styles.buttonText}>Friends Page</ThemedText>
          </Pressable>
        </Link>

        <Link href={"/createChallengePage"} asChild>
          <Pressable style={styles.button}>
            <ThemedText style={styles.buttonText}>
              Create Challenge Page
            </ThemedText>
          </Pressable>
        </Link>

        <Link href={"/takeChallengePage"} asChild>
          <Pressable style={styles.button}>
            <ThemedText style={styles.buttonText}>
              Take Challenge Page
            </ThemedText>
          </Pressable>
        </Link>

        <Link href={"/savedStoriesPage"} asChild>
          <Pressable style={styles.button}>
            <ThemedText style={styles.buttonText}>
              Saved Stories Page
            </ThemedText>
          </Pressable>
        </Link>
      </View>
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
  linksContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "peachpuff",
    width: "70%",
    padding: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderRadius: 28,
    borderColor: "papayawhip",
    shadowOffset: {
      width: -2,
      height: -2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowColor: "peru",
  },
  buttonText: {
    textAlign: "center",
  },
});
