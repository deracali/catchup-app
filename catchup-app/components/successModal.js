import React from "react";
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from Expo

const { width, height } = Dimensions.get("window");

const successModal = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Ionicons name="checkmark-circle" size={50} color="#004d66" style={styles.icon} />
        <Text style={styles.title}>Your Subscription Is Successful!</Text>
        <Text style={styles.subtitle}>Enjoy Unlimited Access.</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Go to Courses</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: width,
    height: height,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "center",
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#004d66",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default successModal;
