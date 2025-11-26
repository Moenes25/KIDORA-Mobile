import React, { useState } from 'react';
import { View, Image, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const [image, setImage] = useState(null);

  const pick = async () => {
    const res = await ImagePicker.launchImageLibraryAsync();
    if (!res.canceled) setImage(res.assets[0].uri);
  };

  return (
    <View style={{ padding: 20 }}>
      {image && <Image source={{ uri: image }} style={{ width: 150, height: 150, borderRadius: 75 }} />}
      <Button title="Pick Profile Image" onPress={pick} />
    </View>
  );
}
