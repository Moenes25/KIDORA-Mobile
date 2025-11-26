import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import api from "../api/api";

export default function Registerv1({ navigation }) {
  const [form, setForm] = useState({ name: "", email: "", password: "",firstname:"" , lastname :"" });

  const onRegister = async () => {
    try {
      await api.post("/auth/register", form);
      navigation.navigate("Login");
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput placeholder="Name" style={styles.input}
        onChangeText={(v) => setForm({ ...form, name: v })} />

      <TextInput placeholder="Email" style={styles.input}
        onChangeText={(v) => setForm({ ...form, email: v })} />

         <TextInput placeholder="FirstName"  style={styles.input}
        onChangeText={(v) => setForm({ ...form, firstname: v })} />
         <TextInput placeholder="LastNmae"  style={styles.input}
        onChangeText={(v) => setForm({ ...form, lastname: v })} />

      <TextInput placeholder="Password" secureTextEntry style={styles.input}
        onChangeText={(v) => setForm({ ...form, password: v })} />

      <TouchableOpacity style={styles.btn} onPress={onRegister}>
        <Text style={styles.btntxt}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 8 },
  btn: { backgroundColor: "#000", padding: 15, borderRadius: 8, marginTop: 10 },
  btntxt: { color: "#fff", textAlign: "center", fontWeight: "bold" }
});
