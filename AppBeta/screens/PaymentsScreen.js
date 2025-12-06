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
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";

// Import the reusable TopNavBar
import TopNavBar from "../components/TopNavBar";

// Import the PayMethodScreen bottom-sheet modal
import PayMethodScreen from "./PayMethodScreen";

export default function PaymentsScreen({ navigation }) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

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

  const shadowColor = isDark ? "#2d1b69" : "#000";

  return (
    <View style={styles.container}>
      <View 
        style={{ 
          height: Platform.OS === "android" ? StatusBar.currentHeight : 44,
          backgroundColor: "white" 
        }} 
      />
      <LinearGradient colors={colors.bgGradient} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
          <TopNavBar title="Payments" navigation={navigation} />

          <View 
            style={[
              styles.card, 
              { 
                backgroundColor: colors.card,
                shadowColor: shadowColor,
                shadowOpacity: isDark ? 0.4 : 0.1,
              }
            ]}
          >
            <View style={styles.cardHeader}>
              <Feather name="alert-octagon" size={22} color={colors.primary} style={{ marginRight: 8 }} />
              <View style={[styles.cardTitleBox, { backgroundColor: isDark ? colors.sidebarItemBg : "#f3e8ff" }]}>
                <Text style={[styles.cardTitle, { color: colors.primary }]}>Unpaid invoices</Text>
              </View>
            </View>

            {unpaidInvoices.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.subItemContainer, { backgroundColor: isDark ? colors.sidebarItemBg : "#f9f9f9" }]}
                onPress={() => setShowPaySheet(true)}
                activeOpacity={0.7}
              >
                <View style={styles.subItemLeft}>
                  <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
                    <Feather name="credit-card" size={20} color="white" />
                  </View>

                  <View style={{ flexShrink: 1 }}>
                    <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
                    <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{item.child}</Text>
                    <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{item.dueDate}</Text>
                    <Text style={[styles.priceBelow, { color: colors.primary }]}>{item.price}</Text>
                  </View>
                </View>

                <Feather name="chevron-right" size={22} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </View>

          <View 
            style={[
              styles.card, 
              { 
                backgroundColor: colors.card,
                shadowColor: shadowColor,
                shadowOpacity: isDark ? 0.4 : 0.1,
              }
            ]}
          >
            <View style={styles.cardHeader}>
              <Feather name="file-text" size={22} color={colors.primary} style={{ marginRight: 8 }} />
              <View style={[styles.cardTitleBox, { backgroundColor: isDark ? colors.sidebarItemBg : "#f3e8ff" }]}>
                <Text style={[styles.cardTitle, { color: colors.primary }]}>Payment history</Text>
              </View>
            </View>

            {paidInvoices.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.subItemContainer, { backgroundColor: isDark ? colors.sidebarItemBg : "#f9f9f9" }]}
              >
                <View style={styles.subItemLeft}>
                  <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
                    <Feather name="check-circle" size={20} color="white" />
                  </View>

                  <View style={{ flexShrink: 1 }}>
                    <Text style={[styles.itemTitle, { color: colors.text }]}>{item.title}</Text>
                    <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{item.child}</Text>
                    <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]}>{item.paymentDate}</Text>
                    <Text style={[styles.priceBelow, { color: colors.primary }]}>{item.price}</Text>
                  </View>
                </View>

                <Feather name="chevron-right" size={22} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <PayMethodScreen
          visible={showPaySheet}
          onClose={() => setShowPaySheet(false)}
        />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  card: {
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 14,
    padding: 15,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTitleBox: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  subItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    marginBottom: 10,
    borderRadius: 12,
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
  },
  itemSubtitle: {
    fontSize: 13,
  },
  priceBelow: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: "700",
  },
});