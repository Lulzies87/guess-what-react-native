import * as SecureStore from "expo-secure-store";
import server from "../app/api-client";
import { router } from "expo-router";

export async function fetchUserToken() {
  try {
    const token = await SecureStore.getItemAsync("userToken");

    return token;
  } catch (error) {
    console.error("Couldn't get player token:", error);
  }
}

export async function fetchUserData() {
  const token = await fetchUserToken();

  if (!token) {
    throw new Error("No token found");
  }

  try {
    const res = await server.get("/userData", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch user data", error);
    throw error;
  }
}

export async function checkLoginStatus() {
  try {
    const userToken = await fetchUserToken();
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
