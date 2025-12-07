// ChatList.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Avatar from '../components/Avatar';
import { USERS, CONVERSATIONS } from '../data/mockData';

export default function ChatList({ navigation }) {
  const renderItem = ({ item }) => {
    const conv = CONVERSATIONS[item.id] || [];
    const last = conv[conv.length - 1];
    return (
      <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Conversation', { user: item })}>
        <Avatar uri={item.avatar} size={56} name={item.name} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems:'center' }}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.time}>{last?.time || ''}</Text>
          </View>
          <Text numberOfLines={1} style={styles.preview}>{last ? last.text : 'Say hi 👋'}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex:1 }}>
      <FlatList
        data={USERS}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{height:1,backgroundColor:'#eee'}} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { padding: 12, flexDirection: 'row', alignItems: 'center' },
  name: { fontWeight: '700', fontSize: 16 },
  preview: { color: '#666', marginTop: 4 },
  time: { fontSize: 12, color: '#999' },
});
