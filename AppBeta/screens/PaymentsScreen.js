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
import { useTranslation } from "../context/TranslationContext";
import TopNavBar from "../components/TopNavBar";

const screenHeight = Dimensions.get("window").height;
const TOP_SECTION_HEIGHT = screenHeight * 0.20;

export default function PaymentsScreen({ navigation }) {
  const { colors, theme } = useTheme();
  const { t, isRTL } = useTranslation();
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
          <TopNavBar title={t('payments')} navigation={navigation} />
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
            <View style={[styles.cardHeaderSection, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={[styles.cardHeaderContent, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.iconBadge, { backgroundColor: "#fee2e2" }, isRTL && { marginLeft: 12, marginRight: 0 }]}>
                  <Feather name="alert-circle" size={20} color="#dc2626" />
                </View>
                <View style={[styles.cardHeaderText, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#2d3436" }, isRTL && { textAlign: 'right' }]}>
                    {t('unpaidInvoices')}
                  </Text>
                  <Text style={[styles.cardSubtitle, { color: isDark ? "#b0a8d9" : "#636e72" }, isRTL && { textAlign: 'right' }]}>
                    {unpaidInvoices.length} {unpaidInvoices.length === 1 ? t('pendingPayment') : t('pendingPayments')}
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
                <View style={[styles.invoiceItemContent, isRTL && { flexDirection: 'row-reverse' }]}>
                  <View style={[styles.invoiceIconCircle, { backgroundColor: "#fef3c7" }, isRTL && { marginLeft: 12, marginRight: 0 }]}>
                    <Feather name="file-text" size={22} color="#f59e0b" />
                  </View>

                  <View style={[styles.invoiceDetails, isRTL && { alignItems: 'flex-end' }]}>
                    <Text style={[styles.invoiceTitle, { color: isDark ? "#ffffff" : "#2d3436" }, isRTL && { textAlign: 'right' }]}>
                      {item.title}
                    </Text>
                    <View style={[styles.invoiceMetaRow, isRTL && { flexDirection: 'row-reverse' }]}>
                      <Feather name="user" size={12} color={isDark ? "#b0a8d9" : "#636e72"} />
                      <Text style={[styles.invoiceMeta, { color: isDark ? "#b0a8d9" : "#636e72" }, isRTL && { marginRight: 6, marginLeft: 0 }]}>
                        {item.child}
                      </Text>
                    </View>
                    <View style={[styles.invoiceMetaRow, isRTL && { flexDirection: 'row-reverse' }]}>
                      <Feather name="calendar" size={12} color="#dc2626" />
                      <Text style={[styles.invoiceMeta, { color: "#dc2626" }, isRTL && { marginRight: 6, marginLeft: 0 }]}>
                        {item.dueDate}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.invoicePriceSection, isRTL && { marginRight: 8, marginLeft: 0 }]}>
                    <Text style={[styles.invoicePrice, { color: "#9b59b6" }]}>
                      {item.price}
                    </Text>
                    <Feather name={isRTL ? "chevron-left" : "chevron-right"} size={20} color="#9b59b6" />
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
            <View style={[styles.cardHeaderSection, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={[styles.cardHeaderContent, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.iconBadge, { backgroundColor: "#b9f3ed" }, isRTL && { marginLeft: 12, marginRight: 0 }]}>
                  <Feather name="check-circle" size={20} color="#016266" />
                </View>
                <View style={[styles.cardHeaderText, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#2d3436" }, isRTL && { textAlign: 'right' }]}>
                    {t('paymentHistory')}
                  </Text>
                  <Text style={[styles.cardSubtitle, { color: isDark ? "#b0a8d9" : "#636e72" }, isRTL && { textAlign: 'right' }]}>
                    {paidInvoices.length} {paidInvoices.length === 1 ? t('completedTransaction') : t('completedTransactions')}
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
                <View style={[styles.invoiceItemContent, isRTL && { flexDirection: 'row-reverse' }]}>
                  <View style={[styles.invoiceIconCircle, { backgroundColor: "#b9f3ed" }, isRTL && { marginLeft: 12, marginRight: 0 }]}>
                    <Feather name="check" size={22} color="#016266" />
                  </View>

                  <View style={[styles.invoiceDetails, isRTL && { alignItems: 'flex-end' }]}>
                    <Text style={[styles.invoiceTitle, { color: isDark ? "#ffffff" : "#2d3436" }, isRTL && { textAlign: 'right' }]}>
                      {item.title}
                    </Text>
                    <View style={[styles.invoiceMetaRow, isRTL && { flexDirection: 'row-reverse' }]}>
                      <Feather name="user" size={12} color={isDark ? "#b0a8d9" : "#636e72"} />
                      <Text style={[styles.invoiceMeta, { color: isDark ? "#b0a8d9" : "#636e72" }, isRTL && { marginRight: 6, marginLeft: 0 }]}>
                        {item.child}
                      </Text>
                    </View>
                    <View style={[styles.invoiceMetaRow, isRTL && { flexDirection: 'row-reverse' }]}>
                      <Feather name="calendar" size={12} color="#016266" />
                      <Text style={[styles.invoiceMeta, { color: "#016266" }, isRTL && { marginRight: 6, marginLeft: 0 }]}>
                        {item.paymentDate}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.invoicePriceSection, isRTL && { marginRight: 8, marginLeft: 0 }]}>
                    <Text style={[styles.invoicePrice, { color: "#016266" }]}>
                      {item.price}
                    </Text>
                    <Feather name={isRTL ? "chevron-left" : "chevron-right"} size={20} color={isDark ? "#b0a8d9" : "#636e72"} />
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