    import React from "react";
    import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
    import { LinearGradient } from "expo-linear-gradient";
    import BottomNav from "../components/BottomNav";
    import { Ionicons } from "@expo/vector-icons";

    export default function ProfileScreen({ navigation, route }) {
    const user = route.params?.user || {};

    // Cards info
    const cards = [
        { 
        label: "Edit Profile", 
        icon: "create-outline", 
        onPress: () => navigation.navigate("EditProfileScreen", { user }) 
        },
        { 
        label: "Change Password", 
        icon: "key-outline", 
        onPress: () => navigation.navigate("ChangePwdScreen", { user }) 
        },
        { 
        label: "Help & Support", 
        icon: "headset-outline", 
        onPress: () => navigation.navigate("HelpSupport") 
        },
        { 
        label: "Settings", 
        icon: "settings-outline", 
        onPress: () => navigation.navigate("Settings") 
        },
        { 
        label: "Logout", 
        icon: "log-out-outline", 
        onPress: () => console.log("Logout pressed") 
        },
    ];

    return (
        <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
            {/* Gradient Header */}
            <LinearGradient colors={["#6F42C1", "#9b59b6"]} style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>

            <Image
                source={require("../assets/default_avatar.jpg")}
                style={styles.avatar}
            />

            <Text style={styles.name}>
                {user.firstname && user.lastname
                ? `${user.firstname} ${user.lastname}`
                : user.name || "John Doe"}
            </Text>

            <Text style={styles.email}>{user.email || "john@example.com"}</Text>
            </LinearGradient>

            {/* Action Cards */}
            <View style={styles.cardsContainer}>
            {cards.map((card, index) => (
                <TouchableOpacity key={index} style={styles.card} onPress={card.onPress}>
                <Ionicons name={card.icon} size={24} color="#6F42C1" style={{ marginRight: 15 }} />
                <Text style={styles.cardText}>{card.label}</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#6F42C1" style={{ marginLeft: "auto" }} />
                </TouchableOpacity>
            ))}
            </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomNav navigation={navigation} activeScreen="person" />
        </View>
    );
    }

    const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fbf7ff" },

    content: {
        paddingBottom: 100,
        alignItems: "center",
    },

    /* Gradient Header */
    header: {
        width: "100%",
        paddingTop: 20,
        paddingBottom: 15,
        alignItems: "center",
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "white",
        marginBottom: 20,
    },

    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: "white",
        marginBottom: 12,
    },

    name: {
        fontSize: 20,
        fontWeight: "700",
        color: "white",
        marginBottom: 6,
    },

    email: {
        fontSize: 16,
        color: "white",
        opacity: 0.9,
    },

    /* Action Cards */
    cardsContainer: {
        width: "90%",
        marginTop: 20,
    },

    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    cardText: {
        color: "#6F42C1",
        fontSize: 16,
        fontWeight: "600",
    },
    });
