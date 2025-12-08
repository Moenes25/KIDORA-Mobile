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

// Import logos from assets
import VisaLogo from "../assets/visa.png";
import MastercardLogo from "../assets/mastercard.png";

export default function AddCardScreen({ visible, onClose, onAddCard }) {
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
          <Text style={styles.title}>Add new card</Text>

          {/* Card Type Selector */}
          <Text style={styles.label}>Card Type</Text>
          <View style={styles.cardTypeRow}>
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setCardType("visa")}
            >
              <View style={styles.radioCircle}>
                {cardType === "visa" && <View style={styles.selected} />}
              </View>
              <Image source={VisaLogo} style={styles.cardLogo} />
              <Text style={styles.radioText}>Visa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setCardType("mastercard")}
            >
              <View style={styles.radioCircle}>
                {cardType === "mastercard" && <View style={styles.selected} />}
              </View>
              <Image source={MastercardLogo} style={styles.cardLogo} />
              <Text style={styles.radioText}>Mastercard</Text>
            </TouchableOpacity>
          </View>

          {/* Card Number */}
          <Text style={styles.label}>Card Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter card number"
            value={cardNumber}
            onChangeText={setCardNumber}
            keyboardType="numeric"
          />

          {/* Card Holder Name */}
          <Text style={styles.label}>Card Holder Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter card holder name"
            value={cardHolder}
            onChangeText={setCardHolder}
          />

          {/* Expire Date & CVV in same row */}
          <View style={styles.row}>
            <View style={{ flex: 0.48 }}>
              <Text style={styles.label}>Expire Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                value={expireDate}
                onChangeText={setExpireDate}
              />
            </View>
            <View style={{ flex: 0.48 }}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="XXX"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Address */}
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Street, City, ZIP"
            value={address}
            onChangeText={setAddress}
          />

          {/* Buttons */}
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
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

  label: { fontSize: 14, fontWeight: "600", color: "#666", marginBottom: 6 },

  cardTypeRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },

  radioOption: { flexDirection: "row", alignItems: "center" },

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

  cardLogo: { width: 30, height: 20, resizeMode: "contain", marginRight: 6 },

  radioText: { fontSize: 14, fontWeight: "600", color: "#333" },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },

  row: { flexDirection: "row", justifyContent: "space-between" },

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

  buttonText: { color: "white", fontWeight: "700", fontSize: 16 },
});
