import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { useTranslation } from "../context/TranslationContext";

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
      <View style={styles.overlay}>
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
                isRTL && { marginLeft: 6, marginRight: 0 }
              ]}>
                {cardType === "visa" && <View style={styles.selected} />}
              </View>
              <Image source={VisaLogo} style={[
                styles.cardLogo,
                isRTL && { marginLeft: 6, marginRight: 0 }
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
                isRTL && { marginLeft: 6, marginRight: 0 }
              ]}>
                {cardType === "mastercard" && <View style={styles.selected} />}
              </View>
              <Image source={MastercardLogo} style={[
                styles.cardLogo,
                isRTL && { marginLeft: 6, marginRight: 0 }
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

  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6F42C1",
    marginBottom: 15,
    textAlign: "center",
  },

  label: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#666", 
    marginBottom: 6 
  },

  cardTypeRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 15 
  },

  radioOption: { 
    flexDirection: "row", 
    alignItems: "center" 
  },

  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#6F42C1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },

  selected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#6F42C1",
  },

  cardLogo: { 
    width: 30, 
    height: 20, 
    resizeMode: "contain", 
    marginRight: 6 
  },

  radioText: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#333" 
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },

  row: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },

  addButton: {
    backgroundColor: "#6F42C1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },

  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: { 
    color: "white", 
    fontWeight: "700", 
    fontSize: 16 
  },
});