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
  Dimensions 
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";

import TopNavBar from "../components/TopNavBar";

const { height: screenHeight } = Dimensions.get("window");
const TOP_SECTION_HEIGHT = screenHeight * 0.20;

export default function PaidInvoiceScreen({ navigation, route }) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  // Example invoice object for testing:
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
      avatar: require("../assets/child1.jpg") // Add your child avatar image
    },
  };

  const handleDownload = () => {
    Alert.alert("Download", "Invoice PDF download initiated!");
  };

  // Map payment methods to logos
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
          {isDark && (
            <View style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            }} />
          )}
          
          <View style={styles.safeArea} />
          <TopNavBar title="Invoice details" navigation={navigation} />
        </LinearGradient>
      </View>

      {/* WHITE BOTTOM SECTION with rounded top */}
      <View style={[styles.whiteSection, { top: TOP_SECTION_HEIGHT }]}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Invoice Card */}
          <View style={styles.mainCard}>
            {/* Child Info Corner */}
            <View style={styles.childCorner}>
              <Image 
                source={invoice.child?.avatar} 
                style={styles.childAvatar} 
              />
            </View>

            {/* Invoice Title */}
            <Text style={styles.invoiceTitle}>{invoice.title}</Text>

            {/* Invoice Info Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="receipt" size={20} color="#9b59b6" />
                <Text style={styles.sectionTitle}>Invoice Information</Text>
              </View>

              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.label}>Reference</Text>
                  <Text style={styles.value}>{invoice.reference}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.label}>Status</Text>
                  <View style={[styles.statusBadge, invoice.status === "Paid" ? styles.paid : styles.cancelled]}>
                    <Feather name="check-circle" size={14} color="#fff" />
                    <Text style={styles.statusText}>{invoice.status}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.label}>Issue Date</Text>
                  <Text style={styles.value}>{invoice.issueDate}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.label}>Payment Date</Text>
                  <Text style={styles.value}>{invoice.paymentDate}</Text>
                </View>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Invoice Details Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="description" size={20} color="#9b59b6" />
                <Text style={styles.sectionTitle}>Charges Breakdown</Text>
              </View>

              <View style={styles.chargeRow}>
                <Text style={styles.chargeLabel}>Monthly Frames</Text>
                <Text style={styles.chargeValue}>{invoice.framesMonthly}</Text>
              </View>

              {invoice.additionalServices?.map((service, index) => (
                <View key={index} style={styles.chargeRow}>
                  <Text style={styles.chargeLabel}>{service.name}</Text>
                  <Text style={styles.chargeValue}>{service.price}</Text>
                </View>
              ))}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>{invoice.total}</Text>
              </View>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Payment Method Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="payment" size={20} color="#9b59b6" />
                <Text style={styles.sectionTitle}>Payment Method</Text>
              </View>

              <View style={styles.paymentRow}>
                {invoice.paymentMethod && paymentLogos[invoice.paymentMethod] && (
                  <View style={styles.paymentLogoContainer}>
                    <Image 
                      source={paymentLogos[invoice.paymentMethod]} 
                      style={styles.paymentLogo} 
                    />
                  </View>
                )}
                <Text style={styles.paymentMethodText}>{invoice.paymentMethod}</Text>
              </View>
            </View>
          </View>

          {/* Bottom spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
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


  

  headerTitle: { 
    fontSize: 22, 
    fontWeight: "700", 
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },

  downloadButton: {
    padding: 8,
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
    borderColor: "#fed703",
    marginBottom: 8,
  },



  invoiceTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2d3436",
    marginBottom: 20,
    paddingRight: 100, // Space for child corner
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

  infoItem: {
    flex: 1,
  },

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

  paid: { 
    backgroundColor: "#27ae60" 
  },

  cancelled: { 
    backgroundColor: "#e74c3c" 
  },

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
    borderTopColor: "#9b59b6",
  },

  totalLabel: {
    fontSize: 16,
    color: "#2d3436",
    fontWeight: "700",
  },

  totalValue: {
    fontSize: 20,
    color: "#9b59b6",
    fontWeight: "700",
  },

  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
  },

  paymentLogoContainer: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  paymentLogo: {
    width: 50,
    height: 30,
    resizeMode: "contain",
  },

  paymentMethodText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2d3436",
  },
});