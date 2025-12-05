import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
    StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

// Import the PayMethodScreen bottom-sheet modal
import PayMethodScreen from "./PayMethodScreen";

export default function PaymentsScreen({ navigation }) {
  const [showPaySheet, setShowPaySheet] = useState(false);

  const unpaidInvoices = [
    {
      id: 1,
      title: "Registration Fee - January",
      child: "Adam Ben Ali",
      dueDate: "Due: Jan 25, 2025",
      price: "120 TND",
    },
    {
      id: 2,
      title: "Meal Plan - January",
      child: "Lina Soltani",
      dueDate: "Due: Jan 20, 2025",
      price: "80 TND",
    },
  ];

  const paidInvoices = [
    {
      id: 1,
      title: "Registration Fee - December",
      child: "Adam Ben Ali",
      paymentDate: "Paid: Dec 5, 2024",
      price: "120 TND",
    },
    {
      id: 2,
      title: "Meal Plan - December",
      child: "Lina Soltani",
      paymentDate: "Paid: Dec 12, 2024",
      price: "80 TND",
    },
  ];

  return (
    <View style={styles.container}>

      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>

        {/* HEADER */}
        <LinearGradient colors={["#6F42C1", "#9b59b6"]} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="chevron-left" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Payments</Text>
        </LinearGradient>

        {/* UNPAID INVOICES */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather
              name="alert-octagon"
              size={22}
              color="#6F42C1"
              style={{ marginRight: 8 }}
            />
            <View style={styles.cardTitleBox}>
              <Text style={styles.cardTitle}>Unpaid invoices</Text>
            </View>
          </View>

          {unpaidInvoices.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.subItemContainer}
              onPress={() => setShowPaySheet(true)}
              activeOpacity={0.7}
            >
              <View style={styles.subItemLeft}>
                <View style={styles.iconCircle}>
                  <Feather name="credit-card" size={20} color="white" />
                </View>

                <View style={{ flexShrink: 1 }}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubtitle}>{item.child}</Text>
                  <Text style={styles.itemSubtitle}>{item.dueDate}</Text>

                  <Text style={styles.priceBelow}>{item.price}</Text>
                </View>
              </View>

              {/* Arrow indicator */}
              <Feather name="chevron-right" size={22} color="#6F42C1" />
            </TouchableOpacity>
          ))}
        </View>

        {/* PAYMENT HISTORY */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Feather
              name="file-text"
              size={22}
              color="#6F42C1"
              style={{ marginRight: 8 }}
            />
            <View style={styles.cardTitleBox}>
              <Text style={styles.cardTitle}>Payment history</Text>
            </View>
          </View>

          {paidInvoices.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.subItemContainer}
            >
              <View style={styles.subItemLeft}>
                <View style={styles.iconCircle}>
                  <Feather name="check-circle" size={20} color="white" />
                </View>

                <View style={{ flexShrink: 1 }}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemSubtitle}>{item.child}</Text>
                  <Text style={styles.itemSubtitle}>{item.paymentDate}</Text>

                  <Text style={styles.priceBelow}>{item.price}</Text>
                </View>
              </View>

              <Feather name="chevron-right" size={22} color="#6F42C1" />
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      {/* BOTTOM SHEET */}
      <PayMethodScreen
        visible={showPaySheet}
        onClose={() => setShowPaySheet(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#fbf7ff"
  },

  header: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingTop: 55,
    paddingBottom: 25,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 12,
  },

  card: {
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 14,
    padding: 15,
    backgroundColor: "white",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  cardTitleBox: {
    backgroundColor: "#f3e8ff",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6F42C1",
  },

  subItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    marginBottom: 10,
    borderRadius: 12,
    backgroundColor: "#f9f9f9",
  },

  subItemLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#6F42C1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 3,
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
    flexShrink: 1,
    color: "#333",
  },

  itemSubtitle: {
    fontSize: 13,
    color: "#666",
  },

  priceBelow: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: "700",
    color: "#6F42C1",
  },

  payButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "700",
    marginRight: 5,
  },
});