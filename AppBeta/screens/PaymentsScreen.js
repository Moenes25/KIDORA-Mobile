import React from "react";
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
import { useTranslation } from "../context/TranslationContext";
import TopNavBar from "../components/TopNavBar";

// Responsive Utilities
import { wp, hp, normalize } from "../utils/responsive";

const TOP_SECTION_HEIGHT = hp(20);

export default function PaymentsScreen({ navigation }) {
  const { colors, theme } = useTheme();
  const { t, isRTL } = useTranslation();
  const isDark = theme === "dark";

  const unpaidInvoices = [
    { id: 1, title: "Registration Fee - Jan", child: "Adam Ben Ali", dueDate: "Due: Jan 25, 2025", price: "120 TND" },
    { id: 2, title: "Meal Plan - Jan", child: "Lina Soltani", dueDate: "Due: Jan 20, 2025", price: "80 TND" },
  ];

  const paidInvoices = [
    { id: 1, title: "Registration Fee - Dec", child: "Adam Ben Ali", paymentDate: "Paid: Dec 5, 2024", price: "120 TND" },
  ];

  const renderInvoiceItem = (item, index, isPaid) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.invoiceItem,
        { 
          backgroundColor: isDark ? colors.sidebarItemBg : "#f8f9fa",
          marginTop: hp(index === 0 ? 2 : 1.2),
        }
      ]}
      onPress={() => navigation.navigate(isPaid ? "PaidInvoiceScreen" : "InvoiceToPayScreen", { invoice: item })}
      activeOpacity={0.7}
    >
      <View style={[styles.invoiceItemContent, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={[
          styles.invoiceIconCircle, 
          { backgroundColor: isPaid ? "#b9f3ed" : "#fef3c7" }, 
          isRTL ? { marginLeft: wp(3) } : { marginRight: wp(3) }
        ]}>
          <Feather name={isPaid ? "check" : "file-text"} size={normalize(22)} color={isPaid ? "#016266" : "#f59e0b"} />
        </View>

        <View style={[styles.invoiceDetails, isRTL && { alignItems: 'flex-end' }]}>
          <Text 
            style={[styles.invoiceTitle, { color: isDark ? "#ffffff" : "#2d3436" }]}
            allowFontScaling={false}
          >
            {item.title}
          </Text>
          <View style={[styles.invoiceMetaRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <Feather name="user" size={normalize(12)} color={isDark ? "#b0a8d9" : "#636e72"} />
            <Text 
              style={[
                styles.invoiceMeta, 
                { color: isDark ? "#b0a8d9" : "#636e72" }, 
                isRTL && { marginRight: wp(1.5) }
              ]}
              allowFontScaling={false}
            >
              {item.child}
            </Text>
          </View>
          <View style={[styles.invoiceMetaRow, isRTL && { flexDirection: 'row-reverse' }]}>
            <Feather name="calendar" size={normalize(12)} color={isPaid ? "#016266" : "#dc2626"} />
            <Text 
              style={[
                styles.invoiceMeta, 
                { color: isPaid ? "#016266" : "#dc2626" }, 
                isRTL && { marginRight: wp(1.5) }
              ]}
              allowFontScaling={false}
            >
              {isPaid ? item.paymentDate : item.dueDate}
            </Text>
          </View>
        </View>

        <View style={[styles.invoicePriceSection, isRTL ? { marginRight: wp(2) } : { marginLeft: wp(2) }]}>
          <Text 
            style={[styles.invoicePrice, { color: isPaid ? "#016266" : "#9b59b6" }]}
            allowFontScaling={false}
          >
            {item.price}
          </Text>
          <Feather name={isRTL ? "chevron-left" : "chevron-right"} size={normalize(20)} color={isDark ? "#b0a8d9" : "#636e72"} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.background : "#ffffff" }]}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <View style={[styles.topSection, { height: TOP_SECTION_HEIGHT }]}>
        <LinearGradient 
          colors={isDark ? (colors.bgGradient || ["#1a1a2e", "#0f0f1f"]) : (colors.headerGradient || ["#6F42C1", "#9b59b6"])} 
          style={StyleSheet.absoluteFill}
        >
          {isDark && <View style={styles.darkOverlay} />}
          <View style={styles.safeArea} />
          <TopNavBar title={t('payments')} navigation={navigation} />
        </LinearGradient>
      </View>
      
      <View style={[styles.bottomSection, { backgroundColor: isDark ? colors.background : "#ffffff", top: TOP_SECTION_HEIGHT - hp(3) }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Unpaid Section */}
          <View style={[styles.card, { backgroundColor: isDark ? colors.card : "#FFFFFF" }]}>
            <View style={[styles.cardHeaderSection, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={[styles.cardHeaderContent, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.iconBadge, { backgroundColor: "#fee2e2" }, isRTL ? { marginLeft: wp(3) } : { marginRight: wp(3) }]}>
                  <Feather name="alert-circle" size={normalize(20)} color="#dc2626" />
                </View>
                <View style={[styles.cardHeaderText, isRTL && { alignItems: 'flex-end' }]}>
                  <Text 
                    style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#2d3436" }]}
                    allowFontScaling={false}
                  >
                    {t('unpaidInvoices')}
                  </Text>
                  <Text 
                    style={[styles.cardSubtitle, { color: isDark ? "#b0a8d9" : "#636e72" }]}
                    allowFontScaling={false}
                  >
                    {unpaidInvoices.length} {t('pendingPayment')}
                  </Text>
                </View>
              </View>
              <View style={[styles.countBadge, { backgroundColor: "#dc2626" }]}>
                <Text style={styles.countBadgeText} allowFontScaling={false}>
                  {unpaidInvoices.length}
                </Text>
              </View>
            </View>
            {unpaidInvoices.map((item, index) => renderInvoiceItem(item, index, false))}
          </View>

          {/* History Section */}
          <View style={[styles.card, { backgroundColor: isDark ? colors.card : "#FFFFFF" }]}>
            <View style={[styles.cardHeaderSection, isRTL && { flexDirection: 'row-reverse' }]}>
              <View style={[styles.cardHeaderContent, isRTL && { flexDirection: 'row-reverse' }]}>
                <View style={[styles.iconBadge, { backgroundColor: "#b9f3ed" }, isRTL ? { marginLeft: wp(3) } : { marginRight: wp(3) }]}>
                  <Feather name="check-circle" size={normalize(20)} color="#016266" />
                </View>
                <View style={styles.cardHeaderText}>
                  <Text 
                    style={[styles.cardTitle, { color: isDark ? "#ffffff" : "#2d3436" }]}
                    allowFontScaling={false}
                  >
                    {t('paymentHistory')}
                  </Text>
                </View>
              </View>
            </View>
            {paidInvoices.map((item, index) => renderInvoiceItem(item, index, true))}
          </View>

          <View style={{ height: hp(15) }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topSection: { position: "absolute", top: 0, left: 0, right: 0, zIndex: 1 },
  safeArea: { height: Platform.OS === "ios" ? hp(5) : StatusBar.currentHeight },
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.3)' },
  bottomSection: { position: "absolute", left: 0, right: 0, bottom: 0, borderTopLeftRadius: normalize(30), borderTopRightRadius: normalize(30), overflow: "hidden", elevation: 8 },
  scrollContent: { paddingTop: hp(4), paddingBottom: hp(5) },
  card: { marginHorizontal: wp(4), marginBottom: hp(3), borderRadius: normalize(20), padding: wp(5), elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: hp(0.25) }, shadowRadius: normalize(8) },
  cardHeaderSection: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardHeaderContent: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconBadge: { width: normalize(44), height: normalize(44), borderRadius: normalize(22), justifyContent: "center", alignItems: "center" },
  cardHeaderText: { flex: 1 },
  cardTitle: { fontSize: normalize(18), fontWeight: "700" },
  cardSubtitle: { fontSize: normalize(13), fontWeight: "500" },
  countBadge: { width: normalize(32), height: normalize(32), borderRadius: normalize(16), justifyContent: "center", alignItems: "center" },
  countBadgeText: { color: "#fff", fontSize: normalize(14), fontWeight: "700" },
  invoiceItem: { borderRadius: normalize(16), padding: wp(4) },
  invoiceItemContent: { flexDirection: "row", alignItems: "center" },
  invoiceIconCircle: { width: normalize(48), height: normalize(48), borderRadius: normalize(24), justifyContent: "center", alignItems: "center" },
  invoiceDetails: { flex: 1 },
  invoiceTitle: { fontSize: normalize(15), fontWeight: "700", marginBottom: hp(0.5) },
  invoiceMetaRow: { flexDirection: "row", alignItems: "center", marginTop: hp(0.4) },
  invoiceMeta: { fontSize: normalize(12), fontWeight: "500", marginLeft: wp(1.5) },
  invoicePriceSection: { alignItems: "flex-end", justifyContent: "center" },
  invoicePrice: { fontSize: normalize(16), fontWeight: "700", marginBottom: hp(0.5) },
});