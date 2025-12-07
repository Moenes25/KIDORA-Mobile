// ChatBubble.js
import React from 'react';
import { View, Text } from 'react-native';

export default function ChatBubble({ message, isMine }) {
  const containerStyle = {
    alignSelf: isMine ? 'flex-end' : 'flex-start',
    backgroundColor: isMine ? '#0b93f6' : '#e5e5ea',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: '78%',
  };

  const textStyle = {
    color: isMine ? '#fff' : '#111',
    fontSize: 15,
  };

  const timeStyle = {
    fontSize: 11,
    color: isMine ? '#e0f0ff' : '#666',
    marginTop: 4,
    alignSelf: 'flex-end',
  };

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{message.text}</Text>
      <Text style={timeStyle}>{message.time}</Text>
    </View>
  );
}
