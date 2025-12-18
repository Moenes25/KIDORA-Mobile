import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useTranslation } from "../context/TranslationContext";
import { normalize, wp, hp, isSmallDevice } from "../utils/responsive";

// Import logos from assets
import VisaLogo from "../assets/visa.png";
import MastercardLogo from "../assets/mastercard.png";

export default function AddCardScreen({ visible, onClose, onAddCard }) {
  const { t, isRTL } = useTranslation();
  const [cardType, setCardType] = useState("visa");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [address, setAddress] = useState("");

  const handleAdd = () => {
    const newCard = {
      cardType,
      cardNumber,
      cardHolder,
      expireDate,
      cvv,
      address,
    };
    if (onAddCard) onAddCard(newCard);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalContainer}>
            {/* Title */}
            <Text style={[
              styles.title,
              isRTL && { textAlign: 'right' }
            ]}>
              {t('addNewCard')}
            </Text>

            {/* Card Type Selector */}
            <Text style={[
              styles.label,
              isRTL && { textAlign: 'right' }
            ]}>
              {t('cardType')}
            </Text>
            <View style={[
              styles.cardTypeRow,
              isRTL && { flexDirection: 'row-reverse' }
            ]}>
              <TouchableOpacity
                style={[
                  styles.radioOption,
                  isRTL && { flexDirection: 'row-reverse' }
                ]}
                onPress={() => setCardType("visa")}
              >
                <View style={[
                  styles.radioCircle,
                  isRTL && { marginLeft: wp(1.5), marginRight: 0 }
                ]}>
                  {cardType === "visa" && <View style={styles.selected} />}
                </View>
                <Image source={VisaLogo} style={[
                  styles.cardLogo,
                  isRTL && { marginLeft: wp(1.5), marginRight: 0 }
                ]} />
                <Text style={styles.radioText}>{t('visa')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.radioOption,
                  isRTL && { flexDirection: 'row-reverse' }
                ]}
                onPress={() => setCardType("mastercard")}
              >
                <View style={[
                  styles.radioCircle,
                  isRTL && { marginLeft: wp(1.5), marginRight: 0 }
                ]}>
                  {cardType === "mastercard" && <View style={styles.selected} />}
                </View>
                <Image source={MastercardLogo} style={[
                  styles.cardLogo,
                  isRTL && { marginLeft: wp(1.5), marginRight: 0 }
                ]} />
                <Text style={styles.radioText}>{t('mastercard')}</Text>
              </TouchableOpacity>
            </View>

            {/* Card Number */}
            <Text style={[
              styles.label,
              isRTL && { textAlign: 'right' }
            ]}>
              {t('cardNumber')}
            </Text>
            <TextInput
              style={[
                styles.input,
                isRTL && { textAlign: 'right' }
              ]}
              placeholder={t('enterCardNumber')}
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
            />

            {/* Card Holder Name */}
            <Text style={[
              styles.label,
              isRTL && { textAlign: 'right' }
            ]}>
              {t('cardHolderName')}
            </Text>
            <TextInput
              style={[
                styles.input,
                isRTL && { textAlign: 'right' }
              ]}
              placeholder={t('enterCardHolderName')}
              value={cardHolder}
              onChangeText={setCardHolder}
            />

            {/* Expire Date & CVV in same row */}
            <View style={[
              styles.row,
              isRTL && { flexDirection: 'row-reverse' }
            ]}>
              <View style={{ flex: 0.48 }}>
                <Text style={[
                  styles.label,
                  isRTL && { textAlign: 'right' }
                ]}>
                  {t('expireDate')}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    isRTL && { textAlign: 'right' }
                  ]}
                  placeholder="MM/YY"
                  value={expireDate}
                  onChangeText={setExpireDate}
                />
              </View>
              <View style={{ flex: 0.48 }}>
                <Text style={[
                  styles.label,
                  isRTL && { textAlign: 'right' }
                ]}>
                  CVV
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    isRTL && { textAlign: 'right' }
                  ]}
                  placeholder="XXX"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Address */}
            <Text style={[
              styles.label,
              isRTL && { textAlign: 'right' }
            ]}>
              {t('address')}
            </Text>
            <TextInput
              style={[
                styles.input,
                isRTL && { textAlign: 'right' }
              ]}
              placeholder={t('streetCityZip')}
              value={address}
              onChangeText={setAddress}
            />

            {/* Buttons */}
            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
              <Text style={styles.buttonText}>{t('add')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: hp(2),
  },

  modalContainer: {
    width: wp(90),
    maxWidth: 500,
    backgroundColor: "white",
    borderRadius: normalize(15),
    padding: wp(5),
  },

  title: {
    fontSize: normalize(isSmallDevice ? 18 : 20),
    fontWeight: "700",
    color: "#6F42C1",
    marginBottom: hp(2),
    textAlign: "center",
  },

  label: { 
    fontSize: normalize(isSmallDevice ? 12 : 14), 
    fontWeight: "600", 
    color: "#666", 
    marginBottom: hp(0.8),
  },

  cardTypeRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: hp(2),
  },

  radioOption: { 
    flexDirection: "row", 
    alignItems: "center",
  },

  radioCircle: {
    width: normalize(isSmallDevice ? 18 : 20),
    height: normalize(isSmallDevice ? 18 : 20),
    borderRadius: normalize(10),
    borderWidth: 2,
    borderColor: "#6F42C1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(1.5),
  },

  selected: {
    width: normalize(isSmallDevice ? 8 : 10),
    height: normalize(isSmallDevice ? 8 : 10),
    borderRadius: normalize(5),
    backgroundColor: "#6F42C1",
  },

  cardLogo: { 
    width: normalize(isSmallDevice ? 26 : 30), 
    height: normalize(isSmallDevice ? 17 : 20), 
    resizeMode: "contain", 
    marginRight: wp(1.5),
  },

  radioText: { 
    fontSize: normalize(isSmallDevice ? 12 : 14), 
    fontWeight: "600", 
    color: "#333",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: normalize(10),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.4),
    marginBottom: hp(1.5),
    fontSize: normalize(isSmallDevice ? 12 : 14),
  },

  row: { 
    flexDirection: "row", 
    justifyContent: "space-between",
  },

  addButton: {
    backgroundColor: "#6F42C1",
    paddingVertical: hp(1.8),
    borderRadius: normalize(12),
    alignItems: "center",
    marginBottom: hp(1.2),
    marginTop: hp(1),
  },

  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: hp(1.8),
    borderRadius: normalize(12),
    alignItems: "center",
  },

  buttonText: { 
    color: "white", 
    fontWeight: "700", 
    fontSize: normalize(isSmallDevice ? 14 : 16),
  },
});