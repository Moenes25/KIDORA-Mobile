// screens/ConversationScreen.js
import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar, Dimensions, Keyboard
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatBubble from '../components/ChatBubble';
import ChatNavBar from '../components/ChatNavBar';
import { CONVERSATIONS } from '../data/mockData';
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../context/TranslationContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const COMPOSER_HEIGHT = 70; // Fixed height for composer
const EMOJI_PICKER_HEIGHT = 200; // Fixed height for emoji picker

export default function ConversationScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { t, isRTL } = useTranslation();
  const { user } = route.params;
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);
  
  const [messages, setMessages] = useState(CONVERSATIONS[user.id] || []);
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Calculate total bottom spacing
  const bottomInset = insets.bottom || 0;
  const totalComposerHeight = COMPOSER_HEIGHT + bottomInset;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  // Handle keyboard show/hide
  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setShowEmoji(false);
      }
    );
    
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const commonEmojis = ['😀', '😂', '❤️', '👍', '🎉', '😊', '🔥', '💯', '👏', '🙌', '😍', '🤔', '😢', '😎', '🙏', '✨'];

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
    
    // Scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9d00ff" />
      
      <ChatNavBar 
        name={user.name} 
        isOnline={true}
        avatar={user.avatar ? { uri: user.avatar } : null}
      />
      
      <View style={styles.contentContainer}>
        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={i => i.id}
          contentContainerStyle={{ 
            padding: 12, 
            paddingBottom: showEmoji 
              ? EMOJI_PICKER_HEIGHT + totalComposerHeight + 20 
              : totalComposerHeight + 20
          }}
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
          <View style={[
            styles.emojiContainer,
            { bottom: totalComposerHeight }
          ]}>
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
        <View style={[
          styles.composerWrapper,
          { 
            paddingBottom: keyboardHeight > 0 ? 0 : bottomInset,
            bottom: keyboardHeight > 0 ? keyboardHeight : 0
          }
        ]}>
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,1)']}
            style={[
              styles.composer,
              isRTL && { flexDirection: 'row-reverse' }
            ]}
          >
            <TouchableOpacity 
              style={styles.iconButtonSmall} 
              onPress={() => {
                Keyboard.dismiss();
                setShowEmoji(!showEmoji);
              }}
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
                onFocus={() => setShowEmoji(false)}
                multiline
                maxLength={500}
                onSubmitEditing={send}
                blurOnSubmit={false}
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
                  name={isRTL ? "arrow-left" : "send"}
                  size={18} 
                  color="#ffffff" 
                  style={isRTL && { transform: [{ rotate: '180deg' }] }}
                />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  messagesList: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  composerWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: SCREEN_WIDTH,
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
    width: SCREEN_WIDTH,
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
    position: 'absolute',
    left: 0,
    width: SCREEN_WIDTH,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: 'rgba(111, 66, 193, 0.1)',
    paddingBottom: 8,
    maxHeight: EMOJI_PICKER_HEIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
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