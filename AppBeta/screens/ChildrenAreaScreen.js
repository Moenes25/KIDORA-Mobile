import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation'; // 1. Import Orientation
import { useTheme } from '../context/ThemeContext';

// Import Sub-Screens
import AgeSelectionScreen from './children/AgeSelectionScreen';
import ChildrenHomeScreen from './children/ChildrenHomeScreen';
import ModulesScreen from './children/ModulesScreen';
import LessonScreen from './children/LessonScreen'; // 2. Fixed Typo (was LessonScreren)
import GamesScreen from './children/GamesScreen';
import AiTutorScreen from './children/AiTutorScreen';
import StoreScreen from './children/StoreScreen';

export default function ChildrenAreaScreen({ navigation }) {
  const { colors } = useTheme(); // Kept 'colors' for basic palette, ignored 'theme'
  
  // Shared State
  const [screen, setScreen] = useState('age-select');
  const [selectedAge, setSelectedAge] = useState(null);
  const [coins, setCoins] = useState(2500);
  const [level, setLevel] = useState(1);
  const [ownedSkins, setOwnedSkins] = useState([1]);
  const [equippedSkin, setEquippedSkin] = useState(1);
  const [selectedModule, setSelectedModule] = useState(null);

  // 3. Orientation Logic: Unlock on mount, Lock on unmount
  useEffect(() => {
    async function enableRotation() {
      // Allows both Portrait and Landscape
      await ScreenOrientation.unlockAsync(); 
    }

    enableRotation();

    // Cleanup: Lock back to Portrait when leaving this screen
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

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
          isDark={isDark} // Forced to false
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