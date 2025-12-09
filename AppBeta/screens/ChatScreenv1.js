// screens/ChatScreen.js
import React, { useEffect, useState, useRef } from "react";
import { View, TextInput, FlatList, Text, StyleSheet, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import io from "socket.io-client";
import BottomNavApp from "../components/BottomNavApp";

const SERVER_URL = "http://192.168.0.120:3000"; // your server IP

export default function ChatScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SERVER_URL, { transports: ["websocket"] });

    socketRef.current.on("connect", () => {
      console.log("connected to server", socketRef.current.id);
      socketRef.current.emit("joinRoom", { room: "parental-room" });
    });

    socketRef.current.on("message", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socketRef.current.on("history", (history) => {
      setMessages(history);
    });

    return () => socketRef.current.disconnect();
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    const payload = { text: message.trim(), sender: "me", at: new Date().toISOString() };
    socketRef.current.emit("message", payload);
    setMessages(prev => [...prev, payload]);
    setMessage("");
  };

  const renderMessage = ({ item }) => {
    const isMine = item.sender === "me";
    return (
      <View style={[styles.msgContainer, isMine ? styles.myMsg : styles.otherMsg]}>
        {!isMine && <Text style={styles.sender}>{item.sender}</Text>}
        <Text style={[styles.msgText, isMine && styles.myMsgText]}>{item.text}</Text>
        <Text style={styles.time}>{new Date(item.at || Date.now()).toLocaleTimeString()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <FlatList
          data={messages}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 16 }}
        />

        <View style={styles.inputRow}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#1d0202ff"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <BottomNavApp />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000ff",
  },
  msgContainer: {
    maxWidth: "80%",
    borderRadius: 18,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  myMsg: {
    backgroundColor: "#6F42C1",
    alignSelf: "flex-end",
  },
  otherMsg: {
    backgroundColor: "#f3e8ff",
    alignSelf: "flex-start",
  },
  msgText: {
    fontSize: 15,
    color: "#1a1a2e",
  },
  myMsgText: {
    color: "#fff",
  },
  sender: {
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 4,
    color: "#5a2e5a",
  },
  time: {
    fontSize: 10,
    color: "#999",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 44,
    backgroundColor: "#faf5ff",
    marginRight: 8,
    color: "#000",
  },
  sendBtn: {
    backgroundColor: "#6F42C1",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendText: {
    color: "#fff",
    fontWeight: "600",
  },
});
