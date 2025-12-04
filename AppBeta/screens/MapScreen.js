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

  // ─── Parent Location ───
  useEffect(() => {
    const init = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required")
        setLoading(false)
        return
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
      setParentLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude })
      setLoading(false)

      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
        (l) => setParentLocation({ latitude: l.coords.latitude, longitude: l.coords.longitude })
      )
    }
    init()
  }, [])

  // ─── Supabase Realtime Child Location ───
  useEffect(() => {
    if (!childId) return

    const fetchInitial = async () => {
      const { data } = await supabase
        .from("child_locations")
        .select("*")
        .eq("child_id", childId)
        .order("timestamp", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (data) {
        setChildLocation({ latitude: data.latitude, longitude: data.longitude })
        setChildBattery(data.battery_level)
        setLastUpdated(new Date(data.timestamp).toLocaleTimeString())
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

    return () => subscription.unsubscribe()
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
      console.error(e)
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
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header with safe area */}
      <View style={styles.safeHeader}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={26} color="#6F42C1" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Tracking {childName}</Text>

          <View style={{ width: 44 }} />
        </View>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_DEFAULT}
          style={styles.map}
          showsUserLocation={true}               // Real Google blue dot
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
              <Text style={styles.labelText}>{childName}</Text>
            </View>
          )}
        </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.timeCard}>
          <Text style={styles.timeNumber}>
            {distance ? `${distance} km away` : "Calculating..."}
          </Text>
          <Text style={styles.timeSubtitle}>
            {duration ? `About ${duration} minutes travel time` : "Getting route..."}
          </Text>
        </View>

        <View style={styles.pricingCard}>
          <View style={styles.priceRow}>
            <View style={[styles.priceIcon, { backgroundColor: "#E8F5E9" }]}>
              <Feather name="shield" size={20} color="#4CAF50" />
            </View>
            <View style={styles.priceContent}>
              <Text style={styles.priceTitle}>{childName} is safe</Text>
              <Text style={styles.priceSubtext}>Last updated: {lastUpdated || "Just now"}</Text>
              <Text style={styles.priceSubtext}>
                Battery: {childBattery !== null ? `${childBattery}%` : "Unknown"}
              </Text>
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
              <Feather name="phone" size={16} color="#6F42C1" />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="message-circle" size={16} color="#6F42C1" />
              <Text style={styles.actionButtonText}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Feather name="bell" size={16} color="#6F42C1" />
              <Text style={styles.actionButtonText}>Alert</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.checkboxRow}>
            <Feather name="check" size={16} color="#4CAF50" />
            <Text style={styles.checkboxText}>Location sharing active</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.shareButton}>
            <Feather name="compass" size={20} color="#6F42C1" />
            <Text style={styles.shareText}>Navigate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentButton}>
            <Feather name="clock" size={18} color="#6F42C1" />
            <Text style={styles.shareText}>History</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fbf7ff" },
  safeHeader: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 50,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
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
    marginRight: 44,
  },
  mapContainer: { width: "100%", height: 320, marginBottom: 16, position: "relative" },
  map: { flex: 1 },
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
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  childLocationLabel: { top: 50, right: 20 },
  labelText: { fontSize: 14, fontWeight: "700", color: "#000" },
  scrollContent: { paddingBottom: 40 },
  timeCard: { marginHorizontal: 16, marginBottom: 12, padding: 16, backgroundColor: "#fff", borderRadius: 16, elevation: 3 },
  timeNumber: { fontSize: 22, fontWeight: "700", color: "#000" },
  timeSubtitle: { fontSize: 14, color: "#999", marginTop: 4 },
  pricingCard: { marginHorizontal: 16, marginBottom: 12, padding: 16, backgroundColor: "#fff", borderRadius: 16, elevation: 3 },
  priceRow: { flexDirection: "row", alignItems: "flex-start" },
  priceIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: "#f5f5f5", justifyContent: "center", alignItems: "center", marginRight: 12 },
  priceContent: { flex: 1 },
  priceTitle: { fontSize: 15, fontWeight: "600", color: "#000" },
  priceSubtext: { fontSize: 12.5, color: "#888", marginTop: 3 },
  tipCard: { marginHorizontal: 16, marginBottom: 16, padding: 16, backgroundColor: "#fff", borderRadius: 16, elevation: 3 },
  tipHeader: { marginBottom: 14 },
  tipTitle: { fontSize: 16, fontWeight: "700", color: "#000" },
  tipSubtitle: { fontSize: 12.5, color: "#999", marginTop: 2 },
  tipOptions: { flexDirection: "row", gap: 10, marginBottom: 14 },
  actionButton: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 22, backgroundColor: "#f8f8f8", borderWidth: 1, borderColor: "#eee", gap: 8 },
  actionButtonText: { fontSize: 13, fontWeight: "600", color: "#333" },
  checkboxRow: { flexDirection: "row", alignItems: "center", paddingTop: 12, borderTopWidth: 1, borderTopColor: "#f0f0f0" },
  checkboxText: { fontSize: 13, color: "#666", marginLeft: 8 },
  actionButtons: { flexDirection: "row", marginHorizontal: 16, gap: 12, marginBottom: 20 },
  shareButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, backgroundColor: "#fff", borderRadius: 16, gap: 10, elevation: 4 },
  paymentButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, backgroundColor: "#fff", borderRadius: 16, gap: 10, elevation: 4 },
  shareText: { fontSize: 15.5, fontWeight: "600", color: "#6F42C1" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fbf7ff" },
  loadingText: { fontSize: 16, color: "#666" },
})