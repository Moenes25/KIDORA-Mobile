import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import TopNav from "../components/TopNav";
import BottomNav from "../components/BottomNav";

export default function ProfileScreen({ navigation, route }) {
  const user = route.params?.user;

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <TopNav navigation={navigation} user={user} />

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Profile Information</Text>
        <Image
          source={require("../assets/default_avatar.jpg")}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name || "John Doe"}</Text>
        <Text style={styles.info}>Email: {user?.email || "john@example.com"}</Text>
        <Text style={styles.info}>Phone: {user?.phone || "+216 123 456 789"}</Text>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNav navigation={navigation} activeScreen="person" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf7ff" },
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#6F42C1",
    marginBottom: 20,
  },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  name: { fontSize: 18, fontWeight: "600", marginBottom: 6 },
  info: { fontSize: 16, marginBottom: 4 },
});
