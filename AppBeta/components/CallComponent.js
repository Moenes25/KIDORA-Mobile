import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Avatar from './Avatar';

export default function CallComponent({ route, navigation }) {
  const { user } = route.params;
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Simulate call duration timer
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Pulse animation for avatar
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => {
      clearInterval(interval);
      pulse.stop();
    };
  }, []);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6f42c1" />
      
      <LinearGradient
        colors={['#6f42c1', '#8e44ad', '#9b59b6']}
        style={styles.gradient}
      >
        {/* User Info */}
        <View style={styles.userInfo}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <View style={styles.avatarContainer}>
              <Avatar uri={user.avatar} size={160} name={user.name} />
              <View style={styles.avatarRing} />
              <View style={[styles.avatarRing, styles.avatarRing2]} />
            </View>
          </Animated.View>
          
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.callStatus}>
            {callDuration > 0 ? formatDuration(callDuration) : 'Calling...'}
          </Text>
        </View>

        {/* Control Buttons */}
        <View style={styles.controlsGrid}>
          <View style={styles.controlRow}>
            <TouchableOpacity 
              style={[styles.controlButton, isSpeaker && styles.controlButtonActive]}
              onPress={() => setIsSpeaker(!isSpeaker)}
            >
              <Feather name="volume-2" size={28} color="#fff" />
              <Text style={styles.controlLabel}>Speaker</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.controlButton, isMuted && styles.controlButtonActive]}
              onPress={() => setIsMuted(!isMuted)}
            >
              <Feather name={isMuted ? "mic-off" : "mic"} size={28} color="#fff" />
              <Text style={styles.controlLabel}>Mute</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.controlRow}>
            <TouchableOpacity style={styles.controlButton}>
              <Feather name="user-plus" size={28} color="#fff" />
              <Text style={styles.controlLabel}>Add Call</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton}>
              <Feather name="grid" size={28} color="#fff" />
              <Text style={styles.controlLabel}>Keypad</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* End Call Button */}
        <View style={styles.endCallContainer}>
          <TouchableOpacity 
            style={styles.endCallButton}
            onPress={handleEndCall}
          >
            <LinearGradient
              colors={['#e74c3c', '#c0392b']}
              style={styles.endCallGradient}
            >
              <Feather name="phone-off" size={32} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.endCallLabel}>End Call</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 40,
  },
  avatarContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarRing2: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  userName: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    marginTop: 24,
  },
  callStatus: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    marginTop: 8,
  },
  controlsGrid: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: 40,
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(231, 76, 60, 0.8)',
  },
  controlLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
  endCallContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  endCallButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  endCallGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  endCallLabel: {
    color: '#fff',
    fontSize: 14,
    marginTop: 12,
    fontWeight: '600',
  },
});