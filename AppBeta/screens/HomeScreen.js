import React, { useState, useRef, useEffect } from "react";

import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Text, 
  Animated, 
  Dimensions,
  ScrollView,
  FlatList,
  Alert,
  Modal
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";



import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNavApp from "../components/BottomNavApp";
import MapScreen from "../screens/MapScreen";
const screenWidth = Dimensions.get("window").width;

export default function HomeScreen({ navigation, route }) {
  const [expandedCard, setExpandedCard] = useState(null);
  const [animatedHeights, setAnimatedHeights] = useState({});
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-250)).current;
  const [lang, setLang] = useState('en'); // Add this line

  const user = route.params?.user;
  const username = user?.name || "User";
  const email = user?.email || "";

  const children = [
    {
      id: 1,
      name: "John Doe",
      age: 8,
      grade: 3,
      present: true,
      completedTasks: 10,
      totalTasks: 15,
      performance: 42,
      avatar: require("../assets/child1.jpg"),
    },
    {
      id: 2,
      name: "Emma Smith",
      age: 7,
      grade: 2,
      present: false,
      completedTasks: 7,
      totalTasks: 12,
      performance: 74,
      avatar: require("../assets/child3.jpg"),
    },
    {
      id: 3,
      name: "Liam Brown",
      age: 9,
      grade: 4,
      present: true,
      completedTasks: 12,
      totalTasks: 15,
      performance: 91,
      avatar: require("../assets/child2.jpg"),
    },
  ];

  const today = new Date();
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const scrollRef = useRef(null);
  const currentDayIndex = (today.getDay() + 6) % 7;
  const weekDays = dayNames.map((day, index) => {
    const d = new Date(today);
    const diff = index - currentDayIndex;
    d.setDate(today.getDate() + diff);
    return { name: day, date: d.getDate() };
  });

  useEffect(() => {
    setTimeout(() => {
      if (scrollRef.current) {
        const cardWidth = 80;
        const offset = cardWidth * currentDayIndex - screenWidth / 2 + cardWidth / 2;
        scrollRef.current.scrollTo({ x: offset > 0 ? offset : 0, animated: true });
      }
    }, 100);
  }, []);

  const handleNotifications = () => {
    // Temporary placeholder until Notifications screen is set up
    Alert.alert(
      "Notifications",
      "Notifications feature coming soon!",
      [{ text: "OK" }]
    );
    
    // Once you add the Notifications screen to your navigator, replace above with:
    // navigation.navigate("Notifications");
  };
  const handleLanguageChange = () => {
    const next = lang === 'en' ? 'ar' : 'en';
    setLang(next);
    Alert.alert('Language Changed', `Language switched to ${next.toUpperCase()}`);
    // If you add i18next later: i18n.changeLanguage(next);
  };
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            await AsyncStorage.removeItem("user");
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
        },
      ]
    );
  };

  const toggleCard = (index) => {
    if (expandedCard === index) {
      Animated.timing(animatedHeights[index], {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setExpandedCard(null));
    } else {
      const newAnimatedHeights = { ...animatedHeights };
      if (!newAnimatedHeights[index]) newAnimatedHeights[index] = new Animated.Value(0);
      if (expandedCard !== null && expandedCard !== index) {
        Animated.timing(animatedHeights[expandedCard], {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
      setExpandedCard(index);
      Animated.timing(newAnimatedHeights[index], {
        toValue: 50,
        duration: 300,
        useNativeDriver: false,
      }).start();
      setAnimatedHeights(newAnimatedHeights);
    }
  };

  const renderChildCard = ({ item, index }) => {
    let gradientColors = ["#6FCF97", "#27AE60"];
    if (item.performance >= 45 && item.performance < 75) gradientColors = ["#F2C94C", "#F2994A"];
    if (item.performance < 45) gradientColors = ["#EB5757", "#E53935"];

    if (!animatedHeights[index]) animatedHeights[index] = new Animated.Value(0);

    return (
      <TouchableOpacity
        style={styles.childCardWrapper}
        activeOpacity={0.9}
        onPress={() => toggleCard(index)}
      >
        <LinearGradient colors={gradientColors} style={styles.childCard}>
          <View style={styles.childHeader}>
            <Image source={item.avatar} style={styles.childAvatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.childName}>{item.name}</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.childInfo}>
                  Age: {item.age} | Grade: {item.grade} | {item.present ? "Present" : "Absent"}
                </Text>
                <Feather name={item.present ? "check" : "x"} size={16} color="#fff" style={{ marginLeft: 4 }} />
              </View>
            </View>
          </View>

          <View style={[styles.taskRow, { alignItems: "center" }]}>
            <Feather name="clipboard" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.taskText}>Tasks:</Text>
            <View style={styles.taskBarBackground}>
              <View style={[styles.taskBarProgress, { width: `${(item.completedTasks / item.totalTasks) * 100}%` }]} />
            </View>
            <Text style={styles.taskNumber}>{item.completedTasks}/{item.totalTasks}</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="bar-chart-2" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.performanceText}>Performance: {item.performance}%</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderItemSeparator = () => <View style={styles.itemSeparator} />;

  return (
    <View style={styles.container}>
      {/* Full Screen Sidebar Modal */}
      <Modal
        visible={sidebarVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={toggleSidebar}
      >
        <LinearGradient
          colors={["#6F42C1", "#9b59b6"]}
          style={styles.fullScreenSidebar}
        >
          {/* Header with Back Button */}
          <View style={styles.sidebarTopBar}>
            <TouchableOpacity onPress={toggleSidebar} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.sidebarTitle}>Menu</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={styles.sidebarContent} showsVerticalScrollIndicator={false}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
              <Image
                source={require("../assets/omarPicture.jpg")}
                style={styles.profileAvatar}
                resizeMode="contain"
              />
              <Text style={styles.profileName}>{username}</Text>
              <Text style={styles.profileEmail}>{email || "user@example.com"}</Text>
              <View style={styles.badges}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Regular</Text>
                </View>
                <View style={[styles.badge, styles.badgeVerified]}>
                  <Text style={styles.badgeText}>Verified</Text>
                </View>
              </View>
            </View>

            {/* Shortcut Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Shortcut</Text>
              <View style={styles.shortcutGrid}>
                <TouchableOpacity style={styles.shortcutItem} onPress={() => {
                  toggleSidebar();
                  Alert.alert("Profile", "Profile screen coming soon!");
                }}>
                  <View style={styles.shortcutIcon}>
                    <Feather name="user" size={24} color="#6F42C1" />
                  </View>
                  <Text style={styles.shortcutText}>Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.shortcutItem} onPress={() => {
                  toggleSidebar();
                  navigation.navigate("Calendar");                }}>
                  <View style={styles.shortcutIcon}>
                    <Feather name="calendar" size={24} color="#6F42C1" />
                  </View>
                  <Text style={styles.shortcutText}>Calendar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.shortcutItem} onPress={() => {
                  toggleSidebar();
                  navigation.navigate("MapScreen");
                }}>
                  <View style={styles.shortcutIcon}>
                    <Feather name="map" size={24} color="#6F42C1" />
                  </View>
                  <Text style={styles.shortcutText}>Maps</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.shortcutItem} onPress={() => {
                  toggleSidebar();
                  Alert.alert("Settings", "Settings screen coming soon!");
                }}>
                  <View style={styles.shortcutIcon}>
                    <Feather name="settings" size={24} color="#6F42C1" />
                  </View>
                  <Text style={styles.shortcutText}>Settings</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Recommend Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recommend</Text>
              
              <TouchableOpacity style={styles.menuListItem} onPress={() => {
                toggleSidebar();
                Alert.alert("Language", "Language selection coming soon!");
              }}>
                <View style={styles.menuListIcon}>
                  <Feather name="globe" size={22} color="#6F42C1" />
                </View>
                <View style={styles.menuListContent}>
                  <Text style={styles.menuListTitle}>Language</Text>
                  <Text style={styles.menuListSubtitle}>Change app language</Text>
                </View>
                <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuListItem} onPress={() => {
                toggleSidebar();
                handleNotifications();
              }}>
                <View style={styles.menuListIcon}>
                  <Feather name="bell" size={22} color="#6F42C1" />
                </View>
                <View style={styles.menuListContent}>
                  <Text style={styles.menuListTitle}>Notifications</Text>
                  <Text style={styles.menuListSubtitle}>Manage notifications</Text>
                </View>
                <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuListItem} onPress={() => {
                toggleSidebar();
                Alert.alert("Help & Support", "Support center coming soon!");
              }}>
                <View style={styles.menuListIcon}>
                  <Feather name="help-circle" size={22} color="#6F42C1" />
                </View>
                <View style={styles.menuListContent}>
                  <Text style={styles.menuListTitle}>Help & Support</Text>
                  <Text style={styles.menuListSubtitle}>Get help and support</Text>
                </View>
                <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuListItem} onPress={() => {
                toggleSidebar();
                Alert.alert("Settings", "Settings screen coming soon!");
              }}>
                <View style={styles.menuListIcon}>
                  <Feather name="settings" size={22} color="#6F42C1" />
                </View>
                <View style={styles.menuListContent}>
                  <Text style={styles.menuListTitle}>Settings</Text>
                  <Text style={styles.menuListSubtitle}>App preferences</Text>
                </View>
                <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity 
              style={styles.logoutButton} 
              onPress={() => {
                toggleSidebar();
                setTimeout(() => handleLogout(), 300);
              }}
            >
              <Feather name="log-out" size={20} color="white" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <View style={{ height: 40 }} />
          </ScrollView>
        </LinearGradient>
      </Modal>

      {/* Top Header with Welcome, Notification, and Logout */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.burgerButton} onPress={toggleSidebar}>
          <Feather name="menu" size={24} color="#6F42C1" />
        </TouchableOpacity>
        <View style={styles.headerLeft}>
           <Image
    source={require("../assets/famGif.gif")} // or use a profile image
    style={styles.userAvatar}
    resizeMode="cover"
  />
          </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={handleNotifications}>
            <Feather name="bell" size={24} color="#6F42C1" />
          </TouchableOpacity>
<TouchableOpacity style={styles.iconButton} onPress={handleLanguageChange}>
  <Image
    source={
      lang === 'en'
        ? require('../assets/flags/en.png')
        : require('../assets/flags/ar.png')
    }
    style={{ width: 24, height: 24, borderRadius: 12 }}
    resizeMode="cover"
  />
</TouchableOpacity>

        </View>
      </View>

      <ScrollView contentContainerStyle={styles.mainScroll} showsVerticalScrollIndicator={false}>
        {/* Welcome Card */}
        <LinearGradient
          colors={["#6F42C1", "#9b59b6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.welcomeCard}
        >
          <View style={styles.welcomeContent}>
            <View style={{ flex: 1 }}>
              <Text style={styles.welcomeTitle}>Welcome to Family Space</Text>
              <Text style={styles.welcomeSubtitle}>
                Track your children's progress and educational activities
              </Text>
            </View>
            <Image
              source={require("../assets/famGif.gif")}
              style={styles.famGif}
              resizeMode="contain"
            />
          </View>
        </LinearGradient>

        {/* Metric Cards + Calendar */}
        <LinearGradient
          colors={["#6F42C1", "#9b59b6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.metricBigCard}
        >
          <View style={[styles.metricContainer, { marginBottom: 12 }]}>
            <View style={[styles.metricCard, { backgroundColor: "rgba(110, 190, 252, 0.7)" }]}>
              <View style={styles.metricTop}>
                <Feather name="users" size={22} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.metricNumber}>3</Text>
              </View>
              <Text style={styles.metricText}>Children</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: "rgba(55, 224, 178, 0.7)" }]}>
              <View style={styles.metricTop}>
                <Feather name="check-circle" size={22} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.metricNumber}>15</Text>
              </View>
              <Text style={styles.metricText}>Completed Tasks</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: "rgba(255, 140, 97, 0.7)" }]}>
              <View style={styles.metricTop}>
                <Feather name="bar-chart-2" size={22} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.metricNumber}>82%</Text>
              </View>
              <Text style={styles.metricText}>Average performance</Text>
            </View>
          </View>

          {/* Calendar */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            ref={scrollRef}
            contentContainerStyle={{ paddingHorizontal: 8 }}
          >
            <View style={{ flexDirection: "row" }}>
              {weekDays.map((day, index) => {
                const isToday = index === currentDayIndex;
                return (
                  <View
                    key={index}
                    style={{
                      backgroundColor: isToday ? "white" : "rgba(255,255,255,0.2)",
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      borderRadius: 8,
                      marginRight: 8,
                    }}
                  >
                    <Text style={{
                      color: isToday ? "#6F42C1" : "white",
                      fontWeight: isToday ? "700" : "500",
                      fontSize: 14,
                    }}>
                      {day.name} {day.date}
                    </Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </LinearGradient>

        {/* Child Cards - Horizontal FlatList */}
    <View 
  style={{ marginTop: 20, paddingHorizontal: 16 }}>
          <Text style={styles.childrenTitle}>My Childrens</Text>

          {children.map((child, index) => (
            <View key={child.id} style={{ marginBottom: 16 }}>
              {renderChildCard({ item: child, index })}
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNavApp />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf7ff" },
  
  // Full Screen Sidebar Styles
  fullScreenSidebar: {
    flex: 1,
    paddingTop: 40,
  },
  sidebarTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  sidebarContent: {
    flex: 1,
  },
  
  // Profile Section
  profileSection: {
    alignItems: "center",
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 16,
  },
  profileName: {
    fontSize: 22,
    fontWeight: "700",
    color: "white",
    marginBottom: 6,
  },
  profileEmail: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 12,
  },
  badges: {
    flexDirection: "row",
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(242, 201, 76, 0.8)",
  },
  badgeVerified: {
    backgroundColor: "rgba(76, 175, 80, 0.8)",
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  
  // Section
  section: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 16,
  },
  
  // Shortcut Grid
  shortcutGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  shortcutItem: {
    width: (screenWidth - 72) / 4,
    alignItems: "center",
  },
  shortcutIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  shortcutText: {
    color: "white",
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
childrenTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#6F42C1",
    marginBottom: 12,
  },

  childCardWrapper: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  
  // Menu List Items
  menuListItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    marginBottom: 12,
  },
  menuListIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuListContent: {
    flex: 1,
  },
  menuListTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 2,
  },
  menuListSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
  
  // Logout Button
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 16,
    backgroundColor: "rgba(235, 87, 87, 0.3)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(235, 87, 87, 0.5)",
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  userAvatar: {
  width: 40,
  height: 40,
  borderRadius: 20,
  borderWidth: 2,
  borderColor: "#6F42C1",
  backgroundColor: "#f0f0f0",
},


  header: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    paddingHorizontal: 16, 
    paddingVertical: 16,
    marginTop: 40,
    backgroundColor: "white", 
    elevation: 2, 
    shadowColor: "#000", 
    shadowOpacity: 0.1, 
    shadowRadius: 4, 
    shadowOffset: { width: 0, height: 2 } 
  },
  burgerButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  headerLeft: { flex: 1 },
  welcomeHeader: { fontSize: 18, fontWeight: "600", color: "#6F42C1" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  iconButton: { 
    padding: 8, 
    marginLeft: 16, 
    borderRadius: 20, 
    backgroundColor: "#f0f0f0" 
  },
  mainScroll: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 90 },
  welcomeCard: { borderRadius: 16, padding: 18, shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 8, elevation: 4, marginBottom: 16, marginTop: 16 },
  welcomeContent: { flexDirection: "row", alignItems: "center" },
  welcomeTitle: { color: "white", fontSize: 20, fontWeight: "700", marginBottom: 6 },
  welcomeSubtitle: { color: "white", fontSize: 14, opacity: 0.95 },
  famGif: { width: 80, height: 80, marginLeft: 12 },
  metricBigCard: { borderRadius: 16, paddingVertical: 16, paddingHorizontal: 10, marginBottom: 16 },
  metricContainer: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 0 },
  metricCard: { width: 100, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 10 },
  metricTop: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  metricNumber: { color: "white", fontSize: 18, fontWeight: "700" },
  metricText: { color: "white", fontSize: 12, opacity: 0.95 },
  flatListContainer: { 
    paddingTop: 20,
    paddingHorizontal: 16, 
    alignItems: "center" 
  },
  itemSeparator: { width: 16 },
  childCardWrapper: { 
    width: screenWidth * 0.85,
    marginHorizontal: 8,
    shadowColor: "#000", 
    shadowOpacity: 0.15, 
    shadowRadius: 6, 
    shadowOffset: { width: 0, height: 4 }, 
    elevation: 4 
  },
  childCard: { borderRadius: 20, padding: 16 },
  childHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  childAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  childName: { fontSize: 16, fontWeight: "700", marginBottom: 2, color: "#fff" },
  childInfo: { fontSize: 13, color: "#fff" },
  taskRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  taskText: { fontSize: 14, fontWeight: "600", marginRight: 6, color: "#fff" },
  taskBarBackground: { flex: 1, height: 10, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 5, overflow: "hidden", marginRight: 6 },
  taskBarProgress: { height: "100%", backgroundColor: "white", borderRadius: 5 },
  taskNumber: { fontSize: 13, fontWeight: "600", color: "#fff" },
  performanceText: { fontSize: 14, fontWeight: "600", color: "#fff" },
});