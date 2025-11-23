import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState({
    code: "en",
    label: "English",
    flag: require("../assets/eng.png"),
  });

  const languages = [
    { code: "en", label: "English", flag: require("../assets/eng.png") },
    { code: "fr", label: "Français", flag: require("../assets/fr.png") },
    { code: "ar", label: "العربية", flag: require("../assets/arab.png") },
  ];

  return (
    <View style={styles.container}>
      {/* Current selection */}
      <TouchableOpacity style={styles.selected} onPress={() => setOpen(!open)}>
        <Image source={language.flag} style={styles.flag} />
        <Text style={styles.text}>{language.label}</Text>
      </TouchableOpacity>

      {/* Dropdown */}
      {open && (
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
              <Text style={styles.text}>{lang.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { zIndex: 100 },
  selected: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 8,
  },
  text: {
    fontSize: 16,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 5,
    borderRadius: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
});
