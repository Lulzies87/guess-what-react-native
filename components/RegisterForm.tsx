import React, { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";
import server from "../app/api-client";
import { router } from "expo-router";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isValidUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9]{6,16}$/;

    return usernameRegex.test(username);
  };

  const isValidPassword = (password: string): boolean => {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;

    return passwordRegex.test(password);
  };

  const handleSubmit = async () => {
    if (!isValidUsername(username)) {
      return console.error(
        "Username must be 6-16 characters and can contain only letters and numbers"
      );
    }

    if (!isValidPassword(password)) {
      return console.error(
        "Password must be 8-15 characters and contain at least one lowercase letter, one uppercase letter, one digit, and one special character"
      );
    }

    if (password !== confirmPassword) {
      return console.error("Passwords don't match!");
    }

    try {
      const res = await server.post("/register", {
        username,
        password,
      });

      const token = res.data;
      await SecureStore.setItemAsync("userToken", token);
      router.replace("/mainMenuPage");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.form}>
        <TextInput
          style={styles.formField}
          placeholder="Username"
          placeholderTextColor="#888"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.formField}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.formField}
          placeholder="Confirm Password"
          secureTextEntry={true}
          placeholderTextColor="#888"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <ThemedText style={styles.buttonText}>Register</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
  },
  form: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 14,
  },
  formField: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    textAlign: "center",
    borderWidth: 1,
    borderRadius: 28,
    borderColor: "#eee",
    shadowOffset: {
      width: -4,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowColor: "darkgray",
  },
  button: {
    backgroundColor: "lightcyan",
    borderWidth: 1,
    borderColor: "lightblue",
    borderRadius: 28,
    padding: 10,
    width: "30%",
    alignItems: "center",
    shadowOffset: {
      width: -4,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowColor: "darkgray",
  },
  buttonText: {
    color: "darkcyan",
  },
});
