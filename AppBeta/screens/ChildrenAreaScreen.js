import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation'; 
import { useTheme } from '../context/ThemeContext';
import { normalize, wp, hp } from '../utils/responsive';

// Import Sub-Screens from children folder
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

  // Lock to Landscape Mode
  useEffect(() => {
    async function lockToLandscape() {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }

    lockToLandscape();

    // Cleanup: Lock back to Portrait when leaving
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
          normalize={normalize}
          wp={wp}
          hp={hp}
        />
      );
    case 'home':
      return (
        <ChildrenHomeScreen 
          setScreen={setScreen}
          selectedAge={selectedAge}
          setSelectedAge={setSelectedAge}
          coins={coins}
          level={level}
          isDark={isDark} 
          colors={colors}
          normalize={normalize}
          wp={wp}
          hp={hp}
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
          normalize={normalize}
          wp={wp}
          hp={hp}
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
          normalize={normalize}
          wp={wp}
          hp={hp}
        />
      );
    case 'games':
      return (
        <GamesScreen 
          setScreen={setScreen}
          isDark={isDark}
          colors={colors}
          normalize={normalize}
          wp={wp}
          hp={hp}
        />
      );
    case 'ai-tutor':
      return (
        <AiTutorScreen 
          setScreen={setScreen}
          isDark={isDark}
          colors={colors}
          normalize={normalize}
          wp={wp}
          hp={hp}
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
          normalize={normalize}
          wp={wp}
          hp={hp}
        />
      );
    default:
      return null;
  }
}