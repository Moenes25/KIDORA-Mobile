import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import ScreenLayout from "../components/ScreenLayout";

export default function ProfileScreen({ navigation, route }) {
  const user = route.params?.user;

  return (
    <ScreenLayout navigation={navigation} user={user} activeScreen="person">
      <View style={styles.container}>
        <Text style={styles.title}>Profile Information</Text>
        <Image source={require("../assets/default_avatar.jpg")} style={styles.avatar} />
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.info}>Email: john@example.com</Text>
        <Text style={styles.info}>Phone: +216 123 456 789</Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fbf7ff" },
  title: { fontSize: 22, fontWeight: "700", color: "#6F42C1", marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: "600", marginBottom: 6 },
  info: { fontSize: 16, marginBottom: 4 },
});
