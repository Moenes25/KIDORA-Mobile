import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function PaidInvoiceScreen({ navigation, route }) {
  //const invoice = route.params?.invoice || {};

  // Example invoice object for testing:
const invoice = {
  title: "Registration Fee - December",
  reference: "INV-00123",
  issueDate: "Dec 1, 2024",
  paymentDate: "Dec 5, 2024",
  status: "Paid",
  framesMonthly: "120 TND",
  additionalServices: [
    { name: "Transport", price: "30 TND" },
    { name: "Canteen", price: "50 TND" },
    { name: "Activities Extras", price: "20 TND" },
  ],
  total: "220 TND",
  paymentMethod: "Mastercard",
  child: { name: "Adam Ben Ali", age: 8, class: "Class 1" },
};


  const handleDownload = () => {
    Alert.alert("Download", "Invoice PDF download initiated!");
  };

  // Map payment methods to logos (ensure you have these images in your assets folder)
  const paymentLogos = {
    Mastercard: require("../assets/mastercard.png"),
    Visa: require("../assets/visa.png"),
    D17: require("../assets/D17.png"),
    Flouci: require("../assets/flouci.png"),
    Payoneer: require("../assets/payoneer.png"),
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={["#6F42C1", "#9b59b6"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invoice Details</Text>
        <TouchableOpacity onPress={handleDownload}>
          <Feather name="download" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 1- Invoice Info Subcard */}
        <View style={styles.subCard}>
          <Text style={styles.subCardTitle}>{invoice.title || "Invoice Title"}</Text>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Invoice Reference:</Text>
            <Text style={styles.value}>{invoice.reference || "INV-00123"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Date of Issue:</Text>
            <Text style={styles.value}>{invoice.issueDate || "Jan 1, 2025"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Payment Date:</Text>
            <Text style={styles.value}>{invoice.paymentDate || "Jan 5, 2025"}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Invoice Status:</Text>
            <View style={[styles.statusTag, invoice.status === "Paid" ? styles.paid : styles.cancelled]}>
              <Feather name="check" size={16} color="white" style={{ marginRight: 4 }} />
              <Text style={styles.statusText}>{invoice.status || "Paid"}</Text>
            </View>
          </View>
        </View>

        {/* 2- Invoice Details Subcard */}
        <View style={styles.subCard}>
          <View style={styles.subCardHeader}>
            <MaterialIcons name="description" size={22} color="#6F42C1" style={{ marginRight: 8 }} />
            <Text style={styles.subCardTitle}>Invoice Details</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Monthly Frames:</Text>
            <Text style={styles.value}>{invoice.framesMonthly || "120 TND"}</Text>
          </View>

          <Text style={[styles.label, { marginTop: 12 }]}>Additional Services:</Text>
          {invoice.additionalServices?.map((service, index) => (
            <View key={index} style={styles.serviceRow}>
              <Text style={styles.value}>{service.name}</Text>
              <Text style={styles.value}>{service.price}</Text>
            </View>
          ))}

          <View style={styles.detailRow}>
            <Text style={[styles.label, { marginTop: 12 }]}>Total Amount:</Text>
            <Text style={styles.value}>{invoice.total || "200 TND"}</Text>
          </View>
        </View>

        {/* Payment Method Subcard */}
        <View style={styles.subCard}>
        <View style={styles.subCardHeader}>
            <MaterialIcons name="payment" size={22} color="#6F42C1" style={{ marginRight: 8 }} />
            <Text style={styles.subCardTitle}>Payment Method</Text>
        </View>

        <View style={styles.paymentRow}>
            {invoice.paymentMethod && paymentLogos[invoice.paymentMethod] && (
            <Image source={paymentLogos[invoice.paymentMethod]} style={styles.paymentLogo} />
            )}
            <Text style={styles.value}>{invoice.paymentMethod || "Credit Card"}</Text>
        </View>
        </View>

        {/* Child Concerned Subcard */}
        <View style={styles.subCard}>
        <View style={styles.subCardHeader}>
            <MaterialIcons name="child-care" size={22} color="#6F42C1" style={{ marginRight: 8 }} />
            <Text style={styles.subCardTitle}>Child Concerned</Text>
        </View>

        <View style={styles.childRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{invoice.child?.name || "Adam Ben Ali"}</Text>
        </View>

        <View style={styles.childRow}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{invoice.child?.age || "8"}</Text>
        </View>

        <View style={styles.childRow}>
            <Text style={styles.label}>Class:</Text>
            <Text style={styles.value}>{invoice.child?.class || "Class 1"}</Text>
        </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf7ff" },

  header: {
    paddingTop: 55,
    paddingBottom: 25,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  headerTitle: { color: "white", fontSize: 22, fontWeight: "700" },

  contentContainer: {
    padding: 20,
    paddingBottom: 50,
  },

  subCard: {
    backgroundColor: "white",
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  subCardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 12 },

  subCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6F42C1",
  },

  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 16,
    marginTop: 4,
  },

  label: { fontSize: 14, fontWeight: "600", color: "#666" },
  value: { fontSize: 16, fontWeight: "700", color: "#333" },

  statusTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  statusText: { color: "white", fontWeight: "700" },

  paid: { backgroundColor: "green" },
  cancelled: { backgroundColor: "red" },

  paymentLogo: { width: 40, height: 24, marginRight: 10, resizeMode: "contain" },

  paymentRow: {
  flexDirection: "row",
  alignItems: "center",
  marginTop: 8,
},

childRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  marginTop: 8,
},

value: { fontSize: 16, fontWeight: "700", color: "#333", marginLeft: 6 },

});
