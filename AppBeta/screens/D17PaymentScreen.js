// D17PaymentScreen.js
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
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import D17Logo from "../assets/D17.png";

// Official La Poste Tunisienne colors
const LAPOSTE_BLUE = "#005EB8";        // Primary deep blue
const LAPOSTE_LIGHT_BLUE = "#E6F0FA";   // Background light blue
const LAPOSTE_ACCENT = "#003087";      // Darker blue for emphasis
const TEXT_DARK = "#1A1A1A";
const TEXT_LIGHT = "#555";

export default function D17PaymentScreen({
  visible,
  onClose,
  paymentAmount,
  onPaymentSuccess,
}) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const formatPhoneNumber = (value) => {
    // Auto-format Tunisian mobile numbers: 98 123 456 → +216 98 123 456
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)}`;
  };

  const handlePayment = async () => {
    const cleaned = phoneNumber.replace(/\D/g, "");

    if (cleaned.length !== 8) {
      Alert.alert("Numéro invalide", "Veuillez entrer un numéro D17 valide (8 chiffres)");
      return;
    }

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      Alert.alert("Erreur", "Montant invalide");
      return;
    }

    setLoading(true);

    try {
      // Replace with your actual backend endpoint
      const response = await fetch("YOUR_BACKEND_URL/api/d17/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: `+216${cleaned}`,
          amount: parseFloat(paymentAmount),
          currency: "TND",
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          "Paiement en cours",
          `Un code de confirmation a été envoyé au +216 ${cleaned.slice(
            0,
            2
          )} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}\n\nVeuillez saisir le code reçu par SMS.`,
          [{ text: "OK", onPress: () => onPaymentSuccess?.() }]
        );
      } else {
        Alert.alert("Échec", data.message || "Impossible d'initier le paiement D17");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erreur de connexion", "Vérifiez votre connexion internet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}>
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <Image source={D17Logo} style={styles.logo} resizeMode="contain" />
                <Text style={styles.title}>Payer avec D17</Text>
                <Text style={styles.subtitle}>
                  Service de paiement mobile de La Poste Tunisienne
                </Text>
              </View>

              {/* Amount Card */}
              <View style={styles.amountCard}>
                <Text style={styles.amountLabel}>Montant à payer</Text>
                <Text style={styles.amountValue}>{paymentAmount} TND</Text>
              </View>

              {/* Phone Number Input */}
              <View style={styles.inputSection}>
                <Text style={styles.inputLabel}>Numéro D17 (Mobile)</Text>
                <View style={styles.phoneInputContainer}>
                  <View style={styles.countryCode}>
                    <Text style={styles.countryFlag}>TN</Text>
                    <Text style={styles.countryPrefix}>+216</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="98 123 456"
                    keyboardType="numeric"
                    value={formatPhoneNumber(phoneNumber)}
                    onChangeText={(text) => setPhoneNumber(text.replace(/\D/g, "").slice(0, 8))}
                    maxLength={11}
                    editable={!loading}
                  />
                </View>
                <Text style={styles.helpText}>
                  Entrez votre numéro de téléphone associé à votre compte D17
                </Text>
              </View>

              {/* Security & Trust Indicators */}
              <View style={styles.trustRow}>
                <View style={styles.trustItem}>
                  <MaterialCommunityIcons name="shield-check" size={20} color={LAPOSTE_BLUE} />
                  <Text style={styles.trustText}>Sécurisé par La Poste</Text>
                </View>
                <View style={styles.trustItem}>
                  <Feather name="lock" size={18} color={LAPOSTE_BLUE} />
                  <Text style={styles.trustText}>Cryptage 256 bits</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.payButton, loading && styles.payButtonDisabled]}
                  onPress={handlePayment}
                  disabled={loading}
                >
                  {loading ? (
                    <View style={styles.loadingRow}>
                      <ActivityIndicator color="#fff" />
                      <Text style={styles.payButtonText}>Traitement en cours...</Text>
                    </View>
                  ) : (
                    <>
                      <Text style={styles.payButtonText}>Payer {paymentAmount} TND</Text>
                      <Feather name="arrow-right" size={22} color="#fff" style={{ marginLeft: 10 }} />
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={loading}>
                  <Text style={styles.cancelText}>Annuler</Text>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Image
                  source={{ uri: "https://www.poste.tn/images/logo-poste.png" }} // Optional: official logo
                  style={styles.posteLogo}
                  resizeMode="contain"
                />
                <Text style={styles.footerText}>
                  Service officiel de paiement mobile • La Poste Tunisienne
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
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    minHeight: "80%",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    width: 110,
    height: 80,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: LAPOSTE_BLUE,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: TEXT_LIGHT,
    textAlign: "center",
    lineHeight: 20,
  },
  amountCard: {
    backgroundColor: LAPOSTE_LIGHT_BLUE,
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
    marginBottom: 28,
    borderWidth: 1.5,
    borderColor: "#B3D7FF",
  },
  amountLabel: {
    fontSize: 15,
    color: LAPOSTE_ACCENT,
    fontWeight: "600",
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 36,
    fontWeight: "900",
    color: LAPOSTE_BLUE,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: 10,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: LAPOSTE_BLUE,
    borderRadius: 16,
    backgroundColor: "#fff",
    height: 60,
  },
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 6,
  },
  countryPrefix: {
    fontSize: 16,
    fontWeight: "600",
    color: LAPOSTE_BLUE,
  },
  phoneInput: {
    flex: 1,
    marginLeft: 14,
    fontSize: 18,
    color: TEXT_DARK,
    letterSpacing: 1,
  },
  helpText: {
    fontSize: 13,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  trustRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginBottom: 28,
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  trustText: {
    marginLeft: 8,
    fontSize: 13,
    color: TEXT_LIGHT,
    fontWeight: "600",
  },
  actions: {
    gap: 12,
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: LAPOSTE_BLUE,
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: LAPOSTE_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  payButtonDisabled: {
    backgroundColor: "#6699CC",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#ddd",
  },
  cancelText: {
    color: "#555",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: 10,
  },
  posteLogo: {
    width: 60,
    height: 40,
    opacity: 0.7,
    marginBottom: 8,
  },
  footerText: {
    fontSize: 11,
    color: "#888",
    textAlign: "center",
  },
});