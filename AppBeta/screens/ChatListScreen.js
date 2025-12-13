import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Image, Dimensions, StatusBar, Platform, Modal, Animated, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Avatar from '../components/Avatar';
import { CONVERSATIONS, USERS, STORIES } from '../data/mockData';
import { Feather } from '@expo/vector-icons';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../components/BottomNav';
import SideBar from '../components/Sidebar';
import TopBar from '../components/TopBar';

// ✅ IMPORTS FOR NOTIFICATION
import { useNotifications } from "../context/NotificationContext"; 
import NotificationPanel from "../components/NotificationPanel";

const { width, height } = Dimensions.get('window');

// ... (StoryBubble and ConversationItem components remain unchanged) ...
const StoryBubble = ({ story, onPress }) => {
  if (!story.user) return null;
  return (
    <TouchableOpacity onPress={() => onPress(story)}>
      <View style={{ alignItems: 'center', marginRight: 12 }}>
        <View style={styles.storyBorder}>
          <Avatar uri={story.user.avatar} size={50} name={story.user.name} />
        </View>
        <Text style={styles.storyName}>{story.user.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const ConversationItem = ({ user, lastMessage, onPress, onVideoCall, onAudioCall }) => {
  return (
    <TouchableOpacity style={styles.conversationItem} onPress={() => onPress(user)}>
      <Avatar uri={user.avatar} size={56} name={user.name} />
      <View style={styles.conversationInfo}>
        <Text style={styles.conversationName}>{user.name}</Text>
        <Text style={styles.conversationMessage} numberOfLines={1}>
          {lastMessage}
        </Text>
      </View>
      <View style={styles.conversationMeta}>
        <Text style={styles.conversationTime}>2m ago</Text>
        <View style={styles.callIcons}>
          <TouchableOpacity 
            style={styles.callIconButton}
            onPress={(e) => {
              e.stopPropagation();
              onVideoCall(user);
            }}
          >
            <Feather name="video" size={18} color="#6f42c1" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.callIconButton}
            onPress={(e) => {
              e.stopPropagation();
              onAudioCall(user);
            }}
          >
            <Feather name="phone" size={18} color="#6f42c1" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ChatListScreen({ navigation, route }) {
  const { colors } = useTheme();
  
  // ✅ 1. SETUP NOTIFICATION LOGIC
  const { unreadCount } = useNotifications();
  const [notificationPanelVisible, setNotificationPanelVisible] = useState(false);
  const toggleNotificationPanel = () => setNotificationPanelVisible(!notificationPanelVisible);

  const [sidebarVisible, setSidebarVisible] = useState(false);

  // Story state
  const [storyVisible, setStoryVisible] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [progress] = useState(STORIES.map(() => new Animated.Value(0)));

  const user = route.params?.user;
  const username = user?.name || "User";
  const email = user?.email || "";

  // Mock conversations list
  const conversations = Object.keys(USERS).map(key => ({
    user: USERS[key],
    lastMessage: CONVERSATIONS[key]?.[CONVERSATIONS[key].length - 1]?.text || "Start chatting..."
  }));

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          await AsyncStorage.removeItem("user");
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  };

  const openConversation = (selectedUser) => {
    navigation.navigate('Conversation', { user: selectedUser });
  };

  const handleVideoCall = (selectedUser) => {
    navigation.navigate('VideoCall', { user: selectedUser });
  };

  const handleAudioCall = (selectedUser) => {
    navigation.navigate('Call', { user: selectedUser });
  };

  // Story functions
  const openStory = (story) => {
    const index = STORIES.findIndex(s => s.id === story.id);
    setActiveStoryIndex(index);
    setStoryVisible(true);
  };
  
  const closeStory = () => { 
    setStoryVisible(false); 
    progress.forEach(p => p.setValue(0)); 
  };
  
  const nextStory = () => { 
    if (activeStoryIndex < STORIES.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      closeStory();
    }
  };
  
  const prevStory = () => { 
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    }
  };

  // Story progress animation
  useEffect(() => {
    if (!storyVisible) return;
    progress[activeStoryIndex].setValue(0);
    Animated.timing(progress[activeStoryIndex], { 
      toValue: 1, 
      duration: 5000, 
      useNativeDriver: false 
    }).start(({ finished }) => { 
      if (finished) nextStory(); 
    });
  }, [storyVisible, activeStoryIndex]);

  // Video player for current story
  const currentStory = STORIES[activeStoryIndex];
  const videoPlayer = currentStory?.type === 'video' 
    ? useVideoPlayer(currentStory.uri, player => {
        player.loop = true;
        player.play();
      })
    : null;

  const TOP_SECTION_HEIGHT = height * 0.45;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6F42C1" />
      
      <SideBar 
        visible={sidebarVisible} 
        onClose={toggleSidebar} 
        username={username} 
        email={email} 
        navigation={navigation} 
        onLogout={handleLogout} 
      />

      {/* ✅ 2. ADD NOTIFICATION PANEL */}
      <NotificationPanel 
        visible={notificationPanelVisible}
        onClose={toggleNotificationPanel}
      />

      {/* FIXED TOP SECTION */}
      <View style={[styles.fixedTopSection, { height: TOP_SECTION_HEIGHT }]}>
        <LinearGradient colors={colors.headerGradient} style={StyleSheet.absoluteFill}>
          <View style={styles.safeArea} />
          
          {/* ✅ 3. CONNECT TOPBAR TO REAL DATA */}
          <TopBar 
            onMenuPress={toggleSidebar}
            onNotificationPress={toggleNotificationPanel}
            notificationCount={unreadCount}   
          />

          <View style={styles.fixedTopContent}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Messages</Text>
              <Image source={require("../assets/famGif.gif")} style={styles.gif} resizeMode="contain" />
            </View>

            {/* Stories Section */}
            <View style={styles.storiesCard}>
              <Text style={styles.storiesTitle}>Stories</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={{ paddingVertical: 8 }}
              >
                {STORIES.map(story => (
                  <StoryBubble key={story.id} story={story} onPress={openStory} />
                ))}
              </ScrollView>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* WHITE BOTTOM SECTION - Conversations List */}
      <View style={[styles.scrollableBottomSection, { top: TOP_SECTION_HEIGHT }]}>
        <ScrollView contentContainerStyle={styles.bottomScroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.conversationsTitle}>Recent Chats</Text>
          
          {conversations.map((conv) => (
            <ConversationItem
              key={conv.user.id}
              user={conv.user}
              lastMessage={conv.lastMessage}
              onPress={openConversation}
              onVideoCall={handleVideoCall}
              onAudioCall={handleAudioCall}
            />
          ))}

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      <View style={styles.bottomNavContainer}>
        <BottomNav navigation={navigation} activeScreen="chat" />
      </View>

      {/* Story Modal */}
      <Modal visible={storyVisible} transparent={false} animationType="slide">
        <View style={styles.storyModal}>
          <TouchableOpacity 
            style={styles.closeStoryButton} 
            onPress={closeStory}
          >
            <Feather name="x" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tapZone, { left: 0 }]} 
            onPress={prevStory} 
          />
          <TouchableOpacity 
            style={[styles.tapZone, { right: 0 }]} 
            onPress={nextStory} 
          />

          <View style={styles.progressContainer}>
            {STORIES.map((s, i) => (
              <View key={s.id} style={styles.progressBarBg}>
                <Animated.View 
                  style={[styles.progressBarFill, { flex: progress[i] }]} 
                />
              </View>
            ))}
          </View>

          {currentStory?.type === 'image' ? (
            <Image 
              source={{ uri: currentStory.uri }} 
              style={styles.storyImage} 
            />
          ) : currentStory?.type === 'video' && videoPlayer ? (
            <VideoView
              style={styles.storyVideo}
              player={videoPlayer}
              contentFit="cover"
            />
          ) : null}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  fixedTopSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: "hidden",
    borderBottomEndRadius: 38,
    borderBottomStartRadius: 38,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  safeArea: { height: Platform.OS === "ios" ? 44 : StatusBar.currentHeight },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: 12,
    marginBottom: 20,
  },
  headerTitle: { fontSize: 28, fontWeight: "700", color: "#ffffff" },
  gif: { width: 80, height: 80 },
  storiesCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 16,
    padding: 12,
  },
  storiesTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
  },
  storyBorder: {
    padding: 3,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  storyName: { 
    fontSize: 11, 
    marginTop: 6,
    fontWeight: '600',
    color: '#ffffff',
  },
  scrollableBottomSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomScroll: { paddingHorizontal: 16, paddingTop: 32, paddingBottom: 100 },
  bottomNavContainer: { 
    position: "absolute", 
    bottom: 0, 
    left: 0, 
    right: 0, 
    zIndex: 10, 
    backgroundColor: "#ffffff" 
  },
  conversationsTitle: { 
    fontSize: 20, 
    fontWeight: "700", 
    marginBottom: 16, 
    color: "#1a1a2e" 
  },
  fixedTopContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
    justifyContent: 'flex-end',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  conversationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 4,
  },
  conversationMessage: {
    fontSize: 14,
    color: '#666',
  },
  conversationMeta: {
    alignItems: 'flex-end',
  },
  conversationTime: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  callIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  callIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(111, 66, 193, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyModal: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeStoryButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 2,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tapZone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: width / 2,
  },
  progressContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBarBg: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 3,
    backgroundColor: '#ffffff',
  },
  storyImage: {
    width,
    height: '100%',
    resizeMode: 'cover',
  },
  storyVideo: {
    width,
    height: '100%',
  },
});