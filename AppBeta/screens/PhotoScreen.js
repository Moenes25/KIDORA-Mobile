import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export default function PhotoScreen({
  visible,
  onClose,
  photo,
  details,
  photos = [],
  currentIndex = 0,
  onIndexChange,
}) {
  const [showInfo, setShowInfo] = useState(false);
  const [localIndex, setLocalIndex] = useState(currentIndex);
  const [downloading, setDownloading] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Update local index when props change
  useEffect(() => {
    setLocalIndex(currentIndex);
  }, [currentIndex]);

  // Toggle info panel
  const toggleInfo = () => {
    if (showInfo) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setShowInfo(false));
    } else {
      setShowInfo(true);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  // Navigation
  const navigatePhoto = (direction) => {
    let newIndex = localIndex;

    if (direction === "prev" && localIndex > 0) {
      newIndex = localIndex - 1;
    } else if (direction === "next" && localIndex < photos.length - 1) {
      newIndex = localIndex + 1;
    } else {
      return;
    }

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setLocalIndex(newIndex);
      if (onIndexChange) onIndexChange(newIndex);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  // DOWNLOAD FUNCTION
  const downloadImage = async () => {
    try {
      setDownloading(true);

      // Ask for permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission denied! Cannot save image.");
        setDownloading(false);
        return;
      }

      const currentPhoto = photos.length > 0 ? photos[localIndex] : photo;

      // If the image is local (require()), we must convert it
      const assetUri =
        typeof currentPhoto === "number"
          ? Image.resolveAssetSource(currentPhoto).uri
          : currentPhoto.uri || currentPhoto;

      // Download to temp folder
      const fileUri = FileSystem.documentDirectory + "downloaded.jpg";

      await FileSystem.downloadAsync(assetUri, fileUri);

      // Save to gallery
      await MediaLibrary.saveToLibraryAsync(fileUri);

      alert("Photo saved to your gallery!");
    } catch (error) {
      alert("Error saving photo!");
      console.log("Download error:", error);
    }

    setDownloading(false);
  };

  const PANEL_HEIGHT = 150;
  const slideUp = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-PANEL_HEIGHT, 0],
  });

  const currentPhoto = photos.length > 0 ? photos[localIndex] : photo;
  const hasPrev = localIndex > 0;
  const hasNext = localIndex < photos.length - 1;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        {/* FULL IMAGE */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <Image source={currentPhoto} style={styles.photo} resizeMode="contain" />
        </Animated.View>

        {/* CLOSE BUTTON */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Feather name="x" size={30} color="#fff" />
        </TouchableOpacity>

        {/* LEFT ARROW */}
        {hasPrev && (
          <TouchableOpacity
            style={[styles.arrowBtn, styles.leftArrow]}
            onPress={() => navigatePhoto("prev")}
          >
            <Feather name="chevron-left" size={32} color="#fff" />
          </TouchableOpacity>
        )}

        {/* RIGHT ARROW */}
        {hasNext && (
          <TouchableOpacity
            style={[styles.arrowBtn, styles.rightArrow]}
            onPress={() => navigatePhoto("next")}
          >
            <Feather name="chevron-right" size={32} color="#fff" />
          </TouchableOpacity>
        )}

        {/* PHOTO COUNTER */}
        {photos.length > 1 && (
          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>
              {localIndex + 1} / {photos.length}
            </Text>
          </View>
        )}

        {/* BOTTOM BUTTONS */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.bottomBtn} onPress={toggleInfo}>
            <Feather name="info" size={24} color="#fff" />
          </TouchableOpacity>

          {/* DOWNLOAD BUTTON */}
          <TouchableOpacity style={styles.bottomBtn} onPress={downloadImage}>
            {downloading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Feather name="download" size={24} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {/* INFO SLIDE PANEL */}
        {showInfo && (
          <Animated.View style={[styles.infoPanel, { bottom: slideUp }]}>
            <Text style={styles.infoText}>Name: {details.name}</Text>
            <Text style={styles.infoText}>Date: {details.date}</Text>
            <Text style={styles.infoText}>Time: {details.time}</Text>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  closeBtn: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 10,
    borderRadius: 30,
  },
  arrowBtn: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 12,
    borderRadius: 30,
  },
  leftArrow: {
    left: 20,
    top: "50%",
    marginTop: -25,
  },
  rightArrow: {
    right: 20,
    top: "50%",
    marginTop: -25,
  },
  counterContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  counterText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  bottomButtons: {
    position: "absolute",
    bottom: 170,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 25,
  },
  bottomBtn: {
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 14,
    borderRadius: 35,
  },
  infoPanel: {
    position: "absolute",
    left: 0,
    width: "100%",
    height: 150,
    backgroundColor: "rgba(0,0,0,0.55)",
    padding: 20,
    justifyContent: "center",
  },
  infoText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 6,
  },
});
