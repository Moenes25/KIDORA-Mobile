import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Import PaymentSuccessfulScreen
import PaymentSuccessfulScreen from "./PaymentSuccessfulScreen";

export default function OTPScreen({ visible, onClose, onVerify, onPaymentSuccess }) {
  const navigation = useNavigation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showSuccess, setShowSuccess] = useState(false);

  const inputsRef = useRef([]);

  useEffect(() => {
    if (visible) {
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    }
  }, [visible]);

  const handleChange = (text, index) => {
    if (/^\d$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to next input
      if (index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleBackspace = (text, index) => {
    if (text === "") {
      if (index > 0) {
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const handleVerify = () => {
    const code = otp.join("");
    
    // Show the success screen
    setShowSuccess(true);

    // Close this modal (OTP screen)
    onClose();

    // Close PayMethodScreen if callback is provided
    if (onPaymentSuccess) onPaymentSuccess();

    // Call the original onVerify callback if needed
    if (onVerify) onVerify(code);

    // After 1.5 seconds, hide success screen and navigate to PaymentsScreen
    setTimeout(() => {
      setShowSuccess(false);
      navigation.navigate("PaymentsScreen");
    }, 1500);
  };

  return (
    <>
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.popup}>

            {/* CLOSE BUTTON */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Feather name="x" size={26} color="#333" />
            </TouchableOpacity>

            {/* MESSAGE ICON */}
            <View style={styles.iconCircle}>
              <Feather name="message-square" size={32} color="#6F42C1" />
            </View>

            {/* TITLE */}
            <Text style={styles.title}>Enter code</Text>

            {/* DESCRIPTION */}
            <Text style={styles.description}>
              We sent a verification code to your phone number
            </Text>

            {/* OTP INPUTS */}
            <View style={styles.otpRow}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputsRef.current[index] = ref)}
                  style={styles.otpInput}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === "Backspace") {
                      handleBackspace(digit, index);
                    }
                  }}
                />
              ))}
            </View>

            {/* VERIFY BUTTON */}
            <TouchableOpacity
              style={styles.verifyBtn}
              onPress={handleVerify}
            >
              <Text style={styles.verifyText}>Verify Code</Text>
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
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },

  popup: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
  },

  closeBtn: {
    position: "absolute",
    left: 15,
    top: 15,
    padding: 5,
  },

  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f3e9ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#5a2e84",
    marginTop: 5,
  },

  description: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 25,
  },

  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 25,
  },

  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    fontSize: 20,
    textAlign: "center",
    backgroundColor: "#fafafa",
  },

  verifyBtn: {
    backgroundColor: "#6F42C1",
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  verifyText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
});