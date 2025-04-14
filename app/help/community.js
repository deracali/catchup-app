import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";

const { width, height } = Dimensions.get("window");

export default function Community() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [replyTo, setReplyTo] = useState(null); // Store the ID of the message being replied to
  const [highlightedMessage, setHighlightedMessage] = useState(null); // Store the ID of the message being highlighted

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("https://catchup-project.onrender.com/api/messages");

        // Access the data field in the response and set it to messages
        if (response.data && Array.isArray(response.data.data)) {
          setMessages(response.data.data);
        } else {
          console.error("Received data is not in expected format:", response.data);
          setMessages([]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    };

    fetchMessages();
  }, []);

  const handleReply = (messageId) => {
    setReplyTo(messageId);
    setHighlightedMessage(messageId); // Highlight the message when it's clicked
  };

  const sendMessage = async () => {
    if (inputText.trim()) {
      // Check for phone numbers or links
      const linkRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|\S+\.com|\S+\.\S{2,})/i;
      const phoneRegex = /(\+?\d{1,3}[-.\s]?(\(?\d{1,4}\)?)[-.\s]?\d{3,4}[-.\s]?\d{3,4})/;

      if (linkRegex.test(inputText) || phoneRegex.test(inputText)) {
        Alert.alert(
          "Content Not Allowed",
          "Sharing of links or phone numbers is not allowed.",
          [{ text: "OK" }]
        );
        return;
      }

      try {
        const newMessage = {
          text: inputText,
          replyTo: replyTo ? replyTo : null,
        };

        await axios.post("https://catchup-project.onrender.com/api/messages", newMessage);

        // Fetch updated messages
        const response = await axios.get("https://catchup-project.onrender.com/api/messages");
        if (response.data && Array.isArray(response.data.data)) {
          setMessages(response.data.data);
        } else {
          console.error("Received data is not in expected format:", response.data);
          setMessages([]);
        }

        setInputText("");
        setReplyTo(null);
        setHighlightedMessage(null);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Customer Service</Text>
      </View>

      {/* Messages */}
      <ScrollView contentContainerStyle={styles.messagesContainer}>
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageWrapper,
                msg.from === "me" ? styles.myMessageWrapper : styles.otherMessageWrapper,
                // Highlight message if it's being clicked
                highlightedMessage === msg._id && styles.highlightedMessage,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  msg.from === "me" ? styles.myMessage : styles.otherMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    msg.from === "me" ? styles.myMessageText : styles.otherMessageText,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
              <Text style={styles.messageTime}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </Text>
              {/* Reply button */}
              <TouchableOpacity onPress={() => handleReply(msg._id)} style={styles.replyButton}>
                <Text style={styles.replyText}>Reply</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text>No messages to display</Text> // Fallback if no messages are present
        )}
      </ScrollView>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        {replyTo && (
          <View style={styles.replyInfo}>
            <Text style={styles.replyingToText}>Replying to message:</Text>
            <Text style={styles.replyingText}>
              {messages.find(msg => msg._id === replyTo)?.text || "Loading..."}
            </Text>
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholder="Message"
          placeholderTextColor="#aaa"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Feather name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  container: { flex: 1, paddingTop:40 },
  header: { padding: 10, backgroundColor: "#1a73e8" },
  headerTitle: { fontSize: 24, color: "#fff" },
  messagesContainer: { padding: 16 },
  messageWrapper: { marginBottom: 10, paddingVertical: 5 },
  myMessageWrapper: { alignSelf: "flex-end", backgroundColor: "#e0e0e0" },
  otherMessageWrapper: { alignSelf: "flex-start" },
  messageBubble: { padding: 10, borderRadius: 20 },
  myMessage: { backgroundColor: "#007bff", color: "#fff" },
  otherMessage: { backgroundColor: "#f1f1f1", color: "#000" },
  messageText: { fontSize: 16 },
  messageTime: { fontSize: 12, color: "#aaa" },
  replyButton: { marginTop: 5 },
  replyText: { color: "#007BFF" },
  inputBar: { flexDirection: "row", padding: 10, borderTopWidth: 1, borderTopColor: "#ddd" },
  replyInfo: { marginBottom: 10 },
  replyingToText: { fontSize: 14, color: "#777" },
  replyingText: { fontSize: 16, fontStyle: "italic" },
  input: { flex: 1, padding: 10, borderRadius: 20, backgroundColor: "#f4f4f4" },
  sendButton: {
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,  // Adds a shadow effect for Android
    shadowColor: "#000",  // iOS shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
  },
  // Highlighted message style
  highlightedMessage: {
    backgroundColor: "#fce6a0", // Change background color to highlight the message
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#f9c800",
  },
};