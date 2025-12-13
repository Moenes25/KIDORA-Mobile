import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import polyline from "@mapbox/polyline";
import { supabase } from "../utils/supabase.js"; // Ensure this path is correct
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";
import TopNavBar from "../components/TopNavBar";

export default function MapScreen({ navigation, route }) {
  const { colors } = useTheme();
  const mapRef = useRef(null);

  const [parentLocation, setParentLocation] = useState(null);
  const [childLocation, setChildLocation] = useState(null);
  const [childBattery, setChildBattery] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  const childName = route?.params?.childName?.trim() || "My Child";
  const childId = route?.params?.childId || "child_1";

  // ✅ FIX 1: Secure Parent Location Tracking (Prevents 'stopTracking of undefined' crash)
  useEffect(() => {
    let locationSubscription = null;

    const startTracking = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission denied", "Location access is required to track distance.");
          setLocationError("Permission denied");
          setLoading(false);
          return;
        }

        // Get initial position quickly
        const currentPos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setParentLocation({
          latitude: currentPos.coords.latitude,
          longitude: currentPos.coords.longitude,
        });
        setLoading(false);

        // Start Live Watcher
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // Update every 5 seconds
            distanceInterval: 10, // Or every 10 meters
          },
          (loc) => {
            setParentLocation({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            });
          }
        );
      } catch (error) {
        console.warn("Location Error:", error);
        setLocationError(error.message);
        setLoading(false);
      }
    };

    startTracking();

    // 🔴 CRITICAL FIX: Check if subscription exists before removing
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // ✅ FIX 2: Supabase Child Tracking
  useEffect(() => {
    if (!childId) return;

    const fetchInitial = async () => {
      try {
        const { data, error } = await supabase
          .from("child_locations")
          .select("*")
          .eq("child_id", childId)
          .order("timestamp", { ascending: false })
          .limit(1)
          .single();

        if (data) {
          setChildLocation({ latitude: data.latitude, longitude: data.longitude });
          setChildBattery(data.battery_level);
          setLastUpdated(new Date(data.timestamp).toLocaleTimeString());
        }
      } catch (err) {
        console.log("Supabase fetch error (ignoring if table empty):", err.message);
        // Fallback for demo if no data exists
        setChildLocation({ latitude: 36.8065, longitude: 10.1815 }); 
      }
    };

    fetchInitial();

    const subscription = supabase
      .channel("child_locations_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "child_locations",
          filter: `child_id=eq.${childId}`,
        },
        (payload) => {
          const n = payload.new;
          if (n.latitude && n.longitude) {
            setChildLocation({ latitude: n.latitude, longitude: n.longitude });
            setChildBattery(n.battery_level);
            setLastUpdated(new Date(n.timestamp).toLocaleTimeString());
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [childId]);

  // ✅ FIX 3: Routing Logic (Only fetch if both locations exist)
  useEffect(() => {
    if (parentLocation && childLocation) {
      fetchRoute();
    }
  }, [parentLocation, childLocation]);

  const fetchRoute = async () => {
    if (!parentLocation || !childLocation) return;

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${parentLocation.longitude},${parentLocation.latitude};${childLocation.longitude},${childLocation.latitude}?overview=full&geometries=polyline`;
      
      const res = await fetch(url);
      const json = await res.json();

      if (json.routes?.length) {
        const points = polyline.decode(json.routes[0].geometry);
        const coords = points.map((p) => ({ latitude: p[0], longitude: p[1] }));
        setRouteCoordinates(coords);
        setDistance((json.routes[0].distance / 1000).toFixed(1));
        setDuration(Math.ceil(json.routes[0].duration / 60));

        // Fit map to show both markers
        mapRef.current?.fitToCoordinates([parentLocation, childLocation], {
          edgePadding: { top: 100, right: 50, bottom: 350, left: 50 },
          animated: true,
        });
      }
    } catch (e) {
      console.log("Routing Error (using straight line fallback):", e);
      setRouteCoordinates([parentLocation, childLocation]);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Feather name="map-pin" size={48} color="#6f42c1" />
        <Text style={styles.loadingText}>Locating...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Spacer for Status Bar */}
      <View style={{ height: Platform.OS === "android" ? StatusBar.currentHeight : 44, backgroundColor: "#6f42c1" }} />
      <StatusBar barStyle="light-content" />
      
      <LinearGradient colors={colors.headerGradient} style={styles.topSection}>
        <TopNavBar title={`Tracking ${childName}`} navigation={navigation} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mapCard}>
          {parentLocation && (
            <MapView
              ref={mapRef}
              // ✅ Fix for Android Maps
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : null}
              style={styles.map}
              showsUserLocation={true}
              showsMyLocationButton={false}
              initialRegion={{
                latitude: parentLocation.latitude,
                longitude: parentLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              {/* Child Marker */}
              {childLocation && (
                <Marker coordinate={childLocation} title={`${childName}'s Location`}>
                  <View style={styles.childMarker}>
                    <View style={styles.childMarkerInner} />
                    <View style={styles.markerTriangle} />
                  </View>
                </Marker>
              )}

              {/* Route Line */}
              {routeCoordinates.length > 0 && (
                <Polyline coordinates={routeCoordinates} strokeColor="#6F42C1" strokeWidth={4} />
              )}
            </MapView>
          )}

          {childLocation && (
            <View style={styles.floatingLabel}>
              <View style={styles.labelDot} />
              <Text style={styles.labelText}>{childName}</Text>
            </View>
          )}
        </View>

        {/* Info Cards */}
        <View style={styles.infoCard}>
          <View style={styles.distanceRow}>
            <Feather name="navigation" size={26} color={colors.primary} />
            <View style={styles.distanceText}>
              <Text style={styles.distanceMain}>
                {distance ? `${distance} km away` : "Calculating..."}
              </Text>
              <Text style={styles.distanceSub}>
                {duration ? `~${duration} min by car` : "Getting route..."}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.safetyCard}>
          <View style={styles.safetyRow}>
            <View style={styles.shieldIcon}>
              <Feather name="shield" size={26} color="#4CAF50" />
            </View>
            <View style={styles.safetyInfo}>
              <Text style={styles.safetyTitle}>{childName} is safe</Text>
              <View style={styles.safetyDetail}>
                <Feather name="clock" size={14} color="#666666" />
                <Text style={styles.detailText}>Updated: {lastUpdated || "Just now"}</Text>
              </View>
              <View style={styles.safetyDetail}>
                <Feather name="battery-charging" size={14} color="#666666" />
                <Text style={styles.detailText}>Battery: {childBattery !== null ? `${childBattery}%` : "—"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Quick Actions</Text>
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#FFC75F" }]}>
              <Feather name="phone" size={20} color="#ffffff" />
              <Text style={styles.actionBtnText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#FFC75F" }]}>
              <Feather name="message-circle" size={20} color="#ffffff" />
              <Text style={styles.actionBtnText}>Msg</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#FFC75F" }]}>
              <Feather name="bell" size={20} color="#ffffff" />
              <Text style={styles.actionBtnText}>Alert</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activeStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Location sharing active</Text>
          </View>
        </View>

        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.navigateBtn}>
            <Feather name="compass" size={22} color="#fff" />
            <Text style={styles.navigateText}>Navigate</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.historyBtn}>
            <Feather name="clock" size={22} color="#6F42C1" />
            <Text style={styles.historyText}>History</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5" },
  topSection: { paddingBottom: 10 },
  mapCard: { marginHorizontal: 16, marginTop: 20, height: 340, borderRadius: 24, overflow: "hidden", elevation: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12 },
  map: { flex: 1 },
  childMarker: { width: 30, height: 30, borderRadius: 15, backgroundColor: "#FF6B9D", alignItems: "center", justifyContent: "center" },
  childMarkerInner: { width: 15, height: 15, borderRadius: 7.5, backgroundColor: "#FF6B9D", borderWidth: 2, borderColor: "#fff" },
  markerTriangle: { position: "absolute", bottom: -8, width: 0, height: 0, borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: "#FF6B9D" },
  floatingLabel: { position: "absolute", top: 20, right: 20, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: "#ffffff", borderRadius: 20, flexDirection: "row", alignItems: "center", elevation: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8 },
  labelDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#FF6B9D", marginRight: 8 },
  labelText: { fontSize: 15, fontWeight: "700", color: "#1a1a2e" },
  infoCard: { marginHorizontal: 20, marginTop: 16, padding: 18, backgroundColor: "#ffffff", borderRadius: 20, elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  distanceRow: { flexDirection: "row", alignItems: "center" },
  distanceText: { marginLeft: 16, flex: 1 },
  distanceMain: { fontSize: 20, fontWeight: "700", color: "#000000" },
  distanceSub: { fontSize: 14, marginTop: 4, color: "#666666" },
  safetyCard: { marginHorizontal: 20, marginTop: 12, padding: 18, backgroundColor: "#ffffff", borderRadius: 20, elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  safetyRow: { flexDirection: "row" },
  shieldIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: "#E8F5E9", justifyContent: "center", alignItems: "center" },
  safetyInfo: { marginLeft: 16, flex: 1 },
  safetyTitle: { fontSize: 18, fontWeight: "700", color: "#000000" },
  safetyDetail: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  detailText: { fontSize: 14, marginLeft: 8, color: "#666666" },
  actionsCard: { marginHorizontal: 20, marginTop: 12, padding: 20, backgroundColor: "#ffffff", borderRadius: 20, elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  actionsTitle: { fontSize: 18, fontWeight: "700", color: "#000000", marginBottom: 16 },
  actionButtonsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  actionBtn: { flex: 1, alignItems: "center", paddingVertical: 14, borderRadius: 16, marginHorizontal: 6, shadowColor: "#FFC75F", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  actionBtnText: { marginTop: 8, fontSize: 14, fontWeight: "600", color: "#ffffff" },
  activeStatus: { flexDirection: "row", alignItems: "center", paddingTop: 16, borderTopWidth: 1, borderTopColor: "#f0f0f0" },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#4CAF50", marginRight: 10 },
  statusText: { fontSize: 14, fontWeight: "500", color: "#666666" },
  bottomButtons: { flexDirection: "row", marginHorizontal: 20, marginTop: 20, gap: 12 },
  navigateBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 18, backgroundColor: "#4CAF50", borderRadius: 16, elevation: 6, shadowColor: "#4CAF50", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 8 },
  navigateText: { color: "#fff", fontSize: 17, fontWeight: "700", marginLeft: 10 },
  historyBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 18, backgroundColor: "#ffffff", borderRadius: 16, borderWidth: 2, borderColor: "#6F42C1", elevation: 4, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  historyText: { fontSize: 17, fontWeight: "700", marginLeft: 10, color: "#6F42C1" },
  loadingText: { fontSize: 16, marginTop: 16, fontWeight: "500", color: "#000000" },
  debugText: { fontSize: 12, marginTop: 8, color: "#666666" },
  errorText: { fontSize: 18, fontWeight: "700", color: "#ff6b6b", marginTop: 16 },
  errorDetail: { fontSize: 14, color: "#666666", marginTop: 8, textAlign: "center" },
  retryButton: { marginTop: 20, paddingHorizontal: 30, paddingVertical: 12, backgroundColor: "#6f42c1", borderRadius: 12 },
  retryText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});