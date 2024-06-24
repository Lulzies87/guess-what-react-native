import { useRef, useState } from "react";
import {
  Camera,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import server from "../app/api-client";

export default function CameraComponent() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photoURI, setPhotoURI] = useState<string | null>(null);
  const cameraRef = useRef<Camera>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function takePhoto() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
      });
      console.log("Photo taken:", photo);
      setPhotoURI(photo.uri);

      try {
        const res = await server.post("/upload", { imageData: photo.base64 });
        console.log("Server response:", res.data);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        pictureSize=""
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.text}>Take Photo</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
      {photoURI && (
        <Image source={{ uri: photoURI }} style={styles.capturedImage} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  capturedImage: {
    width: 200,
    height: 200,
    marginTop: 20,
    alignSelf: "center",
  },
});
