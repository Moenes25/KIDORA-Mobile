// VideoCallScreen.js
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import Avatar from '../components/Avatar';
import { normalize, wp, hp } from '../utils/responsive';

export default function VideoCallScreen({ route, navigation }) {
  const { user } = route.params;

  useEffect(() => {
    // In real app: set up WebRTC or native camera here.
    // We just auto-close after a while to simulate.
    const t = setTimeout(() => { /* nothing - keep open until user hangs up */ }, 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={styles.container}>
      {/* remote simulated video */}
      <View style={styles.remote}>
        <Avatar uri={user.avatar} size={normalize(180)} name={user.name} />
        <Text 
          style={styles.remoteName}
          allowFontScaling={false}
        >
          {user.name}
        </Text>
      </View>

      {/* local simulated video (small) */}
      <View style={styles.local}>
        <Avatar uri={'https://www.gravatar.com/avatar/anon?s=80&d=identicon'} size={normalize(64)} />
        <Text 
          style={styles.localName}
          allowFontScaling={false}
        >
          You
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlBtn, {backgroundColor:'#e74c3c'}]} 
          onPress={() => navigation.goBack()}
        >
          <Text 
            style={styles.controlBtnText}
            allowFontScaling={false}
          >
            Hang Up
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.controlBtn, {backgroundColor:'#2ecc71'}]} 
          onPress={() => alert('Toggle mute (mock)')}
        >
          <Text 
            style={styles.controlBtnText}
            allowFontScaling={false}
          >
            Mute
          </Text>
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
    justifyContent: 'center' 
  },
  remote: { 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  remoteName: {
    color: '#fff', 
    fontSize: normalize(18), 
    marginTop: hp(1.5)
  },
  local: { 
    position: 'absolute', 
    top: Platform.OS === 'ios' ? hp(5.5) : (StatusBar.currentHeight || hp(3)), 
    right: wp(4.5), 
    alignItems: 'center' 
  },
  localName: {
    color: '#fff', 
    fontSize: normalize(12), 
    marginTop: hp(0.7)
  },
  controls: { 
    position: 'absolute', 
    bottom: hp(5.5), 
    flexDirection: 'row', 
    gap: wp(3) 
  },
  controlBtn: { 
    paddingHorizontal: wp(4.5), 
    paddingVertical: hp(1.5), 
    borderRadius: normalize(30), 
    marginHorizontal: wp(2) 
  },
  controlBtnText: {
    color: '#fff', 
    fontWeight: '700',
    fontSize: normalize(15)
  }
});