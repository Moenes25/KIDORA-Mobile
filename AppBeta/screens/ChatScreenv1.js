// screens/ChatScreen.js
import React, { useEffect, useState, useRef } from "react";
import { View, TextInput, Button, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import io from "socket.io-client";
import BottomNavApp from "../components/BottomNavApp";

const SERVER_URL = "http:///192.168.0.120:3000"; // <--- change to your server IP or domain

export default function ChatScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    // connect
    socketRef.current = io(SERVER_URL, {
      transports: ["websocket"],
      // if you need auth, add: auth: { token: '...' }
    });

    socketRef.current.on("connect", () => {
      console.log("connected to server", socketRef.current.id);
      // optionally join a room:
      socketRef.current.emit("joinRoom", { room: "parental-room" });
    });

    socketRef.current.on("message", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    // load recent messages (via HTTP or via socket)
    socketRef.current.on("history", (history) => {
      setMessages(history);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    const payload = { text: message.trim(), sender: "parent", at: new Date().toISOString() };
    socketRef.current.emit("message", payload);
    setMessage("");
    // optimistic UI (server will broadcast back too)
    setMessages(prev => [...prev, payload]);
  };

  return (
        <View style={styles.container}>
          <SidebarApp visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <FlatList
        data={messages}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.msg}>
            <Text style={styles.sender}>{item.sender}</Text>
            <Text>{item.text}</Text>
            <Text style={styles.time}>{new Date(item.at || Date.now()).toLocaleTimeString()}</Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput value={message} onChangeText={setMessage} style={styles.input} placeholder="Type a message..." />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>

     <BottomNavApp />
     </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  inputRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 6, paddingHorizontal: 8, height: 44 },
  msg: { padding: 8, borderBottomWidth: 1, borderColor: "#eee" },
  sender: { fontWeight: "600" },
  time: { fontSize: 10, color: "#999", marginTop: 4 }
});
