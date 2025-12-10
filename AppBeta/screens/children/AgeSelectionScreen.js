import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Platform, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SpaceBackground from '../../components/SpaceBackground';

export default function AgeSelectionScreen({ setScreen, setSelectedAge }) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  // Dynamic Card sizing
  // In Portrait, cards take about 1/4 of width (now 4 cards).
  // In Landscape, cards take about 1/4 of the RIGHT HALF of the screen.
  const cardWidth = isPortrait 
    ? (width - 80) / 4  // 80 = gap(20*3) + padding(20*2) roughly
    : (width * 0.5 - 80) / 4; // Use half screen width for grid calculation

  return (
    <SpaceBackground theme="purple" isPortrait={isPortrait}>
      <View style={styles.container}>
        <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 44 }} />
        <StatusBar barStyle="light-content" />
        
        <ScrollView 
          contentContainerStyle={[
            styles.centerContent, 
            !isPortrait && styles.centerContentLandscape
          ]} 
          showsVerticalScrollIndicator={false}
        >
          
          {/* HEADER SECTION */}
          <View style={[
            styles.headerSection, 
            !isPortrait && styles.headerSectionLandscape
          ]}>
            <View style={[
              styles.iconCircle, 
              { backgroundColor: 'rgba(255,255,255,0.2)' },
              !isPortrait && { width: 80, height: 80, borderRadius: 40, marginBottom: 16 }
            ]}>
              <Feather name="star" size={isPortrait ? 60 : 40} color="#fff" />
            </View>
            <Text style={[styles.mainTitle, !isPortrait && { fontSize: 28 }]}>عالم التعلم السحري</Text>
            <Text style={[styles.subtitle, !isPortrait && { fontSize: 16 }]}>اختر عمرك لنبدأ المغامرة!</Text>
          </View>

          {/* GRID SECTION - Now includes age 3 */}
          <View style={[
            styles.ageGrid,
            !isPortrait && styles.ageGridLandscape
          ]}>
            {[3, 4, 5, 6].map((age) => (
              <TouchableOpacity
                key={age}
                onPress={() => {
                  setSelectedAge(age);
                  setScreen('home');
                }}
                style={{ width: Math.max(80, cardWidth) }} // Dynamic Width with safety minimum
              >
                <LinearGradient 
                  colors={['#fef3c7', '#fde68a']} 
                  style={[
                    styles.ageCardGradient,
                    !isPortrait && { padding: 14 }
                  ]}
                >
                  <Text style={[styles.ageEmoji, !isPortrait && { fontSize: 32 }]}>🎈</Text>
                  <Text style={[styles.ageNumber, !isPortrait && { fontSize: 36 }]}>{age}</Text>
                  <Text style={[styles.ageLabel, !isPortrait && { fontSize: 13 }]}>سنوات</Text>
                </LinearGradient>
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
  centerContent: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  centerContentLandscape: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  
  headerSection: { 
    alignItems: 'center', 
    marginBottom: 40 
  },
  headerSectionLandscape: {
    marginBottom: 0,
    alignItems: 'center',
    flex: 1,
    paddingRight: 20,
  },
  
  iconCircle: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  mainTitle: { 
    fontSize: 36, 
    fontWeight: '900', 
    color: '#fff', 
    textAlign: 'center', 
    marginBottom: 10 
  },
  subtitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: 'rgba(255,255,255,0.9)', 
    textAlign: 'center' 
  },
  
  ageGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center', 
    gap: 16 
  },
  ageGridLandscape: {
    flex: 1.5,
    justifyContent: 'center',
    gap: 14
  },
  
  ageCardGradient: { 
    borderRadius: 20, 
    padding: 16, 
    alignItems: 'center', 
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  ageEmoji: { 
    fontSize: 40, 
    marginBottom: 8 
  },
  ageNumber: { 
    fontSize: 42, 
    fontWeight: '900', 
    color: '#8b5cf6' 
  },
  ageLabel: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#6b7280' 
  },
});