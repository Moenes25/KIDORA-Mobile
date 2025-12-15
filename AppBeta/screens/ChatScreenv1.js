// screens/ChatScreen.js
import React, { useEffect, useState, useRef } from "react";
import { 
  View, 
  TextInput, 
  FlatList, 
  Text, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity 
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import io from "socket.io-client";
import { useTranslation } from "../context/TranslationContext";
import BottomNavApp from "../components/BottomNavApp";
import ChatNavBar from "../components/ChatNavBar"; // Ensure you import your new Header

const SERVER_URL = "http://192.168.0.120:3000"; // your server IP

export default function ChatScreen() {
  const { t, isRTL } = useTranslation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(SERVER_URL, { transports: ["websocket"] });

    socketRef.current.on("connect", () => {
      console.log("connected to server", socketRef.current.id);
      socketRef.current.emit("joinRoom", { room: "parental-room" });
    });

    socketRef.current.on("message", (msg) => {
      setMessages(prev => [...prev, msg]);
      // Auto-scroll to bottom when new message arrives
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    socketRef.current.on("history", (history) => {
      setMessages(history);
    });

    return () => socketRef.current.disconnect();
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    const payload = { 
      text: message.trim(), 
      sender: "me", 
      at: new Date().toISOString() 
    };
    socketRef.current.emit("message", payload);
    setMessages(prev => [...prev, payload]);
    setMessage("");
    
    // Auto-scroll to bottom after sending
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = ({ item }) => {
    const isMine = item.sender === "me";
    return (
      <View 
        style={[
          styles.msgContainer, 
          isMine ? styles.myMsg : styles.otherMsg,
          // RTL support: swap alignment
          isRTL && (isMine ? { alignSelf: "flex-start" } : { alignSelf: "flex-end" })
        ]}
      >
        {!isMine && (
          <Text 
            style={[
              styles.sender,
              isRTL && { textAlign: 'right' }
            ]}
          >
            {item.sender}
          </Text>
        )}
        <Text 
          style={[
            styles.msgText, 
            isMine && styles.myMsgText,
            isRTL && { textAlign: 'right' }
          ]}
        >
          {item.text}
        </Text>
        <Text 
          style={[
            styles.time,
            isMine ? styles.myTime : styles.otherTime, // Different time color for contrast
            isRTL && { alignSelf: 'flex-start' }
          ]}
        >
          {new Date(item.at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Added the custom ChatNavBar here */}
      <ChatNavBar 
        name="Ayoub" 
        isOnline={true} 
      />

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={renderMessage}
          contentContainerStyle={{ 
            paddingVertical: 12, 
            paddingHorizontal: 16,
            flexGrow: 1 
          }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        <View style={[
          styles.inputRow,
          isRTL && { flexDirection: 'row-reverse' }
        ]}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            style={[
              styles.input,
              isRTL && { 
                textAlign: 'right',
                marginRight: 0,
                marginLeft: 8 
              }
            ]}
            placeholder={t('typeMessage')}
            placeholderTextColor="#999"
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity 
            style={styles.sendBtn} 
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Feather 
              name="send" 
              size={20} 
              color="#fff" 
              style={isRTL && { transform: [{ scaleX: -1 }] }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* <BottomNavApp />  <-- Typically hidden on chat screens, uncomment if needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  msgContainer: {
    maxWidth: "80%",
    borderRadius: 18,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  // ME: Purple Background
  myMsg: {
    backgroundColor: "#9d00ff", // Vibrant purple to match header
    alignSelf: "flex-end",
    borderBottomRightRadius: 2,
  },
  // OTHERS: Gray Background (Removed purple tint)
  otherMsg: {
    backgroundColor: "#E5E5EA", // Standard iOS gray
    alignSelf: "flex-start",
    borderBottomLeftRadius: 2,
  },
  msgText: {
    fontSize: 15,
    color: "#000", // Default black for 'otherMsg'
    lineHeight: 20,
  },
  // Text color white for my purple bubbles
  myMsgText: {
    color: "#fff",
  },
  sender: {
    fontWeight: "600",
    fontSize: 12,
    marginBottom: 4,
    color: "#555",
  },
  time: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  // Light gray time for purple background
  myTime: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  // Dark gray time for gray background
  otherTime: {
    color: "#888",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginBottom: Platform.OS === 'ios' ? 10 : 0,
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
    fontSize: 15,
  },
  sendBtn: {
    backgroundColor: "#9d00ff", // Match the purple theme
    borderRadius: 24,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
});