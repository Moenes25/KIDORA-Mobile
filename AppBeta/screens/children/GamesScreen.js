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
import { games } from '../../data/ChildrenData'; // Import shared data

export default function GamesScreen({ setScreen, isDark, colors }) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  // Shadow color based on theme
  const shadowColor = isDark ? '#2d1b69' : '#000';

  // Responsive Layout Calculations
  // In Landscape, we want 2 columns. In Portrait, just 1.
  const gap = 16;
  const padding = 20;
  const cardWidth = isPortrait 
    ? '100%' 
    : (width - (padding * 2) - gap) / 2;

  return (
    <View style={styles.container}>
      <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 44, backgroundColor: isDark ? '#0f0a1f' : '#a78bfa' }} />
      <StatusBar barStyle="light-content" />
      
      <LinearGradient colors={['#a78bfa', '#f472b6', '#f87171']} style={styles.fullScreen}>
        
        {/* Top Bar */}
        <View style={[styles.topBar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>ألعاب ممتعة</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Grid Container */}
          <View style={[styles.gridContainer, !isPortrait && styles.landscapeGrid]}>
            {games.map((game) => (
              <View 
                key={game.id} 
                style={[
                  styles.gameCard, 
                  { 
                    width: cardWidth,
                    backgroundColor: isDark ? colors.childrenArea.cardBg : '#ffffff',
                    shadowColor: shadowColor,
                    shadowOpacity: isDark ? 0.4 : 0.1,
                  }
                ]}
              >
                <View style={styles.gameCardInner}>
                  <LinearGradient colors={game.color} style={styles.gameIcon}>
                    <Feather name={game.icon} size={36} color="#fff" />
                  </LinearGradient>
                  <View style={styles.gameInfo}>
                    <Text style={[styles.gameTitle, { color: isDark ? colors.childrenArea.cardText : '#1f2937' }]}>
                      {game.title}
                    </Text>
                    <Text style={[styles.gameLevels, { color: isDark ? colors.childrenArea.cardTextSecondary : '#6b7280' }]}>
                      {game.levels} مستوى
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity style={styles.playButton}>
                  <LinearGradient colors={game.color} style={styles.playButtonGradient}>
                    <Text style={styles.playButtonText}>العب الآن</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ))}
          </View>

        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreen: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  gridContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  landscapeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gameCard: {
    borderRadius: 24,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    // Note: marginBottom is handled by 'gap' in the grid container, 
    // but needed for older RN versions or fallback
    marginBottom: 0, 
  },
  gameCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  gameIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameInfo: {
    flex: 1,
    marginLeft: 16,
    alignItems: 'flex-end',
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
  },
  gameLevels: {
    fontSize: 14,
    fontWeight: '600',
  },
  playButton: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  playButtonGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});