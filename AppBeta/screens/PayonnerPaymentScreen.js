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
import { normalize, wp, hp } from "../utils/responsive";

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
                isRTL && { marginLeft: wp(2), marginRight: 0 }
              ]}
            >
              <Feather name="x" size={normalize(24)} color={COLORS.lightText} />
            </TouchableOpacity>
            <Image source={PayoneerLogo} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.secureBadge}>
            <Feather name="lock" size={normalize(14)} color={COLORS.success} />
            <Text 
              style={[
                styles.secureText,
                isRTL && { marginRight: wp(1), marginLeft: 0 }
              ]}
              allowFontScaling={false}
            >
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
              <Text 
                style={[
                  styles.sectionTitle,
                  isRTL && { textAlign: 'right' }
                ]}
                allowFontScaling={false}
              >
                {t('orderSummary')}
              </Text>
              <View style={[
                styles.summaryRow,
                isRTL && { flexDirection: 'row-reverse' }
              ]}>
                <Text 
                  style={[
                    styles.summaryLabel,
                    isRTL && { textAlign: 'right' }
                  ]}
                  allowFontScaling={false}
                >
                  {t('totalAmount')}
                </Text>
                <View style={{ alignItems: isRTL ? 'flex-start' : 'flex-end' }}>
                  <Text style={styles.summaryAmount} allowFontScaling={false}>
                    {paymentAmount} TND
                  </Text>
                  <Text 
                    style={[
                      styles.summarySubAmount,
                      isRTL && { textAlign: 'left' }
                    ]}
                    allowFontScaling={false}
                  >
                    ≈ ${usdAmount} USD
                  </Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={[
                styles.merchantRow,
                isRTL && { flexDirection: 'row-reverse' }
              ]}>
                <Text 
                  style={[
                    styles.merchantLabel,
                    isRTL && { textAlign: 'right' }
                  ]}
                  allowFontScaling={false}
                >
                  {t('merchant')}
                </Text>
                <Text 
                  style={[
                    styles.merchantName,
                    isRTL && { textAlign: 'left' }
                  ]}
                  allowFontScaling={false}
                >
                  KIDORA Inc.
                </Text>
              </View>
            </View>

            {/* Login / Payment Form */}
            <View style={styles.formCard}>
              <Text 
                style={[
                  styles.formTitle,
                  isRTL && { textAlign: 'right' }
                ]}
                allowFontScaling={false}
              >
                {t('payWithPayoneer')}
              </Text>
              <Text 
                style={[
                  styles.formSubtitle,
                  isRTL && { textAlign: 'right' }
                ]}
                allowFontScaling={false}
              >
                {t('enterAccountDetails')}
              </Text>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text 
                  style={[
                    styles.inputLabel,
                    isRTL && { textAlign: 'right' }
                  ]}
                  allowFontScaling={false}
                >
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
                    allowFontScaling={false}
                  />
                </View>
              </View>

              {/* Info Note */}
              <View style={[
                styles.infoBox,
                isRTL && { flexDirection: 'row-reverse' }
              ]}>
                <Feather name="info" size={normalize(16)} color={COLORS.lightText} />
                <Text 
                  style={[
                    styles.infoText,
                    isRTL && { marginRight: wp(2.5), marginLeft: 0, textAlign: 'right' }
                  ]}
                  allowFontScaling={false}
                >
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
                  <Text style={styles.payButtonText} allowFontScaling={false}>
                    {t('payNow')}
                  </Text>
                )}
              </TouchableOpacity>

              {/* Cancel Link */}
              <TouchableOpacity 
                onPress={onClose} 
                style={styles.cancelLink} 
                disabled={loading}
              >
                <Text style={styles.cancelLinkText} allowFontScaling={false}>
                  {t('cancelReturnToMerchant')}
                </Text>
              </TouchableOpacity>
            </View>

          </ScrollView>

          {/* Footer (Gateway Standard) */}
          <View style={styles.footer}>
            <Text 
              style={[
                styles.footerText,
                isRTL && { textAlign: 'right' }
              ]}
              allowFontScaling={false}
            >
              {t('allRightsReserved')}
            </Text>
            <View style={[
              styles.footerLinks,
              isRTL && { flexDirection: 'row-reverse' }
            ]}>
              <Text style={styles.footerLink} allowFontScaling={false}>
                {t('privacy')}
              </Text>
              <Text style={styles.footerDivider} allowFontScaling={false}>|</Text>
              <Text style={styles.footerLink} allowFontScaling={false}>
                {t('terms')}
              </Text>
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
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: COLORS.white,
    borderBottomWidth: normalize(1),
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeButton: {
    padding: wp(2),
    marginRight: wp(2),
  },
  logo: {
    width: wp(25),
    height: hp(3.7),
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: normalize(4),
  },
  secureText: {
    fontSize: normalize(10),
    fontWeight: '700',
    color: COLORS.success,
    marginLeft: wp(1),
  },

  /* Scroll Content */
  scrollContent: {
    padding: wp(4),
    paddingBottom: hp(5),
  },

  /* Order Summary */
  orderSummaryContainer: {
    backgroundColor: COLORS.white,
    padding: wp(5),
    borderRadius: normalize(8),
    marginBottom: hp(2.5),
    borderWidth: normalize(1),
    borderColor: '#E5E7EB',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.12) },
    shadowOpacity: 0.05,
    shadowRadius: normalize(2),
    elevation: 2,
  },
  sectionTitle: {
    fontSize: normalize(12),
    fontWeight: '700',
    color: COLORS.lightText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: hp(1.5),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: hp(1.5),
  },
  summaryLabel: {
    fontSize: normalize(16),
    color: COLORS.darkText,
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: normalize(20),
    fontWeight: '700',
    color: COLORS.orange,
  },
  summarySubAmount: {
    fontSize: normalize(13),
    color: COLORS.lightText,
    textAlign: 'right',
  },
  divider: {
    height: normalize(1),
    backgroundColor: '#F3F4F6',
    marginVertical: hp(1.5),
  },
  merchantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  merchantLabel: {
    fontSize: normalize(14),
    color: COLORS.lightText,
  },
  merchantName: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: COLORS.darkText,
  },

  /* Form Card */
  formCard: {
    backgroundColor: COLORS.white,
    padding: wp(6),
    borderRadius: normalize(8),
    borderWidth: normalize(1),
    borderColor: '#E5E7EB',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.08,
    shadowRadius: normalize(4),
    elevation: 3,
  },
  formTitle: {
    fontSize: normalize(18),
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: hp(0.7),
  },
  formSubtitle: {
    fontSize: normalize(14),
    color: COLORS.lightText,
    marginBottom: hp(3),
  },
  inputGroup: {
    marginBottom: hp(2.5),
  },
  inputLabel: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: hp(1),
  },
  inputWrapper: {
    borderWidth: normalize(1),
    borderColor: COLORS.border,
    borderRadius: normalize(4),
    backgroundColor: '#FAFAFA',
    paddingHorizontal: wp(3),
    height: hp(6),
    justifyContent: 'center',
  },
  inputWrapperFocused: {
    borderColor: COLORS.orange,
    backgroundColor: COLORS.white,
    borderWidth: normalize(1.5),
  },
  textInput: {
    fontSize: normalize(16),
    color: COLORS.darkText,
  },
  
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    padding: wp(3),
    borderRadius: normalize(4),
    marginBottom: hp(3),
    alignItems: 'center',
  },
  infoText: {
    marginLeft: wp(2.5),
    fontSize: normalize(12),
    color: COLORS.lightText,
    flex: 1,
  },

  /* Buttons */
  payButton: {
    backgroundColor: COLORS.orange,
    borderRadius: normalize(4),
    height: hp(6.2),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp(2),
    shadowColor: COLORS.orange,
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.2,
    shadowRadius: normalize(4),
    elevation: 2,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    color: COLORS.white,
    fontSize: normalize(16),
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cancelLink: {
    alignItems: 'center',
    padding: wp(2),
  },
  cancelLinkText: {
    color: '#0070BA',
    fontSize: normalize(14),
  },

  /* Footer */
  footer: {
    padding: wp(5),
    alignItems: 'center',
    borderTopWidth: normalize(1),
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    fontSize: normalize(11),
    color: '#9CA3AF',
    marginBottom: hp(1),
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLink: {
    fontSize: normalize(11),
    color: '#6B7280',
    fontWeight: '500',
  },
  footerDivider: {
    marginHorizontal: wp(2),
    fontSize: normalize(10),
    color: '#D1D5DB',
  }
});