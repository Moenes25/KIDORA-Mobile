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
import FeedbackScreen from "../components/FeedBackScreenComponent";

// ✅ IMPORTS FOR NOTIFICATION
import { useNotifications } from "../context/NotificationContext";
import NotificationPanel from "../components/NotificationPanel";

// ✅ IMPORT RESPONSIVE UTILITIES
import { normalize, wp, hp, screenHeight } from "../utils/responsive";

// MenuItem component
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
        <Ionicons name={icon} size={normalize(24)} color={color} />
      </View>
      <View style={[
        styles.menuContent,
        isRTL ? { marginRight: wp(4) } : { marginLeft: wp(4) }
      ]}>
        <Text 
          style={[
            styles.menuLabel,
            isRTL && { textAlign: 'right' }
          ]}
          allowFontScaling={false}
        >
          {label}
        </Text>
        {subtitle && (
          <Text 
            style={[
              styles.menuSubtitle,
              isRTL && { textAlign: 'right' }
            ]}
            allowFontScaling={false}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <Ionicons 
        name={isRTL ? "chevron-back" : "chevron-forward"} 
        size={normalize(22)} 
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

  const getTopSectionHeight = () => {
    const baseHeight = Platform.OS === 'ios' ? hp(5.5) : (StatusBar.currentHeight || hp(3));
    const topBarHeight = hp(7.5);
    const avatarSection = hp(20); // Avatar + greeting
    const padding = hp(3.7);
    
    return baseHeight + topBarHeight + avatarSection + padding;
  };

  const TOP_SECTION_HEIGHT = getTopSectionHeight();

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
                <Ionicons name="camera" size={normalize(18)} color="#6F42C1" />
              </TouchableOpacity>
            </View>
            <Text 
              style={[
                styles.greeting,
                isRTL && { textAlign: 'right', flexDirection: 'row-reverse' }
              ]}
              allowFontScaling={false}
            >
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
            <Text 
              style={[
                styles.sectionHeader,
                isRTL && { textAlign: 'right' }
              ]}
              allowFontScaling={false}
            >
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
            <Text 
              style={[
                styles.sectionHeader,
                isRTL && { textAlign: 'right' }
              ]}
              allowFontScaling={false}
            >
              {t('support')}
            </Text>
            <MenuItem 
              icon="help-circle-outline" 
              label={t('helpSupport')}
              color="#4CAF50"
              onPress={() => navigation.navigate("FeedbackScreen")}
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
            <Ionicons name="log-out-outline" size={normalize(22)} color="white" />
            <Text 
              style={[
                styles.logoutText,
                isRTL ? { marginRight: wp(2.5) } : { marginLeft: wp(2.5) }
              ]}
              allowFontScaling={false}
            >
              {t('logout')}
            </Text>
          </TouchableOpacity>

          <Text 
            style={[
              styles.version,
              isRTL && { textAlign: 'right' }
            ]}
            allowFontScaling={false}
          >
            {t('version')} 1.2.4
          </Text>
        </ScrollView>
      </View>

      {/* Password Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text 
              style={[
                styles.modalTitle,
                isRTL && { textAlign: 'right' }
              ]}
              allowFontScaling={false}
            >
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
              allowFontScaling={false}
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
              allowFontScaling={false}
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
              allowFontScaling={false}
            />
            <View style={[
              styles.modalButtons,
              isRTL && { flexDirection: 'row-reverse' }
            ]}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText} allowFontScaling={false}>
                  {t('cancel')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn}>
                <Text style={styles.confirmText} allowFontScaling={false}>
                  {t('confirm')}
                </Text>
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
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5" 
  },
  fixedTopSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: "hidden",
    borderBottomEndRadius: normalize(38),
    borderBottomStartRadius: normalize(38),
  },
  safeArea: { 
    height: Platform.OS === "ios" ? hp(5.5) : StatusBar.currentHeight 
  },
  
  profileSection: {
    alignItems: "center",
    paddingHorizontal: wp(5),
    paddingTop: hp(0.6),
    paddingBottom: hp(2.5),
  },
  avatarWrapper: { 
    position: "relative", 
    marginBottom: hp(1),
  },
  avatar: { 
    width: wp(20), 
    height: wp(20), 
    borderRadius: wp(10), 
    borderWidth: normalize(3), 
    borderColor: "white",
  },
  cameraBtn: { 
    position: "absolute", 
    right: wp(-0.5), 
    bottom: 0, 
    width: wp(7), 
    height: wp(7), 
    borderRadius: wp(3.5), 
    backgroundColor: "white", 
    justifyContent: "center", 
    alignItems: "center", 
    borderWidth: normalize(2), 
    borderColor: "#6F42C1",
  },
  greeting: {
    fontSize: normalize(20),
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
    borderTopLeftRadius: normalize(38),
    borderTopRightRadius: normalize(38),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(-1) },
    shadowOpacity: 0.3,
    shadowRadius: normalize(12),
    elevation: 12,
  },
  bottomScroll: { 
    paddingHorizontal: wp(4), 
    paddingTop: hp(4), 
    paddingBottom: hp(12.5) 
  },
  section: { 
    marginTop: hp(3) 
  },
  sectionHeader: { 
    fontSize: normalize(13), 
    fontWeight: "700", 
    color: "#999999", 
    textTransform: "uppercase", 
    letterSpacing: 1, 
    marginBottom: hp(1.5) 
  },
  menuItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: hp(2), 
    paddingHorizontal: wp(4),
    marginVertical: hp(0.7),
    backgroundColor: "#ffffff",
    borderRadius: normalize(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowRadius: normalize(8),
  },
  iconCircle: {
    width: wp(12),
    height: wp(12),
    borderRadius: normalize(12),
    justifyContent: "center",
    alignItems: "center",
  },
  menuContent: { 
    flex: 1 
  },
  menuLabel: { 
    fontSize: normalize(16), 
    fontWeight: "600", 
    color: "#1a1a2e" 
  },
  menuSubtitle: { 
    fontSize: normalize(14), 
    marginTop: hp(0.25), 
    fontWeight: "500", 
    color: "#666666" 
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(2),
    backgroundColor: "#E53935",
    borderRadius: normalize(16),
    marginTop: hp(2.5),
  },
  logoutText: { 
    fontSize: normalize(16), 
    fontWeight: "600", 
    color: "white" 
  },

  version: { 
    textAlign: "center", 
    fontSize: normalize(14), 
    color: "#999999", 
    marginVertical: hp(5) 
  },

  bottomNavContainer: { 
    position: "absolute", 
    bottom: 0, 
    left: 0, 
    right: 0, 
    zIndex: 10, 
    backgroundColor: "#ffffff" 
  },

  modalOverlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.7)", 
    justifyContent: "center", 
    alignItems: "center" 
  },
  modalContent: { 
    width: wp(90), 
    backgroundColor: "#ffffff", 
    borderRadius: normalize(20), 
    padding: wp(6), 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: hp(1) }, 
    shadowOpacity: 0.3, 
    shadowRadius: normalize(12), 
    elevation: 10 
  },
  modalTitle: { 
    fontSize: normalize(20), 
    fontWeight: "700", 
    color: "#6F42C1", 
    textAlign: "center", 
    marginBottom: hp(2.5) 
  },
  input: { 
    borderWidth: normalize(1), 
    borderColor: "#e0e0e0", 
    backgroundColor: "#f5f5f5", 
    borderRadius: normalize(12), 
    padding: wp(3.5), 
    marginBottom: hp(1.7), 
    fontSize: normalize(16), 
    color: "#1a1a2e" 
  },
  modalButtons: { 
    flexDirection: "row", 
    marginTop: hp(1.2) 
  },
  cancelBtn: { 
    flex: 1, 
    paddingVertical: hp(1.7), 
    backgroundColor: "#f1f1f1", 
    borderRadius: normalize(12), 
    marginHorizontal: wp(1.5) 
  },
  confirmBtn: { 
    flex: 1, 
    paddingVertical: hp(1.7), 
    backgroundColor: "#6F42C1", 
    borderRadius: normalize(12), 
    marginHorizontal: wp(1.5) 
  },
  cancelText: { 
    textAlign: "center", 
    fontWeight: "600", 
    color: "#1a1a2e" 
  },
  confirmText: { 
    textAlign: "center", 
    color: "#fff", 
    fontWeight: "600" 
  },
});