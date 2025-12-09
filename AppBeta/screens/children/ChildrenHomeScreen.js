import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Platform, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SpaceBackground from '../../components/SpaceBackground';

export default function ChildrenHomeScreen({ setScreen, coins, level, isDark, colors }) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  // LANDSCAPE OPTIMIZATION:
  // 1. In Landscape, show 4 columns (all items in one row)
  // 2. Reduce padding to fit screen
  const numColumns = isPortrait ? 2 : 4; 
  const padding = isPortrait ? 20 : 40; // More side padding in landscape
  const gap = 16;
  
  const gridItemWidth = (width - (padding * 2) - (gap * (numColumns - 1))) / numColumns;

  return (
    <SpaceBackground theme="blue" isPortrait={isPortrait}>
      <View style={styles.container}>
        <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 44 }} />
        <StatusBar barStyle="light-content" />
        
        {/* Header - Compact in Landscape */}
        <View style={[styles.header, !isPortrait && styles.headerLandscape, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
          <View style={styles.headerLeft}>
            <View style={[styles.avatarCircle, !isPortrait && { width: 40, height: 40 }]}>
              <Text style={[styles.avatarEmoji, !isPortrait && { fontSize: 20 }]}>😊</Text>
            </View>
            <View>
              <Text style={styles.headerName}>البطل الصغير</Text>
              {!isPortrait ? null : <Text style={styles.headerLevel}>المستوى {level}</Text>}
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.coinsContainer}>
              <Feather name="star" size={16} color="#fbbf24" />
              <Text style={styles.coinsText}>{coins}</Text>
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.homeContent, { padding }]}>
          <Text style={[styles.homeTitle, !isPortrait && { fontSize: 22, marginBottom: 10 }]}>
            ماذا تريد أن تفعل اليوم؟
          </Text>

          <View style={[styles.mainGrid, { flexDirection: 'row', flexWrap: 'wrap', gap }]}>
            {[
              { id: 'modules', title: 'التعلم', sub: 'دروس', icon: 'book', grad: ['#60a5fa', '#3b82f6'] },
              { id: 'games', title: 'الألعاب', sub: 'مرح', icon: 'play', grad: ['#a78bfa', '#8b5cf6'] },
              { id: 'ai-tutor', title: 'المعلم', sub: 'اسأل', icon: 'cpu', grad: ['#34d399', '#059669'] },
              { id: 'store', title: 'المتجر', sub: 'أزياء', icon: 'shopping-bag', grad: ['#fb923c', '#f97316'] }
            ].map((item) => (
              <TouchableOpacity 
                key={item.id} 
                onPress={() => setScreen(item.id)} 
                style={[styles.mainCard, { width: gridItemWidth }]}
              >
                <View style={[
                  styles.mainCardInner, 
                  !isPortrait && styles.mainCardInnerLandscape, // Compact inner card
                  { backgroundColor: isDark ? colors.childrenArea.cardBg : '#ffffff' }
                ]}>
                  <LinearGradient 
                    colors={item.grad} 
                    style={[styles.mainCardIcon, !isPortrait && { width: 50, height: 50, marginBottom: 8 }]}
                  >
                    <Feather name={item.icon} size={isPortrait ? 40 : 24} color="#fff" />
                  </LinearGradient>
                  
                  <Text style={[
                    styles.mainCardTitle, 
                    !isPortrait && { fontSize: 16, marginBottom: 2 },
                    { color: isDark ? colors.childrenArea.cardText : '#1f2937' }
                  ]}>{item.title}</Text>
                  
                  {isPortrait && (
                    <Text style={[styles.mainCardSubtitle, { color: isDark ? colors.childrenArea.cardTextSecondary : '#6b7280' }]}>
                      {item.sub}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SpaceBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerLandscape: { paddingVertical: 8 }, // Smaller header in landscape
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center' },
  avatarEmoji: { fontSize: 28 },
  headerName: { fontSize: 16, fontWeight: '700', color: '#fff' },
  headerLevel: { fontSize: 13, color: 'rgba(255,255,255,0.9)' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  coinsContainer: { backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
  coinsText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  homeContent: { flexGrow: 1, justifyContent: 'center' }, // Center content vertically
  homeTitle: { fontSize: 28, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 24 },
  mainCard: { marginBottom: 0 },
  mainCardInner: { borderRadius: 24, padding: 24, alignItems: 'center', elevation: 8 },
  mainCardInnerLandscape: { padding: 12, borderRadius: 16 }, // Smaller padding in landscape
  mainCardIcon: { width: 80, height: 80, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  mainCardTitle: { fontSize: 20, fontWeight: '900', marginBottom: 6, textAlign: 'center' },
  mainCardSubtitle: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
});