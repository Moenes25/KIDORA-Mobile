import React, { useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ChatBubble from '../components/ChatBubble';
import Avatar from '../components/Avatar';
import TopNavBar from '../components/TopNavBar';
import { CONVERSATIONS } from '../data/mockData';
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../context/ThemeContext';

export default function ConversationScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { user } = route.params;
  
  const [messages, setMessages] = useState(CONVERSATIONS[user.id] || []);
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);

  // Common emojis for quick access
  const commonEmojis = ['😀', '😂', '❤️', '👍', '🎉', '😊', '🔥', '💯', '👏', '🙌', '😍', '🤔', '😢', '😎', '🙏', '✨'];

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

  // Navigate to video call
  const handleVideoCall = () => {
    navigation.navigate('VideoCall', { user });
  };

  // Navigate to audio call
  const handleAudioCall = () => {
    navigation.navigate('Call', { user });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#6F42C1" />
      
      {/* Purple Header Section */}
      <View style={styles.purpleHeaderSection}>
        <LinearGradient colors={colors.headerGradient} style={styles.headerGradient}>
          <View style={styles.safeArea} />
          
          {/* Top Navigation Bar */}
          <TopNavBar title={user.name} navigation={navigation} />

          {/* Chat Header with User Info */}
          <View style={styles.chatHeader}>
            <Avatar uri={user.avatar} size={40} name={user.name} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.chatHeaderName}>{user.name}</Text>
              <Text style={styles.chatHeaderStatus}>Online</Text>
            </View>
            <TouchableOpacity style={styles.iconButton} onPress={handleVideoCall}>
              <Feather name="video" size={22} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleAudioCall}>
              <Feather name="phone" size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  safeArea: { 
    height: Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0 
  },
  purpleHeaderSection: {
    overflow: 'hidden',
  },
  headerGradient: {
    paddingBottom: 16,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  chatHeaderName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: '#e0e0e0',
    marginTop: 2,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
});