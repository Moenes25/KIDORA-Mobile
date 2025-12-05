import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LightTheme, DarkTheme } from "./ThemeColors";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("system"); // light | dark | system
  const [theme, setTheme] = useState(getSystemTheme());

  function getSystemTheme() {
    return Appearance.getColorScheme() === "dark" ? "dark" : "light";
  }

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    if (themeMode === "system") {
      setTheme(getSystemTheme());
    } else {
      setTheme(themeMode);
    }
    AsyncStorage.setItem("themeMode", themeMode);
  }, [themeMode]);

  async function loadTheme() {
    const saved = await AsyncStorage.getItem("themeMode");
    if (saved) setThemeMode(saved);
  }

  const colors = theme === "dark" ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
