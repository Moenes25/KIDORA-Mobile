import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation'; 
import { useTheme } from '../context/ThemeContext';

// Import Sub-Screens
import AgeSelectionScreen from './children/AgeSelectionScreen';
import ChildrenHomeScreen from './children/ChildrenHomeScreen';
import ModulesScreen from './children/ModulesScreen';
import LessonScreen from './children/LessonScreen'; 
import GamesScreen from './children/GamesScreen';
import AiTutorScreen from './children/AiTutorScreen';
import StoreScreen from './children/StoreScreen';

export default function ChildrenAreaScreen({ navigation }) {
  const { colors } = useTheme(); 
  
  // Shared State
  const [screen, setScreen] = useState('age-select');
  const [selectedAge, setSelectedAge] = useState(null);
  const [coins, setCoins] = useState(2500);
  const [level, setLevel] = useState(1);
  const [ownedSkins, setOwnedSkins] = useState([1]);
  const [equippedSkin, setEquippedSkin] = useState(1);
  const [selectedModule, setSelectedModule] = useState(null);

  // --- UPDATED ORIENTATION LOGIC ---
  useEffect(() => {
    async function lockToLandscape() {
      // This forces the screen to be Horizontal (Landscape)
      // It applies to all sub-screens rendered below
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }

    lockToLandscape();

    // Cleanup: Lock back to Portrait when the user leaves this area entirely
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);
  // ---------------------------------

  // Force Light Mode
  const isDark = false;

  // Render Logic
  switch (screen) {
    case 'age-select':
      return (
        <AgeSelectionScreen 
          setScreen={setScreen} 
          setSelectedAge={setSelectedAge} 
        />
      );
    case 'home':
      return (
        <ChildrenHomeScreen 
          setScreen={setScreen}
          coins={coins}
          level={level}
          isDark={isDark} 
          colors={colors}
        />
      );
    case 'modules':
      return (
        <ModulesScreen 
          setScreen={setScreen}
          selectedAge={selectedAge}
          setSelectedModule={setSelectedModule}
          isDark={isDark}
          colors={colors}
        />
      );
    case 'lesson':
      return (
        <LessonScreen 
          setScreen={setScreen}
          coins={coins}
          setCoins={setCoins}
          isDark={isDark}
          colors={colors}
        />
      );
    case 'games':
      return (
        <GamesScreen 
          setScreen={setScreen}
          isDark={isDark}
          colors={colors}
        />
      );
    case 'ai-tutor':
      return (
        <AiTutorScreen 
          setScreen={setScreen}
          isDark={isDark}
          colors={colors}
        />
      );
    case 'store':
      return (
        <StoreScreen 
          setScreen={setScreen}
          coins={coins}
          setCoins={setCoins}
          ownedSkins={ownedSkins}
          setOwnedSkins={setOwnedSkins}
          equippedSkin={equippedSkin}
          setEquippedSkin={setEquippedSkin}
          isDark={isDark}
          colors={colors}
        />
      );
    default:
      return null;
  }
}