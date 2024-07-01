import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Login() {
  const [isExistingPlayer, setIsExistingPlayer] = useState<boolean>(true);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title} type="title">
        Login/Register Page
      </ThemedText>

      <View style={styles.formContainer}>
        {isExistingPlayer ? <LoginForm /> : <RegisterForm />}
      </View>

      <ThemedText style={styles.footer}>
        {isExistingPlayer ? (
          <>
            New to Guess What?{" "}
            <ThemedText type="link" onPress={() => setIsExistingPlayer(false)}>
              Register
            </ThemedText>
          </>
        ) : (
          <>
            Existing player?{" "}
            <ThemedText type="link" onPress={() => setIsExistingPlayer(true)}>
              Login
            </ThemedText>
          </>
        )}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: "20%",
  },
  title: {
    paddingVertical: 20,
  },
  formContainer: {
    width: "100%",
    flex: 8,
  },
  footer: {
    flex: 1,
  },
});
