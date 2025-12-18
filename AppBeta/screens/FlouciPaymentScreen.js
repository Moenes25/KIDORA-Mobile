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
import { useTranslation } from "../context/TranslationContext";
import { normalize, wp, hp } from "../utils/responsive";
import FlouciLogo from "../assets/flouci.png";

export default function FlouciPaymentScreen({ visible, onClose, onPaymentSuccess, paymentAmount }) {
  const { t, isRTL } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);

  // Initiate Flouci payment
  const initiateFlouciPayment = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert(t('error'), t('enterFlouciPhoneNumber'));
      return;
    }

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      Alert.alert(t('error'), t('invalidPaymentAmount'));
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
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentUrl(data.paymentUrl);
        
        Alert.alert(
          t('paymentInitiated'),
          t('completeInFlouci'),
          [
            {
              text: t('openFlouci'),
              onPress: () => {
                // Open Flouci app or payment URL
                // Linking.openURL(data.paymentUrl);
                checkPaymentStatus(data.paymentId);
              },
            },
            {
              text: t('cancel'),
              style: "cancel",
            },
          ]
        );
      } else {
        Alert.alert(t('error'), data.message || t('failedToInitiate'));
      }
    } catch (error) {
      console.error("Flouci Payment Error:", error);
      Alert.alert(t('error'), t('failedToConnect'));
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
        Alert.alert(t('success'), t('paymentCompletedSuccess'));
        onPaymentSuccess && onPaymentSuccess(data);
        onClose();
      } else if (data.status === "PENDING") {
        // Keep checking
        setTimeout(() => checkPaymentStatus(paymentId), 3000);
      } else {
        Alert.alert(t('paymentFailed'), t('paymentNotCompleted'));
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
          <Text 
            style={[
              styles.title,
              isRTL && { textAlign: 'right' }
            ]}
            allowFontScaling={false}
          >
            {t('payWithFlouci')}
          </Text>

          {/* DESCRIPTION */}
          <Text 
            style={[
              styles.description,
              isRTL && { textAlign: 'right' }
            ]}
            allowFontScaling={false}
          >
            {t('enterFlouciPhone')}
          </Text>

          {/* AMOUNT DISPLAY */}
          <View style={styles.amountBox}>
            <Text 
              style={[
                styles.amountLabel,
                isRTL && { textAlign: 'right' }
              ]}
              allowFontScaling={false}
            >
              {t('amountToPay')}
            </Text>
            <Text 
              style={[
                styles.amountValue,
                isRTL && { textAlign: 'right' }
              ]}
              allowFontScaling={false}
            >
              {paymentAmount} TND
            </Text>
          </View>

          {/* PHONE INPUT */}
          <View style={[
            styles.inputWrapper,
            isRTL && { flexDirection: 'row-reverse' }
          ]}>
            <Feather 
              name="smartphone" 
              size={normalize(20)} 
              color="#666" 
              style={[
                styles.inputIcon,
                isRTL && { marginLeft: wp(2.5), marginRight: 0 }
              ]} 
            />
            <TextInput
              style={[
                styles.phoneInput,
                isRTL && { textAlign: 'right' }
              ]}
              placeholder={t('flouciPhoneNumber')}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              editable={!loading}
              allowFontScaling={false}
            />
          </View>

          {/* INFO BOX */}
          <View style={[
            styles.infoBox,
            isRTL && { flexDirection: 'row-reverse' }
          ]}>
            <Feather name="info" size={normalize(16)} color="#FF6B35" />
            <Text 
              style={[
                styles.infoText,
                isRTL && { marginRight: wp(2), marginLeft: 0, textAlign: 'right' }
              ]}
              allowFontScaling={false}
            >
              {t('redirectToFlouci')}
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
                <View style={[
                  styles.payBtnContent,
                  isRTL && { flexDirection: 'row-reverse' }
                ]}>
                  <Feather name="check-circle" size={normalize(20)} color="white" />
                  <Text 
                    style={[
                      styles.payBtnText,
                      isRTL ? { marginRight: wp(2) } : { marginLeft: wp(2) }
                    ]}
                    allowFontScaling={false}
                  >
                    {t('continueToFlouci')}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={loading}
            >
              <Text style={styles.cancelText} allowFontScaling={false}>
                {t('cancel')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* SECURITY NOTE */}
          <View style={[
            styles.securityNote,
            isRTL && { flexDirection: 'row-reverse' }
          ]}>
            <Feather name="lock" size={normalize(14)} color="#999" />
            <Text 
              style={[
                styles.securityText,
                isRTL ? { marginRight: wp(1.5) } : { marginLeft: wp(1.5) }
              ]}
              allowFontScaling={false}
            >
              {t('securedByFlouci')}
            </Text>
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
    width: wp(90),
    maxWidth: wp(100),
    backgroundColor: "#fff",
    borderRadius: normalize(20),
    padding: wp(6),
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.3,
    shadowRadius: normalize(8),
  },

  logo: {
    width: wp(20),
    height: wp(20),
    marginBottom: hp(2),
  },

  title: {
    fontSize: normalize(22),
    fontWeight: "700",
    color: "#FF6B35",
    textAlign: "center",
    marginBottom: hp(1),
  },

  description: {
    fontSize: normalize(14),
    color: "#666",
    textAlign: "center",
    marginBottom: hp(2.5),
    lineHeight: normalize(20),
  },

  amountBox: {
    width: "100%",
    backgroundColor: "#FFF5F2",
    padding: wp(4),
    borderRadius: normalize(12),
    alignItems: "center",
    marginBottom: hp(2.5),
    borderWidth: normalize(1),
    borderColor: "#FFE0D6",
  },

  amountLabel: {
    fontSize: normalize(13),
    color: "#FF6B35",
    fontWeight: "600",
    marginBottom: hp(0.5),
  },

  amountValue: {
    fontSize: normalize(28),
    fontWeight: "700",
    color: "#FF6B35",
  },

  inputWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: normalize(1),
    borderColor: "#ddd",
    borderRadius: normalize(12),
    paddingHorizontal: wp(3.5),
    backgroundColor: "#fafafa",
    marginBottom: hp(2),
    height: hp(6.7),
  },

  inputIcon: {
    marginRight: wp(2.5),
  },

  phoneInput: {
    flex: 1,
    fontSize: normalize(16),
    color: "#333",
  },

  infoBox: {
    flexDirection: "row",
    backgroundColor: "#FFF5F2",
    padding: wp(3),
    borderRadius: normalize(10),
    alignItems: "center",
    width: "100%",
    marginBottom: hp(2.5),
  },

  infoText: {
    fontSize: normalize(12),
    color: "#FF6B35",
    marginLeft: wp(2),
    flex: 1,
    lineHeight: normalize(16),
  },

  buttonContainer: {
    width: "100%",
    marginBottom: hp(1.5),
  },

  payBtn: {
    backgroundColor: "#FF6B35",
    paddingVertical: hp(2),
    borderRadius: normalize(12),
    width: "100%",
    alignItems: "center",
    marginBottom: hp(1.2),
    elevation: 2,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.3,
    shadowRadius: normalize(4),
  },

  payBtnDisabled: {
    backgroundColor: "#FFB89F",
  },

  payBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  payBtnText: {
    color: "white",
    fontSize: normalize(17),
    fontWeight: "700",
  },

  cancelBtn: {
    backgroundColor: "#f0f0f0",
    paddingVertical: hp(1.7),
    borderRadius: normalize(12),
    width: "100%",
    alignItems: "center",
  },

  cancelText: {
    color: "#666",
    fontSize: normalize(16),
    fontWeight: "600",
  },

  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(1),
  },

  securityText: {
    fontSize: normalize(12),
    color: "#999",
  },
});