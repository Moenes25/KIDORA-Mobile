// screens/MapScreen.js — DEEP PURPLE COSMIC THEME
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
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import polyline from "@mapbox/polyline";
import { supabase } from "../utils/supabase.js";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";

// Reusable TopNavBar
import TopNavBar from "../components/TopNavBar";

export default function MapScreen({ navigation, route }) {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";
  const mapRef = useRef(null);

  const [parentLocation, setParentLocation] = useState(null);
  const [childLocation, setChildLocation] = useState(null);
  const [childBattery, setChildBattery] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(true);

  const childName = route?.params?.childName?.trim() || "My Child";
  const childId = route?.params?.childId || "child_1";

  // Get parent location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location access is required");
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setParentLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setLoading(false);
    })();
  }, []);

  // Supabase realtime child location
  useEffect(() => {
    if (!childId) return;

    const fetchInitial = async () => {
      const { data } = await supabase
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
          setChildLocation({ latitude: n.latitude, longitude: n.longitude });
          setChildBattery(n.battery_level);
          setLastUpdated(new Date(n.timestamp).toLocaleTimeString());
        }
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [childId]);

  // Route calculation
  useEffect(() => {
    if (parentLocation && childLocation) fetchRoute();
  }, [parentLocation, childLocation]);

  const fetchRoute = async () => {
    if (!parentLocation || !childLocation) return;

    try {
      const url = `http://router.project-osrm.org/route/v1/driving/${parentLocation.longitude},${parentLocation.latitude};${childLocation.longitude},${childLocation.latitude}?overview=full&geometries=polyline`;
      const res = await fetch(url);
      const json = await res.json();

      if (json.routes?.length) {
        const points = polyline.decode(json.routes[0].geometry);
        const coords = points.map((p) => ({ latitude: p[0], longitude: p[1] }));
        setRouteCoordinates(coords);
        setDistance((json.routes[0].distance / 1000).toFixed(1));
        setDuration(Math.ceil(json.routes[0].duration / 60));

        mapRef.current?.fitToCoordinates(coords, {
          edgePadding: { top: 100, right: 80, bottom: 400, left: 80 },
          animated: true,
        });
      }
    } catch (e) {
      const dist = calculateDistance(
        parentLocation.latitude,
        parentLocation.longitude,
        childLocation.latitude,
        childLocation.longitude
      );
      setDistance(dist.toFixed(1));
      setDuration(Math.ceil(dist * 2));
      setRouteCoordinates([parentLocation, childLocation]);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const shadowColor = isDark ? "#2d1b69" : "#000";

  if (loading || !parentLocation) {
    return (
      <View style={styles.container}>
        <View 
          style={{ 
            height: Platform.OS === "android" ? StatusBar.currentHeight : 44,
            backgroundColor: "white" 
          }} 
        />
        <LinearGradient colors={colors.bgGradient} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Feather name="map-pin" size={48} color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading map...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View 
        style={{ 
          height: Platform.OS === "android" ? StatusBar.currentHeight : 44,
          backgroundColor: "white" 
        }} 
      />
      <LinearGradient colors={colors.bgGradient} style={{ flex: 1 }}>
      <TopNavBar title={`Tracking ${childName}`} navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Map Card */}
        <View 
          style={[
            styles.mapCard,
            {
              shadowColor: shadowColor,
              shadowOpacity: isDark ? 0.5 : 0.12,
            }
          ]}
        >
          <MapView
            ref={mapRef}
            style={styles.map}
            showsUserLocation={true}
            showsMyLocationButton={false}
            initialRegion={{
              latitude: parentLocation.latitude,
              longitude: parentLocation.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            {childLocation && (
              <Marker coordinate={childLocation} title={`${childName}'s Location`}>
                <View style={[styles.childMarker, { backgroundColor: colors.map.pinColor }]}>
                  <View style={[styles.childMarkerInner, { backgroundColor: colors.map.pinColor }]} />
                  <View style={[styles.markerTriangle, { 
                    borderTopColor: colors.map.pinColor,
                  }]} />
                </View>
              </Marker>
            )}
            {routeCoordinates.length > 0 && (
              <Polyline 
                coordinates={routeCoordinates} 
                strokeColor={colors.map.routeColor} 
                strokeWidth={5} 
              />
            )}
          </MapView>

          {/* Floating Label */}
          {childLocation && (
            <View style={[styles.floatingLabel, { backgroundColor: colors.map.labelBg }]}>
              <View style={[styles.labelDot, { backgroundColor: colors.map.pinColor }]} />
              <Text style={[styles.labelText, { color: colors.map.labelText }]}>{childName}</Text>
            </View>
          )}
        </View>

        {/* Distance & Time */}
        <View 
          style={[
            styles.infoCard, 
            { 
              backgroundColor: colors.card,
              shadowColor: shadowColor,
              shadowOpacity: isDark ? 0.4 : 0.08,
            }
          ]}
        >
          <View style={styles.distanceRow}>
            <Feather name="navigation" size={26} color={colors.primary} />
            <View style={styles.distanceText}>
              <Text style={[styles.distanceMain, { color: colors.text }]}>
                {distance ? `${distance} km away` : "Calculating distance..."}
              </Text>
              <Text style={[styles.distanceSub, { color: colors.textSecondary }]}>
                {duration ? `~${duration} min by car` : "Getting route..."}
              </Text>
            </View>
          </View>
        </View>

        {/* Child Safety Card */}
        <View 
          style={[
            styles.safetyCard, 
            { 
              backgroundColor: colors.card,
              shadowColor: shadowColor,
              shadowOpacity: isDark ? 0.4 : 0.08,
            }
          ]}
        >
          <View style={styles.safetyRow}>
            <View style={[
              styles.shieldIcon, 
              { backgroundColor: isDark ? "rgba(76, 175, 80, 0.2)" : "#E8F5E9" }
            ]}>
              <Feather name="shield" size={26} color="#4CAF50" />
            </View>
            <View style={styles.safetyInfo}>
              <Text style={[styles.safetyTitle, { color: colors.text }]}>{childName} is safe</Text>
              <View style={styles.safetyDetail}>
                <Feather name="clock" size={14} color={colors.textSecondary} />
                <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                  Updated: {lastUpdated || "Just now"}
                </Text>
              </View>
              <View style={styles.safetyDetail}>
                <Feather name="battery-charging" size={14} color={colors.textSecondary} />
                <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                  Battery: {childBattery !== null ? `${childBattery}%` : "—"}
                </Text>
              </View>
            </View>
          </View>
        </View>

       {/* Quick Actions */}
<View 
  style={[
    styles.actionsCard, 
    { 
      backgroundColor: colors.card,
      shadowColor: shadowColor,
      shadowOpacity: isDark ? 0.4 : 0.08,
    }
  ]}
>
  <Text style={[styles.actionsTitle, { color: colors.text }]}>Quick Actions</Text>
  <View style={styles.actionButtonsRow}>
    <TouchableOpacity 
      style={[
        styles.actionBtn, 
        { 
          backgroundColor: isDark ? colors.sidebarItemBg : "#f8f5ff",
          borderColor: isDark ? colors.sidebarIconBg : "#e8e0ff",
        }
      ]}
    >
      <Feather name="phone" size={20} color={isDark ? "#FFFFFF" : colors.primary} />
      <Text style={[styles.actionBtnText, { color: isDark ? "#FFFFFF" : colors.primary }]}>Call</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={[
        styles.actionBtn, 
        { 
          backgroundColor: isDark ? colors.sidebarItemBg : "#f8f5ff",
          borderColor: isDark ? colors.sidebarIconBg : "#e8e0ff",
        }
      ]}
    >
      <Feather name="message-circle" size={20} color={isDark ? "#FFFFFF" : colors.primary} />
      <Text style={[styles.actionBtnText, { color: isDark ? "#FFFFFF" : colors.primary }]}>Message</Text>
    </TouchableOpacity>

    <TouchableOpacity 
      style={[
        styles.actionBtn, 
        { 
          backgroundColor: isDark ? colors.sidebarItemBg : "#f8f5ff",
          borderColor: isDark ? colors.sidebarIconBg : "#e8e0ff",
        }
      ]}
    >
      <Feather name="bell" size={20} color={isDark ? "#FFFFFF" : colors.primary} />
      <Text style={[styles.actionBtnText, { color: isDark ? "#FFFFFF" : colors.primary }]}>Alert</Text>
    </TouchableOpacity>
  </View>

  <View style={[styles.activeStatus, { borderTopColor: isDark ? colors.sidebarItemBg : "#f0f0f0" }]}>
    <View style={styles.statusDot} />
    <Text style={[styles.statusText, { color: colors.textSecondary }]}>Location sharing active</Text>
  </View>
</View>

{/* Bottom Buttons – Fixed History Button Color */}
<View style={styles.bottomButtons}>
  <TouchableOpacity 
    style={[
      styles.navigateBtn, 
      { 
        backgroundColor: colors.primary,
        shadowColor: shadowColor,
        shadowOpacity: isDark ? 0.5 : 0.2,
      }
    ]}
  >
    <Feather name="compass" size={22} color="#fff" />
    <Text style={styles.navigateText}>Navigate</Text>
  </TouchableOpacity>

  <TouchableOpacity 
    style={[
      styles.historyBtn, 
      { 
        backgroundColor: colors.card,
        borderColor: colors.primary,
        shadowColor: shadowColor,
        shadowOpacity: isDark ? 0.4 : 0.08,
      }
    ]}
  >
    <Feather name="clock" size={22} color={isDark ? "#FFFFFF" : colors.primary} />
    <Text style={[styles.historyText, { color: isDark ? "#FFFFFF" : colors.primary }]}>History</Text>
  </TouchableOpacity>
</View>

        <View style={{ height: 100 }} />
      </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapCard: {
    marginHorizontal: 16,
    marginTop: 20,
    height: 340,
    borderRadius: 24,
    overflow: "hidden",
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  map: { flex: 1 },
  childMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  childMarkerInner: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    borderWidth: 2,
    borderColor: "#fff",
  },
  markerTriangle: {
    position: "absolute",
    bottom: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  floatingLabel: {
    position: "absolute",
    top: 20,
    right: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  labelDot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    marginRight: 8 
  },
  labelText: { 
    fontSize: 15, 
    fontWeight: "700" 
  },

  infoCard: { 
    marginHorizontal: 20, 
    marginTop: 16, 
    padding: 18, 
    borderRadius: 20, 
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  distanceRow: { flexDirection: "row", alignItems: "center" },
  distanceText: { marginLeft: 16, flex: 1 },
  distanceMain: { fontSize: 20, fontWeight: "700" },
  distanceSub: { fontSize: 14, marginTop: 4 },

  safetyCard: { 
    marginHorizontal: 20, 
    marginTop: 12, 
    padding: 18, 
    borderRadius: 20, 
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  safetyRow: { flexDirection: "row" },
  shieldIcon: { 
    width: 56, 
    height: 56, 
    borderRadius: 16, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  safetyInfo: { marginLeft: 16, flex: 1 },
  safetyTitle: { fontSize: 18, fontWeight: "700" },
  safetyDetail: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  detailText: { fontSize: 14, marginLeft: 8 },

  actionsCard: { 
    marginHorizontal: 20, 
    marginTop: 12, 
    padding: 20, 
    borderRadius: 20, 
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  actionsTitle: { fontSize: 18, fontWeight: "700", marginBottom: 16 },
  actionButtonsRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 16 
  },
  actionBtn: { 
    flex: 1, 
    alignItems: "center", 
    paddingVertical: 14, 
    borderRadius: 16, 
    borderWidth: 1.5, 
    marginHorizontal: 6 
  },
  actionBtnText: { marginTop: 8, fontSize: 14, fontWeight: "600" },
  activeStatus: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingTop: 16, 
    borderTopWidth: 1 
  },
  statusDot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: "#4CAF50", 
    marginRight: 10 
  },
  statusText: { fontSize: 14, fontWeight: "500" },

  bottomButtons: { 
    flexDirection: "row", 
    marginHorizontal: 20, 
    marginTop: 20, 
    gap: 12 
  },
  navigateBtn: { 
    flex: 1, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    paddingVertical: 18, 
    borderRadius: 16, 
    elevation: 6,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
  },
  navigateText: { 
    color: "#fff", 
    fontSize: 17, 
    fontWeight: "700", 
    marginLeft: 10 
  },
  historyBtn: { 
    flex: 1, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    paddingVertical: 18, 
    borderRadius: 16, 
    borderWidth: 2, 
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  historyText: { 
    fontSize: 17, 
    fontWeight: "700", 
    marginLeft: 10 
  },

  loadingText: { 
    fontSize: 16, 
    marginTop: 16, 
    fontWeight: "500" 
  },
});