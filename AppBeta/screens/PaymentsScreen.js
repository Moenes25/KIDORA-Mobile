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
import TopNavBar from "../components/TopNavBar";

const screenHeight = Dimensions.get("window").height;
const TOP_SECTION_HEIGHT = screenHeight * 0.20;

export default function PaymentsScreen({ navigation }) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

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
      
      {/* WHITE/DARK BOTTOM SECTION */}
      <View style={[
        styles.bottomSection,
        { 
          backgroundColor: isDark ? colors.background : "#ffffff",
          top: TOP_SECTION_HEIGHT 
        }
      ]}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Unpaid Invoices Card */}
          <View 
            style={[
              styles.card, 
              { 
                backgroundColor: isDark ? colors.card : "#FFFFFF",
                shadowOpacity: isDark ? 0.4 : 0.08,
              }
            ]}
          >
            {/* Card Header */}
            <View style={styles.cardHeaderSection}>
              <View style={styles.cardHeaderContent}>
                <View style={[styles.iconBadge, { backgroundColor: "#fee2e2" }]}>
                  <Feather name="alert-circle" size={20} color="#dc2626" />
                </View>
                <View style={styles.cardHeaderText}>
                  <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#2d3436" }]}>
                    Unpaid Invoices
                  </Text>
                  <Text style={[styles.cardSubtitle, { color: isDark ? "#b0a8d9" : "#636e72" }]}>
                    {unpaidInvoices.length} pending payment{unpaidInvoices.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
              <View style={[styles.countBadge, { backgroundColor: "#dc2626" }]}>
                <Text style={styles.countBadgeText}>{unpaidInvoices.length}</Text>
              </View>
            </View>

            {/* Unpaid Invoice Items */}
            {unpaidInvoices.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.invoiceItem,
                  { 
                    backgroundColor: isDark ? colors.sidebarItemBg : "#f8f9fa",
                    marginTop: index === 0 ? 16 : 12,
                  }
                ]}
                onPress={() => navigation.navigate("InvoiceToPayScreen", { invoice: item })}
                activeOpacity={0.7}
              >
                <View style={styles.invoiceItemContent}>
                  <View style={[styles.invoiceIconCircle, { backgroundColor: "#fef3c7" }]}>
                    <Feather name="file-text" size={22} color="#f59e0b" />
                  </View>

                  <View style={styles.invoiceDetails}>
                    <Text style={[styles.invoiceTitle, { color: isDark ? "#ffffff" : "#2d3436" }]}>
                      {item.title}
                    </Text>
                    <View style={styles.invoiceMetaRow}>
                      <Feather name="user" size={12} color={isDark ? "#b0a8d9" : "#636e72"} />
                      <Text style={[styles.invoiceMeta, { color: isDark ? "#b0a8d9" : "#636e72" }]}>
                        {item.child}
                      </Text>
                    </View>
                    <View style={styles.invoiceMetaRow}>
                      <Feather name="calendar" size={12} color="#dc2626" />
                      <Text style={[styles.invoiceMeta, { color: "#dc2626" }]}>
                        {item.dueDate}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.invoicePriceSection}>
                    <Text style={[styles.invoicePrice, { color: "#9b59b6" }]}>
                      {item.price}
                    </Text>
                    <Feather name="chevron-right" size={20} color="#9b59b6" />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Payment History Card */}
          <View 
            style={[
              styles.card, 
              { 
                backgroundColor: isDark ? colors.card : "#FFFFFF",
                shadowOpacity: isDark ? 0.4 : 0.08,
              }
            ]}
          >
            {/* Card Header */}
            <View style={styles.cardHeaderSection}>
              <View style={styles.cardHeaderContent}>
                <View style={[styles.iconBadge, { backgroundColor: "#b9f3ed" }]}>
                  <Feather name="check-circle" size={20} color="#016266" />
                </View>
                <View style={styles.cardHeaderText}>
                  <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#2d3436" }]}>
                    Payment History
                  </Text>
                  <Text style={[styles.cardSubtitle, { color: isDark ? "#b0a8d9" : "#636e72" }]}>
                    {paidInvoices.length} completed transaction{paidInvoices.length !== 1 ? 's' : ''}
                  </Text>
                </View>
              </View>
            </View>

            {/* Paid Invoice Items */}
            {paidInvoices.map((item, index) => (
              <TouchableOpacity 
                key={item.id} 
                style={[
                  styles.invoiceItem,
                  { 
                    backgroundColor: isDark ? colors.sidebarItemBg : "#f8f9fa",
                    marginTop: index === 0 ? 16 : 12,
                  }
                ]}
                onPress={() => navigation.navigate("PaidInvoiceScreen", { invoice: item })}
                activeOpacity={0.7}
              >
                <View style={styles.invoiceItemContent}>
                  <View style={[styles.invoiceIconCircle, { backgroundColor: "#b9f3ed" }]}>
                    <Feather name="check" size={22} color="#016266" />
                  </View>

                  <View style={styles.invoiceDetails}>
                    <Text style={[styles.invoiceTitle, { color: isDark ? "#ffffff" : "#2d3436" }]}>
                      {item.title}
                    </Text>
                    <View style={styles.invoiceMetaRow}>
                      <Feather name="user" size={12} color={isDark ? "#b0a8d9" : "#636e72"} />
                      <Text style={[styles.invoiceMeta, { color: isDark ? "#b0a8d9" : "#636e72" }]}>
                        {item.child}
                      </Text>
                    </View>
                    <View style={styles.invoiceMetaRow}>
                      <Feather name="calendar" size={12} color="#016266" />
                      <Text style={[styles.invoiceMeta, { color: "#016266" }]}>
                        {item.paymentDate}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.invoicePriceSection}>
                    <Text style={[styles.invoicePrice, { color: "#016266" }]}>
                      {item.price}
                    </Text>
                    <Feather name="chevron-right" size={20} color={isDark ? "#b0a8d9" : "#636e72"} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 100 }} />
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
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 80,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  cardHeaderSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: "500",
  },
  countBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  countBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  invoiceItem: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 0,
  },
  invoiceItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  invoiceIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  invoiceDetails: {
    flex: 1,
  },
  invoiceTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 6,
  },
  invoiceMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  invoiceMeta: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 6,
  },
  invoicePriceSection: {
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 8,
  },
  invoicePrice: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
});