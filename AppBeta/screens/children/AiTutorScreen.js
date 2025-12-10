import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Platform, 
  StatusBar, 
  TextInput,
  useWindowDimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech'; 
import { PERPLEXITY_API_KEY } from '../../secrets';
const apiKey = PERPLEXITY_API_KEY;
export default function AiTutorScreen({ setScreen, isDark, colors }) {
  const [chatInput, setChatInput] = useState('');
  
  // UI State
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'مرحباً يا بطل! 🌟 أنا معلمك الذكي. اسألني أي سؤال يخطر ببالك وسأشرحه لك!' }
  ]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const scrollViewRef = useRef();
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  // Theme Colors
  const themeColors = {
    gradient: ['#a78bfa', '#818cf8', '#6366f1'],
    primary: '#6366f1',
    userBubble: '#e0e7ff',
    aiBubble: '#f3f4f6',
    statusBar: '#a78bfa'
  };

  const shadowColor = isDark ? '#2d1b69' : '#000';

  // --- 1. CLEAN TEXT FUNCTION (UPDATED) ---
  const cleanTextForSpeech = (text) => {
    if (!text) return "";
    return text
      // 1. Remove Citations like [1], [12]
      .replace(/\[\d+\]/g, "") 
      // 2. Remove Markdown like **text** or ## text
      .replace(/[*#]/g, "") 
      // 3. Remove EMOJIS (This regex catches standard emojis like 🚀, 🌟, 🐦)
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "")
      // 4. Remove extra whitespace created by removals
      .trim();
  };

  // --- 2. TEXT TO SPEECH ---
  const speakText = (text) => {
    Speech.stop(); 
    setIsSpeaking(true);
    
    // We strictly use the CLEANED text for audio
    const textToRead = cleanTextForSpeech(text);

    // If there is nothing left to read (e.g. only emojis were sent), don't speak
    if (!textToRead) {
        setIsSpeaking(false);
        return;
    }

    Speech.speak(textToRead, {
      language: 'ar-SA', 
      pitch: 1.0,        
      rate: 0.85,        
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false) 
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  // --- 3. SEND MESSAGE LOGIC ---
  const sendMessage = async (textOverride = null) => {
    const textToSend = textOverride || chatInput;
    if (!textToSend.trim()) return;

    const newUserMsg = { role: 'user', content: textToSend };

    setMessages(prev => [...prev, newUserMsg]);
    setChatInput('');
    setIsLoading(true);
    Keyboard.dismiss();

    try {
      // Filter out greeting for API logic
      const validHistory = messages.filter((msg, index) => {
        if (index === 0 && msg.role === 'assistant') return false; 
        return true;
      });

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "sonar", 
          messages: [
            {
              role: "system",
              // We still ask for emojis in text because they look nice
              content: "You are a friendly, magical tutor for children. Explain simply. Use emojis to make it fun. NEVER use citations or sources. Just give the answer directly in Arabic and don't read icons only phrases and try to use sentiment."
            },
            ...validHistory, 
            newUserMsg       
          ]
        })
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error.message);

      if (data.choices && data.choices.length > 0) {
        let aiResponse = data.choices[0].message.content;
        
        // Remove citations from TEXT as well (just in case)
        aiResponse = aiResponse.replace(/\[\d+\]/g, "");

        setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
        
        // The speak function handles the Emoji removal internally
        speakText(aiResponse);
      } 

    } catch (error) {
      console.error("API Error Details:", error);
      const errorMsg = 'عذراً، حدثت مشكلة صغيرة. هل يمكنك المحاولة مرة أخرى؟';
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
      speakText(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);


  return (
    <View style={styles.container}>
      <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 0, backgroundColor: isDark ? '#0f0a1f' : themeColors.statusBar }} />
      <StatusBar hidden={true} /> 
      
      <LinearGradient colors={themeColors.gradient} style={styles.fullScreen}>
        
        <View style={[styles.topBar, !isPortrait && { paddingVertical: 10 }, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
          <TouchableOpacity onPress={() => { stopSpeaking(); setScreen('home'); }} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>المعلم الذكي 🤖</Text>
          
          <TouchableOpacity 
            onPress={isSpeaking ? stopSpeaking : () => {
                const lastMsg = messages[messages.length-1];
                if(lastMsg.role === 'assistant') speakText(lastMsg.content);
            }} 
            style={styles.backButton}
          >
            <Feather name={isSpeaking ? "volume-x" : "volume-2"} size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={[styles.scrollContent, !isPortrait && { paddingHorizontal: 40 }]}
          >
            <View style={{ flexDirection: isPortrait ? 'column' : 'row', gap: 20 }}>
              
              <View style={{ flex: isPortrait ? 0 : 3 }}>
                <View style={[styles.chatCard, { 
                  backgroundColor: isDark ? colors.childrenArea.cardBg : '#ffffff',
                  shadowColor: shadowColor,
                  shadowOpacity: isDark ? 0.4 : 0.1,
                  height: isPortrait ? height * 0.6 : height * 0.65 
                }]}>
                  
                  <ScrollView ref={scrollViewRef} style={styles.messagesList} showsVerticalScrollIndicator={false}>
                     <View style={styles.chatHeader}>
                        <LinearGradient colors={['#8b5cf6', '#6366f1']} style={styles.chatAvatar}>
                          <Feather name="cpu" size={28} color="#fff" />
                        </LinearGradient>
                        <View style={styles.chatHeaderInfo}>
                          <Text style={[styles.chatHeaderTitle, { color: isDark ? colors.childrenArea.cardText : '#1f2937' }]}>
                            مرحباً بك!
                          </Text>
                          <Text style={[styles.chatHeaderSubtitle, { color: isDark ? colors.childrenArea.cardTextSecondary : '#6b7280' }]}>
                             أنا أتكلم وأسمعك! 🔊
                          </Text>
                        </View>
                      </View>

                      {messages.map((msg, index) => (
                        <View key={index} style={[
                          msg.role === 'user' ? styles.userMessage : styles.aiMessage,
                          { 
                            backgroundColor: msg.role === 'user' 
                              ? (isDark ? '#312e81' : themeColors.userBubble) 
                              : (isDark ? '#374151' : themeColors.aiBubble) 
                          }
                        ]}>
                          <Text style={[styles.messageText, { color: isDark ? colors.childrenArea.cardText : '#1f2937' }]}>
                            {msg.content}
                          </Text>
                        </View>
                      ))}

                      {isLoading && (
                        <View style={styles.loadingContainer}>
                           <ActivityIndicator size="small" color={themeColors.primary} />
                           <Text style={{ marginLeft: 8, color: '#6b7280' }}>جار التفكير...</Text>
                        </View>
                      )}
                  </ScrollView>

                  <View style={styles.chatInput}>
                    <TextInput
                      style={[styles.chatTextInput, { 
                        backgroundColor: isDark ? '#374151' : '#f9fafb',
                        borderColor: isDark ? '#4b5563' : '#e5e7eb',
                        color: isDark ? colors.childrenArea.cardText : '#1f2937',
                      }]}
                      placeholder="اكتب سؤالك هنا..."
                      placeholderTextColor="#9ca3af"
                      value={chatInput}
                      onChangeText={setChatInput}
                      onSubmitEditing={() => sendMessage()}
                    />
                    <TouchableOpacity 
                      style={[styles.sendButton, { opacity: isLoading ? 0.5 : 1 }]} 
                      onPress={() => sendMessage()}
                      disabled={isLoading}
                    >
                      <LinearGradient colors={['#8b5cf6', '#6366f1']} style={styles.sendButtonGradient}>
                        <Feather name="send" size={20} color="#fff" />
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={{ flex: isPortrait ? 0 : 2, justifyContent: 'center' }}>
                 {!isPortrait && (
                   <Text style={{color: '#fff', fontSize: 16, fontWeight:'bold', marginBottom: 12, textAlign:'center', opacity: 0.9}}>
                     ✨ أسئلة مقترحة:
                   </Text>
                 )}
                 <View style={[styles.quickQuestions, !isPortrait && { flexDirection: 'column' }]}>
                  {['ما هو الفضاء؟ 🚀', 'لماذا البحر مالح؟ 🌊', 'كيف تتنفس الأسماك؟ 🐟', 'من اخترع المصباح؟ 💡'].map((q, i) => (
                    <TouchableOpacity 
                      key={i} 
                      onPress={() => sendMessage(q)} 
                      style={[styles.quickQuestionButton, { 
                        backgroundColor: isDark ? colors.childrenArea.cardBg : '#ffffff',
                        shadowColor: shadowColor,
                        shadowOpacity: isDark ? 0.4 : 0.1,
                        width: isPortrait ? 'auto' : '100%',
                        marginBottom: isPortrait ? 0 : 8
                      }]}
                    >
                      <Text style={[styles.quickQuestionText, { color: isDark ? colors.childrenArea.cardText : '#4b5563', textAlign: isPortrait ? 'left' : 'center' }]}>
                        {q}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

            </View>
            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fullScreen: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)' },
  topBarTitle: { fontSize: 22, fontWeight: '900', color: '#fff', textShadowColor: 'rgba(0, 0, 0, 0.1)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  scrollContent: { padding: 20 },
  chatCard: { borderRadius: 24, padding: 16, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 6, display: 'flex', flexDirection: 'column' },
  messagesList: { flex: 1, marginBottom: 12 }, 
  chatHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', paddingBottom: 16 },
  chatAvatar: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  chatHeaderInfo: { marginLeft: 12 },
  chatHeaderTitle: { fontSize: 18, fontWeight: '800' },
  chatHeaderSubtitle: { fontSize: 13, fontWeight: '500' },
  userMessage: { borderRadius: 18, borderBottomRightRadius: 4, padding: 16, marginBottom: 12, alignSelf: 'flex-end', maxWidth: '85%' },
  aiMessage: { borderRadius: 18, borderTopLeftRadius: 4, padding: 16, maxWidth: '95%', alignSelf: 'flex-start', marginBottom: 12 },
  messageText: { fontSize: 15, lineHeight: 24, textAlign: 'right' },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  chatInput: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 'auto' },
  chatTextInput: { flex: 1, borderRadius: 30, paddingHorizontal: 20, paddingVertical: 12, fontSize: 15, borderWidth: 1 },
  sendButton: { overflow: 'hidden', borderRadius: 25 },
  sendButtonGradient: { width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
  quickQuestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  quickQuestionButton: { borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 },
  quickQuestionText: { fontSize: 13, fontWeight: '700' },
});