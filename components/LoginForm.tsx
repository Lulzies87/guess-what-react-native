import React from "react";
import { useForm } from "@tanstack/react-form";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";

export default function LoginForm() {
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <View style={styles.formContainer}>
      <View style={styles.formFieldsContainer}>
        <form.Field
          name="username"
          children={(field) => (
            <TextInput
              style={styles.formField}
              placeholder="Username"
              placeholderTextColor={"#888"}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={(text) => field.handleChange(text)}
            />
          )}
        />
        <form.Field
          name="password"
          children={(field) => (
            <TextInput
              style={styles.formField}
              placeholder="Password"
              placeholderTextColor={"#888"}
              secureTextEntry={true}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChangeText={(text) => field.handleChange(text)}
            />
          )}
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={form.handleSubmit}>
          <ThemedText style={styles.buttonText}>Login</ThemedText>
        </TouchableOpacity>
        <ThemedText>
          New to Guess What? <ThemedText type="link">Register</ThemedText>
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  formFieldsContainer: {
    flex: 6,
    justifyContent: "center",
    gap: 14,
    width: "80%",
  },
  formField: {
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
  footer: {
    flex: 1,
    gap: 8,
    alignItems: "center",
    width: "100%",
  },
});
