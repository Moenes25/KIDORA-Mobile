import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";

export default function ChangePwdScreen({ onClose }) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";
  
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChange = (key, value) => setForm({ ...form, [key]: value });
  const toggleShowPassword = (key) =>
    setShowPassword({ ...showPassword, [key]: !showPassword[key] });

  const handleSave = () => {
    if (form.newPassword !== form.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    console.log("Password change submitted:", form);
    onClose();
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.modalCard}>
        {/* Gradient Header */}
        <LinearGradient
          colors={isDark 
            ? (colors.bgGradient || ["#1a1a2e", "#0f0f1f"])
            : (colors.headerGradient || ["#6F42C1", "#9b59b6"])
          }
          style={styles.header}
        >
          {isDark && (
            <View style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }} />
          )}
          <Text style={styles.headerTitle}>Change Password</Text>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.content}>
          {[ 
            { label: "Current Password", key: "currentPassword", placeholder: "Enter current password" },
            { label: "New Password", key: "newPassword", placeholder: "Enter new password" },
            { label: "Confirm Password", key: "confirmPassword", placeholder: "Confirm new password" },
          ].map((item) => (
            <View key={item.key} style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: isDark ? "#B794F4" : "#6F42C1" }]}>
                {item.label}
              </Text>
              <View style={[
                styles.inputRow,
                { backgroundColor: isDark ? "rgba(0, 0, 0, 0.3)" : "white" }
              ]}>
                <TextInput
                  style={[styles.input, { color: isDark ? "#ffffff" : "#333" }]}
                  placeholder={item.placeholder}
                  placeholderTextColor={isDark ? "#999" : "#999"}
                  value={form[item.key]}
                  onChangeText={(text) => handleChange(item.key, text)}
                  secureTextEntry={!showPassword[item.key]}
                />
                <TouchableOpacity onPress={() => toggleShowPassword(item.key)}>
                  <Ionicons
                    name={showPassword[item.key] ? "eye-off" : "eye"}
                    size={22}
                    color={isDark ? "#B794F4" : "#6F42C1"}
                    style={{ marginLeft: 10 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <View style={styles.buttonsRow}>
            <TouchableOpacity 
              style={[styles.btn, { backgroundColor: isDark ? "#7c3aed" : "#6F42C1" }]} 
              onPress={handleSave}
            >
              <Ionicons name="checkmark-outline" size={20} color="white" />
              <Text style={styles.btnText}> Save</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.btn, { backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#ccc" }]} 
              onPress={onClose}
            >
              <Ionicons name="close-outline" size={20} color={isDark ? "#ffffff" : "#333"} />
              <Text style={[styles.btnText, { color: isDark ? "#ffffff" : "#333" }]}> Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
  },
  header: {
    width: "100%",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  content: {
    padding: 20,
  },
  inputContainer: { marginBottom: 15 },
  inputLabel: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  input: { flex: 1, height: 45, fontSize: 16 },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  btnText: { color: "white", fontWeight: "600", fontSize: 16 },
});