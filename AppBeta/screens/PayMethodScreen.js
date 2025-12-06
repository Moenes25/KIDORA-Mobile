import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

// Import your logos from assets
import MastercardLogo from "../assets/mastercard.png";
import VisaLogo from "../assets/visa.png";
import D17Logo from "../assets/D17.png";
import FlouciLogo from "../assets/flouci.png";
import PayoneerLogo from "../assets/payoneer.png";

export default function PayMethodScreen({ visible, onClose }) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  if (!visible) return null;

  // Example primary card data
  const primaryCard = {
    type: "Mastercard", // or "Visa"
    name: "John Doe",
    number: "1234",
  };

  const cardLogo = primaryCard.type === "Mastercard" ? MastercardLogo : VisaLogo;

  return (
    <Modal transparent animationType="slide">
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <TouchableOpacity 
          style={[styles.sheet, { backgroundColor: colors.card }]} 
          activeOpacity={1}
        >
          
          {/* TITLE */}
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.primary }]}>Choose payment method</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* CREDIT & DEBIT CARDS SECTION */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: colors.primary }]}>Credit & Debit Card</Text>
          </View>

          {/* CURRENT CARD */}
          <TouchableOpacity 
            style={[
              styles.cardItem, 
              { backgroundColor: isDark ? colors.sidebarItemBg : "#f5f5f5" }
            ]}
          >
            <Image source={cardLogo} style={styles.cardLogo} resizeMode="contain" />

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>{primaryCard.name}</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>•••• {primaryCard.number}</Text>
            </View>

            <View style={[styles.primaryTag, { backgroundColor: colors.primary }]}>
              <Text style={styles.primaryText}>Primary</Text>
            </View>
          </TouchableOpacity>

          {/* ADD NEW CARD */}
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]}>
            <Feather name="plus" size={20} color="white" />
            <Text style={styles.addBtnText}>Add new card</Text>
          </TouchableOpacity>

          {/* OTHER PAYMENT METHODS */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { marginTop: 0, color: colors.primary }]}>Or pay with</Text>
          </View>

          {/* D17 */}
          <TouchableOpacity 
            style={[
              styles.altMethod, 
              { backgroundColor: isDark ? colors.sidebarItemBg : "#f5f5f5" }
            ]}
          >
            <Image source={D17Logo} style={styles.altLogo} resizeMode="contain" />
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.altTitle, { color: colors.text }]}>D17</Text>
              <Text style={[styles.altDesc, { color: colors.textSecondary }]}>Poste office card</Text>
            </View>
          </TouchableOpacity>

          {/* FLOUCI */}
          <TouchableOpacity 
            style={[
              styles.altMethod, 
              { backgroundColor: isDark ? colors.sidebarItemBg : "#f5f5f5" }
            ]}
          >
            <Image source={FlouciLogo} style={styles.altLogo} resizeMode="contain" />
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.altTitle, { color: colors.text }]}>Flouci</Text>
              <Text style={[styles.altDesc, { color: colors.textSecondary }]}>Digital wallet</Text>
            </View>
          </TouchableOpacity>

          {/* PAYONEER */}
          <TouchableOpacity 
            style={[
              styles.altMethod, 
              { backgroundColor: isDark ? colors.sidebarItemBg : "#f5f5f5" }
            ]}
          >
            <Image source={PayoneerLogo} style={styles.altLogo} resizeMode="contain" />
            <View style={{ marginLeft: 12 }}>
              <Text style={[styles.altTitle, { color: colors.text }]}>Payoneer</Text>
              <Text style={[styles.altDesc, { color: colors.textSecondary }]}>Global payment service</Text>
            </View>
          </TouchableOpacity>

        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  sheet: {
    padding: 20,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    minHeight: "50%",
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  sectionLabel: {
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 6,
  },

  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },

  cardLogo: {
    width: 50,
    height: 30,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  cardSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },

  primaryTag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  primaryText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 20,
  },

  addBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 6,
  },

  altMethod: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
  },

  altLogo: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },

  altTitle: {
    fontSize: 16,
    fontWeight: "700",
  },

  altDesc: {
    fontSize: 13,
    marginTop: 2,
  },
});