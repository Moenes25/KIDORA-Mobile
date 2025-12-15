// screens/ConversationScreen.js
import React, { useState, useLayoutEffect } from 'react'; // Added useLayoutEffect
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ChatBubble from '../components/ChatBubble';
// Removed explicit TopNavBar and Avatar imports as ChatNavBar handles the header
import ChatNavBar from '../components/ChatNavBar'; // <--- Import your new consistent header
import { CONVERSATIONS } from '../data/mockData';
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';

export default function ConversationScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { t, isRTL } = useTranslation();
  const { user } = route.params;
  
  const [messages, setMessages] = useState(CONVERSATIONS[user.id] || []);
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);

  // --- FIX: Hide the default Navigation Header to avoid duplicates ---
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  // ------------------------------------------------------------------

  // Common emojis for quick access
  const commonEmojis = ['😀', '😂', '❤️', '👍', '🎉', '😊', '🔥', '💯', '👏', '🙌', '😍', '🤔', '😢', '😎', '🙏', '✨'];

  // Send text message
  const send = () => {
    if (!text.trim()) return;
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, '0');
    const mm = now.getMinutes().toString().padStart(2, '0');
    const msg = { 
      id: `m${Date.now()}`, 
      from: 'me', 
      text: text.trim(), 
      time: `${hh}:${mm}` 
    };
    setMessages(prev => [...prev, msg]);
    setText('');
    setShowEmoji(false);
  };

  // File upload
  const uploadFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (result.type === 'success') {
      const msg = { 
        id: `f${Date.now()}`, 
        from: 'me', 
        text: `📎 ${result.name}`, 
        time: t('now') 
      };
      setMessages(prev => [...prev, msg]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <StatusBar barStyle="light-content" backgroundColor="#9d00ff" />
      
      {/* --- FIX: Use the consistent ChatNavBar --- */}
      {/* This replaces the entire 'Purple Header Section' block you had before */}
      <ChatNavBar 
        name={user.name} 
        isOnline={true} // You can pass user.status here if you have it
        avatar={user.avatar ? { uri: user.avatar } : null}
      />
      
      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={i => i.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
        style={styles.messagesList}
        renderItem={({ item }) => (
          <ChatBubble 
            message={item} 
            isMine={item.from === 'me'}
            isRTL={isRTL}
          />
        )}
      />

      {/* Emoji Picker - Show above composer */}
      {showEmoji && (
        <View style={styles.emojiContainer}>
          <View style={[
            styles.emojiHeader,
            isRTL && { flexDirection: 'row-reverse' }
          ]}>
            <Text style={[
              styles.emojiTitle,
              isRTL && { textAlign: 'right' }
            ]}>
              {t('emojis')}
            </Text>
            <TouchableOpacity onPress={() => setShowEmoji(false)}>
              <Feather name="x" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ maxHeight: 180 }}>
            <View style={[
              styles.emojiGrid,
              isRTL && { flexDirection: 'row-reverse' }
            ]}>
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
          style={[
            styles.composer,
            isRTL && { flexDirection: 'row-reverse' }
          ]}
        >
          <TouchableOpacity 
            style={styles.iconButtonSmall} 
            onPress={() => setShowEmoji(!showEmoji)}
          >
            <Feather name="smile" size={24} color="#6f42c1" />
          </TouchableOpacity>
          
          <View style={[
            styles.inputWrapper,
            isRTL && { marginHorizontal: 8 }
          ]}>
            <TextInput
              style={[
                styles.input,
                isRTL && { textAlign: 'right' }
              ]}
              placeholder={t('typeMessage')}
              placeholderTextColor="#999"
              value={text}
              onChangeText={setText}
              multiline
              maxLength={500}
              onSubmitEditing={send}
              blurOnSubmit={false} // Keep keyboard open on submit usually better for chats
            />
          </View>
          
          <TouchableOpacity style={styles.iconButtonSmall} onPress={uploadFile}>
            <Feather name="paperclip" size={24} color="#6f42c1" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.sendBtn} 
            onPress={send}
            disabled={!text.trim()}
          >
            <LinearGradient
              colors={!text.trim() ? ['#ccc', '#aaa'] : colors.headerGradient}
              style={styles.sendGradient}
            >
              <Feather 
                name={isRTL ? "arrow-left" : "send"} // Nice detail for RTL
                size={18} 
                color="#ffffff" 
                style={isRTL && { transform: [{ rotate: '180deg' }] }}
              />
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
  // Removed 'purpleHeaderSection', 'headerGradient', 'safeArea', 'chatHeader' styles 
  // because ChatNavBar handles all of that now.
  
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