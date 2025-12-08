// Avatar.js
import React from 'react';
import { Image, View, Text } from 'react-native';

export default function Avatar({ uri, size = 40, name }) {
  if (uri) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  // fallback: initials
  const initials = (name || '').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
  return (
    <View style={{
      width: size, height: size, borderRadius: size/2, backgroundColor: '#ddd',
      alignItems:'center', justifyContent:'center'
    }}>
      <Text style={{fontWeight:'700'}}>{initials}</Text>
    </View>
  );
}
