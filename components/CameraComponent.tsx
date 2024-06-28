import { useRef, useState } from "react";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import * as ImageManipulator from "expo-image-manipulator";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

interface CameraCompponentProps {
  onPhotoUriReady: (uri: string | null) => void;
  onClose: () => void;
}

export default function CameraComponent({
  onPhotoUriReady,
  onClose,
}: CameraCompponentProps) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [resizedPhotoUri, setResizedPhotoUri] = useState<string | null>(null);

  const cameraRef = useRef<CameraView>(null);

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const onTakePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();

      if (photo) {
        const resizedPhoto = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 800 } }],
          { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        setResizedPhotoUri(resizedPhoto.uri);
      } else {
        console.error("There was a problem with the photo:", photo);
      }
    }
  };

  const onRetakePicture = () => {
    setResizedPhotoUri(null);
  };

  const onSubmitPicture = () => {
    if (resizedPhotoUri) {
      onPhotoUriReady(resizedPhotoUri);
      setResizedPhotoUri(null);
    }
  };

  const onCloseCamera = () => {
    setResizedPhotoUri(null);
    onPhotoUriReady(null);
    onClose();
  };

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

  return (
    <View style={styles.container}>
      {resizedPhotoUri ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: resizedPhotoUri }} style={styles.image} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onRetakePicture}>
              <MaterialCommunityIcons
                name="camera-retake"
                size={34}
                color="lightgray"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onSubmitPicture}>
              <AntDesign name="check" size={34} color="lightgray" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          pictureSize={"Low"}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleCameraFacing}
            >
              <AntDesign name="reload1" size={34} color="lightgray" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onTakePicture}>
              <AntDesign name="camera" size={34} color="lightgray" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={onCloseCamera}>
              <AntDesign name="close" size={34} color="lightgray" />
            </TouchableOpacity>
          </View>
        </CameraView>
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
    justifyContent: "space-between",
    position: "absolute",
    bottom: "7%",
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
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
});
