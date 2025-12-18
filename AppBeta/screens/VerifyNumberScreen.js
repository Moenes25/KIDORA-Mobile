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
import { normalize, wp, hp } from "../utils/responsive";

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
              <Feather name="credit-card" size={normalize(32)} color="#6F42C1" />
            </View>

            {/* TITLE */}
            <Text style={styles.title} allowFontScaling={false}>
              D17 Payment - La Poste
            </Text>

            {/* DESCRIPTION */}
            <Text style={styles.description} allowFontScaling={false}>
              Enter your phone number and amount. You'll receive a verification code via SMS to confirm your payment.
            </Text>

            {/* AMOUNT INPUT */}
            <View style={styles.amountContainer}>
              <Text style={styles.label} allowFontScaling={false}>
                Amount (TND)
              </Text>
              <View style={styles.amountInputWrapper}>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  value={amount}
                  onChangeText={setAmount}
                  editable={!paymentAmount} // Disable if amount is passed as prop
                  allowFontScaling={false}
                />
                <Text style={styles.currency} allowFontScaling={false}>
                  TND
                </Text>
              </View>
            </View>

            {/* PHONE INPUT WRAPPER */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label} allowFontScaling={false}>
                Phone Number
              </Text>
              <View style={styles.inputRow}>
                {/* COUNTRY CODE SELECTOR */}
                <View style={styles.selectorWrapper}>
                  <TouchableOpacity
                    style={styles.selector}
                    onPress={() => setDropdownOpen(!dropdownOpen)}
                    disabled={loading}
                  >
                    <Text style={styles.selectorText} allowFontScaling={false}>
                      {selectedCode}
                    </Text>
                    <Feather
                      name={dropdownOpen ? "chevron-up" : "chevron-down"}
                      size={normalize(18)}
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
                          <Text style={styles.dropdownText} allowFontScaling={false}>
                            {code}
                          </Text>
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
                  allowFontScaling={false}
                />
              </View>
            </View>

            {/* INFO BOX */}
            <View style={styles.infoBox}>
              <Feather name="info" size={normalize(16)} color="#6F42C1" />
              <Text style={styles.infoText} allowFontScaling={false}>
                You will receive an SMS code from La Poste to authorize this payment
              </Text>
            </View>

            {/* BUTTONS */}
            <View style={{ marginTop: hp(1.2), width: "100%" }}>
              <TouchableOpacity
                style={[styles.sendBtn, loading && styles.sendBtnDisabled]}
                onPress={initiateD17Payment}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.sendText} allowFontScaling={false}>
                    Proceed to Payment
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={onClose}
                disabled={loading}
              >
                <Text style={styles.cancelText} allowFontScaling={false}>
                  Cancel
                </Text>
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
    width: wp(90),
    maxWidth: wp(100),
    backgroundColor: "#fff",
    borderRadius: normalize(18),
    padding: wp(6),
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.3,
    shadowRadius: normalize(8),
  },

  iconCircle: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: normalize(35),
    backgroundColor: "#f3e9ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: hp(1.5),
  },

  title: {
    fontSize: normalize(20),
    fontWeight: "700",
    color: "#5a2e84",
    textAlign: "center",
  },

  description: {
    fontSize: normalize(13),
    color: "#666",
    textAlign: "center",
    marginTop: hp(0.7),
    marginBottom: hp(2.5),
    lineHeight: normalize(18),
  },

  label: {
    fontSize: normalize(14),
    fontWeight: "600",
    color: "#333",
    marginBottom: hp(1),
    alignSelf: "flex-start",
  },

  amountContainer: {
    width: "100%",
    marginBottom: hp(2.2),
  },

  amountInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: normalize(1),
    borderColor: "#ccc",
    borderRadius: normalize(8),
    paddingHorizontal: wp(3),
    backgroundColor: "#fafafa",
    height: hp(6.2),
  },

  amountInput: {
    flex: 1,
    fontSize: normalize(18),
    fontWeight: "600",
    color: "#333",
  },

  currency: {
    fontSize: normalize(16),
    fontWeight: "600",
    color: "#6F42C1",
    marginLeft: wp(2),
  },

  inputWrapper: {
    width: "100%",
    zIndex: 20,
    elevation: 20,
    marginBottom: hp(2),
  },

  inputRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },

  selectorWrapper: {
    width: wp(22.5),
    zIndex: 30,
    elevation: 30,
  },

  selector: {
    height: hp(6.2),
    borderRadius: normalize(8),
    borderWidth: normalize(1),
    borderColor: "#ccc",
    paddingHorizontal: wp(2.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fafafa",
  },

  selectorText: {
    fontSize: normalize(15),
    fontWeight: "600",
    color: "#333",
  },

  dropdown: {
    position: "absolute",
    top: hp(6.8),
    width: "100%",
    backgroundColor: "#fff",
    borderWidth: normalize(1),
    borderColor: "#ccc",
    borderRadius: normalize(8),
    zIndex: 999,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.2,
    shadowRadius: normalize(4),
  },

  dropdownItem: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(3),
    borderBottomWidth: normalize(1),
    borderBottomColor: "#f0f0f0",
  },

  dropdownText: {
    fontSize: normalize(15),
    color: "#333",
  },

  phoneInput: {
    flex: 1,
    height: hp(6.2),
    marginLeft: wp(2.5),
    borderWidth: normalize(1),
    borderColor: "#ccc",
    borderRadius: normalize(8),
    paddingHorizontal: wp(3),
    backgroundColor: "#fafafa",
    fontSize: normalize(15),
    color: "#333",
  },

  infoBox: {
    flexDirection: "row",
    backgroundColor: "#f3e9ff",
    padding: wp(3),
    borderRadius: normalize(8),
    alignItems: "center",
    width: "100%",
    marginBottom: hp(2.5),
  },

  infoText: {
    fontSize: normalize(12),
    color: "#5a2e84",
    marginLeft: wp(2),
    flex: 1,
    lineHeight: normalize(16),
  },

  sendBtn: {
    backgroundColor: "#6F42C1",
    paddingVertical: hp(1.7),
    borderRadius: normalize(12),
    width: "100%",
    alignItems: "center",
    marginBottom: hp(1.2),
    elevation: 2,
    shadowColor: "#6F42C1",
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.3,
    shadowRadius: normalize(4),
  },

  sendBtnDisabled: {
    backgroundColor: "#9d7ec7",
  },

  sendText: {
    color: "white",
    fontSize: normalize(16),
    fontWeight: "700",
  },

  cancelBtn: {
    backgroundColor: "#eee",
    paddingVertical: hp(1.7),
    borderRadius: normalize(12),
    width: "100%",
    alignItems: "center",
  },

  cancelText: {
    color: "#555",
    fontSize: normalize(15),
    fontWeight: "600",
  },
});