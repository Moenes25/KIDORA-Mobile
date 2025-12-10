import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar, 
  Platform, 
  useWindowDimensions 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { learningModules } from '../../data/ChildrenData';

export default function ModulesScreen({ setScreen, selectedAge, setSelectedModule, isDark, colors }) {
  
  // 1. Get Screen Dimensions for Grid Calculation
  const { width } = useWindowDimensions();
  
  // Landscape Logic: If width > 600 (typical landscape phone), use 2 columns. Otherwise 1.
  const isLandscape = width > 500; 
  const numColumns = isLandscape ? 2 : 1;
  const gap = 16;
  const padding = 20;
  
  // Calculate specific card width based on columns
  // (Total Width - Padding - Gaps) / Number of Columns
  const cardWidth = (width - (padding * 2) - (gap * (numColumns - 1))) / numColumns;

  // 2. Safe Data Access
  // Ensure we have data to map over. If selectedAge is null, default to 4 (or your default age key)
  const currentModules = learningModules[selectedAge] || learningModules[4] || [];

  return (
    <View style={styles.container}>
       {/* Top Status Bar Spacer */}
       <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 0, backgroundColor: isDark ? '#0f0a1f' : '#60a5fa' }} />
       <StatusBar hidden={true} /> 

       <LinearGradient colors={['#60a5fa', '#6366f1', '#8b5cf6']} style={styles.fullScreen}>
        
        {/* Top Bar */}
        <View style={[styles.topBar, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>وحدات التعلم</Text>
          <View style={{ width: 40 }} /> 
        </View>

        {/* Content Area */}
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          {/* Grid Container */}
          <View style={styles.gridContainer}>
            {currentModules.map((module) => (
               <TouchableOpacity
                key={module.id}
                onPress={() => {
                  setSelectedModule(module);
                  setScreen('lesson');
                }}
                activeOpacity={0.9}
                style={[
                  styles.moduleCard, 
                  { 
                    width: cardWidth, // Apply calculated width
                    backgroundColor: isDark ? colors.childrenArea.cardBg : '#ffffff' 
                  }
                ]}
              >
                {/* Upper Card: Icon & Text */}
                <View style={styles.moduleCardInner}>
                  {/* Icon Box */}
                  <LinearGradient colors={module.color} style={styles.moduleIcon}>
                    <Feather name={module.icon} size={28} color="#fff" />
                  </LinearGradient>
                  
                  {/* Text Info */}
                  <View style={styles.moduleInfo}>
                    <Text style={[styles.moduleTitle, { color: isDark ? colors.childrenArea.cardText : '#1f2937' }]}>
                      {module.title}
                    </Text>
                    <Text style={[styles.moduleLessons, { color: isDark ? colors.childrenArea.cardTextSecondary : '#6b7280' }]}>
                      {module.lessons} درس
                    </Text>
                  </View>
                </View>

                {/* Progress Bar (Restored) */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressTextRow}>
                    <Text style={styles.progressPercentage}>0%</Text>
                    <Text style={styles.progressLabel}>مكتمل</Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: '5%', backgroundColor: module.color[0] }]} />
                  </View>
                </View>

              </TouchableOpacity>
            ))}
          </View>
          
          {/* Spacer at bottom for easier scrolling */}
          <View style={{ height: 40 }} />
        </ScrollView>
       </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fullScreen: { flex: 1 },
  
  // Top Bar
  topBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 16,
    paddingVertical: 12, // Reduced vertical padding for Landscape
  },
  backButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)'
  },
  topBarTitle: { 
    fontSize: 20, 
    fontWeight: '900', 
    color: '#fff',
    textAlign: 'center'
  },

  // Scroll Content
  scrollContent: { 
    padding: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Keeps items spaced nicely
    gap: 16, // If gap isn't supported in your RN version, use margins
  },

  // Card Styling
  moduleCard: { 
    borderRadius: 20, 
    padding: 16, 
    marginBottom: 8, // Reduced margin since we use gap
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moduleCardInner: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  moduleIcon: { 
    width: 56, // Slightly smaller for landscape
    height: 56, 
    borderRadius: 16, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  moduleInfo: { 
    flex: 1, 
    marginLeft: 12, 
    alignItems: 'flex-end' // RTL Alignment
  },
  moduleTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 4,
    textAlign: 'right' 
  },
  moduleLessons: { 
    fontSize: 13, 
    fontWeight: '600',
    textAlign: 'right'
  },

  // Progress Bar Styles
  progressContainer: {
    marginTop: 4,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600'
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280'
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  }
});