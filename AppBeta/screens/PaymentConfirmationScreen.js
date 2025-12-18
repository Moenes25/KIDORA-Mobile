import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// 1. Import your utilities
import { wp, hp, normalize } from "../utils/responsive";

// Import PaymentSuccessfulScreen
import PaymentSuccessfulScreen from "./PaymentSuccessfulScreen";

export default function PaymentConfirmationScreen({
  visible,
  onClose,
  amount,
  method,
  onPaymentSuccess,
}) {
  const navigation = useNavigation();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConfirm = () => {
    setShowSuccess(true);
    onClose();
    if (onPaymentSuccess) onPaymentSuccess();

    setTimeout(() => {
      setShowSuccess(false);
      navigation.navigate("PaymentsScreen");
    }, 1500);
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.container}>
            {/* Payment Logo - Scaled based on device */}
            <Image
              source={require("../assets/confirm_pay.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* Title */}
            <Text style={styles.title}>Confirm Payment</Text>

            {/* Amount */}
            <Text style={styles.amountText}>{amount} TND</Text>

            {/* Confirm Button */}
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
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
    backgroundColor: "rgba(0,0,0,0.5)", // Darkened slightly for better focus
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: wp(85), // 85% of screen width
    backgroundColor: "#fff",
    borderRadius: normalize(16),
    padding: wp(6), // Consistent padding
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  logo: {
    width: normalize(90),
    height: normalize(90),
    marginBottom: hp(1.5),
  },

  title: {
    fontSize: normalize(20),
    fontWeight: "bold",
    marginBottom: hp(2),
    color: "#2d3436",
  },

  amountText: {
    fontSize: normalize(32),
    fontWeight: "900",
    color: "#6F42C1",
    marginBottom: hp(3),
  },

  confirmBtn: {
    width: "100%",
    paddingVertical: hp(1.8), // Responsive vertical hit area
    backgroundColor: "#6F42C1",
    borderRadius: normalize(12),
    marginBottom: hp(1.5),
  },

  confirmText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: normalize(16),
  },

  cancelBtn: {
    width: "100%",
    paddingVertical: hp(1.8),
    backgroundColor: "#f0f0f0", // Softened the cancel button background
    borderRadius: normalize(12),
    marginBottom: hp(1),
  },

  cancelText: {
    textAlign: "center",
    color: "#636e72",
    fontWeight: "600",
    fontSize: normalize(16),
  },
});