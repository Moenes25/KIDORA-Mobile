// ProfileScreen.js - Meaningful colors without dark theme
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
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BottomNav from "../components/BottomNav";
import TopBar from "../components/TopBar";
import SideBar from "../components/Sidebar";

const screenHeight = Dimensions.get("window").height;

const MenuItem = ({ icon, label, subtitle, color = "#6F42C1", onPress }) => {
  const [pressed, setPressed] = useState(false);
  
  return (
    <TouchableOpacity 
      style={[
        styles.menuItem, 
        {
          shadowOpacity: pressed ? 0.15 : 0.08,
          elevation: pressed ? 8 : 3,
        }
      ]} 
      activeOpacity={1}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
    >
      <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuLabel}>{label}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={22} color="#999999" />
    </TouchableOpacity>
  );
};

export default function ProfileScreen({ navigation, route }) {
  const user = route.params?.user || {};
  const { colors } = useTheme();

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const fullName = user.firstname && user.lastname
    ? `${user.firstname} ${user.lastname}`
    : user.name || user.fullname || "Omar Djebbi";
  const username = user.username || "@omar.djebbi.94";

  const toggleSidebar = () => setSidebarVisible(prev => !prev);

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Oui",
        onPress: async () => {
          await AsyncStorage.removeItem("user");
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  };

  const TOP_SECTION_HEIGHT = screenHeight * 0.45;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6F42C1" />
      
      <SideBar 
        visible={sidebarVisible} 
        onClose={toggleSidebar} 
        username={fullName} 
        email={user.email} 
        navigation={navigation} 
        onLogout={handleLogout} 
      />

      {/* PURPLE GRADIENT TOP SECTION */}
      <View style={[styles.fixedTopSection, { height: TOP_SECTION_HEIGHT }]}>
        <LinearGradient colors={colors.headerGradient} style={StyleSheet.absoluteFill}>
          <View style={styles.safeArea} />
          <TopBar onMenuPress={toggleSidebar} />

          <View style={styles.heroContent}>
            <View style={styles.hero}>
              <View style={styles.avatarWrapper}>
                <Image source={require("../assets/default_avatar.jpg")} style={styles.avatar} />
                <TouchableOpacity
                  style={styles.cameraBtn}
                  onPress={() => navigation.navigate("EditProfileScreen", { user })}
                >
                  <Ionicons name="camera" size={18} color="#6F42C1" />
                </TouchableOpacity>
              </View>
              <Text style={styles.name}>{fullName}</Text>
              <Text style={styles.username}>{username}</Text>
            </View>

            {/* Security Alert Card */}
            <TouchableOpacity style={styles.securityCardTop}>
              <View style={styles.securityIconWrapper}>
                <Ionicons name="shield-checkmark" size={24} color="#FF6B6B" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.securityTitleTop}>Security Alerts</Text>
                <Text style={styles.securitySubtitle}>2 items need attention</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>
            
            <View style={{ height: 40 }} />
          </View>
        </LinearGradient>
      </View>

      {/* WHITE BOTTOM SECTION */}
      <View style={[styles.scrollableBottomSection, { top: TOP_SECTION_HEIGHT }]}>
        <ScrollView contentContainerStyle={styles.bottomScroll} showsVerticalScrollIndicator={false}>
          {/* Account */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>ACCOUNT</Text>
            <MenuItem 
              icon="person-outline" 
              label="Edit Profile"
              color="#6F42C1"
              onPress={() => navigation.navigate("EditProfileScreen", { user })} 
            />
            <MenuItem 
              icon="lock-closed-outline" 
              label="Change Password"
              color="#FFC75F"
              onPress={() => setModalVisible(true)} 
            />
            <MenuItem 
              icon="card-outline" 
              label="Payments"
              color="#4ECDC4"
              onPress={() => navigation.navigate("PaymentsScreen")} 
            />
          </View>

          {/* Support */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>SUPPORT</Text>
            <MenuItem 
              icon="help-circle-outline" 
              label="Help & Support"
              color="#4CAF50"
              onPress={() => navigation.navigate("HelpSupport")} 
            />
            <MenuItem 
              icon="document-text-outline" 
              label="Privacy Policy"
              color="#9B59B6"
              onPress={() => {}} 
            />
          </View>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#E53935" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <Text style={styles.version}>Version 1.2.4</Text>
        </ScrollView>
      </View>

      {/* Password Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Current Password" 
              placeholderTextColor="#999999"
              secureTextEntry 
              value={currentPwd} 
              onChangeText={setCurrentPwd} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="New Password" 
              placeholderTextColor="#999999"
              secureTextEntry 
              value={newPwd} 
              onChangeText={setNewPwd} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Confirm Password" 
              placeholderTextColor="#999999"
              secureTextEntry 
              value={confirmPwd} 
              onChangeText={setConfirmPwd} 
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn}>
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomNavContainer}>
        <BottomNav navigation={navigation} activeScreen="person" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  fixedTopSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: "hidden",
    borderBottomEndRadius: 38,
    borderBottomStartRadius: 38,
  },
  safeArea: { height: Platform.OS === "ios" ? 44 : StatusBar.currentHeight },
  heroContent: { paddingHorizontal: 16, paddingVertical: 8, flex: 1, justifyContent: "center" },
  hero: { alignItems: "center", paddingVertical: 20, paddingHorizontal: 20, borderRadius: 20, backgroundColor: "rgba(255, 255, 255, 0.15)" },
  avatarWrapper: { position: "relative", marginBottom: 10 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: "#fff" },
  cameraBtn: { position: "absolute", right: -2, bottom: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: "#ffffff", justifyContent: "center", alignItems: "center", borderWidth: 2, borderColor: "#fff" },
  name: { fontSize: 20, fontWeight: "700", color: "#fff", marginBottom: 2 },
  username: { fontSize: 13, color: "#ffffff", opacity: 0.85 },

  securityCardTop: { 
    flexDirection: "row", 
    alignItems: "center", 
    padding: 14, 
    borderRadius: 16,
    marginTop: 16,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  securityIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  securityTitleTop: { fontSize: 15, fontWeight: "600", color: "#ffffff" },
  securitySubtitle: { fontSize: 12, color: "rgba(255, 255, 255, 0.8)", marginTop: 2 },
  badge: { width: 26, height: 26, borderRadius: 13, justifyContent: "center", alignItems: "center", backgroundColor: "#FF6B6B" },
  badgeText: { color: "#fff", fontWeight: "bold", fontSize: 13 },

  scrollableBottomSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  bottomScroll: { paddingHorizontal: 16, paddingTop: 32, paddingBottom: 100 },
  section: { marginTop: 24 },
  sectionHeader: { fontSize: 13, fontWeight: "700", color: "#999999", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 },
  menuItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 16, 
    paddingHorizontal: 16,
    marginVertical: 6,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContent: { flex: 1, marginLeft: 16 },
  menuLabel: { fontSize: 16, fontWeight: "600", color: "#1a1a2e" },
  menuSubtitle: { fontSize: 14, marginTop: 2, fontWeight: "500", color: "#666666" },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#FFEBEE",
    borderRadius: 16,
    marginTop: 20,
  },
  logoutText: { fontSize: 16, fontWeight: "600", color: "#E53935", marginLeft: 10 },

  version: { textAlign: "center", fontSize: 14, color: "#999999", marginVertical: 40 },

  bottomNavContainer: { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10, backgroundColor: "#ffffff" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "90%", backgroundColor: "#ffffff", borderRadius: 20, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#6F42C1", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#e0e0e0", backgroundColor: "#f5f5f5", borderRadius: 12, padding: 14, marginBottom: 14, fontSize: 16, color: "#1a1a2e" },
  modalButtons: { flexDirection: "row", marginTop: 10 },
  cancelBtn: { flex: 1, paddingVertical: 14, backgroundColor: "#f1f1f1", borderRadius: 12, marginHorizontal: 6 },
  confirmBtn: { flex: 1, paddingVertical: 14, backgroundColor: "#6F42C1", borderRadius: 12, marginHorizontal: 6 },
  cancelText: { textAlign: "center", fontWeight: "600", color: "#1a1a2e" },
  confirmText: { textAlign: "center", color: "#fff", fontWeight: "600" },
});