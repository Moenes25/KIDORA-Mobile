import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Import the bottom-sheet PayMethodScreen
import PayMethodScreen from "./PayMethodScreen";

export default function InvoiceToPayScreen({ navigation, route }) {
  const [showPaySheet, setShowPaySheet] = useState(false);

  // Use the invoice passed via route.params or fallback to example
  const invoice = /*route.params?.invoice || */{
    title: "Registration Fee - December",
    reference: "INV-00123",
    issueDate: "Dec 1, 2024",
    dueDate: "Dec 15, 2024",
    framesMonthly: "120 TND",
    additionalServices: [
      { name: "Transport", price: "30 TND" },
      { name: "Canteen", price: "50 TND" },
      { name: "Activities Extras", price: "20 TND" },
    ],
    total: "220 TND",
    child: { name: "Adam Ben Ali", age: 8, class: "Class 1" },
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={["#6F42C1", "#9b59b6"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="chevron-left" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invoice Details</Text>
        <View style={{ width: 24 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 1- Invoice Info Subcard */}
        <View style={styles.subCard}>
          <Text style={styles.subCardTitle}>{invoice.title}</Text>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Invoice Reference:</Text>
            <Text style={styles.value}>{invoice.reference}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Date of Issue:</Text>
            <Text style={styles.value}>{invoice.issueDate}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Due Date:</Text>
            <Text style={styles.value}>{invoice.dueDate}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Invoice Status:</Text>
            <View style={[styles.statusTag, styles.unpaid]}>
              <Feather name="x" size={16} color="white" style={{ marginRight: 4 }} />
              <Text style={styles.statusText}>Unpaid</Text>
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
            <Text style={styles.value}>{invoice.framesMonthly}</Text>
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
            <Text style={styles.value}>{invoice.total}</Text>
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
            <Text style={styles.value}>{invoice.child?.name}</Text>
          </View>

          <View style={styles.childRow}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{invoice.child?.age}</Text>
          </View>

          <View style={styles.childRow}>
            <Text style={styles.label}>Class:</Text>
            <Text style={styles.value}>{invoice.child?.class}</Text>
          </View>
        </View>

        {/* Confirm Payment Button */}
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => setShowPaySheet(true)}
        >
          <Text style={styles.confirmButtonText}>Pay</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* PayMethodScreen Bottom Sheet */}
      <PayMethodScreen
        visible={showPaySheet}
        onClose={() => setShowPaySheet(false)}
      />
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

  unpaid: { backgroundColor: "red" },

  childRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 8,
  },

  value: { fontSize: 16, fontWeight: "700", color: "#333", marginLeft: 6 },

  confirmButton: {
    backgroundColor: "#6F42C1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  confirmButtonText: { color: "white", fontSize: 16, fontWeight: "700" },
});
