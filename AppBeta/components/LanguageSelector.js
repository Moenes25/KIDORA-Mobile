import React, { useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet, Modal, Text } from "react-native";

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState({
    code: "en",
    flag: require("../assets/eng.png"),
  });

  const languages = [
    { code: "en", flag: require("../assets/eng.png") },
    { code: "fr", flag: require("../assets/fr.png") },
    { code: "ar", flag: require("../assets/arab.png") },
  ];

  return (
    <View>
      {/* Selected Flag Only */}
      <TouchableOpacity style={styles.selected} onPress={() => setOpen(true)}>
        <Image source={language.flag} style={styles.flag} />
      </TouchableOpacity>

      {/* Dropdown */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setOpen(false)}
        >
          <View style={styles.dropdown}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={styles.option}
                onPress={() => {
                  setLanguage(lang);
                  setOpen(false);
                }}
              >
                <Image source={lang.flag} style={styles.flag} />
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selected: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: "#e0c3fc",
    justifyContent: "center",
    alignItems: "center",
  },
  flag: {
    width: 28,
    height: 20,
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 70,
    paddingRight: 20,
  },
  dropdown: {
    backgroundColor: "#e0c3fc",
    borderRadius: 8,
    padding: 4,
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
});
