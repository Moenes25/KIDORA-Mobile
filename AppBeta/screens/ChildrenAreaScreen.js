// screens/ChildrenAreaScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  TextInput,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

// Mock data
const learningModules = {
  4: [
    { id: 1, title: 'القرآن الكريم', icon: 'book-open', color: ['#34d399', '#059669'], lessons: 12 },
    { id: 2, title: 'الحروف العربية', icon: 'type', color: ['#60a5fa', '#3b82f6'], lessons: 28 },
    { id: 3, title: 'الأرقام', icon: 'hash', color: ['#a78bfa', '#8b5cf6'], lessons: 10 },
    { id: 4, title: 'الألوان', icon: 'droplet', color: ['#fb923c', '#f97316'], lessons: 8 },
  ],
  5: [
    { id: 1, title: 'القرآن الكريم', icon: 'book-open', color: ['#34d399', '#059669'], lessons: 20 },
    { id: 2, title: 'القراءة', icon: 'book', color: ['#60a5fa', '#3b82f6'], lessons: 15 },
    { id: 3, title: 'الحساب', icon: 'plus', color: ['#a78bfa', '#8b5cf6'], lessons: 18 },
    { id: 4, title: 'الحيوانات', icon: 'feather', color: ['#fbbf24', '#f59e0b'], lessons: 12 },
    { id: 5, title: 'الأشعار', icon: 'star', color: ['#f472b6', '#ec4899'], lessons: 10 },
  ],
  6: [
    { id: 1, title: 'القرآن الكريم', icon: 'book-open', color: ['#34d399', '#059669'], lessons: 30 },
    { id: 2, title: 'القراءة المتقدمة', icon: 'book', color: ['#60a5fa', '#3b82f6'], lessons: 25 },
    { id: 3, title: 'الرياضيات', icon: 'hash', color: ['#a78bfa', '#8b5cf6'], lessons: 22 },
    { id: 4, title: 'العلوم', icon: 'circle', color: ['#22d3ee', '#06b6d4'], lessons: 18 },
    { id: 5, title: 'الأشعار', icon: 'star', color: ['#f472b6', '#ec4899'], lessons: 15 },
  ],
};

const games = [
  { id: 1, title: 'لعبة الحروف', icon: 'type', color: ['#60a5fa', '#3b82f6'], levels: 10 },
  { id: 2, title: 'لعبة الأرقام', icon: 'target', color: ['#a78bfa', '#8b5cf6'], levels: 8 },
  { id: 3, title: 'لعبة الذاكرة', icon: 'cpu', color: ['#34d399', '#059669'], levels: 12 },
  { id: 4, title: 'التلوين', icon: 'droplet', color: ['#fb923c', '#f97316'], levels: 15 },
];

const skins = [
  { id: 1, name: 'قميص أحمر', price: 500, type: 'shirt', color: '#ef4444', icon: 'shirt' },
  { id: 2, name: 'قميص أزرق', price: 500, type: 'shirt', color: '#3b82f6', icon: 'shirt' },
  { id: 3, name: 'قميص أخضر', price: 500, type: 'shirt', color: '#22c55e', icon: 'shirt' },
  { id: 4, name: 'نظارة شمسية', price: 800, type: 'glasses', color: '#fbbf24', icon: 'sun' },
  { id: 5, name: 'قبعة', price: 600, type: 'hat', color: '#8b5cf6', icon: 'umbrella' },
  { id: 6, name: 'تاج ذهبي', price: 1500, type: 'crown', color: '#fbbf24', icon: 'award' },
];

export default function ChildrenAreaScreen({ navigation }) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [screen, setScreen] = useState('age-select');
  const [selectedAge, setSelectedAge] = useState(null);
  const [coins, setCoins] = useState(2500);
  const [level, setLevel] = useState(1);
  const [ownedSkins, setOwnedSkins] = useState([1]);
  const [equippedSkin, setEquippedSkin] = useState(1);
  const [selectedModule, setSelectedModule] = useState(null);
  const [chatInput, setChatInput] = useState('');

  const shadowColor = isDark ? '#2d1b69' : '#000';

  // Age Selection Screen
  const AgeSelectionScreen = () => (
    <View style={styles.container}>
      <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 44, backgroundColor: 'white' }} />
      <LinearGradient colors={['#a78bfa', '#f472b6', '#fb923c']} style={styles.fullScreen}>
        <ScrollView contentContainerStyle={styles.centerContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerSection}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Feather name="star" size={60} color="#fff" />
            </View>
            <Text style={styles.mainTitle}>عالم التعلم السحري</Text>
            <Text style={styles.subtitle}>اختر عمرك لنبدأ المغامرة!</Text>
          </View>

          <View style={styles.ageGrid}>
            {[4, 5, 6].map((age) => (
              <TouchableOpacity
                key={age}
                onPress={() => {
                  setSelectedAge(age);
                  setScreen('home');
                }}
                style={styles.ageCard}
              >
                <LinearGradient colors={['#fef3c7', '#fde68a']} style={styles.ageCardGradient}>
                  <Text style={styles.ageEmoji}>🎈</Text>
                  <Text style={styles.ageNumber}>{age}</Text>
                  <Text style={styles.ageLabel}>سنوات</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );

  // Home Screen
  const HomeScreen = () => (
    <View style={styles.container}>
      <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 44, backgroundColor: 'white' }} />
      <LinearGradient colors={['#60a5fa', '#a78bfa', '#f472b6']} style={styles.fullScreen}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarEmoji}>😊</Text>
            </View>
            <View>
              <Text style={styles.headerName}>البطل الصغير</Text>
              <Text style={styles.headerLevel}>المستوى {level}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.coinsContainer}>
              <Feather name="star" size={18} color="#fbbf24" />
              <Text style={styles.coinsText}>{coins}</Text>
            </View>
            <Feather name="award" size={28} color="#fbbf24" />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.homeContent}>
          <Text style={styles.homeTitle}>ماذا تريد أن تفعل اليوم؟</Text>

          <View style={styles.mainGrid}>
            {/* Learning */}
            <TouchableOpacity onPress={() => setScreen('modules')} style={styles.mainCard}>
              <View style={styles.mainCardInner}>
                <LinearGradient colors={['#60a5fa', '#3b82f6']} style={styles.mainCardIcon}>
                  <Feather name="book" size={40} color="#fff" />
                </LinearGradient>
                <Text style={styles.mainCardTitle}>التعلم</Text>
                <Text style={styles.mainCardSubtitle}>دروس ممتعة ومفيدة</Text>
              </View>
            </TouchableOpacity>

            {/* Games */}
            <TouchableOpacity onPress={() => setScreen('games')} style={styles.mainCard}>
              <View style={styles.mainCardInner}>
                <LinearGradient colors={['#a78bfa', '#8b5cf6']} style={styles.mainCardIcon}>
                  <Feather name="play" size={40} color="#fff" />
                </LinearGradient>
                <Text style={styles.mainCardTitle}>الألعاب</Text>
                <Text style={styles.mainCardSubtitle}>العب واستمتع</Text>
              </View>
            </TouchableOpacity>

            {/* AI Tutor */}
            <TouchableOpacity onPress={() => setScreen('ai-tutor')} style={styles.mainCard}>
              <View style={styles.mainCardInner}>
                <LinearGradient colors={['#34d399', '#059669']} style={styles.mainCardIcon}>
                  <Feather name="cpu" size={40} color="#fff" />
                </LinearGradient>
                <Text style={styles.mainCardTitle}>المعلم الذكي</Text>
                <Text style={styles.mainCardSubtitle}>اسأل عن أي شيء</Text>
              </View>
            </TouchableOpacity>

            {/* Store */}
            <TouchableOpacity onPress={() => setScreen('store')} style={styles.mainCard}>
              <View style={styles.mainCardInner}>
                <LinearGradient colors={['#fb923c', '#f97316']} style={styles.mainCardIcon}>
                  <Feather name="shopping-bag" size={40} color="#fff" />
                </LinearGradient>
                <Text style={styles.mainCardTitle}>المتجر</Text>
                <Text style={styles.mainCardSubtitle}>زيّن بطلك</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );

  // Modules Screen
  const ModulesScreen = () => (
    <View style={styles.container}>
      <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 44, backgroundColor: 'white' }} />
      <LinearGradient colors={['#60a5fa', '#6366f1', '#8b5cf6']} style={styles.fullScreen}>
        <View style={[styles.topBar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>وحدات التعلم</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {learningModules[selectedAge]?.map((module) => (
            <TouchableOpacity
              key={module.id}
              onPress={() => {
                setSelectedModule(module);
                setScreen('lesson');
              }}
        style={[styles.moduleCard, { backgroundColor: colors.childrenArea.cardBg }]}>
              <View style={styles.moduleCardInner}>
                <LinearGradient colors={module.color} style={styles.moduleIcon}>
                  <Feather name={module.icon} size={32} color="#fff" />
                </LinearGradient>
                <View style={styles.moduleInfo}>
                  <Text style={[styles.moduleTitle, { color: colors.childrenArea.cardText }]}>
{module.title}</Text>
                  <Text style={[styles.moduleLessons, { color: colors.childrenArea.cardTextSecondary }]}>{module.lessons} درس</Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.random() * 60 + 20}%` }]}>
                  <LinearGradient colors={module.color} style={StyleSheet.absoluteFill} />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );

  // Lesson Screen
  const LessonScreen = () => (
    <View style={styles.container}>
      <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 44, backgroundColor: 'white' }} />
      <LinearGradient colors={['#fbbf24', '#fb923c', '#f87171']} style={styles.fullScreen}>
        <View style={[styles.topBar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <TouchableOpacity onPress={() => setScreen('modules')} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.coinsContainer}>
            <Feather name="star" size={18} color="#fbbf24" />
            <Text style={[styles.coinsText, { color: '#fff' }]}>{coins}</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Progress */}
          <View style={styles.lessonProgressCard}>
            <View style={styles.lessonProgressHeader}>
              <Text style={styles.lessonProgressText}>الدرس 2 من 9</Text>
              <Text style={styles.lessonProgressEmoji}>📚</Text>
            </View>
            <View style={styles.progressBar}>
              <LinearGradient colors={['#34d399', '#059669']} style={[styles.progressFill, { width: '22%' }]} />
            </View>
          </View>

          {/* Content */}
          <View style={styles.lessonContentCard}>
            <Text style={styles.lessonEmoji}>🦁</Text>
            <Text style={styles.lessonTitle}>الأسد الملك</Text>
            <Text style={styles.lessonText}>
              الأسد هو ملك الغابة. يعيش في أفريقيا وله صوت قوي يسمى الزئير. 
              الأسد حيوان قوي وشجاع ويحب أن يعيش مع عائلته.
            </Text>

            <TouchableOpacity style={styles.audioButton}>
              <LinearGradient colors={['#3b82f6', '#6366f1']} style={styles.audioButtonGradient}>
                <Feather name="volume-2" size={24} color="#fff" />
                <Text style={styles.audioButtonText}>استمع للدرس</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Question */}
            <View style={styles.questionBox}>
              <Text style={styles.questionText}>أين يعيش الأسد؟</Text>
              {['في البحر 🌊', 'في أفريقيا 🌍', 'في القطب الشمالي ❄️'].map((option, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    if (i === 1) {
                      setCoins(coins + 50);
                      alert('إجابة صحيحة! +50 نقطة');
                    }
                  }}
                  style={styles.optionButton}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Navigation */}
          <View style={styles.lessonNavigation}>
            <TouchableOpacity style={styles.navButtonSecondary}>
              <Text style={styles.navButtonSecondaryText}>السابق</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButtonPrimary}>
              <LinearGradient colors={['#34d399', '#059669']} style={styles.navButtonGradient}>
                <Text style={styles.navButtonPrimaryText}>التالي</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );

  // Games Screen
  const GamesScreen = () => (
    <View style={styles.container}>
      <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 44, backgroundColor: 'white' }} />
      <LinearGradient colors={['#a78bfa', '#f472b6', '#f87171']} style={styles.fullScreen}>
        <View style={[styles.topBar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>ألعاب ممتعة</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {games.map((game) => (
            <View key={game.id} style={styles.gameCard}>
              <View style={styles.gameCardInner}>
                <LinearGradient colors={game.color} style={styles.gameIcon}>
                  <Feather name={game.icon} size={36} color="#fff" />
                </LinearGradient>
                <View style={styles.gameInfo}>
                  <Text style={styles.gameTitle}>{game.title}</Text>
                  <Text style={styles.gameLevels}>{game.levels} مستوى</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.playButton}>
                <LinearGradient colors={game.color} style={styles.playButtonGradient}>
                  <Text style={styles.playButtonText}>العب الآن</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );

  // AI Tutor Screen
  const AITutorScreen = () => (
    <View style={styles.container}>
      <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 44, backgroundColor: 'white' }} />
      <LinearGradient colors={['#34d399', '#10b981', '#059669']} style={styles.fullScreen}>
        <View style={[styles.topBar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>المعلم الذكي 🤖</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.chatCard}>
            <View style={styles.chatHeader}>
              <LinearGradient colors={['#34d399', '#059669']} style={styles.chatAvatar}>
                <Feather name="cpu" size={28} color="#fff" />
              </LinearGradient>
              <View style={styles.chatHeaderInfo}>
                <Text style={styles.chatHeaderTitle}>مرحباً بك!</Text>
                <Text style={styles.chatHeaderSubtitle}>اسألني أي سؤال وسأساعدك</Text>
              </View>
            </View>

            {/* Messages */}
            <View style={styles.chatMessages}>
              <View style={styles.userMessage}>
                <Text style={styles.messageText}>كيف يطير الطائر؟ 🐦</Text>
              </View>
              <View style={styles.aiMessage}>
                <Text style={styles.messageText}>
                  الطائر يطير بفضل أجنحته القوية! عندما يحرك جناحيه لأعلى وأسفل، يدفع الهواء ويرتفع في السماء. 🌤️
                </Text>
              </View>
            </View>

            {/* Input */}
            <View style={styles.chatInput}>
              <TextInput
                style={styles.chatTextInput}
                placeholder="اكتب سؤالك هنا..."
                value={chatInput}
                onChangeText={setChatInput}
              />
              <TouchableOpacity style={styles.sendButton}>
                <LinearGradient colors={['#34d399', '#059669']} style={styles.sendButtonGradient}>
                  <Feather name="send" size={20} color="#fff" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Questions */}
          <View style={styles.quickQuestions}>
            {['ما هو الماء؟', 'لماذا السماء زرقاء؟', 'كيف ينمو النبات؟', 'ما هي الشمس؟'].map((q, i) => (
              <TouchableOpacity key={i} style={styles.quickQuestionButton}>
                <Text style={styles.quickQuestionText}>{q}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );

  // Store Screen
  const StoreScreen = () => (
    <View style={styles.container}>
      <View style={{ height: Platform.OS === 'android' ? StatusBar.currentHeight : 44, backgroundColor: 'white' }} />
      <LinearGradient colors={['#fb923c', '#f87171', '#f472b6']} style={styles.fullScreen}>
        <View style={[styles.topBar, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <TouchableOpacity onPress={() => setScreen('home')} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>متجر الأزياء</Text>
          <View style={styles.coinsContainer}>
            <Feather name="star" size={18} color="#fbbf24" />
            <Text style={[styles.coinsText, { color: '#fff' }]}>{coins}</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Character Preview */}
          <View style={styles.characterPreview}>
            <Text style={styles.characterEmoji}>😊</Text>
            <Text style={styles.characterTitle}>بطلك</Text>
            <View style={styles.equippedItems}>
              {ownedSkins.map((skinId) => {
                const skin = skins.find(s => s.id === skinId);
                return (
                  <Feather key={skinId} name={skin.icon} size={24} color={skin.color} />
                );
              })}
            </View>
          </View>

          {/* Skins Grid */}
          <View style={styles.skinsGrid}>
            {skins.map((skin) => {
              const owned = ownedSkins.includes(skin.id);
              const equipped = equippedSkin === skin.id;
              const canBuy = coins >= skin.price;

              return (
                <View key={skin.id} style={styles.skinCard}>
                  <View style={[
                    styles.skinPreview,
                    { backgroundColor: skin.color },
                    equipped && styles.skinEquipped
                  ]}>
                    <Feather name={skin.icon} size={48} color="#fff" />
                  </View>
                  <Text style={styles.skinName}>{skin.name}</Text>
                  
                  {owned ? (
                    <TouchableOpacity
                      onPress={() => setEquippedSkin(skin.id)}
                      style={[
                        styles.skinButton,
                        equipped ? styles.skinButtonEquipped : styles.skinButtonOwned
                      ]}
                    >
                      <Text style={[
                        styles.skinButtonText,
                        equipped ? styles.skinButtonTextEquipped : styles.skinButtonTextOwned
                      ]}>
                        {equipped ? '✓ مُجهَّز' : 'ارتداء'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        if (canBuy) {
                          setCoins(coins - skin.price);
                          setOwnedSkins([...ownedSkins, skin.id]);
                          alert('تم الشراء! 🎉');
                        }
                      }}
                      disabled={!canBuy}
                      style={styles.skinButton}
                    >
                      <LinearGradient
                        colors={canBuy ? ['#34d399', '#059669'] : ['#d1d5db', '#9ca3af']}
                        style={styles.skinButtonGradient}
                      >
                        <Feather name="star" size={16} color="#fff" />
                        <Text style={styles.skinButtonTextBuy}>{skin.price}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );

  // Render current screen
  return (
    <>
      {screen === 'age-select' && <AgeSelectionScreen />}
      {screen === 'home' && <HomeScreen />}
      {screen === 'modules' && <ModulesScreen />}
      {screen === 'lesson' && <LessonScreen />}
      {screen === 'games' && <GamesScreen />}
      {screen === 'ai-tutor' && <AITutorScreen />}
      {screen === 'store' && <StoreScreen />}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreen: {
    flex: 1,
  },
  centerContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  ageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
  },
  ageCard: {
    width: (width - 80) / 3,
    minWidth: 100,
  },
  ageCardGradient: {
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ageEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  ageNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#8b5cf6',
  },
  ageLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  headerLevel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  coinsContainer: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coinsText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  homeContent: {
    padding: 20,
  },
  homeTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  mainGrid: {
    gap: 16,
  },
  mainCard: {
    marginBottom: 12,
  },
  mainCardInner: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  mainCardIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainCardTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 6,
  },
  mainCardSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6b7280',
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
  moduleCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  moduleCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  moduleIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleInfo: {
    flex: 1,
    marginLeft: 16,
    alignItems: 'flex-end',
  },
  moduleTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 4,
  },
  moduleLessons: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  lessonProgressCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lessonProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  lessonProgressText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4b5563',
  },
  lessonProgressEmoji: {
    fontSize: 24,
  },
  lessonContentCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  lessonEmoji: {
    fontSize: 80,
    textAlign: 'center',
    marginBottom: 16,
  },
  lessonTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  lessonText: {
    fontSize: 18,
    color: '#4b5563',
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 24,
  },
  audioButton: {
    marginBottom: 16,
  },
  audioButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  audioButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  questionBox: {
    backgroundColor: '#faf5ff',
    borderRadius: 20,
    padding: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4b5563',
    textAlign: 'center',
  },
  lessonNavigation: {
    flexDirection: 'row',
    gap: 12,
  },
  navButtonSecondary: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  navButtonSecondaryText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4b5563',
    textAlign: 'center',
  },
  navButtonPrimary: {
    flex: 1,
  },
  navButtonGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  navButtonPrimaryText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  gameCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    color: '#1f2937',
    marginBottom: 4,
  },
  gameLevels: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
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
  chatCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  chatAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeaderInfo: {
    marginLeft: 12,
  },
  chatHeaderTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1f2937',
  },
  chatHeaderSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  chatMessages: {
    marginBottom: 20,
  },
  userMessage: {
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  aiMessage: {
    backgroundColor: '#dbeafe',
    borderRadius: 16,
    padding: 16,
  },
  messageText: {
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 22,
  },
  chatInput: {
    flexDirection: 'row',
    gap: 10,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  sendButton: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  sendButtonGradient: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickQuestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickQuestionButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickQuestionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4b5563',
  },
  characterPreview: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  characterEmoji: {
    fontSize: 100,
    marginBottom: 12,
  },
  characterTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1f2937',
    marginBottom: 12,
  },
  equippedItems: {
    flexDirection: 'row',
    gap: 12,
  },
  skinsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  skinCard: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  skinPreview: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  skinEquipped: {
    borderWidth: 4,
    borderColor: '#fbbf24',
  },
  skinName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  skinButton: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  skinButtonEquipped: {
    backgroundColor: '#fbbf24',
  },
  skinButtonOwned: {
    backgroundColor: '#e5e7eb',
  },
  skinButtonText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 10,
  },
  skinButtonTextEquipped: {
    color: '#1f2937',
  },
  skinButtonTextOwned: {
    color: '#4b5563',
  },
  skinButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  skinButtonTextBuy: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});