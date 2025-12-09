import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Avatar from './Avatar';

export default function VideoCallComponent({ route, navigation }) {
  const { user } = route.params;
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    // Simulate call duration timer
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
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
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Remote Video View */}
      <View style={styles.remoteVideo}>
        <Avatar uri={user.avatar} size={180} name={user.name} />
        <Text style={styles.remoteName}>{user.name}</Text>
        <Text style={styles.callStatus}>Connected • {formatDuration(callDuration)}</Text>
      </View>

      {/* Local Video Preview (Small) */}
      <View style={styles.localVideo}>
        {!isVideoOff ? (
          <>
            <Avatar 
              uri={'https://www.gravatar.com/avatar/anon?s=80&d=identicon'} 
              size={80} 
              name="You"
            />
            <Text style={styles.localLabel}>You</Text>
          </>
        ) : (
          <View style={styles.videoOffContainer}>
            <Feather name="video-off" size={32} color="#fff" />
          </View>
        )}
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={() => setIsMuted(!isMuted)}
        >
          <Feather name={isMuted ? "mic-off" : "mic"} size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, styles.endCallButton]}
          onPress={handleEndCall}
        >
          <Feather name="phone-off" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.controlButton, isVideoOff && styles.controlButtonActive]}
          onPress={() => setIsVideoOff(!isVideoOff)}
        >
          <Feather name={isVideoOff ? "video-off" : "video"} size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Additional Controls */}
      <View style={styles.additionalControls}>
        <TouchableOpacity style={styles.smallControlButton}>
          <Feather name="rotate-cw" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.smallControlButton}>
          <Feather name="speaker" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  remoteVideo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  remoteName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 16,
  },
  callStatus: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 8,
  },
  localVideo: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 100,
    height: 140,
    backgroundColor: '#333',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#6f42c1',
  },
  localLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
  },
  videoOffContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 60,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButtonActive: {
    backgroundColor: '#e74c3c',
  },
  endCallButton: {
    backgroundColor: '#e74c3c',
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  additionalControls: {
    position: 'absolute',
    bottom: 150,
    flexDirection: 'row',
    gap: 16,
  },
  smallControlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});