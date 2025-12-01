// import { View, StyleSheet } from "react-native";
// import MapView, { Marker } from "react-native-maps";
// import * as Location from "expo-location";
// import { useEffect, useState } from "react";

// export default function MapViewScreen() {
//   const [region, setRegion] = useState(null);

//   useEffect(() => {
//     (async () => {
//       let { granted } = await Location.requestForegroundPermissionsAsync();
//       if (!granted) return;

//       const location = await Location.getCurrentPositionAsync({});
//       setRegion({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         latitudeDelta: 0.01,
//         longitudeDelta: 0.01,
//       });
//     })();
//   }, []);

//   if (!region) return null;

//   return (
//     <MapView style={styles.map} region={region}>
//       <Marker coordinate={region} title="You Are Here" />
//     </MapView>
//   );
// }

// const styles = StyleSheet.create({
//   map: { flex: 1 }
// });
