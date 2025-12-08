import React, { useState } from "react";
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

// Logos
import MastercardLogo from "../assets/mastercard.png";
import VisaLogo from "../assets/visa.png";
import D17Logo from "../assets/D17.png";
import FlouciLogo from "../assets/flouci.png";
import PayoneerLogo from "../assets/payoneer.png";

// Payment Screens
import AddCardScreen from "./AddCardScreen";
import PaymentConfirmationScreen from "./PaymentConfirmationScreen";
import D17PaymentScreen from "./D17PaymentScreen";           // Updated: New official D17 screen
import FlouciPaymentScreen from "./FlouciPaymentScreen";
import PayoneerPaymentScreen from "./PayonnerPaymentScreen"; // Fixed typo: Payonner → Payoneer (optional)

export default function PayMethodScreen({ visible, onClose, amount }) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  const [showAddCard, setShowAddCard] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showD17, setShowD17] = useState(false);           // Updated state name
  const [showFlouci, setShowFlouci] = useState(false);
  const [showPayoneer, setShowPayoneer] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

  if (!visible) return null;

  // Example primary card
  const primaryCard = {
    type: "Mastercard",
    name: "John Doe",
    number: "1234",
  };

  const cardLogo = primaryCard.type === "Mastercard" ? MastercardLogo : VisaLogo;

  const handleSelectMethod = (method) => {
    setSelectedMethod(method);

    if (method.type === "visa" || method.type === "mastercard") {
      setShowConfirm(true);
    } else if (method.type === "d17") {
      setShowD17(true);                    // Open new D17 screen
    } else if (method.type === "flouci") {
      setShowFlouci(true);
    } else if (method.type === "payoneer") {
      setShowPayoneer(true);
    }
  };

  const handlePaymentSuccess = () => {
    // Reset all modals
    setShowConfirm(false);
    setShowD17(false);
    setShowFlouci(false);
    setShowPayoneer(false);
    onClose();
  };

  return (
    <>
      {/* Main Payment Method Selector */}
      <Modal transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
          <TouchableOpacity
            style={[styles.sheet, { backgroundColor: colors.card }]}
            activeOpacity={1}
            onPress={() => {}}
          >
            {/* Header */}
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: colors.primary }]}>
                Choose payment method
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Credit & Debit Cards */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionLabel, { color: colors.primary }]}>
                Credit & Debit Card
              </Text>
            </View>

            {/* Primary Card */}
            <TouchableOpacity
              style={[
                styles.cardItem,
                { backgroundColor: isDark ? colors.sidebarItemBg : "#f5f5f5" },
              ]}
              onPress={() =>
                handleSelectMethod({
                  type: primaryCard.type.toLowerCase(),
                  last4Digits: primaryCard.number,
                })
              }
            >
              <Image source={cardLogo} style={styles.cardLogo} resizeMode="contain" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  {primaryCard.name}
                </Text>
                <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                  •••• {primaryCard.number}
                </Text>
              </View>
              <View style={[styles.primaryTag, { backgroundColor: colors.primary }]}>
                <Text style={styles.primaryText}>Primary</Text>
              </View>
            </TouchableOpacity>

            {/* Add New Card */}
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: colors.primary }]}
              onPress={() => setShowAddCard(true)}
            >
              <Feather name="plus" size={20} color="white" />
              <Text style={styles.addBtnText}>Add new card</Text>
            </TouchableOpacity>

            {/* Alternative Methods */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionLabel, { color: colors.primary }]}>
                Or pay with
              </Text>
            </View>

            {/* D17 - La Poste Tunisienne */}
            <TouchableOpacity
              style={[
                styles.altMethod,
                { backgroundColor: isDark ? colors.sidebarItemBg : "#f5f5f5" },
              ]}
              onPress={() => handleSelectMethod({ type: "d17" })}
            >
              <Image source={D17Logo} style={styles.altLogo} resizeMode="contain" />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.altTitle, { color: colors.text }]}>D17</Text>
                <Text style={[styles.altDesc, { color: colors.textSecondary }]}>
                  Paiement mobile La Poste Tunisienne
                </Text>
              </View>
            </TouchableOpacity>

            {/* Flouci */}
            <TouchableOpacity
              style={[
                styles.altMethod,
                { backgroundColor: isDark ? colors.sidebarItemBg : "#f5f5f5" },
              ]}
              onPress={() => handleSelectMethod({ type: "flouci" })}
            >
              <Image source={FlouciLogo} style={styles.altLogo} resizeMode="contain" />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.altTitle, { color: colors.text }]}>Flouci</Text>
                <Text style={[styles.altDesc, { color: colors.textSecondary }]}>
                  Portefeuille numérique
                </Text>
              </View>
            </TouchableOpacity>

            {/* Payoneer */}
            <TouchableOpacity
              style={[
                styles.altMethod,
                { backgroundColor: isDark ? colors.sidebarItemBg : "#f5f5f5" },
              ]}
              onPress={() => handleSelectMethod({ type: "payoneer" })}
            >
              <Image source={PayoneerLogo} style={styles.altLogo} resizeMode="contain" />
              <View style={{ marginLeft: 12 }}>
                <Text style={[styles.altTitle, { color: colors.text }]}>Payoneer</Text>
                <Text style={[styles.altDesc, { color: colors.textSecondary }]}>
                  Paiement international
                </Text>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modals */}
      <AddCardScreen
        visible={showAddCard}
        onClose={() => setShowAddCard(false)}
        onAddCard={(card) => console.log("New card added:", card)}
      />

      <PaymentConfirmationScreen
        visible={showConfirm}
        method={selectedMethod}
        amount={amount}
        onClose={() => setShowConfirm(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Updated: Using the new official D17 screen */}
      <D17PaymentScreen
        visible={showD17}
        onClose={() => setShowD17(false)}
        paymentAmount={amount}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <FlouciPaymentScreen
        visible={showFlouci}
        onClose={() => setShowFlouci(false)}
        paymentAmount={amount}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <PayoneerPaymentScreen
        visible={showPayoneer}
        onClose={() => setShowPayoneer(false)}
        paymentAmount={amount}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}

// Styles remain unchanged (you can keep your existing styles)
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
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 17,
    fontWeight: "700",
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