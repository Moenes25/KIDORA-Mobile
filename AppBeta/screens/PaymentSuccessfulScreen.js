import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "../context/TranslationContext";

// Import PaymentSuccessfulScreen
import PaymentSuccessfulScreen from "./PaymentSuccessfulScreen";

const { width } = Dimensions.get("window");

export default function PaymentConfirmationScreen({
  visible,
  onClose,
  amount,
  method,
  onPaymentSuccess, // NEW: callback to close PayMethodScreen
}) {
  const navigation = useNavigation();
  const { t, isRTL } = useTranslation();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirm = () => {
    // Show the success screen
    setShowSuccess(true);

    // Close this modal (confirmation screen)
    onClose();

    // Close PayMethodScreen if callback is provided
    if (onPaymentSuccess) onPaymentSuccess();

    // After 3 seconds, hide success screen and navigate to PaymentsScreen
    setTimeout(() => {
      setShowSuccess(false);
      navigation.navigate("PaymentsScreen"); // Make sure this matches your navigator
    }, 1500);
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.container}>
            {/* Payment Logo */}
            <Image
              source={require("../assets/confirm_pay.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* Title */}
            <Text style={[
              styles.title,
              isRTL && { textAlign: 'right' }
            ]}>
              {t('confirmPayment')}
            </Text>

            {/* Amount */}
            <Text style={[
              styles.amountText,
              isRTL && { textAlign: 'right' }
            ]}>
              {amount} {t('tnd')}
            </Text>

            {/* Confirm Button */}
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmText}>{t('confirm')}</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Payment Success Popup */}
      <PaymentSuccessfulScreen
        visible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: width * 0.85,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    elevation: 5,
  },

  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  amountText: {
    fontSize: 32,
    fontWeight: "900",
    color: "#6F42C1",
    marginBottom: 25,
    textAlign: "center",
  },

  confirmBtn: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#6F42C1",
    borderRadius: 10,
    marginBottom: 10,
  },

  confirmText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  cancelBtn: {
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#ccc",
    borderRadius: 10,
    marginBottom: 10,
  },

  cancelText: {
    textAlign: "center",
    color: "#555",
    fontWeight: "600",
    fontSize: 16,
  },
});