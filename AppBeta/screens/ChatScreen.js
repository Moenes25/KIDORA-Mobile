import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Modal, Image, Dimensions, Animated
} from 'react-native';
import ChatBubble from '../components/ChatBubble';
import Avatar from '../components/Avatar';
import { CONVERSATIONS, USERS, STORIES } from '../data/mockData';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import EmojiSelector from "react-native-emoji-selector";

const { width, height } = Dimensions.get('window');

// Story bubble component
const StoryBubble = ({ story, onPress }) => {
  if (!story.user) return null;
  return (
    <TouchableOpacity onPress={() => onPress(story)}>
      <View style={{ alignItems: 'center', marginRight: 12 }}>
        <Avatar uri={story.user.avatar} size={50} name={story.user.name} />
        <Text style={{ fontSize: 12, marginTop: 4 }}>{story.user.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function ChatScreen({ route, navigation }) {
  const { user } = route.params;
  const convKey = user.id;
  const initial = CONVERSATIONS[convKey] || [];
  const [messages, setMessages] = useState(initial);
  const [text, setText] = useState('');

  // Stories
  const [storyVisible, setStoryVisible] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [progress] = useState(STORIES.map(() => new Animated.Value(0)));
  const videoRef = useRef(null);

  // Emoji picker
  const [showEmoji, setShowEmoji] = useState(false);

  // Header with call buttons
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Avatar uri={user.avatar} size={36} name={user.name} />
          <Text style={{ marginLeft: 10, fontWeight: '700' }}>{user.name}</Text>
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: 'row', marginRight: 10 }}>
          <TouchableOpacity
            style={{ marginRight: 16 }}
            onPress={() => navigation.navigate('VideoCall', { user })}
          >
            <Ionicons name="videocam-outline" size={24} color="#0b93f6" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Audio Call')}>
            <Ionicons name="call-outline" size={24} color="#0b93f6" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, user]);

  // Send text message
  const send = () => {
    if (!text.trim()) return;
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    const msg = { id: `m${Date.now()}`, from: 'me', text: text.trim(), time: `${hh}:${mm}` };
    setMessages(prev => [...prev, msg]);
    setText('');
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
  const closeStory = () => { setStoryVisible(false); progress.forEach(p => p.setValue(0)); };
  const nextStory = () => { if (activeStoryIndex < STORIES.length - 1) setActiveStoryIndex(activeStoryIndex + 1); else closeStory(); };
  const prevStory = () => { if (activeStoryIndex > 0) setActiveStoryIndex(activeStoryIndex - 1); };

  // Story progress animation
  useEffect(() => {
    if (!storyVisible) return;
    progress[activeStoryIndex].setValue(0);
    Animated.timing(progress[activeStoryIndex], { toValue: 1, duration: 5000, useNativeDriver: false })
      .start(({ finished }) => { if (finished) nextStory(); });
  }, [storyVisible, activeStoryIndex]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Stories */}
      <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
          {STORIES.map(story => <StoryBubble key={story.id} story={story} onPress={openStory} />)}
        </ScrollView>
      </View>

      {/* Chat */}
      <FlatList
        data={messages}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => <ChatBubble message={item} isMine={item.from === 'me'} />}
      />

      {/* Composer */}
      <View style={styles.composer}>
        <TouchableOpacity style={{ marginRight: 8 }} onPress={() => setShowEmoji(!showEmoji)}>
          <Ionicons name="happy-outline" size={28} color="#6f42c1" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Message..."
          value={text}
          onChangeText={setText}
          multiline
        />
        <TouchableOpacity style={{ marginHorizontal: 8 }} onPress={uploadFile}>
          <Ionicons name="attach-outline" size={28} color="#6f42c1" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendBtn} onPress={send}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Send</Text>
        </TouchableOpacity>
      </View>

      {/* Emoji Selector */}
      {showEmoji && (
        <EmojiSelector
          onEmojiSelected={emoji => setText(prev => prev + emoji)}
          showSearchBar={false}
          showTabs={true}
          showSectionTitles={false}
          columns={8}
        />
      )}

      {/* Story Modal */}
      <Modal visible={storyVisible} transparent={false} animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity style={{ position: 'absolute', top: 40, left: 20, zIndex: 2 }} onPress={closeStory}>
            <Ionicons name="close" size={36} color="#fff" />
          </TouchableOpacity>

          {/* Tap left/right */}
          <TouchableOpacity style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: width / 2 }} onPress={prevStory} />
          <TouchableOpacity style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: width / 2 }} onPress={nextStory} />

          {/* Progress bars */}
          <View style={{ position: 'absolute', top: 50, left: 10, right: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
            {STORIES.map((s, i) => (
              <View key={s.id} style={{ flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 2 }}>
                <Animated.View style={{ flex: progress[i], height: 2, backgroundColor: '#fff' }} />
              </View>
            ))}
          </View>

          {/* Display story */}
          {STORIES[activeStoryIndex].type === 'image' ? (
            <Image source={{ uri: STORIES[activeStoryIndex].uri }} style={{ width, height: '100%', resizeMode: 'cover' }} />
          ) : (
            <Video
              ref={videoRef}
              source={{ uri: STORIES[activeStoryIndex].uri }}
              style={{ width, height: '100%' }}
              resizeMode="cover"
              shouldPlay
              isLooping
            />
          )}
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  composer: { flexDirection: 'row', padding: 8, borderTopWidth: 1, borderColor: '#eee', alignItems: 'flex-end' },
  input: { flex: 1, minHeight: 40, maxHeight: 120, backgroundColor: '#f7f7f7', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  sendBtn: { marginLeft: 8, backgroundColor: '#0b93f6', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});
