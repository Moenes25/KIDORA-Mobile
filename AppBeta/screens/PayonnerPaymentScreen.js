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
  SafeAreaView
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "../context/TranslationContext";
import PayoneerLogo from "../assets/payoneer.png";

// Official-like Payoneer Color Palette
const COLORS = {
  orange: "#FF4800",
  darkText: "#2B2B2B",
  lightText: "#666666",
  border: "#D1D5DB",
  background: "#F4F6F8",
  white: "#FFFFFF",
  success: "#4CAF50",
};

export default function PayoneerPaymentScreen({
  visible,
  onClose,
  paymentAmount,
}) {
  const { t, isRTL } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const initiatePayoneerPayment = async () => {
    if (!email.trim()) {
      Alert.alert(t('required'), t('enterPayoneerEmail'));
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(t('simulated'), t('paymentLogicWouldRun'));
    }, 2000);
  };

  const usdAmount = (parseFloat(paymentAmount || "0") * 0.32).toFixed(2);

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header Bar (Gateway Style) */}
        <View style={[
          styles.headerBar,
          isRTL && { flexDirection: 'row-reverse' }
        ]}>
          <View style={[
            styles.headerLeft,
            isRTL && { flexDirection: 'row-reverse' }
          ]}>
            <TouchableOpacity 
              onPress={onClose} 
              style={[
                styles.closeButton,
                isRTL && { marginLeft: 8, marginRight: 0 }
              ]}
            >
              <Feather name="x" size={24} color={COLORS.lightText} />
            </TouchableOpacity>
            <Image source={PayoneerLogo} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.secureBadge}>
            <Feather name="lock" size={14} color={COLORS.success} />
            <Text style={[
              styles.secureText,
              isRTL && { marginRight: 4, marginLeft: 0 }
            ]}>
              {t('secure')}
            </Text>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {/* Order Summary Card */}
            <View style={styles.orderSummaryContainer}>
              <Text style={[
                styles.sectionTitle,
                isRTL && { textAlign: 'right' }
              ]}>
                {t('orderSummary')}
              </Text>
              <View style={[
                styles.summaryRow,
                isRTL && { flexDirection: 'row-reverse' }
              ]}>
                <Text style={[
                  styles.summaryLabel,
                  isRTL && { textAlign: 'right' }
                ]}>
                  {t('totalAmount')}
                </Text>
                <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end' }}>
                  <Text style={styles.summaryAmount}>{paymentAmount} TND</Text>
                  <Text style={[
                    styles.summarySubAmount,
                    isRTL && { textAlign: 'left' }
                  ]}>
                    ≈ ${usdAmount} USD
                  </Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={[
                styles.merchantRow,
                isRTL && { flexDirection: 'row-reverse' }
              ]}>
                <Text style={[
                  styles.merchantLabel,
                  isRTL && { textAlign: 'right' }
                ]}>
                  {t('merchant')}
                </Text>
                <Text style={[
                  styles.merchantName,
                  isRTL && { textAlign: 'left' }
                ]}>
                  KIDORA Inc.
                </Text>
              </View>
            </View>

            {/* Login / Payment Form */}
            <View style={styles.formCard}>
              <Text style={[
                styles.formTitle,
                isRTL && { textAlign: 'right' }
              ]}>
                {t('payWithPayoneer')}
              </Text>
              <Text style={[
                styles.formSubtitle,
                isRTL && { textAlign: 'right' }
              ]}>
                {t('enterAccountDetails')}
              </Text>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={[
                  styles.inputLabel,
                  isRTL && { textAlign: 'right' }
                ]}>
                  {t('payoneerUsernameOrEmail')}
                </Text>
                <View style={[
                  styles.inputWrapper,
                  focusedField === 'email' && styles.inputWrapperFocused
                ]}>
                  <TextInput
                    style={[
                      styles.textInput,
                      isRTL && { textAlign: 'right' }
                    ]}
                    placeholder={t('usernamePlaceholder')}
                    placeholderTextColor="#A0A0A0"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    editable={!loading}
                  />
                </View>
              </View>

              {/* Info Note */}
              <View style={[
                styles.infoBox,
                isRTL && { flexDirection: 'row-reverse' }
              ]}>
                <Feather name="info" size={16} color={COLORS.lightText} />
                <Text style={[
                  styles.infoText,
                  isRTL && { marginRight: 10, marginLeft: 0, textAlign: 'right' }
                ]}>
                  {t('redirectInfo')}
                </Text>
              </View>

              {/* Pay Button */}
              <TouchableOpacity
                style={[styles.payButton, loading && styles.payButtonDisabled]}
                onPress={initiatePayoneerPayment}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.payButtonText}>{t('payNow')}</Text>
                )}
              </TouchableOpacity>

              {/* Cancel Link */}
              <TouchableOpacity 
                onPress={onClose} 
                style={styles.cancelLink} 
                disabled={loading}
              >
                <Text style={styles.cancelLinkText}>
                  {t('cancelReturnToMerchant')}
                </Text>
              </TouchableOpacity>
            </View>

          </ScrollView>

          {/* Footer (Gateway Standard) */}
          <View style={styles.footer}>
            <Text style={[
              styles.footerText,
              isRTL && { textAlign: 'right' }
            ]}>
              {t('allRightsReserved')}
            </Text>
            <View style={[
              styles.footerLinks,
              isRTL && { flexDirection: 'row-reverse' }
            ]}>
              <Text style={styles.footerLink}>{t('privacy')}</Text>
              <Text style={styles.footerDivider}>|</Text>
              <Text style={styles.footerLink}>{t('terms')}</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  /* Header Styles */
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    padding: 8,
    marginRight: 8,
  },
  logo: {
    width: 100,
    height: 30,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  secureText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.success,
    marginLeft: 4,
  },

  /* Scroll Content */
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  /* Order Summary */
  orderSummaryContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.lightText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: COLORS.darkText,
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.orange,
  },
  summarySubAmount: {
    fontSize: 13,
    color: COLORS.lightText,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  merchantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  merchantLabel: {
    fontSize: 14,
    color: COLORS.lightText,
  },
  merchantName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
  },

  /* Form Card */
  formCard: {
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 14,
    color: COLORS.lightText,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 8,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 4,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 12,
    height: 48,
    justifyContent: 'center',
  },
  inputWrapperFocused: {
    borderColor: COLORS.orange,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
  },
  textInput: {
    fontSize: 16,
    color: COLORS.darkText,
  },
  
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 4,
    marginBottom: 24,
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 10,
    fontSize: 12,
    color: COLORS.lightText,
    flex: 1,
  },

  /* Buttons */
  payButton: {
    backgroundColor: COLORS.orange,
    borderRadius: 4,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.orange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cancelLink: {
    alignItems: 'center',
    padding: 8,
  },
  cancelLinkText: {
    color: '#0070BA',
    fontSize: 14,
  },

  /* Footer */
  footer: {
    padding: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLink: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  footerDivider: {
    marginHorizontal: 8,
    fontSize: 10,
    color: '#D1D5DB',
  }
});