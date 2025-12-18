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
import { useTranslation } from "../context/TranslationContext";

// Import responsive utilities
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
  const { t, isRTL } = useTranslation();
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
            {/* Payment Logo - Normalized for consistent physical size */}
            <Image
              source={require("../assets/confirm_pay.png")}
              style={styles.logo}
              resizeMode="contain"
            />

            {/* Title */}
            <Text 
              style={[
                styles.title,
                isRTL && { textAlign: 'right' }
              ]}
              allowFontScaling={false}
            >
              {t('confirmPayment')}
            </Text>

            {/* Amount */}
            <Text 
              style={[
                styles.amountText,
                isRTL && { textAlign: 'right' }
              ]}
              allowFontScaling={false}
            >
              {amount} {t('tnd')}
            </Text>

            {/* Confirm Button */}
            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
              <Text style={styles.confirmText} allowFontScaling={false}>
                {t('confirm')}
              </Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText} allowFontScaling={false}>
                {t('cancel')}
              </Text>
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
    padding: wp(6), // Internal padding scales with width
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
    textAlign: "center",
    color: "#2d3436",
  },

  amountText: {
    fontSize: normalize(32),
    fontWeight: "900",
    color: "#6F42C1",
    marginBottom: hp(3),
    textAlign: "center",
  },

  confirmBtn: {
    width: "100%",
    paddingVertical: hp(1.8), // Comfortable touch target height
    backgroundColor: "#6F42C1",
    borderRadius: normalize(10),
    marginBottom: hp(1.2),
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
    backgroundColor: "#f0f0f0", // Subtle grey for secondary action
    borderRadius: normalize(10),
    marginBottom: hp(1),
  },

  cancelText: {
    textAlign: "center",
    color: "#636e72",
    fontWeight: "600",
    fontSize: normalize(16),
  },
});