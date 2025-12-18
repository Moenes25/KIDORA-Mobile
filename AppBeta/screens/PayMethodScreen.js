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
import { useTranslation } from "../context/TranslationContext";

// Logos
import MastercardLogo from "../assets/mastercard.png";
import VisaLogo from "../assets/visa.png";
import D17Logo from "../assets/D17.png";
import FlouciLogo from "../assets/flouci.png";
import PayoneerLogo from "../assets/payoneer.png";

// Payment Screens
import AddCardScreen from "./AddCardScreen";
import PaymentConfirmationScreen from "./PaymentConfirmationScreen";
import D17PaymentScreen from "./D17PaymentScreen";
import FlouciPaymentScreen from "./FlouciPaymentScreen";
import PayoneerPaymentScreen from "./PayonnerPaymentScreen";

export default function PayMethodScreen({ visible, onClose, amount, navigation }) {
  const { colors, theme } = useTheme();
  const { t, isRTL } = useTranslation();
  const isDark = theme === "dark";

  const [showAddCard, setShowAddCard] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showD17, setShowD17] = useState(false);
  const [showFlouci, setShowFlouci] = useState(false);
  const [showPayoneer, setShowPayoneer] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);

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
      setShowD17(true);
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
      {/* Main Payment Method Selector - FIXED: Added visible prop */}
      <Modal transparent animationType="slide" visible={visible}>
        <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
          <TouchableOpacity
            style={[styles.sheet, { backgroundColor: colors.card }]}
            activeOpacity={1}
            onPress={() => {}}
          >
            {/* Header */}
            <View style={[styles.titleRow, isRTL && { flexDirection: 'row-reverse' }]}>
              <Text style={[styles.title, { color: colors.primary }]}>
                {t('choosePaymentMethod')}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Credit & Debit Cards */}
            <View style={styles.sectionHeader}>
              <Text style={[
                styles.sectionLabel, 
                { color: colors.primary },
                isRTL && { textAlign: 'right' }
              ]}>
                {t('creditDebitCard')}
              </Text>
            </View>

            {/* Primary Card */}
            <TouchableOpacity
              style={[
                styles.cardItem,
                { backgroundColor: isDark ? colors.sidebarItemBg : "#f5f5f5" },
                isRTL && { flexDirection: 'row-reverse' }
              ]}
              onPress={() =>
                handleSelectMethod({
                  type: primaryCard.type.toLowerCase(),
                  last4Digits: primaryCard.number,
                })
              }
            >
              <Image source={cardLogo} style={styles.cardLogo} resizeMode="contain" />
              <View style={[
                { flex: 1 },
                isRTL ? { marginRight: 12 } : { marginLeft: 12 }
              ]}>
                <Text style={[
                  styles.cardTitle, 
                  { color: colors.text },
                  isRTL && { textAlign: 'right' }
                ]}>
                  {primaryCard.name}
                </Text>
                <Text style={[
                  styles.cardSubtitle, 
                  { color: colors.textSecondary },
                  isRTL && { textAlign: 'right' }
                ]}>
                  •••• {primaryCard.number}
                </Text>
              </View>
              <View style={[styles.primaryTag, { backgroundColor: colors.primary }]}>
                <Text style={styles.primaryText}>{t('primary')}</Text>
              </View>
            </TouchableOpacity>

            {/* Add New Card */}
            <TouchableOpacity
              style={[
                styles.addBtn, 
                { backgroundColor: colors.primary },
                isRTL && { flexDirection: 'row-reverse' }
              ]}
              onPress={() => setShowAddCard(true)}
            >
              <Feather name="plus" size={20} color="white" />
              <Text style={[
                styles.addBtnText,
                isRTL ? { marginRight: 6 } : { marginLeft: 6 }
              ]}>
                {t('addNewCard')}
              </Text>
            </TouchableOpacity>

            {/* Alternative Methods */}
            <View style={styles.sectionHeader}>
              <Text style={[
                styles.sectionLabel, 
                { color: colors.primary },
                isRTL && { textAlign: 'right' }
              ]}>
                {t('orPayWith')}
              </Text>
            </View>

            {/* D17 - La Poste Tunisienne */}
            <TouchableOpacity
              style={[
                styles.altMethod,
                { backgroundColor: isDark ? colors.sidebarItemBg : "#f5f5f5" },
                isRTL && { flexDirection: 'row-reverse' }
              ]}
              onPress={() => handleSelectMethod({ type: "d17" })}
            >
              <Image source={D17Logo} style={styles.altLogo} resizeMode="contain" />
              <View style={[isRTL ? { marginRight: 12 } : { marginLeft: 12 }]}>
                <Text style={[
                  styles.altTitle, 
                  { color: colors.text },
                  isRTL && { textAlign: 'right' }
                ]}>
                  D17
                </Text>
                <Text style={[
                  styles.altDesc, 
                  { color: colors.textSecondary },
                  isRTL && { textAlign: 'right' }
                ]}>
                  {t('d17Description')}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Flouci */}
            <TouchableOpacity
              style={[
                styles.altMethod,
                { backgroundColor: isDark ? colors.sidebarItemBg : "#f5f5f5" },
                isRTL && { flexDirection: 'row-reverse' }
              ]}
              onPress={() => handleSelectMethod({ type: "flouci" })}
            >
              <Image source={FlouciLogo} style={styles.altLogo} resizeMode="contain" />
              <View style={[isRTL ? { marginRight: 12 } : { marginLeft: 12 }]}>
                <Text style={[
                  styles.altTitle, 
                  { color: colors.text },
                  isRTL && { textAlign: 'right' }
                ]}>
                  Flouci
                </Text>
                <Text style={[
                  styles.altDesc, 
                  { color: colors.textSecondary },
                  isRTL && { textAlign: 'right' }
                ]}>
                  {t('flouciDescription')}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Payoneer */}
            <TouchableOpacity
              style={[
                styles.altMethod,
                { backgroundColor: isDark ? colors.sidebarItemBg : "#f5f5f5" },
                isRTL && { flexDirection: 'row-reverse' }
              ]}
              onPress={() => handleSelectMethod({ type: "payoneer" })}
            >
              <Image source={PayoneerLogo} style={styles.altLogo} resizeMode="contain" />
              <View style={[isRTL ? { marginRight: 12 } : { marginLeft: 12 }]}>
                <Text style={[
                  styles.altTitle, 
                  { color: colors.text },
                  isRTL && { textAlign: 'right' }
                ]}>
                  Payoneer
                </Text>
                <Text style={[
                  styles.altDesc, 
                  { color: colors.textSecondary },
                  isRTL && { textAlign: 'right' }
                ]}>
                  {t('payoneerDescription')}
                </Text>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* CRITICAL FIX: Conditional rendering for all child modals */}
      {showAddCard && (
        <AddCardScreen
          visible={showAddCard}
          onClose={() => setShowAddCard(false)}
          onAddCard={(card) => console.log("New card added:", card)}
          navigation={navigation}
        />
      )}

      {showConfirm && (
        <PaymentConfirmationScreen
          visible={showConfirm}
          method={selectedMethod}
          amount={amount}
          onClose={() => setShowConfirm(false)}
          onPaymentSuccess={handlePaymentSuccess}
          navigation={navigation}
        />
      )}

      {showD17 && (
        <D17PaymentScreen
          visible={showD17}
          onClose={() => setShowD17(false)}
          paymentAmount={amount}
          onPaymentSuccess={handlePaymentSuccess}
          navigation={navigation}
        />
      )}

      {showFlouci && (
        <FlouciPaymentScreen
          visible={showFlouci}
          onClose={() => setShowFlouci(false)}
          paymentAmount={amount}
          onPaymentSuccess={handlePaymentSuccess}
          navigation={navigation}
        />
      )}

      {showPayoneer && (
        <PayoneerPaymentScreen
          visible={showPayoneer}
          onClose={() => setShowPayoneer(false)}
          paymentAmount={amount}
          onPaymentSuccess={handlePaymentSuccess}
          navigation={navigation}
        />
      )}
    </>
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