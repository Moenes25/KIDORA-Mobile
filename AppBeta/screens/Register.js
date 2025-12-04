import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Wave from "../components/Wave";
import api from "../api/api";



export default function Register({ navigation }) {


  const [form, setForm] = useState({
    name: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

const onRegister = async () => {
  if (!form.email || !form.password || !form.name || !form.firstname || !form.lastname) {
    Alert.alert("Error", "Please fill all fields.");
    return;
  }

  setLoading(true);
  console.log("Sending registration:", form); // ADD THIS
  
  try {
    const response = await api.post("/auth/register", form);
    console.log("Registration response:", response.data); // ADD THIS
    
    Alert.alert("Success", "Registration complete. Please log in.", [
      { text: "OK", onPress: () => navigation.navigate("Login") }
    ]);
  } catch (err) {
    console.log("Registration error:", err.response?.data); // ADD THIS
    console.log("Full error:", err); // ADD THIS
    
    const errorMsg = err.response?.data?.msg || err.response?.data?.error || "Registration failed. Please try again.";
    Alert.alert("Registration Error", errorMsg);
  } finally {
    setLoading(false);
  }
};
const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <Wave />
      <Text style={styles.title}>Create Account</Text>

      <TextInput placeholder="Name" style={styles.input} onChangeText={(v) => setForm({...form, name: v})} />
      <TextInput placeholder="First Name" style={styles.input} onChangeText={(v) => setForm({...form, firstname: v})} />
      <TextInput placeholder="Last Name" style={styles.input} onChangeText={(v) => setForm({...form, lastname: v})} />
      <TextInput placeholder="Email" style={styles.input} onChangeText={(v) => setForm({...form, email: v})} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} onChangeText={(v) => setForm({...form, password: v})} />

      <TouchableOpacity style={styles.btn} onPress={onRegister} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "Registering..." : "Register"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>Already have account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center", overflow: "hidden" },
  title: { textAlign: "center", fontSize: 32, fontWeight: "bold", marginBottom: 20, marginTop: 80 },
  input: { borderWidth: 1, padding: 12, borderRadius: 10, marginVertical: 10 },
  btn: { backgroundColor: "#4b6cb7", padding: 15, borderRadius: 10, marginTop: 10 },
  btnText: { color: "#fff", textAlign: "center", fontSize: 18 },
  loginText: { textAlign: "center", marginTop: 10, color: "#333" }
});
