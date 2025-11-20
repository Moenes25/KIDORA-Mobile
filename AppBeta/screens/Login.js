import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import api from "../api/api";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 /* const onLoginV1 = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
    const profileres = await api.post(`/profile/create`, {"username": res.data.user.username});
    alert("Profile created ");
    console.log(profileres.data);
      
      navigation.navigate("ProfileEdit", { user: res.data.user });
        
    } catch (err) {
      alert(err.response.data.msg);
    }
  };*/
  const onLogin = async () => {
  try {
    const res = await api.post("/auth/login", { email, password });

    const user = res.data.user;
    const username = user.email.split("@")[0];
    const email_  = user.email;
    // CHECK IF PROFILE EXISTS
    //let check = await api.get(`/profile/${email}`);
    alert(username);
    //if (!check.data || check ==null) {}
      // CREATE PROFILE IF NOT EXISTS
      await api.post(`/profile/create`, {
        username: username,
        name: user.name,
        profession: "",
        DOB: "",
        titleline: "",
        about: "",
        img: ""
      });

      alert("Profile created!");
    

    navigation.navigate("ProfileEdit", { user });

  } catch (err) {
    console.log(err);
    alert("Error: " + err.response?.data?.msg);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput placeholder="Email" style={styles.input} onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry style={styles.input} onChangeText={setPassword} />

      <TouchableOpacity style={styles.btn} onPress={onLogin}>
        <Text style={styles.btntxt}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.link}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 8 },
  btn: { backgroundColor: "#000", padding: 15, borderRadius: 8, marginTop: 10 },
  btntxt: { color: "#fff", textAlign: "center", fontWeight: "bold" },
  link: { textAlign: "center", marginTop: 15 }
});
