// ProfileScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BottomNav from "../components/BottomNav";
import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar.js";   // Your exact same SideBar

export default function ProfileScreen({ navigation, route }) {
  const user = route.params?.user || {};

  // THIS IS THE KEY STATE
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const fullName =
    user.firstname && user.lastname
      ? `${user.firstname} ${user.lastname}`
      : user.name || user.fullname || "John Doe";
  const email = user.email || "john@example.com";

  // Toggle function – must be passed to TopBar
  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);   // This toggles it correctly
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await AsyncStorage.removeItem("user");
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  const handleNotifications = () => Alert.alert("Notifications", "Coming soon!");

  const handleChangePassword = () => {
    // your validation…
    Alert.alert("Success", "Password changed!", [{ text: "OK", onPress: () => setModalVisible(false) }]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* SIDEBAR – EXACTLY LIKE HOMESCREEN */}
        <SideBar
          visible={sidebarVisible}
          onClose={toggleSidebar}
          username={fullName}
          email={email}
          navigation={navigation}
          onLogout={handleLogout}
          onNotifications={handleNotifications}
        />

        {/* TOPBAR – THIS LINE IS CRUCIAL */}
        <TopBar
          onMenuPress={toggleSidebar}           // Triggers sidebar
          onNotificationPress={handleNotifications}
          onLanguageChange={() => Alert.alert("Language", "Coming soon!")}
          lang="en"
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Your beautiful header */}
          <LinearGradient colors={["#6F42C1", "#8e44ad"]} style={styles.header}>
            <View style={styles.avatarContainer}>
              <Image source={require("../assets/default_avatar.jpg")} style={styles.avatar} />
              <TouchableOpacity
                style={styles.editAvatarButton}
                onPress={() => navigation.navigate("EditProfileScreen", { user })}
              >
                <Ionicons name="camera-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.email}>{email}</Text>
          </LinearGradient>

          {/* Menu items */}
          <View style={styles.menuContainer}>
            {[
              { icon: "person-outline", label: "Edit Profile", onPress: () => navigation.navigate("EditProfileScreen", { user }) },
              { icon: "lock-closed-outline", label: "Change Password", onPress: () => setModalVisible(true) },
              { icon: "help-circle-outline", label: "Help & Support", onPress: () => navigation.navigate("HelpSupport") },
              { icon: "card-outline", label: "Payments", onPress: () => navigation.navigate("PaymentsScreen") },
              { icon: "log-out-outline", label: "Logout", onPress: handleLogout, destructive: true },
            ].map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.menuItem, item.destructive && styles.destructiveItem]}
                onPress={item.onPress}
              >
                <View style={styles.menuLeft}>
                  <Ionicons name={item.icon} size={24} color={item.destructive ? "#e74c3c" : "#6F42C1"} />
                  <Text style={[styles.menuText, item.destructive && styles.destructiveText]}>
                    {item.label}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#bbb" />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.versionText}>App Version 1.0.0</Text>
        </ScrollView>

        {/* Change Password Modal – unchanged */}
        <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
          {/* ... your modal code ... */}
        </Modal>

        <BottomNav navigation={navigation} activeScreen="person" />
      </View>
    </SafeAreaView>
  );
}

/* Styles – unchanged, just keep them */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8f9fa", paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: { alignItems: "center", paddingVertical: 50, paddingHorizontal: 20 },
  avatarContainer: { position: "relative", marginBottom: 16 },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4, borderColor: "#fff" },
  editAvatarButton: {
    position: "absolute", right: 0, bottom: 0, backgroundColor: "#9b59b6", width: 38, height: 38,
    borderRadius: 19, justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "#fff",
  },
  name: { fontSize: 26, fontWeight: "700", color: "#fff", marginTop: 10 },
  email: { fontSize: 16, color: "#eee", marginTop: 6, opacity: 0.9 },
  menuContainer: { marginTop: 30, paddingHorizontal: 16 },
  menuItem: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: "#fff", paddingVertical: 18, paddingHorizontal: 20,
    borderRadius: 16, marginBottom: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  menuText: { fontSize: 17, marginLeft: 16, color: "#2c3e50", fontWeight: "500" },
  destructiveItem: { backgroundColor: "#fef5f5" },
  destructiveText: { color: "#e74c3c" },
  versionText: { textAlign: "center", color: "#95a5a6", fontSize: 14, marginVertical: 30, marginBottom: 80 },
  // ... modal styles stay the same
});