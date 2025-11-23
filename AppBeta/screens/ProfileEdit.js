import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import api from "../api/api";

export default function ProfileEdit({ route }) {
  const { user } = route.params;

  const [profile, setProfile] = useState({
    username: user.email.split("@")[0],
    email : user.email ,
    name: "",
    profession: "",
    DOB: "",
    titleline: "",
    about: "",
  });

  const saveProfile = async () => {
    try {
      await api.put(`/profile/${username}`, profile);
      alert("Profile updated");
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      {Object.keys(profile).map((field) => (
        <TextInput
          key={field}
          placeholder={field}
          style={styles.input}
          value={profile[field]}
          onChangeText={(v) => setProfile({ ...profile, [field]: v })}
        />
      ))}

      <TouchableOpacity style={styles.btn} onPress={saveProfile}>
        <Text style={styles.btntxt}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 15 },
  input: { borderWidth: 1, padding: 10, marginVertical: 8, borderRadius: 8 },
  btn: { backgroundColor: "#000", padding: 15, borderRadius: 8, marginTop: 10 },
  btntxt: { color: "#fff", textAlign: "center" },
});
