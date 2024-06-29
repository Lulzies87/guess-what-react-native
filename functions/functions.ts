import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export async function getUserToken() {
  try {
    const token = await SecureStore.getItemAsync("userToken");

    return token;
  } catch (error) {
    console.error("Couldn't get player token:", error);
  }
}

export async function checkLoginStatus() {
  try {
    const userToken = await getUserToken();
    if (userToken) {
      router.replace("/mainMenuPage");
    } else {
      router.replace("/loginPage");
    }
  } catch (error) {
    console.error("Failed to load user token:", error);
    router.replace("/loginPage");
  }
}

export async function logout() {
  try {
    await SecureStore.deleteItemAsync("userToken");
    router.replace("/loginPage");
  } catch (error) {
    console.error("Failed to log out:", error);
  }
}
