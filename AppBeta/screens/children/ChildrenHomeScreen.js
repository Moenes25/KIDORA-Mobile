import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SpaceBackground from '../../components/SpaceBackground';

const { width, height } = Dimensions.get('window');
const isLandscape = width > height;

export default function ChildrenHomeScreen({ 
  setScreen, 
  coins = 2500, 
  level = 1, 
  selectedAge, 
  setSelectedAge,
  setSelectedSubject, // Add this prop to store selected subject
  isDark, 
  colors 
}) {

  // Subject categories with proper routes
  const categories = [
    { id: 'languages', name: 'اللغات', icon: '📚', color: '#FF6B9D', subject: 'languages' },
    { id: 'math', name: 'الرياضيات', icon: '🔢', color: '#4ECDC4', subject: 'math' },
    { id: 'science', name: 'العلوم', icon: '🔬', color: '#95E1D3', subject: 'science' },
    { id: 'art', name: 'الفنون', icon: '🎨', color: '#FFD93D', subject: 'art' },
    { id: 'social', name: 'المهارات', icon: '🤝', color: '#A8E6CF', subject: 'social' },
    { id: 'stories', name: 'قصص', icon: '📖', color: '#FFB6C1', subject: 'stories' },
  ];

  // AI-Powered Special Features
  const aiFeatures = [
    { id: 'ai-tutor', name: 'المعلم الذكي', icon: '🤖', color: '#667EEA', route: 'ai-tutor' },
    { id: 'ai-games', name: 'ألعاب ذكية', icon: '🎮', color: '#F093FB', route: 'games' },
    { id: 'rewards', name: 'الجوائز', icon: '🎡', color: '#FFA500', route: 'rewards' },
  ];

  const handleCategoryPress = (category) => {
    if (setScreen && typeof setScreen === 'function') {
      // Set the selected subject if the function exists
      if (setSelectedSubject && typeof setSelectedSubject === 'function') {
        setSelectedSubject(category.subject);
      }
      // Navigate to modules screen to show learning modules for this subject
      setScreen('modules');
    }
  };

  const handleFeaturePress = (route) => {
    if (setScreen && typeof setScreen === 'function') {
      setScreen(route);
    }
  };

  const handleChangeAge = () => {
    if (setScreen && typeof setScreen === 'function') {
      setScreen('age-select');
    }
  };

  return (
    <SpaceBackground theme="purple" isPortrait={!isLandscape}>
      <View style={styles.container}>
        {/* Header with Robot Mascot */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.robotContainer}>
              <Text style={styles.robotEmoji}>🤖</Text>
            </View>
            <View>
              <Text style={styles.welcomeText}>مرحباً!</Text>
              <TouchableOpacity onPress={handleChangeAge}>
                <Text style={styles.ageText}>العمر: {selectedAge || '4-5'} 🔄</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.headerRight}>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>⭐ {level}</Text>
            </View>
            <View style={styles.coinsBadge}>
              <Text style={styles.coinText}>💰 {coins}</Text>
            </View>
            <TouchableOpacity 
              style={styles.storeButton}
              onPress={() => handleFeaturePress('store')}
            >
              <Ionicons name="cart" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* AI Features Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ ميزات خاصة بالذكاء الاصطناعي</Text>
            <View style={styles.aiGrid}>
              {aiFeatures.map((feature) => (
                <TouchableOpacity
                  key={feature.id}
                  style={[styles.aiCard, { backgroundColor: feature.color }]}
                  onPress={() => handleFeaturePress(feature.route)}
                >
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <Text style={styles.featureName}>{feature.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Main Categories - Cloud Style */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 اختر المادة</Text>
            <View style={styles.cloudGrid}>
              {categories.map((category, index) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.cloudButton,
                    { backgroundColor: category.color },
                    index % 2 === 0 ? styles.cloudLeft : styles.cloudRight
                  ]}
                  onPress={() => handleCategoryPress(category)}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressCard}>
              <Text style={styles.progressTitle}>📊 تقدمك اليوم</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '60%' }]} />
              </View>
              <Text style={styles.progressText}>٣ دروس من ٥ ✓</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navButton}>
            <Ionicons name="home" size={22} color="#9333EA" />
            <Text style={[styles.navText, styles.navTextActive]}>الرئيسية</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => handleFeaturePress('modules')}
          >
            <Ionicons name="book" size={22} color="#95A5A6" />
            <Text style={styles.navText}>مدرستنا</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => handleFeaturePress('games')}
          >
            <Ionicons name="game-controller" size={22} color="#95A5A6" />
            <Text style={styles.navText}>ألعاب</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => handleFeaturePress('ai-tutor')}
          >
            <Ionicons name="chatbubbles" size={22} color="#95A5A6" />
            <Text style={styles.navText}>المعلم</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={handleChangeAge}
          >
            <Ionicons name="settings" size={22} color="#95A5A6" />
            <Text style={styles.navText}>الإعدادات</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SpaceBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  robotContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#9333EA',
  },
  robotEmoji: {
    fontSize: 24,
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  ageText: {
    fontSize: 10,
    color: '#9333EA',
    fontWeight: '600',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  levelBadge: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#9333EA',
  },
  levelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9333EA',
  },
  coinsBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  coinText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  storeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#9333EA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
    textAlign: 'right',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  aiGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  aiCard: {
    flex: 1,
    height: 85,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  featureIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  featureName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  cloudGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
  cloudButton: {
    width: '31.5%',
    height: 75,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  cloudLeft: {
    transform: [{ rotate: '-2deg' }],
  },
  cloudRight: {
    transform: [{ rotate: '2deg' }],
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 2,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    paddingHorizontal: 4,
  },
  progressSection: {
    marginTop: 6,
  },
  progressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'rgba(147, 51, 234, 0.2)',
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
    textAlign: 'right',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#9333EA',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#7F8C8D',
    textAlign: 'right',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  navText: {
    fontSize: 9,
    color: '#95A5A6',
    marginTop: 2,
  },
  navTextActive: {
    color: '#9333EA',
    fontWeight: 'bold',
  },
});