// ProfileScreen.js — DEEP PURPLE GRADIENT & FULLY THEME-AWARE
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
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

import BottomNav from "../components/BottomNav";
import TopBar from "../components/TopBar";
import SideBar from "../components/Sidebar";

const MenuItem = ({ icon, label, subtitle, destructive = false, onPress }) => {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";
  
  return (
    <TouchableOpacity 
      style={[
        styles.menuItem, 
        { 
          backgroundColor: colors.card,
          shadowColor: isDark ? "#000" : "#000",
          shadowOpacity: isDark ? 0.3 : 0.05,
        }
      ]} 
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={24}
        color={destructive ? (isDark ? "#FF4081" : "#e74c3c") : (isDark ? "#fff" : colors.primary)}
      />
      <View style={styles.menuContent}>
        <Text style={[
          styles.menuLabel, 
          { color: colors.text }, 
          destructive && { color: isDark ? "#FF4081" : "#e74c3c" }
        ]}>
          {label}
        </Text>
        {subtitle && <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
      </View>
      {!destructive && <Ionicons name="chevron-forward" size={22} color={colors.textSecondary} />}
    </TouchableOpacity>
  );
};

export default function ProfileScreen({ navigation, route }) {
  const user = route.params?.user || {};
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

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

  const shadowColor = isDark ? "#000" : "#000";

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient colors={colors.bgGradient} style={{ flex: 1 }}>
        <SideBar 
          visible={sidebarVisible} 
          onClose={toggleSidebar} 
          username={fullName} 
          email={user.email} 
          navigation={navigation} 
          onLogout={handleLogout} 
        />
        <TopBar onMenuPress={toggleSidebar} />

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Hero Header — black card with opacity in dark mode */}
          <View 
            style={[
              styles.hero,
              {
                backgroundColor: isDark ? "rgba(0, 0, 0, 0.5)" : colors.headerGradient[0],
                shadowColor: shadowColor,
                shadowOpacity: isDark ? 0.4 : 0.15,
              }
            ]}
          >
            {!isDark && (
              <LinearGradient 
                colors={colors.headerGradient} 
                style={StyleSheet.absoluteFillObject}
              />
            )}
            <View style={styles.avatarWrapper}>
              <Image source={require("../assets/default_avatar.jpg")} style={styles.avatar} />
              <TouchableOpacity
                style={[styles.cameraBtn, { backgroundColor: isDark ? "#fff" : colors.primary }]}
                onPress={() => navigation.navigate("EditProfileScreen", { user })}
              >
                <Ionicons name="camera" size={22} color={isDark ? "#000" : "#fff"} />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={[styles.username, { color: isDark ? "#e6d9ff" : "#e9d5ff" }]}>{username}</Text>
          </View>

          {/* Security Card */}
          <TouchableOpacity 
            style={[
              styles.securityCard, 
              { 
                backgroundColor: colors.card,
                shadowColor: shadowColor,
                shadowOpacity: isDark ? 0.3 : 0.1,
              }
            ]}
          >
            <Ionicons name="shield-checkmark" size={26} color={isDark ? "#fff" : colors.primary} />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={[styles.securityTitle, { color: colors.text }]}>Voir les alertes de sécurité</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: isDark ? "#FF4081" : "#ef4444" }]}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>

          {/* Sections */}
          <View style={styles.section}>
            <Text style={[styles.sectionHeader, { color: isDark ? "#fff" : colors.primary }]}>Préférences</Text>
            <MenuItem
              icon="moon-outline"
              label="Mode sombre"
              subtitle="Système"
              onPress={() => navigation.navigate("AppearanceScreen")}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionHeader, { color: isDark ? "#fff" : colors.primary }]}>Compte</Text>
            <MenuItem 
              icon="person-outline" 
              label="Modifier le profil" 
              onPress={() => navigation.navigate("EditProfileScreen", { user })} 
            />
            <MenuItem 
              icon="lock-closed-outline" 
              label="Changer le mot de passe" 
              onPress={() => setModalVisible(true)} 
            />
            <MenuItem 
              icon="card-outline" 
              label="Paiements" 
              onPress={() => navigation.navigate("PaymentsScreen")} 
            />
            <MenuItem 
              icon="help-circle-outline" 
              label="Aide & Support" 
              onPress={() => navigation.navigate("HelpSupport")} 
            />
          </View>

          <View style={styles.section}>
            <MenuItem 
              icon="log-out-outline" 
              label="Déconnexion" 
              destructive 
              onPress={handleLogout} 
            />
          </View>

          <Text style={[styles.version, { color: colors.textSecondary }]}>Version 1.2.4</Text>
        </ScrollView>

        {/* Modal */}
        <Modal visible={modalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
              <Text style={[styles.modalTitle, { color: colors.primary }]}>Changer le mot de passe</Text>
              <TextInput 
                style={[
                  styles.input, 
                  { 
                    backgroundColor: isDark ? colors.background : "#f5f5f5",
                    borderColor: isDark ? colors.sidebarItemBg : "#e0e0e0",
                    color: colors.text 
                  }
                ]} 
                placeholder="Mot de passe actuel" 
                placeholderTextColor={colors.textSecondary}
                secureTextEntry 
                value={currentPwd} 
                onChangeText={setCurrentPwd} 
              />
              <TextInput 
                style={[
                  styles.input, 
                  { 
                    backgroundColor: isDark ? colors.background : "#f5f5f5",
                    borderColor: isDark ? colors.sidebarItemBg : "#e0e0e0",
                    color: colors.text 
                  }
                ]} 
                placeholder="Nouveau mot de passe" 
                placeholderTextColor={colors.textSecondary}
                secureTextEntry 
                value={newPwd} 
                onChangeText={setNewPwd} 
              />
              <TextInput 
                style={[
                  styles.input, 
                  { 
                    backgroundColor: isDark ? colors.background : "#f5f5f5",
                    borderColor: isDark ? colors.sidebarItemBg : "#e0e0e0",
                    color: colors.text 
                  }
                ]} 
                placeholder="Confirmer" 
                placeholderTextColor={colors.textSecondary}
                secureTextEntry 
                value={confirmPwd} 
                onChangeText={setConfirmPwd} 
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[
                    styles.cancelBtn,
                    { backgroundColor: isDark ? colors.sidebarItemBg : "#f1f1f1" }
                  ]} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[styles.cancelText, { color: colors.text }]}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: colors.primary }]}>
                  <Text style={styles.confirmText}>Confirmer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <BottomNav navigation={navigation} activeScreen="person" />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  hero: { 
    alignItems: "center", 
    paddingVertical: 50, 
    paddingHorizontal: 20, 
    borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  avatarWrapper: { position: "relative", marginBottom: 16 },
  avatar: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    borderWidth: 4, 
    borderColor: "#fff" 
  },
  cameraBtn: { 
    position: "absolute", 
    right: -4, 
    bottom: 0, 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    justifyContent: "center", 
    alignItems: "center", 
    borderWidth: 3, 
    borderColor: "#fff" 
  },
  name: { fontSize: 26, fontWeight: "700", color: "#fff" },
  username: { fontSize: 16, marginTop: 4 },

  securityCard: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginHorizontal: 16, 
    marginTop: 20, 
    padding: 16, 
    borderRadius: 12, 
    elevation: 4, 
    shadowOffset: { width: 0, height: 2 }, 
    shadowRadius: 8 
  },
  securityTitle: { fontSize: 17, fontWeight: "600" },
  badge: { 
    width: 26, 
    height: 26, 
    borderRadius: 13, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  badgeText: { color: "#fff", fontWeight: "bold", fontSize: 13 },

  section: { marginTop: 28 },
  sectionHeader: { 
    fontSize: 13, 
    fontWeight: "700", 
    textTransform: "uppercase", 
    letterSpacing: 1, 
    paddingHorizontal: 16, 
    marginBottom: 8 
  },
  menuItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 15, 
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  menuContent: { flex: 1, marginLeft: 16 },
  menuLabel: { fontSize: 17, fontWeight: "500" },
  menuSubtitle: { fontSize: 14, marginTop: 2 },

  version: { textAlign: "center", fontSize: 14, marginVertical: 40 },

  modalOverlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.7)", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  modalContent: { 
    width: "90%", 
    borderRadius: 16, 
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "700", 
    textAlign: "center", 
    marginBottom: 20 
  },
  input: { 
    borderWidth: 1, 
    borderRadius: 12, 
    padding: 14, 
    marginBottom: 14, 
    fontSize: 16 
  },
  modalButtons: { flexDirection: "row", marginTop: 10 },
  cancelBtn: { 
    flex: 1, 
    paddingVertical: 14, 
    borderRadius: 12, 
    marginHorizontal: 6 
  },
  confirmBtn: { 
    flex: 1, 
    paddingVertical: 14, 
    borderRadius: 12, 
    marginHorizontal: 6 
  },
  cancelText: { textAlign: "center", fontWeight: "600" },
  confirmText: { textAlign: "center", color: "#fff", fontWeight: "600" },
});