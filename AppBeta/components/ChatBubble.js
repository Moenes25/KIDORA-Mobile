// ChatBubble.js
import React from 'react';
import { View, Text } from 'react-native';

export default function ChatBubble({ message, isMine, isRTL = false }) {
  const containerStyle = {
    alignSelf: isRTL 
      ? (isMine ? 'flex-start' : 'flex-end')  // Reversed in RTL
      : (isMine ? 'flex-end' : 'flex-start'), // Normal in LTR
    backgroundColor: isMine ? '#6F42C1' : '#e5e5ea',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: '78%',
    // Add bubble tail direction
    ...(isRTL 
      ? (isMine ? { borderBottomLeftRadius: 4 } : { borderBottomRightRadius: 4 })
      : (isMine ? { borderBottomRightRadius: 4 } : { borderBottomLeftRadius: 4 })
    ),
  };

  const textStyle = {
    color: isMine ? '#fff' : '#111',
    fontSize: 15,
    textAlign: isRTL ? 'right' : 'left', // RTL text alignment
  };

  const timeStyle = {
    fontSize: 11,
    color: isMine ? '#c7c4c4ff' : '#666',
    marginTop: 4,
    alignSelf: isRTL ? 'flex-start' : 'flex-end', // Time position flips in RTL
  };

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>{message.text}</Text>
      <Text style={timeStyle}>{message.time}</Text>
    </View>
  );
}