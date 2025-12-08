// components/SpaceBackground.js
import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

// Star Component with twinkling animation
const Star = ({ size, left, top, delay }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1500 + delay * 100,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1500 + delay * 100,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          width: size,
          height: size,
          left,
          top,
          opacity,
        },
      ]}
    />
  );
};

// Floating Cloud/Nebula Component
const FloatingCloud = ({ size, left, top, colors, delay }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: 20,
            duration: 4000 + delay * 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 4000 + delay * 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: 15,
            duration: 5000 + delay * 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: 5000 + delay * 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.cloud,
        {
          width: size,
          height: size,
          left,
          top,
          transform: [{ translateY }, { translateX }],
        },
      ]}
    >
      <LinearGradient
        colors={colors}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
};

// Animated Icon Component for decorative elements
const AnimatedIcon = ({ 
  name, 
  size, 
  color, 
  left, 
  top, 
  right, 
  bottom, 
  animation = 'bounce' 
}) => {
  const animValue = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animation === 'bounce') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: -20,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else if (animation === 'rotate') {
      Animated.loop(
        Animated.timing(rotate, {
          toValue: 1,
          duration: 20000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else if (animation === 'pulse') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animValue, {
            toValue: 1,
            duration: 1500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 1500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const opacity = animation === 'pulse' ? animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  }) : 1;

  return (
    <Animated.View
      style={[
        styles.animatedIcon,
        {
          left,
          top,
          right,
          bottom,
          opacity,
          transform: animation === 'rotate' ? [{ rotate: spin }] : [{ translateY: animValue }],
        },
      ]}
    >
      <Feather name={name} size={size} color={color} />
    </Animated.View>
  );
};

// Main Space Background Component
export const SpaceBackground = ({ 
  theme = 'blue', 
  children, 
  isPortrait = true 
}) => {
  const { colors, theme: appTheme } = useTheme();
  const isDark = appTheme === 'dark';

  // Theme configurations with gradients and cloud colors
  const themes = {
    blue: {
      gradient: isDark ? ['#1e3a8a', '#6366f1', '#8b5cf6'] : ['#60a5fa', '#a78bfa', '#f472b6'],
      cloudColors: isDark 
        ? ['rgba(99, 102, 241, 0.15)', 'rgba(139, 92, 246, 0.08)']
        : ['rgba(96, 165, 250, 0.2)', 'rgba(167, 139, 250, 0.1)'],
    },
    purple: {
      gradient: isDark ? ['#581c87', '#c026d3', '#ec4899'] : ['#a78bfa', '#f472b6', '#fb923c'],
      cloudColors: isDark
        ? ['rgba(192, 38, 211, 0.15)', 'rgba(236, 72, 153, 0.08)']
        : ['rgba(167, 139, 250, 0.2)', 'rgba(244, 114, 182, 0.1)'],
    },
    green: {
      gradient: isDark ? ['#065f46', '#059669', '#10b981'] : ['#34d399', '#10b981', '#059669'],
      cloudColors: isDark
        ? ['rgba(5, 150, 105, 0.15)', 'rgba(16, 185, 129, 0.08)']
        : ['rgba(52, 211, 153, 0.2)', 'rgba(16, 185, 129, 0.1)'],
    },
    orange: {
      gradient: isDark ? ['#c2410c', '#f97316', '#ec4899'] : ['#fb923c', '#f87171', '#f472b6'],
      cloudColors: isDark
        ? ['rgba(249, 115, 22, 0.15)', 'rgba(248, 113, 113, 0.08)']
        : ['rgba(251, 146, 60, 0.2)', 'rgba(248, 113, 113, 0.1)'],
    },
    yellow: {
      gradient: isDark ? ['#a16207', '#f59e0b', '#fb923c'] : ['#fbbf24', '#fb923c', '#f87171'],
      cloudColors: isDark
        ? ['rgba(245, 158, 11, 0.15)', 'rgba(251, 146, 60, 0.08)']
        : ['rgba(251, 191, 36, 0.2)', 'rgba(251, 146, 60, 0.1)'],
    },
  };

  const currentTheme = themes[theme] || themes.blue;

  // Generate stars - fewer for dark mode to not overwhelm
  const starCount = isDark ? 35 : 50;
  const stars = Array.from({ length: starCount }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    left: Math.random() * width,
    top: Math.random() * height,
    delay: Math.random() * 10,
  }));

  return (
    <View style={styles.container}>
      {/* Base Gradient Background */}
      <LinearGradient
        colors={currentTheme.gradient}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Twinkling Stars */}
      {stars.map((star) => (
        <Star
          key={star.id}
          size={star.size}
          left={star.left}
          top={star.top}
          delay={star.delay}
        />
      ))}

      {/* Floating Clouds/Nebulas - Responsive positioning */}
      <FloatingCloud
        size={isPortrait ? 250 : 200}
        left={-50}
        top={isPortrait ? 80 : 40}
        colors={currentTheme.cloudColors}
        delay={0}
      />
      <FloatingCloud
        size={isPortrait ? 350 : 280}
        left={width - (isPortrait ? 250 : 200)}
        top={isPortrait ? height / 3 : 100}
        colors={currentTheme.cloudColors}
        delay={2}
      />
      <FloatingCloud
        size={isPortrait ? 300 : 240}
        left={isPortrait ? width / 4 : width / 5}
        top={height - (isPortrait ? 200 : 150)}
        colors={currentTheme.cloudColors}
        delay={4}
      />

      {/* Animated Decorative Icons - Responsive positioning based on orientation */}
      <AnimatedIcon
        name="navigation"
        size={isPortrait ? 60 : 50}
        color="rgba(255, 255, 255, 0.7)"
        right={isPortrait ? 20 : 80}
        top={isPortrait ? 100 : 60}
        animation="bounce"
      />
      <AnimatedIcon
        name="globe"
        size={isPortrait ? 70 : 60}
        color="rgba(255, 255, 255, 0.6)"
        left={isPortrait ? 20 : 120}
        bottom={isPortrait ? 200 : 120}
        animation="rotate"
      />
      <AnimatedIcon
        name="moon"
        size={isPortrait ? 50 : 45}
        color="rgba(254, 240, 138, 0.8)"
        left={isPortrait ? 40 : 80}
        top={isPortrait ? height / 3 : height / 4}
        animation="pulse"
      />
      <AnimatedIcon
        name="star"
        size={isPortrait ? 40 : 35}
        color="rgba(251, 191, 36, 0.9)"
        right={isPortrait ? width / 3 : width / 2.5}
        top={isPortrait ? height / 2.2 : height / 3}
        animation="pulse"
      />

      {/* Content Container */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
  star: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 50,
  },
  cloud: {
    position: 'absolute',
    borderRadius: 200,
    overflow: 'hidden',
  },
  animatedIcon: {
    position: 'absolute',
    zIndex: 5,
  },
});

export default SpaceBackground;