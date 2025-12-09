import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Platform, 
  StatusBar, 
  useWindowDimensions 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function LessonScreen({ setScreen, coins, setCoins, isDark, colors }) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;
  
  const shadowColor = isDark ? '#2d1b69' : '#000';

  return (
    <View style={styles.container}>
      <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 44, backgroundColor: isDark ? '#0f0a1f' : '#fbbf24' }} />
      <StatusBar barStyle="light-content" />
      
      <LinearGradient colors={['#fbbf24', '#fb923c', '#f87171']} style={styles.fullScreen}>
        
        {/* Top Bar */}
        <View style={[styles.topBar, !isPortrait && { paddingVertical: 8 }, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <TouchableOpacity onPress={() => setScreen('modules')} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          {/* Hide Coins in Landscape if space is tight, or just keep small */}
          <View style={styles.coinsContainer}>
            <Feather name="star" size={18} color="#fbbf24" />
            <Text style={[styles.coinsText, { color: '#fff' }]}>{coins}</Text>
          </View>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={[styles.scrollContent, !isPortrait && { paddingHorizontal: 40 }]}
        >
          {/* Progress Card - Make full width but compact in landscape */}
          <View style={[styles.lessonProgressCard, { 
            backgroundColor: isDark ? colors.childrenArea.cardBg : '#ffffff',
            shadowColor: shadowColor,
            shadowOpacity: isDark ? 0.4 : 0.1,
            marginBottom: isPortrait ? 16 : 20
          }]}>
            <View style={[styles.lessonProgressHeader, !isPortrait && { marginBottom: 6 }]}>
              <Text style={[styles.lessonProgressText, { color: isDark ? colors.childrenArea.cardTextSecondary : '#4b5563' }]}>
                الدرس 2 من 9
              </Text>
              {!isPortrait ? null : <Text style={styles.lessonProgressEmoji}>📚</Text>}
            </View>
            <View style={[styles.progressBar, { backgroundColor: isDark ? '#374151' : '#e5e7eb' }]}>
              <LinearGradient colors={['#34d399', '#059669']} style={[styles.progressFill, { width: '22%' }]} />
            </View>
          </View>

          {/* LANDSCAPE SPLIT VIEW CONTAINER */}
          <View style={{ flexDirection: isPortrait ? 'column' : 'row', gap: 20 }}>
            
            {/* LEFT SIDE: Content (Text & Audio) */}
            <View style={{ flex: 1 }}>
              <View style={[styles.lessonContentCard, { 
                backgroundColor: isDark ? colors.childrenArea.cardBg : '#ffffff',
                shadowColor: shadowColor,
                shadowOpacity: isDark ? 0.4 : 0.1,
                // In landscape, we want the card to be compact
              }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                   {/* Smaller Emoji in Landscape side-by-side with title */}
                  <Text style={[styles.lessonEmoji, !isPortrait && { fontSize: 40, marginBottom: 0, marginRight: 10 }]}>🦁</Text>
                  <Text style={[styles.lessonTitle, !isPortrait && { fontSize: 22, marginBottom: 0 }, { color: isDark ? colors.childrenArea.cardText : '#1f2937' }]}>
                    الأسد الملك
                  </Text>
                </View>

                <Text style={[styles.lessonText, !isPortrait && { fontSize: 16, lineHeight: 24, marginVertical: 10 }, { color: isDark ? colors.childrenArea.cardTextSecondary : '#4b5563' }]}>
                  الأسد هو ملك الغابة. يعيش في أفريقيا وله صوت قوي يسمى الزئير. 
                  الأسد حيوان قوي وشجاع.
                </Text>

                <TouchableOpacity style={[styles.audioButton, !isPortrait && { marginBottom: 0 }]}>
                  <LinearGradient colors={['#3b82f6', '#6366f1']} style={[styles.audioButtonGradient, !isPortrait && { paddingVertical: 12 }]}>
                    <Feather name="volume-2" size={20} color="#fff" />
                    <Text style={[styles.audioButtonText, !isPortrait && { fontSize: 16 }]}>استمع للدرس</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            {/* RIGHT SIDE: Interactive (Question & Navigation) */}
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
              <View style={[styles.questionBox, { backgroundColor: isDark ? '#2d1b69' : '#faf5ff' }]}>
                <Text style={[styles.questionText, !isPortrait && { fontSize: 16, marginBottom: 10 }, { color: isDark ? colors.childrenArea.cardText : '#1f2937' }]}>
                  أين يعيش الأسد؟
                </Text>
                
                {/* Options */}
                {['في البحر 🌊', 'في أفريقيا 🌍', 'في القطب الشمالي ❄️'].map((option, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => {
                      if (i === 1) { setCoins(coins + 50); alert('إجابة صحيحة! +50 نقطة'); }
                    }}
                    style={[
                      styles.optionButton, 
                      // Compact buttons in landscape
                      !isPortrait && { padding: 12, marginBottom: 8 },
                      { 
                        backgroundColor: isDark ? colors.childrenArea.cardBg : '#ffffff',
                        shadowColor: shadowColor,
                        shadowOpacity: isDark ? 0.4 : 0.05,
                      }
                    ]}
                  >
                    <Text style={[styles.optionText, { color: isDark ? colors.childrenArea.cardText : '#4b5563' }]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Navigation moved to bottom right column in Landscape */}
              <View style={[styles.lessonNavigation, !isPortrait && { marginTop: 10 }]}>
                <TouchableOpacity style={[styles.navButtonSecondary, { 
                  backgroundColor: isDark ? colors.childrenArea.cardBg : '#ffffff',
                  shadowColor: shadowColor,
                  shadowOpacity: isDark ? 0.4 : 0.1,
                  paddingVertical: isPortrait ? 16 : 12 // Smaller padding
                }]}>
                  <Text style={[styles.navButtonSecondaryText, { color: isDark ? colors.childrenArea.cardText : '#4b5563' }]}>
                    السابق
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navButtonPrimary}>
                  <LinearGradient colors={['#34d399', '#059669']} style={[styles.navButtonGradient, !isPortrait && { paddingVertical: 12 }]}>
                    <Text style={styles.navButtonPrimaryText}>التالي</Text>
                  </LinearGradient>
                </TouchableOpacity>
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
  coinsContainer: { backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
  coinsText: { fontSize: 15, fontWeight: '700' },
  scrollContent: { padding: 20 },
  lessonProgressCard: { borderRadius: 20, padding: 20, marginBottom: 16, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 4 },
  lessonProgressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  lessonProgressText: { fontSize: 16, fontWeight: '700' },
  lessonProgressEmoji: { fontSize: 24 },
  progressBar: { height: 10, borderRadius: 5, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 5 },
  lessonContentCard: { borderRadius: 24, padding: 24, marginBottom: 16, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 4 },
  lessonEmoji: { fontSize: 80, textAlign: 'center', marginBottom: 16 },
  lessonTitle: { fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 12 },
  lessonText: { fontSize: 18, lineHeight: 28, textAlign: 'center', marginBottom: 24 },
  audioButton: { marginBottom: 16 },
  audioButtonGradient: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, paddingVertical: 16, borderRadius: 16 },
  audioButtonText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  questionBox: { borderRadius: 20, padding: 20 },
  questionText: { fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  optionButton: { padding: 16, borderRadius: 12, marginBottom: 10, shadowOffset: { width: 0, height: 1 }, shadowRadius: 4, elevation: 2 },
  optionText: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  lessonNavigation: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  navButtonSecondary: { flex: 1, paddingVertical: 16, borderRadius: 16, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 4 },
  navButtonSecondaryText: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  navButtonPrimary: { flex: 1 },
  navButtonGradient: { paddingVertical: 16, borderRadius: 16, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 4 },
  navButtonPrimaryText: { fontSize: 18, fontWeight: '700', color: '#fff', textAlign: 'center' },
});