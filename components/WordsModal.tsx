import React, { ReactNode } from "react";
import { View, StyleSheet, Modal, Pressable } from "react-native";
import { ThemedText } from "./ThemedText";
import { MaterialIcons } from "@expo/vector-icons";
import { Words } from "./Words";

type WordsModalProps = {
  isVisible: boolean;
  children: ReactNode;
  wordNumber: keyof Words | null;
  onClose: () => void;
  onSave: () => void;
};

const wordKeys: (keyof Words)[] = ['firstWord', 'secondWord', 'thirdWord', 'fourthWord'];

export default function WordsModal({
  isVisible,
  children,
  wordNumber,
  onClose,
  onSave,
}: WordsModalProps) {
  const wordIndex = wordNumber !== null ? wordKeys.indexOf(wordNumber) + 1 : null;

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible}>
      <View style={styles.overlay}>
        <View style={styles.contnainer}>
          <View style={styles.titleContainer}>
            <ThemedText type="subtitle">Word #{wordIndex}</ThemedText>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" color="black" size={22} />
            </Pressable>
          </View>
          {children}
          <Pressable onPress={onSave}>
            <MaterialIcons name="check-circle" color="black" size={30} />
          </Pressable>
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
