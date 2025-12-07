// VideoCallScreen.js
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Avatar from '../components/Avatar';

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
        <Avatar uri={user.avatar} size={180} name={user.name} />
        <Text style={{color:'#fff', fontSize:18, marginTop:12}}>{user.name}</Text>
      </View>

      {/* local simulated video (small) */}
      <View style={styles.local}>
        <Avatar uri={'https://www.gravatar.com/avatar/anon?s=80&d=identicon'} size={64} />
        <Text style={{color:'#fff', fontSize:12, marginTop:6}}>You</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={[styles.controlBtn, {backgroundColor:'#e74c3c'}]} onPress={() => navigation.goBack()}>
          <Text style={{color:'#fff', fontWeight:'700'}}>Hang Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlBtn, {backgroundColor:'#2ecc71'}]} onPress={() => alert('Toggle mute (mock)')}>
          <Text style={{color:'#fff', fontWeight:'700'}}>Mute</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#111', alignItems:'center', justifyContent:'center' },
  remote: { alignItems:'center', justifyContent:'center' },
  local: { position:'absolute', top:44, right:18, alignItems:'center' },
  controls: { position:'absolute', bottom:44, flexDirection:'row', gap:12 },
  controlBtn: { paddingHorizontal:18, paddingVertical:12, borderRadius:30, marginHorizontal:8 }
});
