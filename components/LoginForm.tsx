import React, { useState } from "react";
import axios from "axios";
import server from "../app/api-client";
import { router } from "expo-router";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const res = await server.post("/login", { username, password });
      const userData = res.data; // TODO: Decide how to handle player data
      router.replace("/mainMenuPage");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error(error.response.data.error);
        } else if (error.request) {
          console.error("No response recieved:", error.request);
        } else {
          console.error(error.message);
        }
      } else {
        console.error("An unexpected error occured");
      }
    }
  };

  return (
    <View style={styles.formContainer}>
      <View style={styles.form}>
        <TextInput
          style={styles.formField}
          placeholder="Username"
          placeholderTextColor={"#888"}
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.formField}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor={"#888"}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <ThemedText style={styles.buttonText}>Login</ThemedText>
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
