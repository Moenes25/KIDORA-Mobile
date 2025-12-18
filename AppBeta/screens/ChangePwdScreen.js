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
import { normalize, wp, hp } from "../utils/responsive";

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
                    size={normalize(22)}
                    color={isDark ? "#B794F4" : "#6F42C1"}
                    style={{ marginLeft: wp(2.5) }}
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
              <Ionicons name="checkmark-outline" size={normalize(20)} color="white" />
              <Text style={styles.btnText}> Save</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.btn, { backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "#ccc" }]} 
              onPress={onClose}
            >
              <Ionicons name="close-outline" size={normalize(20)} color={isDark ? "#ffffff" : "#333"} />
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
    width: wp(90),
    maxHeight: hp(80),
    backgroundColor: "white",
    borderRadius: normalize(20),
    overflow: "hidden",
  },
  header: {
    width: "100%",
    paddingVertical: hp(1.8),
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: normalize(15),
    borderBottomRightRadius: normalize(15),
  },
  headerTitle: {
    fontSize: normalize(20),
    fontWeight: "700",
    color: "white",
  },
  content: {
    padding: wp(5),
  },
  inputContainer: { 
    marginBottom: hp(1.8) 
  },
  inputLabel: { 
    fontSize: normalize(16), 
    fontWeight: "600", 
    marginBottom: hp(0.6) 
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: normalize(10),
    paddingHorizontal: wp(3),
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  input: { 
    flex: 1, 
    height: hp(5.5), 
    fontSize: normalize(16) 
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(2.5),
  },
  btn: {
    flex: 1,
    paddingVertical: hp(1.5),
    borderRadius: normalize(12),
    marginHorizontal: wp(1.2),
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  btnText: { 
    color: "white", 
    fontWeight: "600", 
    fontSize: normalize(16) 
  },
});