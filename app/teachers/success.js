import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const success = () => {
  const { email } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isAccepted, setIsAccepted] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  useEffect(() => {
    const checkTeacherStatus = async () => {
      try {
        const res = await fetch("https://catchup-project.onrender.com/api/teacher-reviews");
        const teachers = await res.json();

        const teacher = teachers.find(t => t.email === email);
        if (teacher) {
          setEmailExists(true);
          if (teacher.acceptedOrRejected === "Accepted") {
            setIsAccepted(true);
          }
        }

      } catch (err) {
        console.error("Error fetching teacher list:", err);
      } finally {
        setLoading(false);
      }
    };

    checkTeacherStatus();
  }, [email]);

  if (loading) {
    return (
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#004d66" />
      </View>
    );
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.modalContainer}>
        <Ionicons name="checkmark-circle" size={50} color="#004d66" style={styles.icon} />
        <Text style={styles.title}>Registration Complete</Text>
        {emailExists && isAccepted ? (
          <>
            <Text style={styles.subtitle}>You're now approved!</Text>
            <TouchableOpacity style={styles.button} onPress={() => router.push("/teachers/home")}>
              <Text style={styles.buttonText}>Go to Dashboard</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.subtitle}>Your application is pending review.</Text>
        )}
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

export default success;
