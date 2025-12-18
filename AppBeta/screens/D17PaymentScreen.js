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
import { useTranslation } from "../context/TranslationContext";
import { normalize, wp, hp } from "../utils/responsive";
import D17Logo from "../assets/D17.png";

// Official La Poste Tunisienne colors
const LAPOSTE_BLUE = "#005EB8";
const LAPOSTE_LIGHT_BLUE = "#E6F0FA";
const LAPOSTE_ACCENT = "#003087";
const TEXT_DARK = "#1A1A1A";
const TEXT_LIGHT = "#555";

export default function D17PaymentScreen({
  visible,
  onClose,
  paymentAmount,
  onPaymentSuccess,
}) {
  const { t, isRTL } = useTranslation();
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
      Alert.alert(t('invalidNumber'), t('enterValidD17'));
      return;
    }

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      Alert.alert(t('error'), t('invalidAmount'));
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
          t('paymentInProgress'),
          `${t('confirmationCodeSent')} +216 ${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5)}\n\n${t('enterReceivedCode')}`,
          [{ text: "OK", onPress: () => onPaymentSuccess?.() }]
        );
      } else {
        Alert.alert(t('failed'), data.message || t('unableToInitiateD17'));
      }
    } catch (err) {
      console.error(err);
      Alert.alert(t('connectionError'), t('checkInternetConnection'));
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
                <Text 
                  style={[styles.title, isRTL && { textAlign: 'right' }]}
                  allowFontScaling={false}
                >
                  {t('payWithD17')}
                </Text>
                <Text 
                  style={[styles.subtitle, isRTL && { textAlign: 'right' }]}
                  allowFontScaling={false}
                >
                  {t('d17ServiceDescription')}
                </Text>
              </View>

              {/* Amount Card */}
              <View style={styles.amountCard}>
                <Text 
                  style={[styles.amountLabel, isRTL && { textAlign: 'right' }]}
                  allowFontScaling={false}
                >
                  {t('amountToPay')}
                </Text>
                <Text 
                  style={[styles.amountValue, isRTL && { textAlign: 'right' }]}
                  allowFontScaling={false}
                >
                  {paymentAmount} TND
                </Text>
              </View>

              {/* Phone Number Input */}
              <View style={styles.inputSection}>
                <Text 
                  style={[styles.inputLabel, isRTL && { textAlign: 'right' }]}
                  allowFontScaling={false}
                >
                  {t('d17NumberMobile')}
                </Text>
                <View style={[
                  styles.phoneInputContainer,
                  isRTL && { flexDirection: 'row-reverse' }
                ]}>
                  <View style={[
                    styles.countryCode,
                    isRTL && { 
                      borderRightWidth: 0, 
                      borderLeftWidth: normalize(1), 
                      borderLeftColor: '#ddd' 
                    }
                  ]}>
                    <Text style={styles.countryFlag} allowFontScaling={false}>
                      TN
                    </Text>
                    <Text style={styles.countryPrefix} allowFontScaling={false}>
                      +216
                    </Text>
                  </View>
                  <TextInput
                    style={[
                      styles.phoneInput,
                      isRTL ? { marginRight: wp(3.5), textAlign: 'right' } : { marginLeft: wp(3.5) }
                    ]}
                    placeholder="98 123 456"
                    keyboardType="numeric"
                    value={formatPhoneNumber(phoneNumber)}
                    onChangeText={(text) => setPhoneNumber(text.replace(/\D/g, "").slice(0, 8))}
                    maxLength={11}
                    editable={!loading}
                    allowFontScaling={false}
                  />
                </View>
                <Text 
                  style={[styles.helpText, isRTL && { textAlign: 'right' }]}
                  allowFontScaling={false}
                >
                  {t('enterPhoneNumber')}
                </Text>
              </View>

              {/* Security & Trust Indicators */}
              <View style={[
                styles.trustRow,
                isRTL && { flexDirection: 'row-reverse' }
              ]}>
                <View style={[
                  styles.trustItem,
                  isRTL && { flexDirection: 'row-reverse' }
                ]}>
                  <MaterialCommunityIcons name="shield-check" size={normalize(20)} color={LAPOSTE_BLUE} />
                  <Text 
                    style={[
                      styles.trustText,
                      isRTL ? { marginRight: wp(2) } : { marginLeft: wp(2) }
                    ]}
                    allowFontScaling={false}
                  >
                    {t('securedByLaPoste')}
                  </Text>
                </View>
                <View style={[
                  styles.trustItem,
                  isRTL && { flexDirection: 'row-reverse' }
                ]}>
                  <Feather name="lock" size={normalize(18)} color={LAPOSTE_BLUE} />
                  <Text 
                    style={[
                      styles.trustText,
                      isRTL ? { marginRight: wp(2) } : { marginLeft: wp(2) }
                    ]}
                    allowFontScaling={false}
                  >
                    {t('encryption256')}
                  </Text>
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
                    <View style={[
                      styles.loadingRow,
                      isRTL && { flexDirection: 'row-reverse' }
                    ]}>
                      <ActivityIndicator color="#fff" />
                      <Text 
                        style={[
                          styles.payButtonText,
                          isRTL ? { marginRight: wp(2.5) } : { marginLeft: wp(2.5) }
                        ]}
                        allowFontScaling={false}
                      >
                        {t('processingInProgress')}
                      </Text>
                    </View>
                  ) : (
                    <View style={[
                      styles.payButtonContent,
                      isRTL && { flexDirection: 'row-reverse' }
                    ]}>
                      <Text style={styles.payButtonText} allowFontScaling={false}>
                        {t('pay')} {paymentAmount} TND
                      </Text>
                      <Feather 
                        name={isRTL ? "arrow-left" : "arrow-right"} 
                        size={normalize(22)} 
                        color="#fff" 
                        style={isRTL ? { marginRight: wp(2.5) } : { marginLeft: wp(2.5) }} 
                      />
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={onClose} 
                  disabled={loading}
                >
                  <Text style={styles.cancelText} allowFontScaling={false}>
                    {t('cancel')}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Image
                  source={{ uri: "https://www.poste.tn/images/logo-poste.png" }}
                  style={styles.posteLogo}
                  resizeMode="contain"
                />
                <Text 
                  style={[styles.footerText, isRTL && { textAlign: 'right' }]}
                  allowFontScaling={false}
                >
                  {t('officialPaymentService')} • La Poste Tunisienne
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
    borderTopLeftRadius: normalize(28),
    borderTopRightRadius: normalize(28),
    padding: wp(6),
    paddingBottom: hp(5),
    minHeight: hp(80),
  },
  header: {
    alignItems: "center",
    marginBottom: hp(3),
  },
  logo: {
    width: wp(28),
    height: hp(10),
    marginBottom: hp(1.5),
  },
  title: {
    fontSize: normalize(26),
    fontWeight: "800",
    color: LAPOSTE_BLUE,
    marginBottom: hp(0.8),
  },
  subtitle: {
    fontSize: normalize(15),
    color: TEXT_LIGHT,
    textAlign: "center",
    lineHeight: normalize(20),
  },
  amountCard: {
    backgroundColor: LAPOSTE_LIGHT_BLUE,
    borderRadius: normalize(18),
    padding: wp(5),
    alignItems: "center",
    marginBottom: hp(3.5),
    borderWidth: normalize(1.5),
    borderColor: "#B3D7FF",
  },
  amountLabel: {
    fontSize: normalize(15),
    color: LAPOSTE_ACCENT,
    fontWeight: "600",
    marginBottom: hp(1),
  },
  amountValue: {
    fontSize: normalize(36),
    fontWeight: "900",
    color: LAPOSTE_BLUE,
  },
  inputSection: {
    marginBottom: hp(2.5),
  },
  inputLabel: {
    fontSize: normalize(16),
    fontWeight: "700",
    color: TEXT_DARK,
    marginBottom: hp(1.2),
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: normalize(2),
    borderColor: LAPOSTE_BLUE,
    borderRadius: normalize(16),
    backgroundColor: "#fff",
    height: hp(7.5),
  },
  countryCode: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: wp(3.5),
    borderRightWidth: normalize(1),
    borderRightColor: "#ddd",
  },
  countryFlag: {
    fontSize: normalize(20),
    marginRight: wp(1.5),
  },
  countryPrefix: {
    fontSize: normalize(16),
    fontWeight: "600",
    color: LAPOSTE_BLUE,
  },
  phoneInput: {
    flex: 1,
    fontSize: normalize(18),
    color: TEXT_DARK,
    letterSpacing: 1,
  },
  helpText: {
    fontSize: normalize(13),
    color: "#666",
    marginTop: hp(1),
    textAlign: "center",
  },
  trustRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: wp(6),
    marginBottom: hp(3.5),
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  trustText: {
    fontSize: normalize(13),
    color: TEXT_LIGHT,
    fontWeight: "600",
  },
  actions: {
    gap: hp(1.5),
    marginBottom: hp(2.5),
  },
  payButton: {
    backgroundColor: LAPOSTE_BLUE,
    paddingVertical: hp(2.2),
    borderRadius: normalize(16),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: LAPOSTE_BLUE,
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.3,
    shadowRadius: normalize(8),
  },
  payButtonDisabled: {
    backgroundColor: "#6699CC",
  },
  payButtonText: {
    color: "#fff",
    fontSize: normalize(18),
    fontWeight: "700",
  },
  payButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: hp(2),
    borderRadius: normalize(16),
    alignItems: "center",
    borderWidth: normalize(1.5),
    borderColor: "#ddd",
  },
  cancelText: {
    color: "#555",
    fontSize: normalize(16),
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: hp(1.2),
  },
  posteLogo: {
    width: wp(15),
    height: hp(5),
    opacity: 0.7,
    marginBottom: hp(1),
  },
  footerText: {
    fontSize: normalize(11),
    color: "#888",
    textAlign: "center",
  },
});