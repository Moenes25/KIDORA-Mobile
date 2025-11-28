import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

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
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={28} color="#6F42C1" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={{ width: 28 }} /> {/* Placeholder to center title */}
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image source={avatar} style={styles.avatar} />
          <TouchableOpacity style={styles.addAvatarBtn} onPress={pickImage}>
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Fields */}
        {[
          { label: "Full Name", key: "fullname", icon: "pencil-outline" },
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

        {/* Buttons */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#6F42C1" }]}
            onPress={() => {
              console.log("Save pressed", form);
              // TODO: save changes to backend
            }}
          >
            <Ionicons name="checkmark-outline" size={20} color="white" />
            <Text style={styles.btnText}> Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, { backgroundColor: "#ccc", flexDirection: "row", justifyContent: "center" }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close-outline" size={20} color="#333" />
            <Text style={[styles.btnText, { color: "#333" }]}> Discard</Text>
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

  avatarContainer: { alignItems: "center", marginBottom: 20, position: "relative" },
  avatar: { width: 110, height: 110, borderRadius: 55 },
  addAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6F42C1",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },

  inputContainer: { width: "100%", marginBottom: 12 },
  inputLabel: { fontSize: 14, color: "#6F42C1", fontWeight: "600", marginBottom: 4 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  input: { flex: 1, height: 45, fontSize: 16, color: "#333" },
  inputIcon: { marginLeft: 10 },

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
