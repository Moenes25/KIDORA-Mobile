import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import PhotoScreen from "./PhotoScreen";

export default function GalleryScreen({ navigation }) {
  const [visible, setVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoDetails, setPhotoDetails] = useState({});
  const [currentPhotos, setCurrentPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Example data
  const galleryData = [
    {
      month: "November 2023",
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
      month: "October 2023",
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
      {/* HEADER */}
      <LinearGradient colors={["#6F42C1", "#9b59b6"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="chevron-left" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Gallery</Text>

        <View style={{ width: 28 }} />
      </LinearGradient>

      {/* BODY */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {galleryData.map((monthBlock, index) => (
          <MonthCard
            key={index}
            monthBlock={monthBlock}
            openPhoto={openPhoto}
          />
        ))}
      </ScrollView>

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

function MonthCard({ monthBlock, openPhoto }) {
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <View style={styles.monthCard}>
      <Text style={styles.monthTitle}>{monthBlock.month}</Text>

      <Animated.FlatList
        data={monthBlock.photos}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ paddingVertical: 10 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        renderItem={({ item, index }) => {
          const inputRange = [(index - 1) * 130, index * 130, (index + 1) * 130];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.75, 1.35, 0.75],
            extrapolate: "clamp",
          });

          return (
            <TouchableOpacity onPress={() => openPhoto(item, monthBlock.photos, index)}>
              <Animated.View style={{ transform: [{ scale }], marginRight: 10 }}>
                <Image source={item} style={styles.photo} />
              </Animated.View>
            </TouchableOpacity>
          );
        }}
      />

      <Text style={styles.countText}>{monthBlock.photos.length} photos</Text>
    </View>
  );
}

/* ---------------------- STYLES ---------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbf7ff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 5,
  },

  backBtn: {
    paddingRight: 10,
    paddingVertical: 4,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },

  monthCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 18,
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },

  monthTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#4a2c82",
    marginBottom: 10,
  },

  photo: {
    width: 110,
    height: 110,
    borderRadius: 12,
  },

  countText: {
    marginTop: 10,
    fontSize: 13,
    color: "#777",
    textAlign: "right",
  },
});