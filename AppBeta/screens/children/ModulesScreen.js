import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Platform, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { learningModules } from '../../data/ChildrenData';

export default function ModulesScreen({ setScreen, selectedAge, setSelectedModule, isDark, colors }) {
  // Logic for modules... (Same pattern: imports, styles, etc.)
  // Use useWindowDimensions() if you want 2 columns of modules in landscape
  
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  return (
    <View style={styles.container}>
       <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 44, backgroundColor: isDark ? '#0f0a1f' : '#60a5fa' }} />
       <StatusBar barStyle="light-content" />
       <LinearGradient colors={['#60a5fa', '#6366f1', '#8b5cf6']} style={styles.fullScreen}>
        <View style={[styles.topBar, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>وحدات التعلم</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {learningModules[selectedAge || 4]?.map((module) => (
             <TouchableOpacity
              key={module.id}
              onPress={() => {
                setSelectedModule(module);
                setScreen('lesson');
              }}
              style={[styles.moduleCard, { backgroundColor: isDark ? colors.childrenArea.cardBg : '#ffffff' }]}
            >
              <View style={styles.moduleCardInner}>
                <LinearGradient colors={module.color} style={styles.moduleIcon}>
                  <Feather name={module.icon} size={32} color="#fff" />
                </LinearGradient>
                <View style={styles.moduleInfo}>
                  <Text style={[styles.moduleTitle, { color: isDark ? colors.childrenArea.cardText : '#1f2937' }]}>
                    {module.title}
                  </Text>
                  <Text style={[styles.moduleLessons, { color: isDark ? colors.childrenArea.cardTextSecondary : '#6b7280' }]}>
                    {module.lessons} درس
                  </Text>
                </View>
              </View>
              {/* Progress bar logic... */}
            </TouchableOpacity>
          ))}
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
  moduleCard: { borderRadius: 24, padding: 20, marginBottom: 16, elevation: 4 },
  moduleCardInner: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  moduleIcon: { width: 64, height: 64, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  moduleInfo: { flex: 1, marginLeft: 16, alignItems: 'flex-end' },
  moduleTitle: { fontSize: 20, fontWeight: '900', marginBottom: 4 },
  moduleLessons: { fontSize: 14, fontWeight: '600' },
});