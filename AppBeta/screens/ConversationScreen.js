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
import { normalize, wp, hp } from '../utils/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const EMOJI_PICKER_HEIGHT = hp(25);

export default function ConversationScreen({ navigation, route }) {
  const { colors } = useTheme();
  const { t, isRTL } = useTranslation();
  const { user } = route.params;
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);
  
  const [messages, setMessages] = useState(CONVERSATIONS[user.id] || []);
  const [text, setText] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Dynamic padding based on keyboard state
  // Keyboard CLOSED: Return to initial position (safe area insets only, no extra padding)
  // Keyboard OPEN: Use 0 - KeyboardAvoidingView handles positioning above keyboard
  const composerBottomPadding = keyboardHeight > 0 ? 0 : insets.bottom;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
        setShowEmoji(false);
      }
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
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
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
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
      
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        enabled={isKeyboardVisible}
      >
        <View style={styles.innerContainer}>
          
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={i => i.id}
            contentContainerStyle={{ padding: wp(3), paddingBottom: hp(2.5) }}
            style={styles.messagesList}
            renderItem={({ item }) => (
              <ChatBubble 
                message={item} 
                isMine={item.from === 'me'}
                isRTL={isRTL}
              />
            )}
            onContentSizeChange={() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }}
          />

          {showEmoji && !isKeyboardVisible && (
            <View style={styles.emojiContainer}>
              <View style={[styles.emojiHeader, isRTL && { flexDirection: 'row-reverse' }]}>
                <Text 
                  style={[styles.emojiTitle, isRTL && { textAlign: 'right' }]}
                  allowFontScaling={false}
                >
                  {t('emojis')}
                </Text>
                <TouchableOpacity onPress={() => setShowEmoji(false)}>
                  <Feather name="x" size={normalize(20)} color="#666" />
                </TouchableOpacity>
              </View>
              <ScrollView style={{ maxHeight: hp(18) }} nestedScrollEnabled={true}>
                <View style={[styles.emojiGrid, isRTL && { flexDirection: 'row-reverse' }]}>
                  {commonEmojis.map((emoji, i) => (
                    <TouchableOpacity 
                      key={i} 
                      onPress={() => setText(prev => prev + emoji)}
                      style={styles.emojiButton}
                    >
                      <Text style={styles.emojiText} allowFontScaling={false}>
                        {emoji}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Composer Wrapper */}
          <View style={[
            styles.composerWrapper,
            { 
              paddingBottom: composerBottomPadding 
            }
          ]}>
            <LinearGradient
              colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,1)']}
              style={[styles.composer, isRTL && { flexDirection: 'row-reverse' }]}
            >
              <TouchableOpacity 
                style={styles.iconButtonSmall} 
                onPress={() => {
                  if (isKeyboardVisible) {
                    Keyboard.dismiss();
                    setTimeout(() => setShowEmoji(true), 100);
                  } else {
                    setShowEmoji(!showEmoji);
                  }
                }}
              >
                <Feather name="smile" size={normalize(24)} color="#6f42c1" />
              </TouchableOpacity>
              
              <View style={[styles.inputWrapper, isRTL && { marginHorizontal: wp(2) }]}>
                <TextInput
                  style={[styles.input, isRTL && { textAlign: 'right' }]}
                  placeholder={t('typeMessage')}
                  placeholderTextColor="#999"
                  value={text}
                  onChangeText={setText}
                  onFocus={() => setShowEmoji(false)}
                  multiline
                  maxLength={500}
                  allowFontScaling={false}
                />
              </View>
              
              <TouchableOpacity style={styles.iconButtonSmall} onPress={uploadFile}>
                <Feather name="paperclip" size={normalize(24)} color="#6f42c1" />
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
                    size={normalize(18)} 
                    color="#ffffff" 
                    style={isRTL && { transform: [{ rotate: '180deg' }] }}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  messagesList: {
    flex: 1, 
    backgroundColor: '#f5f5f5',
  },
  composerWrapper: {
    width: '100%',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -hp(0.25) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(8),
    elevation: 8,
    borderTopWidth: normalize(1),
    borderTopColor: '#f0f0f0',
  },
  composer: { 
    flexDirection: 'row', 
    padding: wp(3), 
    alignItems: 'flex-end',
    backgroundColor: '#ffffff',
    minHeight: hp(7.5),
  },
  iconButtonSmall: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(111, 66, 193, 0.1)',
    marginBottom: hp(0.5),
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: wp(2),
    backgroundColor: '#f7f7f7',
    borderRadius: normalize(24),
    borderWidth: normalize(1),
    borderColor: 'rgba(111, 66, 193, 0.2)',
  },
  input: { 
    minHeight: hp(5), 
    maxHeight: hp(15), 
    paddingHorizontal: wp(4), 
    paddingVertical: hp(1.2),
    fontSize: normalize(15),
    lineHeight: normalize(20),
    color: '#333',
  },
  sendBtn: { 
    width: wp(11),
    height: wp(11),
    borderRadius: wp(5.5),
    overflow: 'hidden',
    shadowColor: '#6f42c1',
    shadowOffset: { width: 0, height: hp(0.25) },
    shadowOpacity: 0.3,
    shadowRadius: normalize(4),
    elevation: 4,
    marginBottom: hp(0.25),
  },
  sendGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiContainer: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderTopWidth: normalize(1),
    borderColor: 'rgba(111, 66, 193, 0.1)',
    height: EMOJI_PICKER_HEIGHT,
  },
  emojiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderBottomWidth: normalize(1),
    borderColor: '#f0f0f0',
  },
  emojiTitle: {
    fontSize: normalize(14),
    fontWeight: '700',
    color: '#6f42c1',
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: wp(2),
    paddingTop: hp(1),
  },
  emojiButton: {
    padding: wp(2),
    margin: wp(1),
    backgroundColor: '#f7f7f7',
    borderRadius: normalize(12),
    minWidth: wp(11),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: normalize(1),
    borderColor: 'rgba(111, 66, 193, 0.1)',
  },
  emojiText: {
    fontSize: normalize(24),
  },
});