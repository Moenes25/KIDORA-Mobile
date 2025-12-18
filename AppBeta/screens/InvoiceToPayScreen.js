import React, { useState } from "react";
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, StatusBar, Dimensions 
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "../context/TranslationContext";
import { normalize, wp, hp, screenHeight } from "../utils/responsive";

import TopNavBar from "../components/TopNavBar";
import PayMethodScreen from "./PayMethodScreen";

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

  // FIXED: Extract numeric value from total and convert to number
  const paymentAmount = parseFloat(invoice.total.replace(' TND', '').trim());

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
            <View style={[styles.childCorner, isRTL && { left: wp(2.5), right: 'auto' }]}>
              <Image source={invoice.child?.avatar} style={styles.childAvatar} />
            </View>

            <Text 
              style={[styles.invoiceTitle, isRTL && { paddingLeft: wp(25), paddingRight: 0, textAlign: 'right' }]} 
              allowFontScaling={false}
            >
              {invoice.title}
            </Text>

            {/* Invoice Information */}
            <View style={styles.section}>
              <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                <MaterialIcons name="receipt" size={normalize(20)} color="#6F42C1" />
                <Text 
                  style={[styles.sectionTitle, isRTL && { marginRight: wp(2), marginLeft: 0, textAlign: 'right' }]} 
                  allowFontScaling={false}
                >
                  {t('invoiceInformation')}
                </Text>
              </View>

              <View style={[styles.infoGrid, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.infoItem, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={[styles.label, isRTL && { textAlign: 'right' }]} allowFontScaling={false}>
                    {t('reference')}
                  </Text>
                  <Text style={[styles.value, isRTL && { textAlign: 'right' }]} allowFontScaling={false}>
                    {invoice.reference}
                  </Text>
                </View>
                <View style={[styles.infoItem, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={[styles.label, isRTL && { textAlign: 'right' }]} allowFontScaling={false}>
                    {t('status')}
                  </Text>
                  <View style={[
                    styles.statusBadge, 
                    invoice.status === "Unpaid" ? styles.unpaid : styles.paid,
                    isRTL && { flexDirection: 'row-reverse' }
                  ]}>
                    <Feather name={invoice.status === "Unpaid" ? "x" : "check-circle"} size={normalize(14)} color="#fff" />
                    <Text style={[styles.statusText, isRTL && { marginRight: wp(1), marginLeft: 0 }]} allowFontScaling={false}>
                      {invoice.status === "Unpaid" ? t('unpaid') : t('paid')}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[styles.infoGrid, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.infoItem, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={[styles.label, isRTL && { textAlign: 'right' }]} allowFontScaling={false}>
                    {t('issueDate')}
                  </Text>
                  <Text style={[styles.value, isRTL && { textAlign: 'right' }]} allowFontScaling={false}>
                    {invoice.issueDate}
                  </Text>
                </View>
                <View style={[styles.infoItem, isRTL && { alignItems: 'flex-end' }]}>
                  <Text style={[styles.label, isRTL && { textAlign: 'right' }]} allowFontScaling={false}>
                    {t('dueDate')}
                  </Text>
                  <Text style={[styles.value, isRTL && { textAlign: 'right' }]} allowFontScaling={false}>
                    {invoice.dueDate}
                  </Text>
                </View>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Charges Breakdown */}
            <View style={styles.section}>
              <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                <MaterialIcons name="description" size={normalize(20)} color="#6F42C1" />
                <Text 
                  style={[styles.sectionTitle, isRTL && { marginRight: wp(2), marginLeft: 0, textAlign: 'right' }]} 
                  allowFontScaling={false}
                >
                  {t('chargesBreakdown')}
                </Text>
              </View>

              <View style={[styles.chargeRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.chargeLabel, isRTL && { textAlign: 'right' }]} allowFontScaling={false}>
                  {t('monthlyFrames')}
                </Text>
                <Text style={[styles.chargeValue, isRTL && { textAlign: 'left' }]} allowFontScaling={false}>
                  {invoice.framesMonthly}
                </Text>
              </View>

              {invoice.additionalServices?.map((service, index) => {
                const serviceKey = service.name.toLowerCase().replace(/\s+/g, '');
                const translatedName = serviceKey === 'transport' ? t('transport') 
                  : serviceKey === 'canteen' ? t('canteen')
                  : serviceKey === 'activitiesextras' ? t('activitiesExtras')
                  : service.name;
                
                return (
                  <View key={index} style={[styles.chargeRow, isRTL && { flexDirection: 'row-reverse' }]}>
                    <Text style={[styles.chargeLabel, isRTL && { textAlign: 'right' }]} allowFontScaling={false}>
                      {translatedName}
                    </Text>
                    <Text style={[styles.chargeValue, isRTL && { textAlign: 'left' }]} allowFontScaling={false}>
                      {service.price}
                    </Text>
                  </View>
                );
              })}

              <View style={[styles.totalRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={[styles.totalLabel, isRTL && { textAlign: 'right' }]} allowFontScaling={false}>
                  {t('totalAmount')}
                </Text>
                <Text style={[styles.totalValue, isRTL && { textAlign: 'left' }]} allowFontScaling={false}>
                  {invoice.total}
                </Text>
              </View>
            </View>

            {/* Confirm Payment Button */}
            <TouchableOpacity style={styles.confirmButton} onPress={() => setShowPaySheet(true)}>
              <Text style={styles.confirmButtonText} allowFontScaling={false}>
                {t('pay')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: hp(5) }} />
        </ScrollView>
      </View>

      {/* CRITICAL FIX: Conditional rendering with all required props */}
      {showPaySheet && (
        <PayMethodScreen 
          visible={showPaySheet} 
          onClose={() => setShowPaySheet(false)} 
          amount={paymentAmount}
          navigation={navigation}
        />
      )}
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
    height: Platform.OS === "ios" ? hp(5.5) : StatusBar.currentHeight,
  },

  whiteSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: normalize(38),
    borderTopRightRadius: normalize(38),
    overflow: "hidden",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -hp(0.6) },
    shadowOpacity: 0.15,
    shadowRadius: normalize(12),
    elevation: 12,
  },

  scrollContent: {
    paddingTop: hp(4),
    paddingHorizontal: wp(5),
    paddingBottom: hp(5),
  },

  mainCard: {
    backgroundColor: "#fff",
    borderRadius: normalize(24),
    padding: wp(6),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.5) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(12),
    elevation: 6,
    position: "relative",
  },

  childCorner: {
    position: "absolute",
    top: wp(6),
    right: wp(2.5),
    alignItems: "center",
    zIndex: 10,
  },

  childAvatar: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(7.5),
    borderWidth: normalize(3),
    borderColor: "white",
    marginBottom: hp(1),
  },

  invoiceTitle: {
    fontSize: normalize(20),
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: hp(2.5),
    paddingRight: wp(25),
  },

  section: {
    marginBottom: hp(2.5),
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
  },

  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: "700",
    color: "#2d3436",
    marginLeft: wp(2),
  },

  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(1.5),
  },

  infoItem: { flex: 1 },

  label: {
    fontSize: normalize(12),
    color: "#636e72",
    marginBottom: hp(0.5),
    fontWeight: "600",
  },

  value: {
    fontSize: normalize(15),
    color: "#2d3436",
    fontWeight: "700",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(2.5),
    borderRadius: normalize(16),
    gap: wp(1),
  },

  statusText: {
    color: "#fff",
    fontSize: normalize(13),
    fontWeight: "700",
    marginLeft: wp(1),
  },

  unpaid: { backgroundColor: "#e74c3c" },
  paid: { backgroundColor: "#27ae60" },

  divider: {
    height: normalize(1),
    backgroundColor: "#e1e8ed",
    marginVertical: hp(2),
  },

  chargeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(1.2),
    borderBottomWidth: normalize(1),
    borderBottomColor: "#f0f0f0",
  },

  chargeLabel: {
    fontSize: normalize(14),
    color: "#636e72",
    fontWeight: "500",
  },

  chargeValue: {
    fontSize: normalize(15),
    color: "#2d3436",
    fontWeight: "700",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: hp(2),
    marginTop: hp(1),
    borderTopWidth: normalize(2),
    borderTopColor: "#6F42C1",
  },

  totalLabel: {
    fontSize: normalize(16),
    color: "#2d3436",
    fontWeight: "700",
  },

  totalValue: {
    fontSize: normalize(20),
    color: "#6F42C1",
    fontWeight: "700",
  },

  confirmButton: {
    backgroundColor: "#6F42C1",
    paddingVertical: hp(1.7),
    borderRadius: normalize(12),
    alignItems: "center",
    marginTop: hp(2.5),
  },

  confirmButtonText: {
    color: "#fff",
    fontSize: normalize(16),
    fontWeight: "700",
  },
});