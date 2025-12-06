// context/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LightTheme, DarkTheme } from "./ThemeColors";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("system"); // "light" | "dark" | "system"
  const [theme, setTheme] = useState("light");

  const getSystemTheme = () => (Appearance.getColorScheme() === "dark" ? "dark" : "light");

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      if (themeMode === "system") {
        setTheme(getSystemTheme());
      } else {
        setTheme(themeMode);
      }
      AsyncStorage.setItem("themeMode", themeMode);
    };
    applyTheme();
  }, [themeMode]);

  // Listen to system changes when in "system" mode
  useEffect(() => {
    if (themeMode === "system") {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setTheme(colorScheme === "dark" ? "dark" : "light");
      });
      return () => subscription.remove();
    }
  }, [themeMode]);

  const loadTheme = async () => {
    const saved = await AsyncStorage.getItem("themeMode");
    if (saved) setThemeMode(saved);
  };

  const colors = theme === "dark" ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);