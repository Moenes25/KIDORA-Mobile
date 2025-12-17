import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Image, Dimensions, StatusBar, Platform, Modal, Animated, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { VideoView, useVideoPlayer } from 'expo-video';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Avatar from '../components/Avatar';
import BottomNav from '../components/BottomNav';
import SideBar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import NotificationPanel from '../components/NotificationPanel';
import { CONVERSATIONS, USERS, STORIES } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';
import { useNotifications } from '../context/NotificationContext';

const { width, height } = Dimensions.get('window');

/* ---------------------------------- */
/* Components */
/* ---------------------------------- */

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

const ConversationItem = ({ user, lastMessage, onPress, onVideoCall, onAudioCall, isRTL }) => (
  <TouchableOpacity
    style={[styles.conversationItem, isRTL && { flexDirection: 'row-reverse' }]}
    onPress={() => onPress(user)}
  >
    <Avatar uri={user.avatar} size={56} name={user.name} />

    <View style={[styles.conversationInfo, isRTL ? { marginRight: 12 } : { marginLeft: 12 }]}>
      <Text style={[styles.conversationName, isRTL && { textAlign: 'right' }]}>
        {user.name}
      </Text>
      <Text
        numberOfLines={1}
        style={[styles.conversationMessage, isRTL && { textAlign: 'right' }]}
      >
        {lastMessage}
      </Text>
    </View>

    <View style={[styles.conversationMeta, isRTL && { alignItems: 'flex-start' }]}>
      <Text style={styles.conversationTime}>2m ago</Text>

      <View style={[styles.callIcons, isRTL && { flexDirection: 'row-reverse' }]}>
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

/* ---------------------------------- */
/* Screen */
/* ---------------------------------- */

export default function ChatListScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { t, isRTL } = useTranslation();
  const insets = useSafeAreaInsets();
  const { unreadCount } = useNotifications();

  /* ---- SAFE AREA CONSTANTS ---- */
  const COMPOSER_HEIGHT = 64;
  const bottomInset = insets.bottom || 0;
  const totalComposerHeight = COMPOSER_HEIGHT + bottomInset;

  // Adjust top section height based on device
  const TOP_SECTION_HEIGHT = height < 700 ? height * 0.44 : height < 801 ? height * 0.46 : height * 0.48;

  /* ---- STATE ---- */
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [notificationPanelVisible, setNotificationPanelVisible] = useState(false);
  const [storyVisible, setStoryVisible] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [progress] = useState(STORIES.map(() => new Animated.Value(0)));

  const user = route.params?.user;
  const username = user?.name || 'User';
  const email = user?.email || '';

  const conversations = Object.keys(USERS).map(key => ({
    user: USERS[key],
    lastMessage:
      CONVERSATIONS[key]?.[CONVERSATIONS[key].length - 1]?.text ||
      t('startChatting'),
  }));

  /* ---- HANDLERS ---- */

  const handleLogout = async () => {
    Alert.alert(t('logout'), t('logoutMessage'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('yes'),
        onPress: async () => {
          await AsyncStorage.removeItem('user');
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  const toggleNotificationPanel = () => {
    setNotificationPanelVisible(!notificationPanelVisible);
  };

  const openConversation = (u) => navigation.navigate('Conversation', { user: u });
  const handleVideoCall = (u) => navigation.navigate('VideoCall', { user: u });
  const handleAudioCall = (u) => navigation.navigate('Call', { user: u });

  /* ---- STORIES ---- */

  const openStory = (story) => {
    setActiveStoryIndex(STORIES.findIndex(s => s.id === story.id));
    setStoryVisible(true);
  };

  const closeStory = () => {
    setStoryVisible(false);
    progress.forEach(p => p.setValue(0));
  };

  const nextStory = () => {
    activeStoryIndex < STORIES.length - 1
      ? setActiveStoryIndex(i => i + 1)
      : closeStory();
  };

  const prevStory = () => {
    if (activeStoryIndex > 0) setActiveStoryIndex(i => i - 1);
  };

  useEffect(() => {
    if (!storyVisible) return;
    progress[activeStoryIndex].setValue(0);
    Animated.timing(progress[activeStoryIndex], {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start(({ finished }) => finished && nextStory());
  }, [storyVisible, activeStoryIndex]);

  const currentStory = STORIES[activeStoryIndex];
  const videoPlayer =
    currentStory?.type === 'video'
      ? useVideoPlayer(currentStory.uri, p => {
          p.loop = true;
          p.play();
        })
      : null;

  /* ---------------------------------- */
  /* RENDER */
  /* ---------------------------------- */

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6F42C1" />

      <SideBar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        username={username}
        email={email}
        navigation={navigation}
        onLogout={handleLogout}
      />

      {/* Notification Panel */}
      <NotificationPanel 
        visible={notificationPanelVisible}
        onClose={toggleNotificationPanel}
      />

      {/* TOP SECTION */}
      <View style={[styles.fixedTopSection, { height: TOP_SECTION_HEIGHT }]}>
        <LinearGradient colors={colors.headerGradient} style={StyleSheet.absoluteFill}>
          {/* Safe Area Spacer */}
          <View style={styles.safeArea} />
          
          {/* Top Bar with Notification Count */}
          <TopBar
            onMenuPress={() => setSidebarVisible(true)}
            notificationCount={unreadCount}
            onNotificationPress={toggleNotificationPanel}
          />

          <View style={styles.fixedTopContent}>
            <View style={[styles.headerContent, isRTL && { flexDirection: 'row-reverse' }]}>
              <Text style={styles.headerTitle}>{t('messages')}</Text>
              <Image
                source={require('../assets/famGif.gif')}
                style={styles.gif}
                resizeMode="contain"
              />
            </View>

            <View style={styles.storiesCard}>
              <Text style={styles.storiesTitle}>{t('stories')}</Text>
              <ScrollView horizontal inverted={isRTL} showsHorizontalScrollIndicator={false}>
                {STORIES.map(story => (
                  <StoryBubble key={story.id} story={story} onPress={openStory} />
                ))}
              </ScrollView>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* BOTTOM SECTION */}
      <View
        style={[
          styles.scrollableBottomSection,
          { top: TOP_SECTION_HEIGHT, bottom: COMPOSER_HEIGHT },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.bottomScroll,
            { paddingBottom: COMPOSER_HEIGHT + 16 },
          ]}
        >
          <Text style={styles.conversationsTitle}>{t('recentChats')}</Text>

          {conversations.map(conv => (
            <ConversationItem
              key={conv.user.id}
              user={conv.user}
              lastMessage={conv.lastMessage}
              onPress={openConversation}
              onVideoCall={handleVideoCall}
              onAudioCall={handleAudioCall}
              isRTL={isRTL}
            />
          ))}
        </ScrollView>
      </View>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNavContainer}>
        <BottomNav navigation={navigation} activeScreen="chat" />
      </View>

      {/* STORY MODAL */}
      <Modal visible={storyVisible} animationType="slide">
        <View style={styles.storyModal}>
          <TouchableOpacity style={styles.closeStoryButton} onPress={closeStory}>
            <Feather name="x" size={32} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.tapZone, { left: 0 }]} onPress={prevStory} />
          <TouchableOpacity style={[styles.tapZone, { right: 0 }]} onPress={nextStory} />

          <View style={styles.progressContainer}>
            {STORIES.map((s, i) => (
              <View key={s.id} style={styles.progressBarBg}>
                <Animated.View style={[styles.progressBarFill, { flex: progress[i] }]} />
              </View>
            ))}
          </View>

          {currentStory?.type === 'image' && (
            <Image source={{ uri: currentStory.uri }} style={styles.storyImage} />
          )}

          {currentStory?.type === 'video' && videoPlayer && (
            <VideoView style={styles.storyVideo} player={videoPlayer} contentFit="cover" />
          )}
        </View>
      </Modal>
    </View>
  );
}

/* ---------------------------------- */
/* STYLES */
/* ---------------------------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  fixedTopSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
    borderBottomLeftRadius: 38,
    borderBottomRightRadius: 38,
    overflow: 'hidden',
  },

  safeArea: { 
    height: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight 
  },

  fixedTopContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
    justifyContent: 'flex-end',
  },

  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 24,
  },

  headerTitle: { fontSize: 28, fontWeight: '700', color: '#fff' },

  gif: { width: 70, height: 70 },

  storiesCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 12,
  },

  storiesTitle: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 8 },

  storyBorder: { padding: 3, borderRadius: 30, borderWidth: 2, borderColor: '#fff' },

  storyName: { fontSize: 11, marginTop: 6, fontWeight: '600', color: '#fff' },

  scrollableBottomSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 38,
    borderTopRightRadius: 38,
  },

  bottomScroll: { paddingHorizontal: 16, paddingTop: 32 },

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
    fontWeight: '700',
    marginBottom: 16,
    color: '#1a1a2e',
  },

  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 16,
    marginBottom: 12,
  },

  conversationInfo: { flex: 1 },

  conversationName: { fontSize: 16, fontWeight: '700', color: '#1a1a2e' },

  conversationMessage: { fontSize: 14, color: '#666' },

  conversationMeta: { alignItems: 'flex-end' },

  conversationTime: { fontSize: 12, color: '#999', marginBottom: 8 },

  callIcons: { flexDirection: 'row', gap: 8 },

  callIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(111,66,193,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  storyModal: { flex: 1, backgroundColor: 'black' },

  closeStoryButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 2,
  },

  tapZone: { position: 'absolute', top: 0, bottom: 0, width: width / 2 },

  progressContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    flexDirection: 'row',
  },

  progressBarBg: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 2,
  },

  progressBarFill: { height: 3, backgroundColor: '#fff' },

  storyImage: { width, height: '100%' },

  storyVideo: { width, height: '100%' },
});