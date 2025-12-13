import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  SafeAreaView,
  Animated,
  TouchableWithoutFeedback
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { GestureHandlerRootView, Swipeable } from "react-native-gesture-handler";
import { useNotifications } from "../context/NotificationContext";

const { width } = Dimensions.get("window");

export default function NotificationPanel({ visible, onClose }) {
  const { notifications, toggleReadStatus, clearAllNotifications, removeNotification } = useNotifications();
  
  // State for Custom Options Modal
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // 1. OPEN CUSTOM MENU
  const handleOptionPress = (item) => {
    setSelectedItem(item);
    setOptionsVisible(true);
  };

  // 2. ACTIONS
  const handleMarkAs = () => {
    if (selectedItem) {
      toggleReadStatus(selectedItem.request.identifier);
      setOptionsVisible(false);
      setSelectedItem(null);
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      removeNotification(selectedItem.request.identifier);
      setOptionsVisible(false);
      setSelectedItem(null);
    }
  };

  // 3. SWIPE RENDERER
  const renderRightActions = (progress, dragX, itemId) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity 
        onPress={() => removeNotification(itemId)}
        style={styles.deleteSwipeButton}
      >
        <Animated.View style={{ transform: [{ scale }], alignItems: 'center' }}>
          <Feather name="trash-2" size={24} color="#fff" />
          <Text style={styles.deleteSwipeText}>Delete</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaView style={styles.container}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <View style={styles.headerIcons}>
              {notifications.length > 0 && (
                <TouchableOpacity onPress={clearAllNotifications} style={styles.iconButton}>
                  <Feather name="trash-2" size={22} color="#6F42C1" />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onClose} style={styles.iconButton}>
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Recent</Text>

          <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconCircle}>
                   <Feather name="bell-off" size={32} color="#6F42C1" />
                </View>
                <Text style={styles.emptyText}>No notifications yet</Text>
              </View>
            ) : (
              notifications.map((item) => {
                const key = item.request.identifier;
                const isRead = item.read;

                return (
                  <Swipeable
                    key={key}
                    renderRightActions={(progress, dragX) => 
                      renderRightActions(progress, dragX, key)
                    }
                    onSwipeableRightOpen={() => removeNotification(key)}
                  >
                    <TouchableOpacity
                      style={[styles.notificationItem, !isRead && styles.unreadItem]}
                      onPress={() => {
                         if(!isRead) toggleReadStatus(key);
                      }}
                      activeOpacity={0.9}
                    >
                      {/* Avatar Side */}
                      <View style={styles.avatarContainer}>
                        <View style={[styles.avatarCircle, !isRead && styles.unreadAvatarCircle]}>
                          <Feather name="bell" size={20} color={isRead ? "#999" : "#fff"} />
                        </View>
                        {!isRead && (
                            <View style={styles.purpleDot} />
                        )}
                      </View>

                      {/* Content Side */}
                      <View style={styles.textContainer}>
                        <Text style={styles.contentText}>
                          <Text style={[styles.titleText, !isRead && styles.unreadTitleText]}>
                            {item.request.content.title}
                          </Text>
                          {"\n"}
                          <Text style={styles.bodyText}>
                            {item.request.content.body}
                          </Text>
                        </Text>
                        <Text style={styles.timeText}>Just now</Text>
                      </View>

                      {/* 3 Dots Menu */}
                      <TouchableOpacity 
                        style={styles.menuContainer} 
                        onPress={() => handleOptionPress(item)}
                      >
                        <Feather name="more-horizontal" size={20} color={isRead ? "#ccc" : "#6F42C1"} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </Swipeable>
                );
              })
            )}
          </ScrollView>

          {/* ================================================= */}
          {/* ✅ CENTERED POPUP MODAL */}
          {/* ================================================= */}
          <Modal
            transparent={true}
            visible={optionsVisible}
            animationType="fade"
            onRequestClose={() => setOptionsVisible(false)}
          >
            <TouchableOpacity 
              style={styles.modalOverlay} 
              activeOpacity={1} 
              onPress={() => setOptionsVisible(false)}
            >
              <TouchableWithoutFeedback>
                {/* Changed style from bottomSheet to centeredPopup */}
                <View style={styles.centeredPopup}>
                  <Text style={styles.popupTitle}>Manage Notification</Text>
                  
                  <TouchableOpacity style={styles.sheetOption} onPress={handleMarkAs}>
                    <View style={[styles.sheetIconCircle, { backgroundColor: '#F4EEFF' }]}>
                        <Feather name={selectedItem?.read ? "eye-off" : "check-circle"} size={20} color="#6F42C1" />
                    </View>
                    <Text style={styles.sheetOptionText}>
                        {selectedItem?.read ? "Mark as Unread" : "Mark as Read"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.sheetOption} onPress={handleDelete}>
                     <View style={[styles.sheetIconCircle, { backgroundColor: '#FFE5E5' }]}>
                        <Feather name="trash-2" size={20} color="#FF3B30" />
                     </View>
                    <Text style={[styles.sheetOptionText, { color: "#FF3B30" }]}>Delete Notification</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.cancelButton} onPress={() => setOptionsVisible(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </Modal>

        </SafeAreaView>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#1a1a2e" },
  headerIcons: { flexDirection: "row", gap: 12 },
  iconButton: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#F8F9FA",
    justifyContent: "center", alignItems: "center",
  },

  sectionTitle: { 
    fontSize: 14, fontWeight: "700", color: "#999", 
    marginLeft: 20, marginTop: 20, marginBottom: 10, 
    textTransform: 'uppercase', letterSpacing: 1
  },
  listContent: { paddingBottom: 50 },

  // Empty State
  emptyState: { alignItems: "center", justifyContent: "center", marginTop: 100 },
  emptyIconCircle: {
      width: 70, height: 70, borderRadius: 35, backgroundColor: "#F4EEFF",
      justifyContent: 'center', alignItems: 'center', marginBottom: 16
  },
  emptyText: { color: "#999", fontSize: 16, fontWeight: '500' },

  // Notification Item Styles
  notificationItem: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#f9f9f9",
  },
  unreadItem: { backgroundColor: "#FBF7FF" },

  // Avatar
  avatarContainer: { position: "relative", marginRight: 16 },
  avatarCircle: { 
      width: 48, height: 48, borderRadius: 24, 
      backgroundColor: "#f0f0f0", 
      justifyContent: "center", alignItems: "center" 
  },
  unreadAvatarCircle: { backgroundColor: "#6F42C1" },
  purpleDot: {
      position: 'absolute', top: 0, right: 0, 
      width: 12, height: 12, borderRadius: 6, 
      backgroundColor: "#FFD700", 
      borderWidth: 2, borderColor: '#fff'
  },

  // Text Logic
  textContainer: { flex: 1, justifyContent: "center" },
  contentText: { fontSize: 14, lineHeight: 20 },
  titleText: { fontWeight: "600", color: "#444" },
  unreadTitleText: { fontWeight: "700", color: "#000" },
  bodyText: { color: "#666" },
  timeText: { fontSize: 11, color: "#aaa", marginTop: 4 },

  menuContainer: { justifyContent: "center", paddingLeft: 10 },

  // Swipe Actions
  deleteSwipeButton: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteSwipeText: { color: 'white', fontWeight: '600', fontSize: 12, marginTop: 4 },

  // ✅ CENTERED POPUP STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)", // Darker background for focus
    justifyContent: "center", // ✅ Center Vertically
    alignItems: "center",     // ✅ Center Horizontally
  },
  centeredPopup: {
    width: "85%", // Not full width
    backgroundColor: "white",
    borderRadius: 20, // Rounded on all corners
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  popupTitle: {
      fontSize: 18, fontWeight: '700', color: '#1a1a2e', marginBottom: 20, textAlign: 'center'
  },
  sheetOption: {
      flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f5f5f5'
  },
  sheetIconCircle: {
      width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16
  },
  sheetOptionText: {
      fontSize: 16, fontWeight: '500', color: '#333'
  },
  cancelButton: {
      marginTop: 20, paddingVertical: 12, borderRadius: 12, backgroundColor: '#f5f5f5', alignItems: 'center'
  },
  cancelButtonText: {
      fontSize: 16, fontWeight: '700', color: '#666'
  }
});