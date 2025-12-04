import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import io from "socket.io-client";

const SERVER_URL = "http://192.168.0.120:3000";

export default function ChatScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SERVER_URL, { transports: ["websocket"] });

    socketRef.current.on("connect", () => {
      console.log("Connected:", socketRef.current.id);
      socketRef.current.emit("joinRoom", { room: "parental-room" });
    });

    socketRef.current.on("history", (history) => setMessages(history));
    socketRef.current.on("message", (msg) => setMessages((p) => [...p, msg]));

    return () => socketRef.current.disconnect();
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msg = {
      text: message,
      sender: "parent",
      at: new Date().toISOString(),
    };

    socketRef.current.emit("message", msg);
    setMessages((prev) => [...prev, msg]);
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={styles.msg}>
            <Text style={styles.sender}>{item.sender}</Text>
            <Text>{item.text}</Text>
            <Text style={styles.time}>
              {new Date(item.at).toLocaleTimeString()}
            </Text>
          </View>
        )}
        keyExtractor={(_, i) => i.toString()}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type here..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 5,
    paddingBottom: 5,
    height: 70,
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  logo: {
    width: 90,
    height: 80,
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  notifWrapper: {
    backgroundColor: "#e0c3fc",
    width: 36,
    height: 36,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold" },
  sender: { fontWeight: "700" },
  time: { color: "#999", fontSize: 11 },
  inputRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  input: { flex: 1, borderWidth: 1, borderRadius: 7, paddingHorizontal: 10 },
});

import Svg, { Path } from 'react-native-svg';

const WavyHeader = () => {
  const WIDTH = 320;
  const HEIGHT = 100; // Height of the wavy section
  const waveHeight = 20; // Amplitude of the wave

  const d = `M0,0 L0,${HEIGHT - waveHeight} Q${WIDTH / 4},${HEIGHT} ${WIDTH / 2},${HEIGHT - waveHeight} Q${WIDTH * 3 / 4},${HEIGHT - 2 * waveHeight} ${WIDTH},${HEIGHT - waveHeight} L${WIDTH},0 Z`;

  return (
    <Svg width={WIDTH} height={HEIGHT}>
      <Path d={d} fill="#yourColor" />
    </Svg>
  );
};

const stylesV2 = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  msg: { padding: 10, borderBottomWidth: 1, borderColor: "#ddd" },
  sender: { fontWeight: "700" },
  time: { color: "#999", fontSize: 11 },
  inputRow: { flexDirection: "row", gap: 8, marginTop: 8 },
  input: { flex: 1, borderWidth: 1, borderRadius: 7, paddingHorizontal: 10 },
});


