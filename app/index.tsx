import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import { checkLoginStatus } from "@/functions/functions";

export default function AuthLoadingScreen() {
  checkLoginStatus();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
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
