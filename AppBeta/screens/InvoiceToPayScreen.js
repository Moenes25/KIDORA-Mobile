import React, { useState } from "react";
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, StatusBar, Dimensions 
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "../context/TranslationContext";

import TopNavBar from "../components/TopNavBar";
import PayMethodScreen from "./PayMethodScreen";

const { height: screenHeight } = Dimensions.get("window");
const TOP_SECTION_HEIGHT = screenHeight * 0.20;

export default function InvoiceToPayScreen({ navigation, route }) {
  const { colors, theme } = useTheme();
  const { t, isRTL } = useTranslation();
  const isDark = theme === "dark";
  const [showPaySheet, setShowPaySheet] = useState(false);

  const invoice = /*route.params?.invoice ||*/ {
    title: "Registration Fee - December",
    reference: "INV-00123",
    issueDate: "Dec 1, 2024",
    dueDate: "Dec 15, 2024",
    status: "Unpaid",
    framesMonthly: "120 TND",
    additionalServices: [
      { name: "Transport", price: "30 TND" },
      { name: "Canteen", price: "50 TND" },
      { name: "Activities Extras", price: "20 TND" },
    ],
    total: "220 TND",
    child: { 
      name: "Adam Ben Ali", 
      age: 8, 
      class: "Class 1",
      avatar: require("../assets/child1.png") 
    },
    paymentMethod: null,
  };

  const paymentLogos = {
    Mastercard: require("../assets/mastercard.png"),
    Visa: require("../assets/visa.png"),
    D17: require("../assets/D17.png"),
    Flouci: require("../assets/flouci.png"),
    Payoneer: require("../assets/payoneer.png"),
  };

  return (
    <View style={styles.container}>
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
          {isDark && <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' }} />}
          <View style={styles.safeArea} />
          <TopNavBar title={t('invoiceDetails')} navigation={navigation} />
        </LinearGradient>
      </View>

      {/* WHITE BOTTOM SECTION */}
      <View style={[styles.whiteSection, { top: TOP_SECTION_HEIGHT }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Invoice Card */}
          <View style={styles.mainCard}>
            <View style={[styles.childCorner, isRTL && { left: 10, right: 'auto' }]}>
              <Image source={invoice.child?.avatar} style={styles.childAvatar} />
            </View>

            <Text style={[styles.invoiceTitle, isRTL && { paddingLeft: 100, paddingRight: 0, textAlign: 'right' }]}>
              {invoice.title}
            </Text>

            {/* Invoice Information */}
            <View style={styles.section}>
              <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                <MaterialIcons name="receipt" size={20} color="#6F42C1" />
                <Text style={[styles.sectionTitle, isRTL && { marginRight: 8, marginLeft: 0, textAlign: 'right' }]}>
                  {t('invoiceInformation')}
                </Text>
              </View>

              <View style={[styles.infoGrid, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.infoItem, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('reference')}</Text>
                  <Text style={[styles.value, isRTL && { textAlign: 'right' }]}>{invoice.reference}</Text>
                </View>
                <View style={[styles.infoItem, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('status')}</Text>
                  <View style={[
                    styles.statusBadge, 
                    invoice.status === "Unpaid" ? styles.unpaid : styles.paid,
                    isRTL && { flexDirection: 'row-reverse' }
                  ]}>
                    <Feather name={invoice.status === "Unpaid" ? "x" : "check-circle"} size={14} color="#fff" />
                    <Text style={[styles.statusText, isRTL && { marginRight: 4, marginLeft: 0 }]}>
                      {invoice.status === "Unpaid" ? t('unpaid') : t('paid')}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[styles.infoGrid, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.infoItem, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('issueDate')}</Text>
                  <Text style={[styles.value, isRTL && { textAlign: 'right' }]}>{invoice.issueDate}</Text>
                </View>
                <View style={[styles.infoItem, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={[styles.label, isRTL && { textAlign: 'right' }]}>{t('dueDate')}</Text>
                  <Text style={[styles.value, isRTL && { textAlign: 'right' }]}>{invoice.dueDate}</Text>
                </View>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Charges Breakdown */}
            <View style={styles.section}>
              <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                <MaterialIcons name="description" size={20} color="#6F42C1" />
                <Text style={[styles.sectionTitle, isRTL && { marginRight: 8, marginLeft: 0, textAlign: 'right' }]}>
                  {t('chargesBreakdown')}
                </Text>
              </View>

              <View style={[styles.chargeRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.chargeLabel, isRTL && { textAlign: 'right' }]}>{t('monthlyFrames')}</Text>
                <Text style={[styles.chargeValue, isRTL && { textAlign: 'left' }]}>{invoice.framesMonthly}</Text>
              </View>

              {invoice.additionalServices?.map((service, index) => {
                const serviceKey = service.name.toLowerCase().replace(/\s+/g, '');
                const translatedName = serviceKey === 'transport' ? t('transport') 
                  : serviceKey === 'canteen' ? t('canteen')
                  : serviceKey === 'activitiesextras' ? t('activitiesExtras')
                  : service.name;
                
                return (
                  <View key={index} style={[styles.chargeRow, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Text style={[styles.chargeLabel, isRTL && { textAlign: 'right' }]}>{translatedName}</Text>
                    <Text style={[styles.chargeValue, isRTL && { textAlign: 'left' }]}>{service.price}</Text>
                  </View>
                );
              })}

              <View style={[styles.totalRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.totalLabel, isRTL && { textAlign: 'right' }]}>{t('totalAmount')}</Text>
                <Text style={[styles.totalValue, isRTL && { textAlign: 'left' }]}>{invoice.total}</Text>
              </View>
            </View>

            
            {/* Confirm Payment Button */}
            <TouchableOpacity style={styles.confirmButton} onPress={() => setShowPaySheet(true)}>
              <Text style={styles.confirmButtonText}>{t('pay')}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>

      <PayMethodScreen visible={showPaySheet} onClose={() => setShowPaySheet(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },

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

  whiteSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },

  scrollContent: {
    paddingTop: 32,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  mainCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    position: "relative",
  },

  childCorner: {
    position: "absolute",
    top: 24,
    right: 10,
    alignItems: "center",
    zIndex: 10,
  },

  childAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "white",
    marginBottom: 8,
  },

  invoiceTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 20,
    paddingRight: 100,
  },

  section: {
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2d3436",
    marginLeft: 8,
  },

  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  infoItem: { flex: 1 },

  label: {
    fontSize: 12,
    color: "#636e72",
    marginBottom: 4,
    fontWeight: "600",
  },

  value: {
    fontSize: 15,
    color: "#2d3436",
    fontWeight: "700",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    gap: 4,
  },

  statusText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 4,
  },

  unpaid: { backgroundColor: "#e74c3c" },
  paid: { backgroundColor: "#27ae60" },

  divider: {
    height: 1,
    backgroundColor: "#e1e8ed",
    marginVertical: 16,
  },

  chargeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  chargeLabel: {
    fontSize: 14,
    color: "#636e72",
    fontWeight: "500",
  },

  chargeValue: {
    fontSize: 15,
    color: "#2d3436",
    fontWeight: "700",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#6F42C1",
  },

  totalLabel: {
    fontSize: 16,
    color: "#2d3436",
    fontWeight: "700",
  },

  totalValue: {
    fontSize: 20,
    color: "#6F42C1",
    fontWeight: "700",
  },

  confirmButton: {
    backgroundColor: "#6F42C1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },

  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});