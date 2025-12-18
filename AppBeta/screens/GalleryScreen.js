import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "../context/TranslationContext";
import { normalize, wp, hp, screenHeight } from "../utils/responsive";

import TopNavBar from "../components/TopNavBar";
import PhotoScreen from "./PhotoScreen";

const { width } = Dimensions.get("window");
const TOP_SECTION_HEIGHT = screenHeight * 0.20;
const PHOTO_SIZE = wp(30);
const PHOTO_SNAP_INTERVAL = PHOTO_SIZE + wp(4);

export default function GalleryScreen({ navigation }) {
  const { colors, theme } = useTheme();
  const { t, isRTL } = useTranslation();
  const isDark = theme === "dark";

  const [visible, setVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoDetails, setPhotoDetails] = useState({});
  const [currentPhotos, setCurrentPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Example data with translation keys
  const galleryData = [
    {
      monthKey: "november2023",
      photos: [
        require("../assets/gallery/butterfly.jpeg"),
        require("../assets/gallery/flower.jpeg"),
        require("../assets/gallery/leaf.jpeg"),
        require("../assets/gallery/cat.jpeg"),
        require("../assets/gallery/dog.jpeg"),
        require("../assets/gallery/field.jpeg"),
      ],
    },
    {
      monthKey: "october2023",
      photos: [
        require("../assets/gallery/lion.jpeg"),
        require("../assets/gallery/sunflower.jpeg"),
        require("../assets/gallery/tiger.jpeg"),
        require("../assets/gallery/lake.jpeg"),
        require("../assets/gallery/mountain.jpeg"),
        require("../assets/gallery/paysage.jpeg"),
        require("../assets/gallery/flowers.jpeg"),
      ],
    },
  ];

  // Auto-generate name from file path
  const getPhotoName = (path) => {
    const str = path.toString();
    const match = str.match(/\/([^\/]+)\.jpeg/);
    return match ? match[1] : "Photo";
  };

  const openPhoto = (photo, photosArray, index) => {
    setSelectedPhoto(photo);
    setCurrentPhotos(photosArray);
    setCurrentPhotoIndex(index);

    setPhotoDetails({
      name: getPhotoName(photo),
      date: "12/11/2023",
      time: "14:32",
    });

    setVisible(true);
  };

  const handleIndexChange = (newIndex) => {
    const newPhoto = currentPhotos[newIndex];
    setSelectedPhoto(newPhoto);
    setCurrentPhotoIndex(newIndex);
    
    setPhotoDetails({
      name: getPhotoName(newPhoto),
      date: "12/11/2023",
      time: "14:32",
    });
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
          <TopNavBar title={t('gallery')} navigation={navigation} />
        </LinearGradient>
      </View>

      {/* WHITE BOTTOM SECTION with rounded top */}
      <View style={[
        styles.whiteSection, 
        { 
          top: TOP_SECTION_HEIGHT,
        }
      ]}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {galleryData.map((monthBlock, index) => (
            <MonthCard
              key={index}
              monthBlock={monthBlock}
              openPhoto={openPhoto}
              index={index}
              isRTL={isRTL}
              t={t}
            />
          ))}
          
          {/* Bottom padding */}
          <View style={{ height: hp(5) }} />
        </ScrollView>
      </View>

      {/* PHOTO SCREEN MODAL */}
      <PhotoScreen
        visible={visible}
        photo={selectedPhoto}
        photos={currentPhotos}
        currentIndex={currentPhotoIndex}
        details={photoDetails}
        onClose={() => setVisible(false)}
        onIndexChange={handleIndexChange}
      />
    </View>
  );
}

/* ---------------------- MONTH CARD COMPONENT ---------------------- */

function MonthCard({ monthBlock, openPhoto, index, isRTL, t }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  
  // Alternate gradient colors for visual variety
  const gradients = [
    ["#e8d5ff", "#f0e5ff"],
    ["#d4edff", "#e6f7ff"],
    ["#ffd9a6", "#ffe9c7"],
    ["#ffc2d9", "#ffe0ed"],
  ];
  
  const currentGradient = gradients[index % gradients.length];

  return (
    <View style={styles.monthCardWrapper}>
      <LinearGradient 
        colors={currentGradient}
        style={styles.monthCard}
      >
        {/* Month Header */}
        <View style={[
          styles.monthHeader,
          isRTL && { flexDirection: 'row-reverse' }
        ]}>
          <View style={[
            styles.monthTitleContainer,
            isRTL && { flexDirection: 'row-reverse' }
          ]}>
            <View style={[
              styles.monthIconCircle,
              isRTL && { marginLeft: wp(3), marginRight: 0 }
            ]}>
              <Feather name="calendar" size={normalize(18)} color="#9b59b6" />
            </View>
            <Text style={[
              styles.monthTitle,
              isRTL && { textAlign: 'right' }
            ]}>
              {t(monthBlock.monthKey)}
            </Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>
              {monthBlock.photos.length} {monthBlock.photos.length === 1 ? t('photo') : t('photos')}
            </Text>
          </View>
        </View>

        {/* Photos Carousel */}
        <Animated.FlatList
          data={monthBlock.photos}
          horizontal
          inverted={isRTL}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={styles.photosContainer}
          snapToInterval={PHOTO_SNAP_INTERVAL}
          decelerationRate="fast"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
          renderItem={({ item, index: photoIndex }) => {
            const inputRange = [
              (photoIndex - 1) * PHOTO_SNAP_INTERVAL, 
              photoIndex * PHOTO_SNAP_INTERVAL, 
              (photoIndex + 1) * PHOTO_SNAP_INTERVAL
            ];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.8, 1.1, 0.8],
              extrapolate: "clamp",
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.6, 1, 0.6],
              extrapolate: "clamp",
            });

            return (
              <TouchableOpacity 
                onPress={() => openPhoto(item, monthBlock.photos, photoIndex)}
                activeOpacity={0.9}
              >
                <Animated.View 
                  style={[
                    styles.photoWrapper,
                    { 
                      transform: [{ scale }],
                      opacity,
                    },
                    isRTL && { marginLeft: wp(4), marginRight: 0 }
                  ]}
                >
                  <Image source={item} style={styles.photo} />
                  
                  {/* Photo overlay gradient */}
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.4)"]}
                    style={styles.photoOverlay}
                  >
                    <Feather name="maximize-2" size={normalize(16)} color="#fff" />
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            );
          }}
        />
      </LinearGradient>
    </View>
  );
}

/* ---------------------- STYLES ---------------------- */

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  topSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  safeArea: {
    height: Platform.OS === "ios" ? hp(5.5) : StatusBar.currentHeight,
  },

  whiteSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: normalize(38),
    borderTopRightRadius: normalize(38),
    overflow: "hidden",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -hp(0.6) },
    shadowOpacity: 0.15,
    shadowRadius: normalize(12),
    elevation: 12,
  },

  scrollContent: {
    paddingTop: hp(4),
    paddingBottom: hp(5),
  },

  monthCardWrapper: {
    marginHorizontal: wp(4),
    marginBottom: hp(3),
  },

  monthCard: {
    borderRadius: normalize(24),
    padding: wp(5),
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.08,
    shadowRadius: normalize(12),
  },

  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(2),
  },

  monthTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  monthIconCircle: {
    width: wp(9),
    height: wp(9),
    borderRadius: wp(4.5),
    backgroundColor: "rgba(155, 89, 182, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: wp(3),
  },

  monthTitle: {
    fontSize: normalize(18),
    fontWeight: "700",
    color: "#2d3436",
  },

  countBadge: {
    backgroundColor: "rgba(155, 89, 182, 0.15)",
    paddingHorizontal: wp(3),
    paddingVertical: hp(0.7),
    borderRadius: normalize(20),
  },

  countBadgeText: {
    color: "#9b59b6",
    fontSize: normalize(13),
    fontWeight: "700",
  },

  photosContainer: {
    paddingVertical: hp(2),
    paddingHorizontal: wp(2),
  },

  photoWrapper: {
    marginRight: wp(4),
    position: "relative",
  },

  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: normalize(16),
    borderWidth: normalize(3),
    borderColor: "#fff",
  },

  photoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: hp(5),
    borderBottomLeftRadius: normalize(16),
    borderBottomRightRadius: normalize(16),
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: wp(2),
  },
});