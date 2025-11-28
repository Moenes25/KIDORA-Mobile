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

export default function ChangePwdScreen({ navigation }) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State to toggle visibility for each field
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const toggleShowPassword = (key) => {
    setShowPassword({ ...showPassword, [key]: !showPassword[key] });
  };

  const handleSave = () => {
    if (form.newPassword !== form.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    console.log("Password change submitted:", form);
    // TODO: connect to backend to update password
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#6F42C1" />
          </TouchableOpacity>
          <Text style={styles.title}>Change Password</Text>
          <View style={{ width: 28 }} /> {/* placeholder to center title */}
        </View>

        <View style={{ height: 50 }} />

        {/* Password Fields */}
        {[
          { label: "Current password", key: "currentPassword", placeholder: "Enter your current password" },
          { label: "New password", key: "newPassword", placeholder: "Enter your new password" },
          { label: "Confirm password", key: "confirmPassword", placeholder: "Confirm your new password" },
        ].map((item) => (
          <View key={item.key} style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{item.label}</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder={item.placeholder}
                placeholderTextColor="#999"
                value={form[item.key]}
                onChangeText={(text) => handleChange(item.key, text)}
                secureTextEntry={!showPassword[item.key]}
              />
              <TouchableOpacity onPress={() => toggleShowPassword(item.key)}>
                <Ionicons
                  name={showPassword[item.key] ? "eye-off" : "eye"}
                  size={22}
                  color="#6F42C1"
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Buttons */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#6F42C1" }]}
            onPress={handleSave}
          >
            <Ionicons name="checkmark-outline" size={20} color="white" />
            <Text style={styles.btnText}> Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#ccc", flexDirection: "row", justifyContent: "center" }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close-outline" size={20} color="#333" />
            <Text style={[styles.btnText, { color: "#333" }]}> Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf7ff" },
  content: { padding: 20, alignItems: "center" },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  title: { fontSize: 22, fontWeight: "700", color: "#6F42C1" },

  inputContainer: { width: "100%", marginBottom: 12 },
  inputLabel: { fontSize: 17, color: "#6F42C1", fontWeight: "600", marginBottom: 4 },
  
  inputRow: { 
    flexDirection: "row", 
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },

  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: "#333",
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
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
