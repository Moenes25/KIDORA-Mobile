// components/ChatNavBar.js
import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Platform, 
  StatusBar 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Import LinearGradient
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "../context/TranslationContext";

const ChatNavBar = ({ name = "Ayoub", isOnline = true, avatar }) => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { isRTL } = useTranslation();

  return (
    <LinearGradient
      // Use the exact same gradient colors as TopNavBar
      colors={colors.headerGradient || ["#9d00ff", "#6f42c1"]}
      style={styles.container}
    >
      {/* Safe area placeholder (transparent so gradient shows) */}
      <View style={styles.statusBarPlaceholder} />
      
      <View style={[
        styles.content, 
        { flexDirection: isRTL ? 'row-reverse' : 'row' }
      ]}>
        
        {/* Profile Section */}
        <View style={[
          styles.profileSection,
          { flexDirection: isRTL ? 'row-reverse' : 'row' }
        ]}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ paddingHorizontal: 8 }}
          >
            <Ionicons 
              name={isRTL ? "arrow-forward" : "arrow-back"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>

          <Image 
            source={avatar || { uri: "https://i.pravatar.cc/150?img=11" }} 
            style={styles.avatar}
          />

          <View style={[
            styles.textContainer,
            isRTL ? { marginRight: 10, alignItems: 'flex-end' } : { marginLeft: 10, alignItems: 'flex-start' }
          ]}>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.statusText}>
              {isOnline ? (isRTL ? "متصل" : "Online") : (isRTL ? "غير متصل" : "Offline")}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={[
          styles.actions,
          { flexDirection: isRTL ? 'row-reverse' : 'row' }
        ]}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="videocam" size={20} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="call" size={20} color="white" />
          </TouchableOpacity>
        </View>

      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    // Background color is now handled by LinearGradient props
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    paddingBottom: 10,
  },
  statusBarPlaceholder: {
    height: Platform.OS === "android" ? StatusBar.currentHeight : 44,
    // Removed background color so the gradient shows through
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    height: 60,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
  },
  textContainer: {
    justifyContent: "center",
  },
  nameText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  statusText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
});

export default ChatNavBar;  