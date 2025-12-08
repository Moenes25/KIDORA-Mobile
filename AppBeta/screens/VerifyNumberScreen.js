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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import OTPScreen from "./OTPScreen";

export default function VerifyNumberScreen({ visible, onClose, onPaymentSuccess, paymentAmount }) {
  const [selectedCode, setSelectedCode] = useState("+216");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState(paymentAmount?.toString() || "");
  const [loading, setLoading] = useState(false);

  const [showOtp, setShowOtp] = useState(false);
  const [transactionId, setTransactionId] = useState(null);

  const countryCodes = ["+216", "+33", "+49"];

  // Function to initiate D17 payment
  const initiateD17Payment = async () => {
    if (!phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    setLoading(true);
    setDropdownOpen(false);

    try {
      // Call your backend API to initiate D17 payment
      const response = await fetch("YOUR_BACKEND_URL/api/d17/initiate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: `${selectedCode}${phone}`,
          amount: parseFloat(amount),
          // Add other required fields for D17
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store transaction ID for verification
        setTransactionId(data.transactionId);
        
        // Close this screen and show OTP screen
        onClose();
        setShowOtp(true);
        
        Alert.alert(
          "Code Sent",
          "Please check your phone for the payment verification code from La Poste"
        );
      } else {
        Alert.alert("Error", data.message || "Failed to initiate payment");
      }
    } catch (error) {
      console.error("D17 Payment Error:", error);
      Alert.alert("Error", "Failed to connect to payment service");
    } finally {
      setLoading(false);
    }
  };

  // Function to verify D17 OTP
  const verifyD17Payment = async (code) => {
    try {
      // Call your backend to verify the OTP with D17
      const response = await fetch("YOUR_BACKEND_URL/api/d17/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId: transactionId,
          otp: code,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowOtp(false);
        onPaymentSuccess && onPaymentSuccess(data);
        
        Alert.alert(
          "Payment Successful",
          `Your payment of ${amount} TND has been processed successfully`
        );
      } else {
        Alert.alert("Error", data.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("D17 Verification Error:", error);
      Alert.alert("Error", "Failed to verify payment");
    }
  };

  return (
    <>
      {/* MAIN SCREEN */}
      <Modal transparent visible={visible} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.popup}>
            {/* ICON */}
            <View style={styles.iconCircle}>
              <Feather name="credit-card" size={32} color="#6F42C1" />
            </View>

            {/* TITLE */}
            <Text style={styles.title}>D17 Payment - La Poste</Text>

            {/* DESCRIPTION */}
            <Text style={styles.description}>
              Enter your phone number and amount. You'll receive a verification code via SMS to confirm your payment.
            </Text>

            {/* AMOUNT INPUT */}
            <View style={styles.amountContainer}>
              <Text style={styles.label}>Amount (TND)</Text>
              <View style={styles.amountInputWrapper}>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={setAmount}
                  editable={!paymentAmount} // Disable if amount is passed as prop
                />
                <Text style={styles.currency}>TND</Text>
              </View>
            </View>

            {/* PHONE INPUT WRAPPER */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputRow}>
                {/* COUNTRY CODE SELECTOR */}
                <View style={styles.selectorWrapper}>
                  <TouchableOpacity
                    style={styles.selector}
                    onPress={() => setDropdownOpen(!dropdownOpen)}
                    disabled={loading}
                  >
                    <Text style={styles.selectorText}>{selectedCode}</Text>
                    <Feather
                      name={dropdownOpen ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#555"
                    />
                  </TouchableOpacity>

                  {/* DROPDOWN */}
                  {dropdownOpen && (
                    <View style={styles.dropdown}>
                      {countryCodes.map((code) => (
                        <TouchableOpacity
                          key={code}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedCode(code);
                            setDropdownOpen(false);
                          }}
                        >
                          <Text style={styles.dropdownText}>{code}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* PHONE INPUT */}
                <TextInput
                  style={styles.phoneInput}
                  placeholder="Phone number"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  editable={!loading}
                />
              </View>
            </View>

            {/* INFO BOX */}
            <View style={styles.infoBox}>
              <Feather name="info" size={16} color="#6F42C1" />
              <Text style={styles.infoText}>
                You will receive an SMS code from La Poste to authorize this payment
              </Text>
            </View>

            {/* BUTTONS */}
            <View style={{ marginTop: 10, width: "100%" }}>
              <TouchableOpacity
                style={[styles.sendBtn, loading && styles.sendBtnDisabled]}
                onPress={initiateD17Payment}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.sendText}>Proceed to Payment</Text>
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
          </View>
        </View>
      </Modal>

      {/* ----- OTP SCREEN (ON TOP) ----- */}
      <OTPScreen
        visible={showOtp}
        onClose={() => setShowOtp(false)}
        onVerify={verifyD17Payment}
        onPaymentSuccess={onPaymentSuccess}
        paymentAmount={amount}
        phoneNumber={`${selectedCode}${phone}`}
      />
    </>
  );
}

/* ---------------------- STYLES ---------------------- */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  popup: {
    width: "90%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f3e9ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#5a2e84",
    textAlign: "center",
  },

  description: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    alignSelf: "flex-start",
  },

  amountContainer: {
    width: "100%",
    marginBottom: 18,
  },

  amountInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fafafa",
    height: 50,
  },

  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },

  currency: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6F42C1",
    marginLeft: 8,
  },

  inputWrapper: {
    width: "100%",
    zIndex: 20,
    elevation: 20,
    marginBottom: 16,
  },

  inputRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },

  selectorWrapper: {
    width: 90,
    zIndex: 30,
    elevation: 30,
  },

  selector: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
  },

  selectorText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },

  dropdown: {
    position: "absolute",
    top: 55,
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    zIndex: 999,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  dropdownText: {
    fontSize: 15,
    color: "#333",
  },

  phoneInput: {
    flex: 1,
    height: 50,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fafafa",
    fontSize: 15,
    color: "#333",
  },

  infoBox: {
    flexDirection: "row",
    backgroundColor: "#f3e9ff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },

  infoText: {
    fontSize: 12,
    color: "#5a2e84",
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },

  sendBtn: {
    backgroundColor: "#6F42C1",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#6F42C1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  sendBtnDisabled: {
    backgroundColor: "#9d7ec7",
  },

  sendText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  cancelBtn: {
    backgroundColor: "#eee",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },

  cancelText: {
    color: "#555",
    fontSize: 15,
    fontWeight: "600",
  },
});