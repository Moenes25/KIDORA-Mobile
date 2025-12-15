import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SpaceBackground from '../../components/SpaceBackground';

const { width, height } = Dimensions.get('window');
const isLandscape = width > height;

export default function AgeSelectionScreen({ setScreen, setSelectedAge }) {
  const ageGroups = [
    { age: '4-5', label: 'سنوات', emoji: '🎈', color: ['#fef3c7', '#fde68a'], grade: 'التحضيري' },
    { age: '6-7', label: 'سنوات', emoji: '📚', color: ['#ddd6fe', '#c4b5fd'], grade: 'السنة الأولى' },
    { age: '8-9', label: 'سنوات', emoji: '⭐', color: ['#bfdbfe', '#93c5fd'], grade: 'السنة 2-3' },
    { age: '10-11', label: 'سنة', emoji: '🎯', color: ['#bbf7d0', '#86efac'], grade: 'السنة 4-5' },
    { age: '12', label: 'سنة', emoji: '🏆', color: ['#fecaca', '#fca5a5'], grade: 'السنة السادسة' },
  ];

  const handleSelectAge = (age) => {
    if (setSelectedAge && typeof setSelectedAge === 'function') {
      setSelectedAge(age);
    }
    if (setScreen && typeof setScreen === 'function') {
      setScreen('home');
    }
  };

  return (
    <SpaceBackground theme="purple" isPortrait={!isLandscape}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.iconCircle}>
              <Ionicons name="school" size={40} color="#fff" />
            </View>
            <Text style={styles.mainTitle}>عالم التعلم السحري</Text>
            <Text style={styles.subtitle}>اختر عمرك لنبدأ المغامرة!</Text>
          </View>

          {/* Age Cards Grid */}
          <View style={styles.ageCardsGrid}>
            {ageGroups.map((group, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectAge(group.age)}
                style={styles.ageCardWrapper}
              >
                <LinearGradient
                  colors={group.color}
                  style={styles.ageCard}
                >
                  <Text style={styles.ageCardEmoji}>{group.emoji}</Text>
                  <Text style={styles.ageCardNumber}>{group.age}</Text>
                  <Text style={styles.ageCardLabel}>{group.label}</Text>
                  <View style={styles.gradeTag}>
                    <Text style={styles.gradeText}>{group.grade}</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SpaceBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 900,
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  headerSection: {
    alignItems: 'center',
    flex: 1,
    paddingRight: 30,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  ageCardsGrid: {
    flex: 1.5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  ageCardWrapper: {
    width: '18%',
    minWidth: 85,
  },
  ageCard: {
    borderRadius: 16,
    padding: 10,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    minHeight: 130,
    justifyContent: 'center',
  },
  ageCardEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  ageCardNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#8b5cf6',
  },
  ageCardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6b7280',
    marginBottom: 4,
  },
  gradeTag: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2,
  },
  gradeText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#8b5cf6',
    textAlign: 'center',
  },
});