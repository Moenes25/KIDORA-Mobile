import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Modal, Image, Dimensions, Animated, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ChatBubble from '../components/ChatBubble';
import Avatar from '../components/Avatar';
import { CONVERSATIONS, USERS, STORIES } from '../data/mockData';
import { Feather } from '@expo/vector-icons';
import { VideoView, useVideoPlayer } from 'expo-video';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../components/BottomNav';
import SideBar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const { width, height } = Dimensions.get('window');

// Story bubble component
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

// Conversation item for list
const ConversationItem = ({ user, lastMessage, onPress }) => {
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
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>3</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function ChatScreen({ navigation, route }) {
  const { colors } = useTheme();
  
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  // Stories
  const [storyVisible, setStoryVisible] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [progress] = useState(STORIES.map(() => new Animated.Value(0)));

  // Emoji picker
  const [showEmoji, setShowEmoji] = useState(false);

  const user = route.params?.user;
  const username = user?.name || "User";
  const email = user?.email || "";

  // Common emojis for quick access
  const commonEmojis = ['😀', '😂', '❤️', '👍', '🎉', '😊', '🔥', '💯', '👏', '🙌', '😍', '🤔', '😢', '😎', '🙏', '✨'];

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

  const openConversation = (user) => {
    setSelectedUser(user);
    const convKey = user.id;
    const initial = CONVERSATIONS[convKey] || [];
    setMessages(initial);
  };

  const closeConversation = () => {
    setSelectedUser(null);
    setMessages([]);
    setText('');
    setShowEmoji(false);
  };

  // Send text message
  const send = () => {
    if (!text.trim()) return;
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    const msg = { id: `m${Date.now()}`, from: 'me', text: text.trim(), time: `${hh}:${mm}` };
    setMessages(prev => [...prev, msg]);
    setText('');
    setShowEmoji(false);
  };

  // File upload
  const uploadFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (result.type === 'success') {
      const msg = { id: `f${Date.now()}`, from: 'me', text: `📎 ${result.name}`, time: 'Now' };
      setMessages(prev => [...prev, msg]);
    }
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

  const TOP_SECTION_HEIGHT = height * 0.35;

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

      {!selectedUser && (
        <>
          {/* FIXED TOP SECTION - Only show when no chat selected */}
          <View style={[styles.fixedTopSection, { height: TOP_SECTION_HEIGHT }]}>
            <LinearGradient colors={colors.headerGradient} style={StyleSheet.absoluteFill}>
              <View style={styles.safeArea} />
              <TopBar onMenuPress={toggleSidebar} />
              
              <ScrollView 
                style={styles.topScrollView}
                contentContainerStyle={styles.topContent}
                showsVerticalScrollIndicator={false}
              >
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
                
                <View style={{ height: 20 }} />
              </ScrollView>
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
                />
              ))}

              <View style={{ height: 20 }} />
            </ScrollView>
          </View>

          <View style={styles.bottomNavContainer}>
            <BottomNav navigation={navigation} activeScreen="chat" />
          </View>
        </>
      )}

      {selectedUser && (
        // Full Screen Chat View
        <KeyboardAvoidingView
          style={styles.fullScreenChat}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          {/* Chat Header */}
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={closeConversation} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="#6f42c1" />
            </TouchableOpacity>
            <Avatar uri={selectedUser.avatar} size={40} name={selectedUser.name} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.chatHeaderName}>{selectedUser.name}</Text>
              <Text style={styles.chatHeaderStatus}>Online</Text>
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="video" size={22} color="#6f42c1" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="phone" size={22} color="#6f42c1" />
            </TouchableOpacity>
          </View>

          {/* Chat Messages */}
          <FlatList
            data={messages}
            keyExtractor={i => i.id}
            contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
            style={styles.messagesList}
            renderItem={({ item }) => <ChatBubble message={item} isMine={item.from === 'me'} />}
          />

          {/* Emoji Picker - Show above composer */}
          {showEmoji && (
            <View style={styles.emojiContainer}>
              <View style={styles.emojiHeader}>
                <Text style={styles.emojiTitle}>Emojis</Text>
                <TouchableOpacity onPress={() => setShowEmoji(false)}>
                  <Feather name="x" size={20} color="#666" />
                </TouchableOpacity>
              </View>
              <ScrollView style={{ maxHeight: 180 }}>
                <View style={styles.emojiGrid}>
                  {commonEmojis.map((emoji, i) => (
                    <TouchableOpacity 
                      key={i} 
                      onPress={() => setText(prev => prev + emoji)}
                      style={styles.emojiButton}
                    >
                      <Text style={styles.emojiText}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Message Composer - Always visible at bottom */}
          <View style={styles.composerWrapper}>
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,1)']}
              style={styles.composer}
            >
              <TouchableOpacity 
                style={styles.iconButtonSmall} 
                onPress={() => setShowEmoji(!showEmoji)}
              >
                <Feather name="smile" size={24} color="#6f42c1" />
              </TouchableOpacity>
              
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Type a message..."
                  placeholderTextColor="#999"
                  value={text}
                  onChangeText={setText}
                  multiline
                  maxLength={500}
                />
              </View>
              
              <TouchableOpacity style={styles.iconButtonSmall} onPress={uploadFile}>
                <Feather name="paperclip" size={24} color="#6f42c1" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.sendBtn} onPress={send}>
                <LinearGradient
                  colors={colors.headerGradient}
                  style={styles.sendGradient}
                >
                  <Feather name="send" size={18} color="#ffffff" />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </KeyboardAvoidingView>
      )}

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
  topScrollView: { flex: 1 },
  topContent: { paddingHorizontal: 16, paddingBottom: 16 },
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
    marginBottom: 6,
  },
  unreadBadge: {
    backgroundColor: '#6f42c1',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  fullScreenChat: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(111, 66, 193, 0.1)',
    marginRight: 8,
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: '#27AE60',
    marginTop: 2,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(111, 66, 193, 0.1)',
    marginLeft: 8,
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  composerWrapper: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  composer: { 
    flexDirection: 'row', 
    padding: 12, 
    alignItems: 'center',
    backgroundColor: '#ffffff',
    minHeight: 60,
  },
  iconButtonSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(111, 66, 193, 0.1)',
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#f7f7f7',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(111, 66, 193, 0.2)',
  },
  input: { 
    minHeight: 40, 
    maxHeight: 120, 
    paddingHorizontal: 16, 
    paddingVertical: 10,
    fontSize: 15,
    lineHeight: 20,
    color: '#333',
  },
  sendBtn: { 
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#6f42c1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sendGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiContainer: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: 'rgba(111, 66, 193, 0.1)',
    paddingBottom: 8,
    maxHeight: 200,
  },
  emojiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  emojiTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6f42c1',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  emojiButton: {
    padding: 10,
    margin: 4,
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(111, 66, 193, 0.1)',
  },
  emojiText: {
    fontSize: 28,
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
    backgroundColor: '#fff',
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