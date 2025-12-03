import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

export default function MenuScreen() {
  const navigation = useNavigation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = [
    { label: "Chat", icon: "chatbubble-ellipses-outline", screen: "ChatScreen" },
    { label: "Calendar & Events", icon: "calendar-outline", screen: "CalendarScreen" },
    { label: "Gallery", icon: "images-outline", screen: "GalleryScreen" },
    { label: "Language", icon: "language-outline", screen: "LanguageScreen" },
    { label: "Appearance", icon: "color-palette-outline", screen: "AppearanceScreen" },
    { label: "About Us", icon: "information-circle-outline", screen: "AboutUsScreen" },
  ];

  return (
    <View style={styles.container}>
      
      {/* HEADER WITH PURPLE GRADIENT */}
      <LinearGradient
        colors={["#6F42C1", "#9b59b6"]}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={28} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Menu</Text>

        <View style={{ width: 28 }} />
      </LinearGradient>

      {/* MENU ITEMS */}
      <View style={styles.cardsContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Ionicons name={item.icon} size={25} color="#6F42C1" style={{ marginRight: 15 }} />
            <Text style={styles.cardText}>{item.label}</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#6F42C1" style={{ marginLeft: "auto" }} />
          </TouchableOpacity>
        ))}

        {/* LOGOUT BUTTON */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setShowLogoutModal(true)}
        >
          <Ionicons name="log-out-outline" size={20} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* LOGOUT CONFIRMATION MODAL */}
      <Modal
        transparent={true}
        visible={showLogoutModal}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you sure you want to logout?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#6F42C1" }]}
                onPress={() =>
                  navigation.reset({ index: 0, routes: [{ name: "Login" }] })
                }
              >
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: "#333" }]}>Cancel</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf7ff" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  headerTitle: {
    fontSize: 25,
    fontWeight: "700",
    color: "white",
  },

  cardsContainer: {
    width: "90%",
    marginTop: 20,
    alignSelf: "center",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 17,
    paddingHorizontal: 22,
    borderRadius: 18,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  cardText: { color: "#6F42C1", fontSize: 17, fontWeight: "600" },

  logoutButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#5a2e84",
    paddingVertical: 15,
    borderRadius: 18,
    marginTop: 20,
  },

  logoutText: { color: "white", fontSize: 17, fontWeight: "600" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },

  modalButtons: {
  flexDirection: "column",
  width: "100%",
},

modalButton: {
  width: "100%",
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: "center",
  marginBottom: 10,
},

  modalButtonText: { color: "white", fontWeight: "700", fontSize: 16 },
});
