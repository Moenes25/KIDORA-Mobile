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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import PayoneerLogo from "../assets/payoneer.png";

const PAYONEER_PRIMARY = "#FF4500";
const PAYONEER_DARK = "#002D72";
const TEXT_PRIMARY = "#1a1a1a";
const TEXT_SECONDARY = "#555";
const BG_LIGHT = "#f9f9f9";
const BORDER_COLOR = "#e0e0e0";

export default function PayoneerPaymentScreen({
  visible,
  onClose,
  onPaymentSuccess,
  paymentAmount,
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const initiatePayoneerPayment = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your Payoneer email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      Alert.alert("Error", "Invalid payment amount");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("YOUR_BACKEND_URL/api/payoneer/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          amount: parseFloat(paymentAmount),
          currency: "USD",
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          "Redirecting to Payoneer",
          "You will be redirected to complete your payment securely",
          [
            {
              text: "Continue",
              onPress: () => {
                // Linking.openURL(data.checkoutUrl);
                pollPaymentStatus(data.paymentId);
              },
            },
            { text: "Cancel", style: "cancel", onPress: () => setLoading(false) },
          ]
        );
      } else {
        Alert.alert("Error", data.message || "Failed to initiate payment");
        setLoading(false);
      }
    } catch (error) {
      console.error("Payoneer Payment Error:", error);
      Alert.alert("Error", "Failed to connect to Payoneer service");
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (paymentId) => {
    // ... same as before
  };

  const usdAmount = (parseFloat(paymentAmount) * 0.32).toFixed(2);

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "center", width: "100%" }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <Image source={PayoneerLogo} style={styles.logo} resizeMode="contain" />
                <Text style={styles.title}>Pay with Payoneer</Text>
                <Text style={styles.subtitle}>
                  Secure international payment via your Payoneer account
                </Text>
              </View>

              {/* Amount Card */}
              <View style={styles.amountCard}>
                <Text style={styles.amountLabel}>Payment Amount</Text>
                <Text style={styles.amountTND}>{paymentAmount} TND</Text>
                <Text style={styles.amountUSD}>≈ ${usdAmount} USD</Text>
              </View>

              {/* Email Input with Floating Label */}
              <View style={styles.inputContainer}>
                <Text style={[styles.floatingLabel, email && styles.floatingLabelActive]}>
                  Payoneer Email Address
                </Text>
                <View style={styles.inputWrapper}>
                  <Feather name="mail" size={20} color={email ? PAYONEER_PRIMARY : "#999"} />
                  <TextInput
                    style={styles.textInput}
                    placeholder={email ? "" : "name@domain.com"}
                    placeholderTextColor="#aaa"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Security Badges */}
              <View style={styles.badgesRow}>
                <View style={styles.badge}>
                  <Feather name="shield" size={18} color="#4CAF50" />
                  <Text style={styles.badgeText}>Bank-Level Encryption</Text>
                </View>
                <View style={styles.badge}>
                  <Feather name="globe" size={18} color={PAYONEER_DARK} />
                  <Text style={styles.badgeText}>Global Payments</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.primaryButton, loading && styles.primaryButtonDisabled]}
                  onPress={initiatePayoneerPayment}
                  disabled={loading}
                >
                  {loading ? (
                    <View style={styles.loadingRow}>
                      <ActivityIndicator color="#fff" size="small" />
                      <Text style={styles.primaryButtonText}>Processing...</Text>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.primaryButtonText}>Continue to Payoneer</Text>
                      <Feather name="arrow-right" size={20} color="#fff" style={{ marginLeft: 8 }} />
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={onClose} disabled={loading}>
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Feather name="lock" size={14} color="#999" />
                <Text style={styles.footerText}>
                  Secured by Payoneer • 256-bit SSL • PCI DSS Compliant
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "92%",
    maxWidth: 440,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 120,
    height: 70,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: PAYONEER_PRIMARY,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 20,
  },
  amountCard: {
    backgroundColor: "#FFF5F0",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: "#FFE0D6",
  },
  amountLabel: {
    fontSize: 14,
    color: PAYONEER_PRIMARY,
    fontWeight: "600",
    marginBottom: 8,
  },
  amountTND: {
    fontSize: 32,
    fontWeight: "800",
    color: PAYONEER_PRIMARY,
  },
  amountUSD: {
    fontSize: 16,
    color: "#777",
    marginTop: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  floatingLabel: {
    position: "absolute",
    left: 44,
    top: 18,
    fontSize: 16,
    color: "#999",
    zIndex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 4,
  },
  floatingLabelActive: {
    top: -8,
    fontSize: 12,
    color: PAYONEER_PRIMARY,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: BORDER_COLOR,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 58,
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  badgesRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginBottom: 28,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeText: {
    marginLeft: 8,
    fontSize: 13,
    color: TEXT_SECONDARY,
    fontWeight: "500",
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: PAYONEER_PRIMARY,
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: PAYONEER_PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonDisabled: {
    backgroundColor: "#FF8C69",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
  },
  secondaryButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    marginLeft: 8,
    fontSize: 11.5,
    color: "#999",
  },
});