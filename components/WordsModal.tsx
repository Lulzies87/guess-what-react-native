import React, { ReactNode } from "react";
import { View, StyleSheet, Modal, Pressable } from "react-native";
import { ThemedText } from "./ThemedText";
import { MaterialIcons } from "@expo/vector-icons";

type WordsModalProps = {
  isVisible: boolean;
  children: ReactNode;
  wordNumber: number | null;
  onClose: () => void;
};

export default function WordsModal({
  isVisible,
  children,
  wordNumber,
  onClose,
}: WordsModalProps) {
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={styles.overlay}>
        <View style={styles.contnainer}>
          <View style={styles.titleContainer}>
            <ThemedText type="subtitle">Word #{wordNumber! + 1}</ThemedText>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" color="black" size={22} />
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contnainer: {
    height: "40%",
    width: "80%",
    backgroundColor: "whitesmoke",
    alignItems: "center",
    borderRadius: 18,
    borderColor: "lightgrey",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowColor: "dimgrey",
  },
  titleContainer: {
    width: "100%",
    height: "15%",
    backgroundColor: "gainsboro",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
