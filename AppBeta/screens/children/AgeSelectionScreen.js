import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Platform, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SpaceBackground from '../../components/SpaceBackground';

export default function AgeSelectionScreen({ setScreen, setSelectedAge }) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  // Dynamic Card sizing
  // In Portrait, cards take about 1/3 of width.
  // In Landscape, cards take about 1/3 of the RIGHT HALF of the screen (smaller relative to total width, but physically similar).
  const cardWidth = isPortrait 
    ? (width - 60) / 3  // 60 = gap(20*2) + padding(20) roughly
    : (width * 0.5 - 60) / 3; // Use half screen width for grid calculation

  return (
    <SpaceBackground theme="purple" isPortrait={isPortrait}>
      <View style={styles.container}>
        <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 44 }} />
        <StatusBar barStyle="light-content" />
        
        <ScrollView 
          contentContainerStyle={[
            styles.centerContent, 
            !isPortrait && styles.centerContentLandscape // Switch layout direction
          ]} 
          showsVerticalScrollIndicator={false}
        >
          
          {/* HEADER SECTION */}
          {/* Landscape: Moves to Left Side */}
          <View style={[
            styles.headerSection, 
            !isPortrait && styles.headerSectionLandscape
          ]}>
            <View style={[
              styles.iconCircle, 
              { backgroundColor: 'rgba(255,255,255,0.2)' },
              !isPortrait && { width: 80, height: 80, borderRadius: 40, marginBottom: 16 } // Smaller icon in landscape
            ]}>
              <Feather name="star" size={isPortrait ? 60 : 40} color="#fff" />
            </View>
            <Text style={[styles.mainTitle, !isPortrait && { fontSize: 28 }]}>عالم التعلم السحري</Text>
            <Text style={[styles.subtitle, !isPortrait && { fontSize: 16 }]}>اختر عمرك لنبدأ المغامرة!</Text>
          </View>

          {/* GRID SECTION */}
          {/* Landscape: Moves to Right Side */}
          <View style={[
            styles.ageGrid,
            !isPortrait && styles.ageGridLandscape
          ]}>
            {[4, 5, 6].map((age) => (
              <TouchableOpacity
                key={age}
                onPress={() => {
                  setSelectedAge(age);
                  setScreen('home');
                }}
                style={{ width: Math.max(90, cardWidth) }} // Dynamic Width with safety minimum
              >
                <LinearGradient 
                  colors={['#fef3c7', '#fde68a']} 
                  style={[
                    styles.ageCardGradient,
                    !isPortrait && { padding: 16 } // Slightly tighter padding in landscape
                  ]}
                >
                  <Text style={[styles.ageEmoji, !isPortrait && { fontSize: 36 }]}>🎈</Text>
                  <Text style={[styles.ageNumber, !isPortrait && { fontSize: 40 }]}>{age}</Text>
                  <Text style={[styles.ageLabel, !isPortrait && { fontSize: 14 }]}>سنوات</Text>
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
  // Switch to Row layout in Landscape
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
    alignItems: 'center', // Keep text centered relative to itself
    flex: 1, // Take up left side space
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
    gap: 20 
  },
  ageGridLandscape: {
    flex: 1.5, // Grid takes slightly more width than header
    justifyContent: 'center',
    gap: 16
  },
  
  ageCardGradient: { 
    borderRadius: 24, 
    padding: 20, 
    alignItems: 'center', 
    elevation: 8,
    // Add shadow props for iOS consistency
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  ageEmoji: { 
    fontSize: 48, 
    marginBottom: 10 
  },
  ageNumber: { 
    fontSize: 48, 
    fontWeight: '900', 
    color: '#8b5cf6' 
  },
  ageLabel: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#6b7280' 
  },
});