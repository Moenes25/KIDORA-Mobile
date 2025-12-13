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
import { useTranslation } from "../context/TranslationContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BottomNav from "../components/BottomNav";
import TopBar from "../components/TopBar";
import SideBar from "../components/Sidebar";

// ✅ IMPORTS FOR NOTIFICATION
import { useNotifications } from "../context/NotificationContext";
import NotificationPanel from "../components/NotificationPanel";

const screenHeight = Dimensions.get("window").height;

// ... (MenuItem component remains unchanged) ...
const MenuItem = ({ icon, label, subtitle, color = "#6F42C1", onPress, isRTL }) => {
  const [pressed, setPressed] = useState(false);
  return (
    <TouchableOpacity 
      style={[
        styles.menuItem, 
        {
          shadowOpacity: pressed ? 0.15 : 0.08,
          elevation: pressed ? 8 : 3,
        },
        isRTL && { flexDirection: 'row-reverse' }
      ]} 
      activeOpacity={1}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
    >
      <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={[
        styles.menuContent,
        isRTL ? { marginRight: 16 } : { marginLeft: 16 }
      ]}>
        <Text style={[
          styles.menuLabel,
          isRTL && { textAlign: 'right' }
        ]}>
          {label}
        </Text>
        {subtitle && (
          <Text style={[
            styles.menuSubtitle,
            isRTL && { textAlign: 'right' }
          ]}>
            {subtitle}
          </Text>
        )}
      </View>
      <Ionicons 
        name={isRTL ? "chevron-back" : "chevron-forward"} 
        size={22} 
        color="#999999" 
      />
    </TouchableOpacity>
  );
};

export default function ProfileScreen({ navigation, route }) {
  const user = route.params?.user || {};
  const { colors } = useTheme();
  const { t, isRTL } = useTranslation();

  // ✅ 1. SETUP NOTIFICATION LOGIC
  const { unreadCount } = useNotifications();
  const [notificationPanelVisible, setNotificationPanelVisible] = useState(false);
  const toggleNotificationPanel = () => setNotificationPanelVisible(!notificationPanelVisible);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");

  const fullName = user.firstname && user.lastname
    ? `${user.firstname} ${user.lastname}`
    : user.name || user.fullname || "Tamer M";

  const toggleSidebar = () => setSidebarVisible(prev => !prev);

  const handleLogout = () => {
    Alert.alert(
      t('logoutTitle'), 
      t('logoutMessage'), 
      [
        { text: t('cancel'), style: "cancel" },
        {
          text: t('yes'),
          onPress: async () => {
            await AsyncStorage.removeItem("user");
            navigation.reset({ index: 0, routes: [{ name: "Login" }] });
          },
        },
      ]
    );
  };

  const TOP_SECTION_HEIGHT = screenHeight * 0.3;

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

      {/* ✅ 2. ADD NOTIFICATION PANEL */}
      <NotificationPanel 
        visible={notificationPanelVisible}
        onClose={toggleNotificationPanel}
      />

      {/* FIXED PURPLE TOP SECTION */}
      <View style={[styles.fixedTopSection, { height: TOP_SECTION_HEIGHT }]}>
        <LinearGradient colors={colors.headerGradient} style={StyleSheet.absoluteFill}>
          <View style={styles.safeArea} />
          
          {/* ✅ 3. CONNECT TOPBAR */}
          <TopBar 
            onMenuPress={toggleSidebar} 
            onNotificationPress={toggleNotificationPanel}
            showAvatar={false}
            notificationCount={unreadCount}
          />

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarWrapper}>
              <Image source={require("../assets/human.jpg")} style={styles.avatar} />
              <TouchableOpacity
                style={styles.cameraBtn}
                onPress={() => navigation.navigate("EditProfileScreen", { user })}
              >
                <Ionicons name="camera" size={18} color="#6F42C1" />
              </TouchableOpacity>
            </View>
            <Text style={[
              styles.greeting,
              isRTL && { textAlign: 'right', flexDirection: 'row-reverse' }
            ]}>
              {t('greeting')}, <Text style={styles.userName}>{fullName}</Text>
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* WHITE BOTTOM SECTION */}
      <View style={[styles.scrollableBottomSection, { top: TOP_SECTION_HEIGHT }]}>
        <ScrollView contentContainerStyle={styles.bottomScroll} showsVerticalScrollIndicator={false}>
          {/* Account */}
          <View style={styles.section}>
            <Text style={[
              styles.sectionHeader,
              isRTL && { textAlign: 'right' }
            ]}>
              {t('account')}
            </Text>
            <MenuItem 
              icon="person-outline" 
              label={t('editProfile')}
              color="#6F42C1"
              onPress={() => navigation.navigate("EditProfileScreen", { user })}
              isRTL={isRTL}
            />
            <MenuItem 
              icon="lock-closed-outline" 
              label={t('changePassword')}
              color="#FFC75F"
              onPress={() => setModalVisible(true)}
              isRTL={isRTL}
            />
            <MenuItem 
              icon="card-outline" 
              label={t('payments')}
              color="#4ECDC4"
              onPress={() => navigation.navigate("PaymentsScreen")}
              isRTL={isRTL}
            />
          </View>

          {/* Support */}
          <View style={styles.section}>
            <Text style={[
              styles.sectionHeader,
              isRTL && { textAlign: 'right' }
            ]}>
              {t('support')}
            </Text>
            <MenuItem 
              icon="help-circle-outline" 
              label={t('helpSupport')}
              color="#4CAF50"
              onPress={() => navigation.navigate("HelpSupport")}
              isRTL={isRTL}
            />
            <MenuItem 
              icon="document-text-outline" 
              label={t('privacyPolicy')}
              color="#9B59B6"
              onPress={() => {}}
              isRTL={isRTL}
            />
          </View>

          {/* Logout */}
          <TouchableOpacity 
            style={[
              styles.logoutButton,
              isRTL && { flexDirection: 'row-reverse' }
            ]} 
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={22} color="white" />
            <Text style={[
              styles.logoutText,
              isRTL ? { marginRight: 10 } : { marginLeft: 10 }
            ]}>
              {t('logout')}
            </Text>
          </TouchableOpacity>

          <Text style={[
            styles.version,
            isRTL && { textAlign: 'right' }
          ]}>
            {t('version')} 1.2.4
          </Text>
        </ScrollView>
      </View>

      {/* Password Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[
              styles.modalTitle,
              isRTL && { textAlign: 'right' }
            ]}>
              {t('changePasswordTitle')}
            </Text>
            <TextInput 
              style={[
                styles.input,
                isRTL && { textAlign: 'right' }
              ]} 
              placeholder={t('currentPassword')} 
              placeholderTextColor="#999999"
              secureTextEntry 
              value={currentPwd} 
              onChangeText={setCurrentPwd} 
            />
            <TextInput 
              style={[
                styles.input,
                isRTL && { textAlign: 'right' }
              ]} 
              placeholder={t('newPassword')} 
              placeholderTextColor="#999999"
              secureTextEntry 
              value={newPwd} 
              onChangeText={setNewPwd} 
            />
            <TextInput 
              style={[
                styles.input,
                isRTL && { textAlign: 'right' }
              ]} 
              placeholder={t('confirmPassword')} 
              placeholderTextColor="#999999"
              secureTextEntry 
              value={confirmPwd} 
              onChangeText={setConfirmPwd} 
            />
            <View style={[
              styles.modalButtons,
              isRTL && { flexDirection: 'row-reverse' }
            ]}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn}>
                <Text style={styles.confirmText}>{t('confirm')}</Text>
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
  
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 20,
  },
  avatarWrapper: { 
    position: "relative", 
    marginBottom: 8,
  },
  avatar: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    borderWidth: 3, 
    borderColor: "white",
  },
  cameraBtn: { 
    position: "absolute", 
    right: -2, 
    bottom: 0, 
    width: 28, 
    height: 28, 
    borderRadius: 14, 
    backgroundColor: "white", 
    justifyContent: "center", 
    alignItems: "center", 
    borderWidth: 2, 
    borderColor: "#6F42C1",
  },
  greeting: {
    fontSize: 20,
    color: "#FFFFFF",
    textAlign: "center",
  },
  userName: {
    color: "#FFD700",
    fontWeight: "700",
  },

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
  sectionHeader: { 
    fontSize: 13, 
    fontWeight: "700", 
    color: "#999999", 
    textTransform: "uppercase", 
    letterSpacing: 1, 
    marginBottom: 12 
  },
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
  menuContent: { flex: 1 },
  menuLabel: { fontSize: 16, fontWeight: "600", color: "#1a1a2e" },
  menuSubtitle: { fontSize: 14, marginTop: 2, fontWeight: "500", color: "#666666" },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    backgroundColor: "#E53935",
    borderRadius: 16,
    marginTop: 20,
  },
  logoutText: { fontSize: 16, fontWeight: "600", color: "white" },

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