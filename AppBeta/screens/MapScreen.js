"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
  
} from "react-native"
import { Feather } from "@expo/vector-icons"
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps"
import * as Location from "expo-location"
import polyline from "@mapbox/polyline"
import { supabase } from "../utils/supabase.js"
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MapScreen({ navigation, route }) {
  const mapRef = useRef(null)

  const [parentLocation, setParentLocation] = useState(null)
  const [childLocation, setChildLocation] = useState(null)
  const [childBattery, setChildBattery] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [routeCoordinates, setRouteCoordinates] = useState([])
  const [distance, setDistance] = useState(null)
  const [duration, setDuration] = useState(null)
  const [loading, setLoading] = useState(true)

  // Safe child name – prevents the Text error
  const childName = route?.params?.childName
    ? String(route.params.childName).trim()
    : "My Child"

  const childId = route?.params?.childId || "child_1"

  // ─── Parent Location with better error handling ───
  useEffect(() => {
    const init = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync()
        if (status !== "granted") {
          Alert.alert("Permission denied", "Location permission is required")
          setLoading(false)
          return
        }

        const loc = await Location.getCurrentPositionAsync({ 
          accuracy: Location.Accuracy.High,
          timeout: 10000,
          maximumAge: 1000,
        })
        setParentLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude })
        setLoading(false)

        Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
          (l) => setParentLocation({ latitude: l.coords.latitude, longitude: l.coords.longitude })
        )
      } catch (error) {
        console.error("Location error:", error)
        Alert.alert("Location Error", "Could not get your location. Please check your device settings.")
        setLoading(false)
      }
    }
    init()
  }, [])

  // ─── Supabase Realtime Child Location with error handling ───
  useEffect(() => {
    if (!childId) return

    const fetchInitial = async () => {
      try {
        const { data, error } = await supabase
          .from("child_locations")
          .select("*")
          .eq("child_id", childId)
          .order("timestamp", { ascending: false })
          .limit(1)
          .maybeSingle()

        if (error) {
          console.error("Supabase error:", error)
          return
        }

        if (data) {
          setChildLocation({ latitude: data.latitude, longitude: data.longitude })
          setChildBattery(data.battery_level)
          setLastUpdated(new Date(data.timestamp).toLocaleTimeString())
        }
      } catch (error) {
        console.error("Fetch error:", error)
      }
    }
    fetchInitial()

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
          const n = payload.new
          setChildLocation({ latitude: n.latitude, longitude: n.longitude })
          setChildBattery(n.battery_level)
          setLastUpdated(new Date(n.timestamp).toLocaleTimeString())
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [childId])

  // ─── Route Calculation ───
  useEffect(() => {
    if (parentLocation && childLocation) fetchRoute()
  }, [parentLocation, childLocation])

  const fetchRoute = async () => {
    if (!parentLocation || !childLocation) return

    try {
      const url = `http://router.project-osrm.org/route/v1/driving/${parentLocation.longitude},${parentLocation.latitude};${childLocation.longitude},${childLocation.latitude}?overview=full&geometries=polyline`
      const res = await fetch(url)
      const json = await res.json()

      if (json.routes?.length) {
        const points = polyline.decode(json.routes[0].geometry)
        const coords = points.map((p) => ({ latitude: p[0], longitude: p[1] }))
        setRouteCoordinates(coords)
        setDistance((json.routes[0].distance / 1000).toFixed(1))
        setDuration(Math.ceil(json.routes[0].duration / 60))

        mapRef.current?.fitToCoordinates(coords, {
          edgePadding: { top: 100, right: 80, bottom: 400, left: 80 },
          animated: true,
        })
      }
    } catch (e) {
      console.error("Route error:", e)
      const dist = calculateDistance(
        parentLocation.latitude,
        parentLocation.longitude,
        childLocation.latitude,
        childLocation.longitude
      )
      setDistance(dist.toFixed(1))
      setDuration(Math.ceil(dist * 2))
      setRouteCoordinates([parentLocation, childLocation])
    }
  }

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  if (loading || !parentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Feather name="map-pin" size={48} color="#6F42C1" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header with safe area */}
      <SafeAreaView style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={26} color="#6F42C1" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Tracking {childName}</Text>

          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>

      {/* Map Container with gradient background */}
      <View style={styles.mapWrapper}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
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
          {/* Child marker */}
          {childLocation && (
            <Marker coordinate={childLocation} title={`${childName}'s Location`}>
              <View style={styles.childMarker}>
                <View style={styles.childMarkerInner} />
                <View style={styles.markerTriangle} />
              </View>
            </Marker>
          )}

          {/* Route */}
          {routeCoordinates.length > 0 && (
            <Polyline coordinates={routeCoordinates} strokeColor="#6F42C1" strokeWidth={4} />
          )}
        </MapView>

        {/* Child floating label */}
        {childLocation && (
          <View style={[styles.locationLabel, styles.childLocationLabel]}>
            <View style={styles.labelDot} />
            <Text style={styles.labelText}>{childName}</Text>
          </View>
        )}
      </View>

      {/* Content with curved top */}
      <View style={styles.contentContainer}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.timeCard}>
            <View style={styles.distanceHeader}>
              <Feather name="navigation" size={24} color="#6F42C1" />
              <View style={styles.distanceContent}>
                <Text style={styles.timeNumber}>
                  {distance ? `${distance} km away` : "Calculating..."}
                </Text>
                <Text style={styles.timeSubtitle}>
                  {duration ? `About ${duration} minutes travel time` : "Getting route..."}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.pricingCard}>
            <View style={styles.priceRow}>
              <View style={[styles.priceIcon, { backgroundColor: "#E8F5E9" }]}>
                <Feather name="shield" size={22} color="#4CAF50" />
              </View>
              <View style={styles.priceContent}>
                <Text style={styles.priceTitle}>{childName} is safe</Text>
                <View style={styles.infoRow}>
                  <Feather name="clock" size={14} color="#888" />
                  <Text style={styles.priceSubtext}>Updated: {lastUpdated || "Just now"}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Feather name="battery-charging" size={14} color="#888" />
                  <Text style={styles.priceSubtext}>
                    Battery: {childBattery !== null ? `${childBattery}%` : "Unknown"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Text style={styles.tipTitle}>Quick Actions</Text>
              <Text style={styles.tipSubtitle}>Tap to perform action</Text>
            </View>

            <View style={styles.tipOptions}>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="phone" size={18} color="#6F42C1" />
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="message-circle" size={18} color="#6F42C1" />
                <Text style={styles.actionButtonText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Feather name="bell" size={18} color="#6F42C1" />
                <Text style={styles.actionButtonText}>Alert</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.checkboxRow}>
              <View style={styles.statusIndicator}>
                <View style={styles.statusDot} />
              </View>
              <Text style={styles.checkboxText}>Location sharing active</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.shareButton}>
              <Feather name="compass" size={20} color="#fff" />
              <Text style={styles.buttonText}>Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.paymentButton}>
              <Feather name="clock" size={20} color="#6F42C1" />
              <Text style={styles.shareText}>History</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 60 }} />
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#6F42C1" },
  safeHeader: {
    backgroundColor: "#ffffff",
  },
  header: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#6F42C1",
    flex: 1,
    textAlign: "center",
  },
  mapWrapper: { 
    width: "100%", 
    height: 340, 
    position: "relative",
    backgroundColor: "#fbf7ff",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  map: { 
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
  },
  childMarker: { alignItems: "center" },
  childMarkerInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E91E63",
    borderWidth: 4,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#E91E63",
    marginTop: -4,
  },
  locationLabel: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.98)",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  childLocationLabel: { top: 30, right: 30 },
  labelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E91E63",
    marginRight: 8,
  },
  labelText: { fontSize: 14, fontWeight: "700", color: "#2c2c2c" },
  
  contentContainer: {
    flex: 1,
    backgroundColor: "#fbf7ff",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -16,
    overflow: "hidden",
  },
  scrollContent: { paddingTop: 8 },
  
  timeCard: { 
    marginHorizontal: 20, 
    marginTop: 20,
    marginBottom: 12, 
    padding: 18, 
    backgroundColor: "#fff", 
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  distanceHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  distanceContent: {
    marginLeft: 12,
    flex: 1,
  },
  timeNumber: { fontSize: 20, fontWeight: "700", color: "#2c2c2c", marginBottom: 4 },
  timeSubtitle: { fontSize: 14, color: "#999" },
  
  pricingCard: { 
    marginHorizontal: 20, 
    marginBottom: 12, 
    padding: 18, 
    backgroundColor: "#fff", 
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  priceRow: { flexDirection: "row", alignItems: "flex-start" },
  priceIcon: { 
    width: 48, 
    height: 48, 
    borderRadius: 14, 
    justifyContent: "center", 
    alignItems: "center", 
    marginRight: 14 
  },
  priceContent: { flex: 1 },
  priceTitle: { fontSize: 17, fontWeight: "700", color: "#2c2c2c", marginBottom: 8 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  priceSubtext: { fontSize: 13, color: "#666", marginLeft: 6 },
  
  tipCard: { 
    marginHorizontal: 20, 
    marginBottom: 16, 
    padding: 18, 
    backgroundColor: "#fff", 
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  tipHeader: { marginBottom: 16 },
  tipTitle: { fontSize: 17, fontWeight: "700", color: "#2c2c2c", marginBottom: 4 },
  tipSubtitle: { fontSize: 13, color: "#999" },
  tipOptions: { flexDirection: "row", gap: 10, marginBottom: 16 },
  actionButton: { 
    flex: 1,
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12, 
    paddingHorizontal: 12, 
    borderRadius: 14, 
    backgroundColor: "#f8f5ff", 
    borderWidth: 1.5, 
    borderColor: "#e8e0ff", 
    gap: 6 
  },
  actionButtonText: { fontSize: 14, fontWeight: "600", color: "#6F42C1" },
  checkboxRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingTop: 16, 
    borderTopWidth: 1, 
    borderTopColor: "#f0f0f0" 
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
  },
  checkboxText: { fontSize: 14, color: "#666", fontWeight: "500" },
  
  actionButtons: { flexDirection: "row", marginHorizontal: 20, gap: 12, marginBottom: 20 },
  shareButton: { 
    flex: 1, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    paddingVertical: 16, 
    backgroundColor: "#6F42C1", 
    borderRadius: 16, 
    gap: 10,
    shadowColor: "#6F42C1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  paymentButton: { 
    flex: 1, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    paddingVertical: 16, 
    backgroundColor: "#fff", 
    borderRadius: 16, 
    gap: 10,
    borderWidth: 2,
    borderColor: "#6F42C1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  shareText: { fontSize: 16, fontWeight: "700", color: "#6F42C1" },
  
  loadingContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#fbf7ff" 
  },
  loadingText: { fontSize: 16, color: "#666", marginTop: 16, fontWeight: "500" },
})