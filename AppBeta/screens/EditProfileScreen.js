import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "../context/TranslationContext";
import { normalize, wp, hp } from "../utils/responsive";

export default function EditProfileScreen({ navigation, route }) {
  const { colors, theme } = useTheme();
  const { t, isRTL } = useTranslation();
  const isDark = theme === "dark";
  
  const user = route.params?.user || {};

  const [avatar, setAvatar] = useState(
    user.avatar || require("../assets/human.jpg")
  );
  const [form, setForm] = useState({
    fullname: user.fullname || user.firstname && user.lastname
      ? `${user.firstname} ${user.lastname}`
      : "Omar Djebbi",
    email: user.email || "",
    phone: user.phone || "",
    address: user.address || "",
    occupation: user.occupation || "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar({ uri: result.assets[0].uri });
    }
  };

  const shadowColor = isDark ? "#2d1b69" : "#000";

  const formFields = [
    { label: t('fullName'), key: "fullname", icon: "person-outline", placeholder: t('enterFullName') },
    { label: t('email'), key: "email", icon: "mail-outline", placeholder: t('enterEmail') },
    { label: t('phone'), key: "phone", icon: "call-outline", placeholder: t('enterPhone') },
    { label: t('address'), key: "address", icon: "location-outline", placeholder: t('enterAddress') },
    { label: t('occupation'), key: "occupation", icon: "briefcase-outline", placeholder: t('enterOccupation') },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? "#0f0a1f" : "#f5f5f5" }}>
      <View 
        style={{ 
          height: Platform.OS === "android" ? StatusBar.currentHeight : hp(5.5),
          backgroundColor: isDark ? "#0f0a1f" : "#6f42c1" 
        }} 
      />
      <SafeAreaView style={{ flex: 1 }} edges={["left", "right"]}>
        <StatusBar barStyle="light-content" />

        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
          {/* Header */}
          <LinearGradient 
            colors={isDark ? colors.bgGradient : colors.headerGradient} 
            style={[
              styles.header,
              {
                shadowColor: shadowColor,
                shadowOpacity: isDark ? 0.4 : 0.2,
              }
            ]}
          >
            <View style={[styles.headerTop, isRTL && { flexDirection: 'row-reverse' }]}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Ionicons 
                  name={isRTL ? "arrow-forward" : "arrow-back"} 
                  size={normalize(26)} 
                  color="#fff" 
                />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, isRTL && { textAlign: 'right' }]}>
                {t('editProfile')}
              </Text>
              <View style={{ width: wp(10) }} />
            </View>

            {/* Avatar with Floating Edit Button */}
            <View style={styles.avatarWrapper}>
              <Image source={avatar} style={styles.avatar} />
              <TouchableOpacity 
                style={[
                  styles.cameraOverlay, 
                  { backgroundColor: colors.primary },
                  isRTL && { right: 'auto', left: wp(2) }
                ]} 
                onPress={pickImage}
              >
                <Ionicons name="camera" size={normalize(24)} color="#fff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          {/* Form Section */}
          <View 
            style={[
              styles.formCard, 
              { 
                backgroundColor: isDark ? colors.cardMedium : "#ffffff",
                shadowColor: shadowColor,
                shadowOpacity: isDark ? 0.4 : 0.15,
              }
            ]}
          >
            {formFields.map((field) => (
              <View key={field.key} style={styles.inputGroup}>
                <Text 
                  style={[
                    styles.inputLabel, 
                    { color: isDark ? "#e0d4ff" : colors.primary },
                    isRTL && { textAlign: 'right' }
                  ]}
                >
                  {field.label}
                </Text>
                <View 
                  style={[
                    styles.inputWrapper, 
                    {
                      backgroundColor: isDark ? colors.cardLight : "#f9f7ff",
                      borderColor: isDark ? "rgba(255,255,255,0.1)" : "#e0d4ff",
                      flexDirection: isRTL ? 'row-reverse' : 'row',
                    }
                  ]}
                >
                  <Ionicons 
                    name={field.icon} 
                    size={normalize(20)} 
                    color={isDark ? "#e0d4ff" : colors.primary} 
                    style={[
                      styles.inputIcon,
                      isRTL && { marginRight: 0, marginLeft: wp(3) }
                    ]} 
                  />
                  <TextInput
                    style={[
                      styles.textInput, 
                      { color: isDark ? "#ffffff" : "#000000" },
                      isRTL && { textAlign: 'right' }
                    ]}
                    value={form[field.key]}
                    onChangeText={(text) => handleChange(field.key, text)}
                    placeholder={field.placeholder}
                    placeholderTextColor={isDark ? "#8b7fc7" : "#999999"}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[
                styles.saveButton, 
                { 
                  backgroundColor: isDark ? "#7c3aed" : colors.primary,
                  shadowColor: isDark ? "#7c3aed" : colors.primary,
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                }
              ]} 
              onPress={() => console.log("Saved:", form, avatar)}
            >
              <Ionicons 
                name="checkmark" 
                size={normalize(24)} 
                color="#fff"
                style={isRTL ? { marginLeft: wp(2.5), marginRight: 0 } : {}}
              />
              <Text style={styles.saveButtonText}>{t('saveChanges')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.cancelButton, 
                { backgroundColor: isDark ? colors.cardLight : "#f1f1f1" }
              ]} 
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.cancelButtonText, { color: isDark ? "#b0a8d9" : "#666666" }]}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingTop: hp(2.5),
    paddingBottom: hp(5),
    alignItems: "center",
    borderBottomLeftRadius: normalize(32),
    borderBottomRightRadius: normalize(32),
    shadowOffset: { width: 0, height: hp(0.75) },
    shadowRadius: normalize(12),
    elevation: 8,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: wp(5),
    marginBottom: hp(3.5),
  },
  backBtn: { padding: wp(2) },
  headerTitle: { 
    fontSize: normalize(22), 
    fontWeight: "700", 
    color: "#fff" 
  },

  avatarWrapper: { position: "relative" },
  avatar: {
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
    borderWidth: normalize(5),
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.3,
    shadowRadius: normalize(10),
    elevation: 12,
  },
  cameraOverlay: {
    position: "absolute",
    bottom: wp(2),
    right: wp(2),
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: normalize(4),
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: normalize(8),
    elevation: 10,
  },

  formCard: {
    marginTop: -hp(2.5),
    marginHorizontal: wp(5),
    borderRadius: normalize(20),
    padding: wp(6),
    shadowOffset: { width: 0, height: hp(1) },
    shadowRadius: normalize(20),
    elevation: 12,
  },

  inputGroup: { marginBottom: hp(2.5) },
  inputLabel: {
    fontSize: normalize(14),
    fontWeight: "600",
    marginBottom: hp(1),
    letterSpacing: 0.5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: normalize(16),
    paddingHorizontal: wp(4),
    height: hp(7),
    borderWidth: normalize(1.5),
  },
  inputIcon: { marginRight: wp(3) },
  textInput: {
    flex: 1,
    fontSize: normalize(16),
  },

  buttonContainer: {
    marginHorizontal: wp(5),
    marginTop: hp(3.5),
    marginBottom: hp(5),
  },
  saveButton: {
    flexDirection: "row",
    paddingVertical: hp(2),
    borderRadius: normalize(16),
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: hp(0.75) },
    shadowOpacity: 0.3,
    shadowRadius: normalize(12),
    elevation: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: normalize(17),
    fontWeight: "700",
    marginLeft: wp(2.5),
  },
  cancelButton: {
    marginTop: hp(1.5),
    paddingVertical: hp(1.7),
    borderRadius: normalize(16),
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: normalize(16),
    fontWeight: "600",
  },
});