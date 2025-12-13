// components/LanguageSelector.js - Updated to work with TranslationProvider
import React from "react";
import { Image, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "../context/TranslationContext";

const FLAGS = {
  en: require("../assets/flags/en.png"),
  fr: require("../assets/flags/fr.png"),
  ar: require("../assets/flags/ar.png"),
};

const LANGUAGE_ORDER = ["en", "fr", "ar"];

export default function LanguageSelector() {
  const { language, changeLanguage } = useTranslation();

  const cycleLanguage = () => {
    const currentIndex = LANGUAGE_ORDER.indexOf(language);
    const nextIndex = (currentIndex + 1) % LANGUAGE_ORDER.length;
    const nextLang = LANGUAGE_ORDER[nextIndex];

    changeLanguage(nextLang);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={cycleLanguage}>
      <Image source={FLAGS[language]} style={styles.flag} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  flag: {
    width: 37,
    height: 29,
    borderRadius: 4,
  },
});