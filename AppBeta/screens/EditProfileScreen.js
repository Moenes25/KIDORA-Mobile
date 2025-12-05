import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";

export default function EditProfileScreen({ navigation, route }) {
  const user = route.params?.user || {};

  const [avatar, setAvatar] = useState(
    user.avatar || require("../assets/default_avatar.jpg")
  );
  const [form, setForm] = useState({
    fullname: user.fullname || "",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    occupation: user.occupation || "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar({ uri: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Gradient Header */}
        <LinearGradient colors={["#6F42C1", "#9b59b6"]} style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={28} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={{ width: 28 }} />
          </View>

          <View style={styles.avatarContainer}>
            <Image source={avatar} style={styles.avatar} />
            <TouchableOpacity style={styles.addAvatarBtn} onPress={pickImage}>
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Form Fields */}
        {[
          { label: "Full Name", key: "fullname", icon: "person-outline" },
          { label: "Email", key: "email", icon: "mail-outline" },
          { label: "Phone", key: "phone", icon: "call-outline" },
          { label: "Address", key: "address", icon: "location-outline" },
          { label: "Occupation", key: "occupation", icon: "briefcase-outline" },
        ].map((item) => (
          <View key={item.key} style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{item.label}</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={form[item.key]}
                onChangeText={(text) => handleChange(item.key, text)}
                placeholderTextColor="#999"
              />
              <Ionicons
                name={item.icon}
                size={22}
                color="#6F42C1"
                style={styles.inputIcon}
              />
            </View>
          </View>
        ))}

        {/* Action Buttons */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.btn, styles.saveBtn]}
            onPress={() => {
              console.log("Save pressed", form);
              // TODO: Implement save logic
            }}
          >
            <Ionicons name="checkmark-outline" size={20} color="white" />
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.discardBtn]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close-outline" size={20} color="#333" />
            <Text style={[styles.btnText, { color: "#333" }]}>Discard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  
    flex: 1,
    backgroundColor: "#fbf7ff",
  },
  content: {
    paddingBottom: 30,
    alignItems: "center",
  },
  header: {
    width: "100%",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 50,
    paddingBottom: 30,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 25,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: "white",
  },
  addAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6F42C1",
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  inputContainer: {
    width: "90%",
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: "#6F42C1",
    fontWeight: "600",
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 14,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  inputIcon: {
    marginLeft: 10,
  },
  buttonsRow: {
    flexDirection: "row",
    width: "90%",
    marginTop: 30,
    gap: 12,
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  saveBtn: {
    backgroundColor: "#6F42C1",
  },
  discardBtn: {
    backgroundColor: "#e0e0e0",
  },
  btnText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});