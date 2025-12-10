import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Platform, useWindowDimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SpaceBackground from '../../components/SpaceBackground';
import { skins } from '../../data/ChildrenData';

export default function StoreScreen({ setScreen, coins, setCoins, ownedSkins, setOwnedSkins, equippedSkin, setEquippedSkin, isDark, colors }) {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  // Layout Logic
  const numColumns = isPortrait ? 2 : 3;
  const padding = 20;
  const gap = 16;
  const containerWidth = isPortrait ? width : width * 0.6; 
  const skinCardWidth = (containerWidth - (padding * 2) - (gap * (numColumns - 1))) / numColumns;
  const shadowColor = isDark ? '#2d1b69' : '#000';

  return (
    <SpaceBackground theme="orange" isPortrait={isPortrait}>
      <View style={styles.container}>
        <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 44 }} />
        <StatusBar barStyle="light-content" />
        
        <View style={[styles.topBar, !isPortrait && { paddingVertical: 8 }, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>متجر الأزياء</Text>
          <View style={styles.coinsContainer}>
            <Feather name="star" size={18} color="#fbbf24" />
            <Text style={[styles.coinsText, { color: '#fff' }]}>{coins}</Text>
          </View>
        </View>

        {/* Content Wrapper */}
        <View style={{ flex: 1, flexDirection: isPortrait ? 'column' : 'row' }}>
          
          {/* LEFT SIDE: Character Preview */}
          <View style={[
            styles.previewContainer, 
            !isPortrait && { width: '40%', padding: 20, justifyContent: 'center' }
          ]}>
            <View style={[styles.characterPreview, { backgroundColor: isDark ? colors.childrenArea.cardBg : '#ffffff', shadowColor }]}>
              <Text style={styles.characterEmoji}>😊</Text>
              <Text style={[styles.characterTitle, { color: isDark ? colors.childrenArea.cardText : '#1f2937' }]}>بطلك</Text>
              <View style={styles.equippedItems}>
                {ownedSkins.map((skinId) => {
                  const skin = skins.find(s => s.id === skinId);
                  return skin ? <Feather key={skinId} name={skin.icon} size={24} color={skin.color} /> : null;
                })}
              </View>
            </View>
          </View>

          {/* RIGHT SIDE: Scrollable Store */}
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={[styles.scrollContent, !isPortrait && { paddingLeft: 0 }]}
            style={!isPortrait && { width: '60%' }}
          >
            <View style={styles.skinsGrid}>
              {skins.map((skin) => {
                const owned = ownedSkins.includes(skin.id);
                const equipped = equippedSkin === skin.id;
                const canBuy = coins >= skin.price;

                return (
                  <View key={skin.id} style={[styles.skinCard, { width: skinCardWidth, backgroundColor: isDark ? colors.childrenArea.cardBg : '#ffffff', shadowColor }]}>
                    <View style={[styles.skinPreview, { backgroundColor: skin.color }, equipped && styles.skinEquipped]}>
                      <Feather name={skin.icon} size={32} color="#fff" />
                    </View>
                    <Text style={[styles.skinName, { color: isDark ? colors.childrenArea.cardText : '#1f2937' }]}>{skin.name}</Text>
                    
                    {owned ? (
                      <TouchableOpacity onPress={() => setEquippedSkin(skin.id)} style={[styles.skinButton, equipped ? styles.skinButtonEquipped : styles.skinButtonOwned]}>
                        <Text style={[styles.skinButtonText, equipped ? styles.skinButtonTextEquipped : styles.skinButtonTextOwned]}>
                          {equipped ? '✓' : 'ارتداء'}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={() => { if (canBuy) { setCoins(coins - skin.price); setOwnedSkins([...ownedSkins, skin.id]); } }} disabled={!canBuy} style={styles.skinButton}>
                        <LinearGradient colors={canBuy ? ['#34d399', '#059669'] : ['#d1d5db', '#9ca3af']} style={styles.skinButtonGradient}>
                          <Text style={styles.skinButtonTextBuy}>{skin.price}</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>

      </View>
    </SpaceBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  topBarTitle: { fontSize: 20, fontWeight: '900', color: '#fff' },
  coinsContainer: { backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 6 },
  coinsText: { fontSize: 15, fontWeight: '700' },
  scrollContent: { padding: 20 },
  previewContainer: { padding: 20, paddingBottom: 0 },
  characterPreview: { borderRadius: 24, padding: 20, alignItems: 'center', elevation: 4 },
  characterEmoji: { fontSize: 80, marginBottom: 8 },
  characterTitle: { fontSize: 20, fontWeight: '900', marginBottom: 12 },
  equippedItems: { flexDirection: 'row', gap: 12 },
  skinsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  skinCard: { borderRadius: 20, padding: 12, elevation: 4 },
  skinPreview: { width: '100%', aspectRatio: 1, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  skinEquipped: { borderWidth: 4, borderColor: '#fbbf24' },
  skinName: { fontSize: 14, fontWeight: '900', textAlign: 'center', marginBottom: 8 },
  skinButton: { overflow: 'hidden', borderRadius: 12 },
  skinButtonEquipped: { backgroundColor: '#fbbf24' },
  skinButtonOwned: { backgroundColor: '#e5e7eb' },
  skinButtonText: { fontSize: 14, fontWeight: '700', textAlign: 'center', paddingVertical: 6 },
  skinButtonTextEquipped: { color: '#1f2937' },
  skinButtonTextOwned: { color: '#4b5563' },
  skinButtonGradient: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 6 },
  skinButtonTextBuy: { fontSize: 14, fontWeight: '700', color: '#fff' },
});