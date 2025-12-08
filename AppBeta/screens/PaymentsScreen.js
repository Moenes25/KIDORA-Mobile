import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";

// Import the reusable TopNavBar
import TopNavBar from "../components/TopNavBar";


const screenHeight = Dimensions.get("window").height;
const TOP_SECTION_HEIGHT = screenHeight * 0.20;

export default function PaymentsScreen({ navigation }) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  //const [showPaySheet, setShowPaySheet] = useState(false);

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
    <View style={[styles.container, { backgroundColor: isDark ? colors.background : "#ffffff" }]}>
      <StatusBar 
        barStyle="light-content"
        backgroundColor={isDark 
          ? (colors.bgGradient?.[0])
          : (colors.headerGradient?.[0] || "#6F42C1")
        } 
      />
      
      {/* TOP SECTION with gradient */}
      <View style={[styles.topSection, { height: TOP_SECTION_HEIGHT }]}>
        <LinearGradient 
          colors={isDark 
            ? (colors.bgGradient || ["#1a1a2e", "#0f0f1f"])
            : (colors.headerGradient || ["#6F42C1", "#9b59b6"])
          } 
          style={StyleSheet.absoluteFill}
        >
          {isDark && (
            <View style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }} />
          )}
          
          <View style={styles.safeArea} />
          <TopNavBar title="Payments" navigation={navigation} />
        </LinearGradient>
      </View>
      
      {/* WHITE BOTTOM SECTION */}
      <View style={[
        styles.bottomSection,
        { 
          backgroundColor: isDark ? colors.background : "#ffffff",
          top: TOP_SECTION_HEIGHT 
        }
      ]}>
        <ScrollView contentContainerStyle={{ paddingBottom: 80, paddingTop: 20 }}>
          <View 
            style={[
              styles.card, 
              { 
                backgroundColor: isDark ? colors.card : "#FFFFFF",
                shadowOpacity: isDark ? 0.4 : 0.08,
              }
            ]}
          >
            <View style={styles.cardHeader}>
              <Feather name="alert-octagon" size={22} color="#6F42C1" style={{ marginRight: 8 }} />
              <View style={[styles.cardTitleBox, { backgroundColor: "#f3e8ff" }]}>
                <Text style={[styles.cardTitle, { color: "#6F42C1" }]}>Unpaid invoices</Text>
              </View>
            </View>

            {unpaidInvoices.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.subItemContainer, { backgroundColor: isDark ? colors.sidebarItemBg : "#f9f9f9" }]}
                onPress={() => navigation.navigate("InvoiceToPayScreen", { invoice: item })}
                activeOpacity={0.7}
              >
                <View style={styles.subItemLeft}>
                  <View style={[styles.iconCircle, { backgroundColor: "#6F42C1" }]}>
                    <Feather name="credit-card" size={20} color="white" />
                  </View>

                  <View style={{ flexShrink: 1 }}>
                    <Text style={[styles.itemTitle, { color: isDark ? "#ffffff" : "#2c2c2c" }]}>{item.title}</Text>
                    <Text style={[styles.itemSubtitle, { color: isDark ? "#b0a8d9" : "#666" }]}>{item.child}</Text>
                    <Text style={[styles.itemSubtitle, { color: isDark ? "#b0a8d9" : "#666" }]}>{item.dueDate}</Text>
                    <Text style={[styles.priceBelow, { color: "#6F42C1" }]}>{item.price}</Text>
                  </View>
                </View>

                <Feather name="chevron-right" size={22} color="#6F42C1" />
              </TouchableOpacity>
            ))}
          </View>

          <View 
            style={[
              styles.card, 
              { 
                backgroundColor: isDark ? colors.card : "#FFFFFF",
                shadowOpacity: isDark ? 0.4 : 0.08,
              }
            ]}
          >
            <View style={styles.cardHeader}>
              <Feather name="file-text" size={22} color="#6F42C1" style={{ marginRight: 8 }} />
              <View style={[styles.cardTitleBox, { backgroundColor: "#f3e8ff" }]}>
                <Text style={[styles.cardTitle, { color: "#6F42C1" }]}>Payment history</Text>
              </View>
            </View>

            {paidInvoices.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.subItemContainer, { backgroundColor: isDark ? colors.sidebarItemBg : "#f9f9f9" }]}
                onPress={() => navigation.navigate("PaidInvoiceScreen", { invoice: item })}
              >
                <View style={styles.subItemLeft}>
                  <View style={[styles.iconCircle, { backgroundColor: "#4CAF50" }]}>
                    <Feather name="check-circle" size={20} color="white" />
                  </View>

                  <View style={{ flexShrink: 1 }}>
                    <Text style={[styles.itemTitle, { color: isDark ? "#ffffff" : "#2c2c2c" }]}>{item.title}</Text>
                    <Text style={[styles.itemSubtitle, { color: isDark ? "#b0a8d9" : "#666" }]}>{item.child}</Text>
                    <Text style={[styles.itemSubtitle, { color: isDark ? "#b0a8d9" : "#666" }]}>{item.paymentDate}</Text>
                    <Text style={[styles.priceBelow, { color: "#4CAF50" }]}>{item.price}</Text>
                  </View>
                </View>

                <Feather name="chevron-right" size={22} color={isDark ? "#b0a8d9" : "#666"} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  topSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  safeArea: {
    height: Platform.OS === "ios" ? 44 : StatusBar.currentHeight,
  },
  bottomSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    marginTop: 0,
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 14,
    padding: 15,
    elevation: 4,
    shadowColor: "#000",
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