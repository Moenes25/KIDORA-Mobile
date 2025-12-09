import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Platform, 
  StatusBar, 
  TextInput,
  useWindowDimensions 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AiTutorScreen({ setScreen, isDark, colors }) {
  const [chatInput, setChatInput] = useState('');
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  const shadowColor = isDark ? '#2d1b69' : '#000';

  return (
    <View style={styles.container}>
      <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 44, backgroundColor: isDark ? '#0f0a1f' : '#34d399' }} />
      <StatusBar barStyle="light-content" />
      
      <LinearGradient colors={['#34d399', '#10b981', '#059669']} style={styles.fullScreen}>
        
        {/* Top Bar */}
        <View style={[styles.topBar, !isPortrait && { paddingVertical: 8 }, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>المعلم الذكي 🤖</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={[styles.scrollContent, !isPortrait && { paddingHorizontal: 20 }]}
        >
          {/* LANDSCAPE LAYOUT CONTAINER */}
          <View style={{ flexDirection: isPortrait ? 'column' : 'row', gap: 20 }}>
            
            {/* LEFT SIDE: Chat Interface (Takes 65% width in Landscape) */}
            <View style={{ flex: isPortrait ? 0 : 2 }}>
              <View style={[styles.chatCard, { 
                backgroundColor: isDark ? colors.childrenArea.cardBg : '#ffffff',
                shadowColor: shadowColor,
                shadowOpacity: isDark ? 0.4 : 0.1,
                marginBottom: isPortrait ? 20 : 0 // Remove margin in landscape to fit better
              }]}>
                <View style={styles.chatHeader}>
                  <LinearGradient colors={['#34d399', '#059669']} style={styles.chatAvatar}>
                    <Feather name="cpu" size={28} color="#fff" />
                  </LinearGradient>
                  <View style={styles.chatHeaderInfo}>
                    <Text style={[styles.chatHeaderTitle, { color: isDark ? colors.childrenArea.cardText : '#1f2937' }]}>
                      مرحباً بك!
                    </Text>
                    <Text style={[styles.chatHeaderSubtitle, { color: isDark ? colors.childrenArea.cardTextSecondary : '#6b7280' }]}>
                      اسألني أي سؤال
                    </Text>
                  </View>
                </View>

                {/* Messages */}
                <View style={styles.chatMessages}>
                  <View style={[styles.userMessage, { backgroundColor: isDark ? '#2d1b69' : '#dcfce7' }]}>
                    <Text style={[styles.messageText, { color: isDark ? colors.childrenArea.cardText : '#1f2937' }]}>
                      كيف يطير الطائر؟ 🐦
                    </Text>
                  </View>
                  <View style={[styles.aiMessage, { backgroundColor: isDark ? '#374151' : '#dbeafe' }]}>
                    <Text style={[styles.messageText, { color: isDark ? colors.childrenArea.cardText : '#1f2937' }]}>
                      الطائر يطير بفضل أجنحته القوية! يدفعه الهواء للأعلى. 🌤️
                    </Text>
                  </View>
                </View>

                {/* Input */}
                <View style={styles.chatInput}>
                  <TextInput
                    style={[styles.chatTextInput, { 
                      backgroundColor: isDark ? '#374151' : '#f3f4f6',
                      borderColor: isDark ? '#4b5563' : '#e5e7eb',
                      color: isDark ? colors.childrenArea.cardText : '#1f2937',
                    }]}
                    placeholder="اكتب سؤالك..."
                    placeholderTextColor={isDark ? '#9ca3af' : '#9ca3af'}
                    value={chatInput}
                    onChangeText={setChatInput}
                  />
                  <TouchableOpacity style={styles.sendButton}>
                    <LinearGradient colors={['#34d399', '#059669']} style={styles.sendButtonGradient}>
                      <Feather name="send" size={20} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* RIGHT SIDE: Quick Questions (Takes 35% width in Landscape) */}
            <View style={{ flex: 1, justifyContent: 'center' }}>
               {/* Label only visible in landscape to explain this section */}
               {!isPortrait && (
                 <Text style={{color: '#fff', fontWeight:'bold', marginBottom: 10, textAlign:'center'}}>
                   أو اختر سؤالاً:
                 </Text>
               )}
               
               <View style={[styles.quickQuestions, !isPortrait && { flexDirection: 'column' }]}>
                {['ما هو الماء؟', 'لماذا السماء زرقاء؟', 'كيف ينمو النبات؟', 'ما هي الشمس؟'].map((q, i) => (
                  <TouchableOpacity 
                    key={i} 
                    style={[styles.quickQuestionButton, { 
                      backgroundColor: isDark ? colors.childrenArea.cardBg : '#ffffff',
                      shadowColor: shadowColor,
                      shadowOpacity: isDark ? 0.4 : 0.1,
                      width: isPortrait ? 'auto' : '100%' // Full width in sidebar
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
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fullScreen: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  topBarTitle: { fontSize: 20, fontWeight: '900', color: '#fff' },
  scrollContent: { padding: 20 },
  chatCard: { borderRadius: 24, padding: 20, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 4 },
  chatHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  chatAvatar: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  chatHeaderInfo: { marginLeft: 12 },
  chatHeaderTitle: { fontSize: 20, fontWeight: '900' },
  chatHeaderSubtitle: { fontSize: 14 },
  chatMessages: { marginBottom: 20 },
  userMessage: { borderRadius: 16, padding: 16, marginBottom: 12, alignSelf: 'flex-start', maxWidth: '85%' },
  aiMessage: { borderRadius: 16, padding: 16, maxWidth: '95%' },
  messageText: { fontSize: 15, lineHeight: 22, textAlign: 'left' },
  chatInput: { flexDirection: 'row', gap: 10 },
  chatTextInput: { flex: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, borderWidth: 2 },
  sendButton: { overflow: 'hidden', borderRadius: 12 },
  sendButtonGradient: { width: 48, height: 48, justifyContent: 'center', alignItems: 'center' },
  quickQuestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  quickQuestionButton: { borderRadius: 16, paddingHorizontal: 20, paddingVertical: 12, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 4 },
  quickQuestionText: { fontSize: 14, fontWeight: '700' },
});