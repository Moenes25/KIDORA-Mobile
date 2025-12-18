import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "../context/TranslationContext";
import TopNavBar from "../components/TopNavBar";

// Import responsive utilities
import { wp, hp, normalize } from "../utils/responsive";

// Define a responsive height for the header
const TOP_SECTION_HEIGHT = hp(20);

export default function PaidInvoiceScreen({ navigation, route }) {
  const { colors, theme } = useTheme();
  const { t, isRTL } = useTranslation();
  const isDark = theme === "dark";

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
    child: { 
      name: "Adam Ben Ali", 
      age: 8, 
      class: "Class 1",
      avatar: require("../assets/child1.png")
    },
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
        backgroundColor={isDark ? colors.bgGradient?.[0] : (colors.headerGradient?.[0] || "#6F42C1")} 
      />

      {/* TOP SECTION */}
      <View style={[styles.topSection, { height: TOP_SECTION_HEIGHT }]}>
        <LinearGradient 
          colors={isDark 
            ? (colors.bgGradient || ["#1a1a2e", "#0f0f1f"])
            : (colors.headerGradient || ["#6F42C1", "#9b59b6"])
          } 
          style={StyleSheet.absoluteFill}
        >
          {isDark && <View style={styles.darkOverlay} />}
          <View style={styles.safeArea} />
          <TopNavBar title={t('invoiceDetails')} navigation={navigation} />
        </LinearGradient>
      </View>

      {/* WHITE BOTTOM SECTION */}
      <View style={[styles.whiteSection, { top: TOP_SECTION_HEIGHT - hp(4) }]}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mainCard}>
            {/* Child Avatar Corner */}
            <View style={[styles.childCorner, isRTL ? { left: wp(3) } : { right: wp(3) }]}>
              <Image source={invoice.child?.avatar} style={styles.childAvatar} />
            </View>

            <Text 
              style={[
                styles.invoiceTitle, 
                isRTL && { paddingLeft: wp(20), paddingRight: 0, textAlign: 'right' }
              ]}
              allowFontScaling={false}
            >
              {invoice.title}
            </Text>

            {/* Information Section */}
            <View style={styles.section}>
              <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                <MaterialIcons name="receipt" size={normalize(20)} color="#9b59b6" />
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
                    invoice.status === "Paid" ? styles.paid : styles.cancelled,
                    isRTL && { flexDirection: 'row-reverse' }
                  ]}>
                    <Feather name="check-circle" size={normalize(14)} color="#fff" />
                    <Text style={styles.statusText} allowFontScaling={false}>
                      {t('paid')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Breakdown Section */}
            <View style={styles.section}>
              <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                <MaterialIcons name="description" size={normalize(20)} color="#9b59b6" />
                <Text 
                  style={[styles.sectionTitle, isRTL && { marginRight: wp(2), marginLeft: 0, textAlign: 'right' }]}
                  allowFontScaling={false}
                >
                  {t('chargesBreakdown')}
                </Text>
              </View>

              <View style={[styles.chargeRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={styles.chargeLabel} allowFontScaling={false}>
                  {t('monthlyFrames')}
                </Text>
                <Text style={styles.chargeValue} allowFontScaling={false}>
                  {invoice.framesMonthly}
                </Text>
              </View>

              {invoice.additionalServices?.map((service, index) => (
                <View key={index} style={[styles.chargeRow, isRTL && { flexDirection: 'row-reverse' }]}>
                  <Text style={styles.chargeLabel} allowFontScaling={false}>
                    {service.name}
                  </Text>
                  <Text style={styles.chargeValue} allowFontScaling={false}>
                    {service.price}
                  </Text>
                </View>
              ))}

              <View style={[styles.totalRow, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text style={styles.totalLabel} allowFontScaling={false}>
                  {t('totalAmount')}
                </Text>
                <Text style={styles.totalValue} allowFontScaling={false}>
                  {invoice.total}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Payment Section */}
            <View style={styles.section}>
              <View style={[styles.sectionHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                <MaterialIcons name="payment" size={normalize(20)} color="#9b59b6" />
                <Text 
                  style={[styles.sectionTitle, isRTL && { marginRight: wp(2), marginLeft: 0, textAlign: 'right' }]}
                  allowFontScaling={false}
                >
                  {t('paymentMethod')}
                </Text>
              </View>

              <View style={[styles.paymentRow, isRTL && { flexDirection: 'row-reverse' }]}>
                {invoice.paymentMethod && paymentLogos[invoice.paymentMethod] && (
                  <View style={[styles.paymentLogoContainer, isRTL ? { marginLeft: wp(3) } : { marginRight: wp(3) }]}>
                    <Image source={paymentLogos[invoice.paymentMethod]} style={styles.paymentLogo} />
                  </View>
                )}
                <Text style={styles.paymentMethodText} allowFontScaling={false}>
                  {invoice.paymentMethod}
                </Text>
              </View>
            </View>
          </View>
          <View style={{ height: hp(10) }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  topSection: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 1 },
  safeArea: { height: Platform.OS === "ios" ? hp(5) : StatusBar.currentHeight },
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.3)' },

  whiteSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: normalize(38),
    borderTopRightRadius: normalize(38),
    overflow: "hidden",
    backgroundColor: "#ffffff",
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
    elevation: 6,
    position: "relative",
  },

  childCorner: {
    position: "absolute",
    top: hp(2.5),
    alignItems: "center",
    zIndex: 10,
  },

  childAvatar: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(30),
    borderWidth: 3,
    borderColor: "white",
  },

  invoiceTitle: {
    fontSize: normalize(20),
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: hp(2.5),
    paddingRight: wp(22), // Space for avatar
  },

  section: { marginBottom: hp(2) },
  sectionHeader: { flexDirection: "row", alignItems: "center", marginBottom: hp(2) },
  sectionTitle: { fontSize: normalize(16), fontWeight: "700", color: "#2d3436", marginLeft: wp(2) },
  infoGrid: { flexDirection: "row", justifyContent: "space-between", marginBottom: hp(1.5) },
  infoItem: { flex: 1 },

  label: { fontSize: normalize(12), color: "#636e72", marginBottom: hp(0.5), fontWeight: "600" },
  value: { fontSize: normalize(15), color: "#2d3436", fontWeight: "700" },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: hp(0.5),
    paddingHorizontal: wp(3),
    borderRadius: normalize(16),
  },
  statusText: { color: "#fff", fontSize: normalize(13), fontWeight: "700", marginLeft: wp(1) },
  paid: { backgroundColor: "#27ae60" },
  cancelled: { backgroundColor: "#e74c3c" },

  divider: { height: 1, backgroundColor: "#e1e8ed", marginVertical: hp(2) },

  chargeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp(1.2),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  chargeLabel: { fontSize: normalize(14), color: "#636e72", fontWeight: "500" },
  chargeValue: { fontSize: normalize(15), color: "#2d3436", fontWeight: "700" },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: hp(2),
    marginTop: hp(1),
    borderTopWidth: 2,
    borderTopColor: "#9b59b6",
  },
  totalLabel: { fontSize: normalize(16), fontWeight: "700" },
  totalValue: { fontSize: normalize(20), color: "#9b59b6", fontWeight: "700" },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: wp(4),
    borderRadius: normalize(12),
  },
  paymentLogoContainer: {
    backgroundColor: "#fff",
    padding: normalize(8),
    borderRadius: normalize(8),
    elevation: 2,
  },
  paymentLogo: { width: normalize(50), height: normalize(30), resizeMode: "contain" },
  paymentMethodText: { fontSize: normalize(16), fontWeight: "700", color: "#2d3436" },
});