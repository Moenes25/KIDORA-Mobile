import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import FlouciLogo from "../assets/flouci.png";

export default function FlouciPaymentScreen({ visible, onClose, onPaymentSuccess, paymentAmount }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);

  // Initiate Flouci payment
  const initiateFlouciPayment = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Please enter your Flouci phone number");
      return;
    }

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      Alert.alert("Error", "Invalid payment amount");
      return;
    }

    setLoading(true);

    try {
      // Call your backend to initiate Flouci payment
      const response = await fetch("YOUR_BACKEND_URL/api/flouci/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          amount: parseFloat(paymentAmount),
          // Add other required fields
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Flouci typically returns a payment URL
        setPaymentUrl(data.paymentUrl);
        
        Alert.alert(
          "Payment Initiated",
          "Please complete the payment in your Flouci app",
          [
            {
              text: "Open Flouci",
              onPress: () => {
                // Open Flouci app or payment URL
                // Linking.openURL(data.paymentUrl);
                checkPaymentStatus(data.paymentId);
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );
      } else {
        Alert.alert("Error", data.message || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("Flouci Payment Error:", error);
      Alert.alert("Error", "Failed to connect to Flouci service");
    } finally {
      setLoading(false);
    }
  };

  // Check payment status
  const checkPaymentStatus = async (paymentId) => {
    try {
      const response = await fetch(`YOUR_BACKEND_URL/api/flouci/status/${paymentId}`);
      const data = await response.json();

      if (data.status === "SUCCESS") {
        Alert.alert("Success", "Payment completed successfully!");
        onPaymentSuccess && onPaymentSuccess(data);
        onClose();
      } else if (data.status === "PENDING") {
        // Keep checking
        setTimeout(() => checkPaymentStatus(paymentId), 3000);
      } else {
        Alert.alert("Payment Failed", "The payment was not completed");
      }
    } catch (error) {
      console.error("Payment Status Error:", error);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {/* LOGO */}
          <Image source={FlouciLogo} style={styles.logo} resizeMode="contain" />

          {/* TITLE */}
          <Text style={styles.title}>Pay with Flouci</Text>

          {/* DESCRIPTION */}
          <Text style={styles.description}>
            Enter your Flouci phone number to complete the payment securely
          </Text>

          {/* AMOUNT DISPLAY */}
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>Amount to pay</Text>
            <Text style={styles.amountValue}>{paymentAmount} TND</Text>
          </View>

          {/* PHONE INPUT */}
          <View style={styles.inputWrapper}>
            <Feather name="smartphone" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.phoneInput}
              placeholder="Flouci phone number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              editable={!loading}
            />
          </View>

          {/* INFO BOX */}
          <View style={styles.infoBox}>
            <Feather name="info" size={16} color="#FF6B35" />
            <Text style={styles.infoText}>
              You will be redirected to your Flouci app to confirm the payment
            </Text>
          </View>

          {/* BUTTONS */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.payBtn, loading && styles.payBtnDisabled]}
              onPress={initiateFlouciPayment}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Feather name="check-circle" size={20} color="white" />
                  <Text style={styles.payBtnText}>Continue to Flouci</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* SECURITY NOTE */}
          <View style={styles.securityNote}>
            <Feather name="lock" size={14} color="#999" />
            <Text style={styles.securityText}>Secured by Flouci</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  popup: {
    width: "90%",
    maxWidth: 420,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FF6B35",
    textAlign: "center",
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },

  amountBox: {
    width: "100%",
    backgroundColor: "#FFF5F2",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#FFE0D6",
  },

  amountLabel: {
    fontSize: 13,
    color: "#FF6B35",
    fontWeight: "600",
    marginBottom: 4,
  },

  amountValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FF6B35",
  },

  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: "#fafafa",
    marginBottom: 16,
    height: 54,
  },

  inputIcon: {
    marginRight: 10,
  },

  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },

  infoBox: {
    flexDirection: "row",
    backgroundColor: "#FFF5F2",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },

  infoText: {
    fontSize: 12,
    color: "#FF6B35",
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },

  buttonContainer: {
    width: "100%",
    marginBottom: 12,
  },

  payBtn: {
    backgroundColor: "#FF6B35",
    paddingVertical: 16,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  payBtnDisabled: {
    backgroundColor: "#FFB89F",
  },

  payBtnText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 8,
  },

  cancelBtn: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },

  cancelText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },

  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  securityText: {
    fontSize: 12,
    color: "#999",
    marginLeft: 6,
  },
});