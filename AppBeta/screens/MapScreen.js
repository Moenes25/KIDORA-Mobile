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
import { supabase } from "../utils/supabase.js";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";
import TopNavBar from "../components/TopNavBar";
import { wp, hp, normalize } from "../utils/responsive";

export default function MapScreen({ navigation, route }) {
  const { colors } = useTheme();
  const mapRef = useRef(null);

  // Get childId and childName from route params
  const childId = route?.params?.childId;
  const childName = route?.params?.childName || "Child";

  const [parentLocation, setParentLocation] = useState(null);
  const [childLocation, setChildLocation] = useState(null);
  const [childBattery, setChildBattery] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState(null);

  // Parent Location Tracking
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
        const currentPos = await Location.getCurrentPositionAsync({ 
          accuracy: Location.Accuracy.Balanced 
        });
        setParentLocation({
          latitude: currentPos.coords.latitude,
          longitude: currentPos.coords.longitude,
        });
        setLoading(false);

        // Start Live Watcher
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 10,
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

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  // Child Location Tracking (Supabase)
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
      .channel(`child_location_${childId}`)
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

  // Route Fetching
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

      if (json.routes && json.routes[0]) {
        const coords = polyline.decode(json.routes[0].geometry);
        setRouteCoordinates(coords.map((c) => ({ latitude: c[0], longitude: c[1] })));
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
        <Feather name="map-pin" size={normalize(48)} color="#6f42c1" />
        <Text style={styles.loadingText}>Locating...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ 
        height: Platform.OS === "android" ? StatusBar.currentHeight : hp(5), 
        backgroundColor: "#6f42c1" 
      }} />
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={colors.headerGradient} style={styles.topSection}>
        <TopNavBar title={`Tracking ${childName}`} navigation={navigation} />
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mapCard}>
          {parentLocation && (
            <MapView
              ref={mapRef}
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
              {childLocation && (
                <Marker coordinate={childLocation} title={`${childName}'s Location`}>
                  <View style={styles.childMarker}>
                    <View style={styles.childMarkerInner} />
                  </View>
                </Marker>
              )}
              {routeCoordinates.length > 0 && (
                <Polyline 
                  coordinates={routeCoordinates} 
                  strokeColor="#6F42C1" 
                  strokeWidth={4} 
                />
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

        <View style={styles.infoCard}>
          <View style={styles.distanceRow}>
            <Feather name="navigation" size={normalize(26)} color={colors.primary} />
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
              <Feather name="shield" size={normalize(26)} color="#4CAF50" />
            </View>
            <View style={styles.safetyInfo}>
              <Text style={styles.safetyTitle}>{childName} is safe</Text>
              <View style={styles.safetyDetail}>
                <Feather name="clock" size={normalize(14)} color="#666666" />
                <Text style={styles.detailText}>
                  Updated: {lastUpdated || "Just now"}
                </Text>
              </View>
              <View style={styles.safetyDetail}>
                <Feather name="battery-charging" size={normalize(14)} color="#666666" />
                <Text style={styles.detailText}>
                  Battery: {childBattery !== null ? `${childBattery}%` : "—"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionsCard}>
          <Text style={styles.actionsTitle}>Quick Actions</Text>
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#FFC75F" }]}>
              <Feather name="phone" size={normalize(20)} color="#ffffff" />
              <Text style={styles.actionBtnText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#FFC75F" }]}>
              <Feather name="message-circle" size={normalize(20)} color="#ffffff" />
              <Text style={styles.actionBtnText}>Msg</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#FFC75F" }]}>
              <Feather name="bell" size={normalize(20)} color="#ffffff" />
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
            <Feather name="compass" size={normalize(22)} color="#fff" />
            <Text style={styles.navigateText}>Navigate</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.historyBtn}>
            <Feather name="clock" size={normalize(22)} color="#6F42C1" />
            <Text style={styles.historyText}>History</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: hp(12) }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5" 
  },
  centerContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#f5f5f5" 
  },
  topSection: { 
    paddingBottom: hp(1) 
  },

  // Map Card
  mapCard: {
    marginHorizontal: wp(4),
    marginTop: hp(2),
    height: hp(40),
    borderRadius: normalize(24),
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  map: { 
    flex: 1 
  },

  // Markers
  childMarker: {
    width: normalize(30),
    height: normalize(30),
    borderRadius: normalize(15),
    backgroundColor: "#FF6B9D",
    alignItems: "center",
    justifyContent: "center",
  },
  childMarkerInner: {
    width: normalize(15),
    height: normalize(15),
    borderRadius: normalize(7.5),
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#FF6B9D",
  },

  floatingLabel: {
    position: "absolute",
    top: hp(2),
    right: wp(5),
    paddingHorizontal: wp(3.5),
    paddingVertical: hp(1),
    backgroundColor: "#ffffff",
    borderRadius: normalize(20),
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  labelDot: {
    width: normalize(8),
    height: normalize(8),
    borderRadius: normalize(4),
    backgroundColor: "#FF6B9D",
    marginRight: wp(2),
  },
  labelText: { 
    fontSize: normalize(15), 
    fontWeight: "700", 
    color: "#1a1a2e" 
  },

  // Info Cards
  infoCard: {
    marginHorizontal: wp(5),
    marginTop: hp(2),
    padding: wp(4.5),
    backgroundColor: "#ffffff",
    borderRadius: normalize(20),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceText: {
    marginLeft: wp(4),
    flex: 1,
  },
  distanceMain: { 
    fontSize: normalize(20), 
    fontWeight: "700", 
    color: "#000000" 
  },
  distanceSub: { 
    fontSize: normalize(14), 
    marginTop: hp(0.5), 
    color: "#666666" 
  },

  // Safety Card
  safetyCard: {
    marginHorizontal: wp(5),
    marginTop: hp(1.5),
    padding: wp(4.5),
    backgroundColor: "#ffffff",
    borderRadius: normalize(20),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  safetyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  shieldIcon: {
    width: normalize(56),
    height: normalize(56),
    borderRadius: normalize(16),
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  safetyInfo: {
    marginLeft: wp(4),
    flex: 1,
  },
  safetyTitle: { 
    fontSize: normalize(18), 
    fontWeight: "700", 
    color: "#000000" 
  },
  safetyDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp(0.8),
  },
  detailText: { 
    fontSize: normalize(14), 
    marginLeft: wp(2), 
    color: "#666666" 
  },

  // Actions Card
  actionsCard: {
    marginHorizontal: wp(5),
    marginTop: hp(1.5),
    padding: wp(5),
    backgroundColor: "#ffffff",
    borderRadius: normalize(20),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  actionsTitle: { 
    fontSize: normalize(18), 
    fontWeight: "700", 
    color: "#000000", 
    marginBottom: hp(2) 
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: hp(1.5),
    borderRadius: normalize(16),
    marginHorizontal: wp(1.5),
  },
  actionBtnText: { 
    marginTop: hp(0.8), 
    fontSize: normalize(14), 
    fontWeight: "600", 
    color: "#ffffff" 
  },
  activeStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp(2),
  },
  statusDot: {
    width: normalize(8),
    height: normalize(8),
    borderRadius: normalize(4),
    backgroundColor: "#4CAF50",
    marginRight: wp(2),
  },
  statusText: {
    fontSize: normalize(14),
    color: "#666666",
    fontWeight: "500",
  },

  // Bottom Buttons
  bottomButtons: { 
    flexDirection: "row", 
    marginHorizontal: wp(5), 
    marginTop: hp(2.5), 
    gap: wp(3) 
  },
  navigateBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(2),
    backgroundColor: "#4CAF50",
    borderRadius: normalize(16),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  navigateText: { 
    color: "#fff", 
    fontSize: normalize(17), 
    fontWeight: "700", 
    marginLeft: wp(2) 
  },

  historyBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(2),
    backgroundColor: "#ffffff",
    borderRadius: normalize(16),
    borderWidth: 2,
    borderColor: "#6F42C1",
  },
  historyText: { 
    fontSize: normalize(17), 
    fontWeight: "700", 
    marginLeft: wp(2), 
    color: "#6F42C1" 
  },

  loadingText: { 
    fontSize: normalize(16), 
    marginTop: hp(2), 
    fontWeight: "500", 
    color: "#000000" 
  },
});