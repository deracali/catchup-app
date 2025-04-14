import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, Image, ActivityIndicator } from "react-native";
import { AntDesign, Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const QuizDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    if (id) {
      axios
        .get(`https://catchup-project.onrender.com/api/quiz/quiz/${id}`)
        .then((response) => {
          setQuizData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching quiz data:", error);
        });
    }
  }, [id]);

  if (!quizData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Check if quizData.questions is valid and has questions
  const questionCount = quizData.questions?.length || 0;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff", paddingHorizontal: width * 0.05, paddingTop: height * 0.04 }}>
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: height * 0.02 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="arrowleft" size={width * 0.06} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: width * 0.05, fontWeight: "bold", marginLeft: width * 0.03 }}>
          Quiz of the week
        </Text>
      </View>

      {/* Icon Block */}
      <View
        style={{
          backgroundColor: "#1a73e8",
          borderRadius: width * 0.05,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: height * 0.05,
          marginBottom: height * 0.03,
        }}
      >
        <FontAwesome5 name="question-circle" size={width * 0.3} color="#fff" />
      </View>

      {/* Title */}
      <Text style={{ fontSize: width * 0.07, fontWeight: "bold", color: "#1C1C1E", marginBottom: height * 0.02 }}>
        {quizData.questions && quizData.questions[0]?.subject || "Quiz Title"}
      </Text>

      {/* Info Boxes */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: height * 0.03 }}>
        <View style={styles.infoBox}>
          <AntDesign name="staro" size={width * 0.06} color="#1a73e8" />
          <Text style={styles.infoText}>{questionCount} questions</Text>
        </View>
        <View style={styles.infoBox}>
          <FontAwesome5 name="gem" size={width * 0.06} color="#1a73e8" />
          <Text style={styles.infoText}>+{quizData.rewardPoints || 100} points</Text>
        </View>
        <View style={styles.infoBox}>
          <Feather name="heart" size={width * 0.06} color="#1a73e8" />
          <Text style={styles.infoText}>3 lives</Text>
        </View>
      </View>

      {/* Description */}
      <Text style={{ fontSize: width * 0.04, fontWeight: "500", marginBottom: height * 0.01 }}>
        Become the best and fastest player of quiz of the week worldwide and win $50!
      </Text>
      <Text style={{ fontSize: width * 0.04, color: "#555", marginBottom: height * 0.04 }}>
        {quizData.description || "This quiz is about design tools for non-designers. Challenge yourself and your friends!"}
      </Text>

      {/* Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `/quiz/quizsystem`,
              params: { quizId: id },
            })
          }
          style={{
            flex: 1,
            borderColor: "#1a73e8",
            borderWidth: 2,
            padding: width * 0.035,
            borderRadius: width * 0.03,
            marginRight: width * 0.02,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#1a73e8", fontWeight: "bold", fontSize: width * 0.045 }}>Practice</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: `/quiz/leadersboard`,
            })
          }
          style={{
            flex: 1,
            backgroundColor: "#1a73e8",
            padding: width * 0.035,
            borderRadius: width * 0.03,
            marginLeft: width * 0.02,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: width * 0.045 }}>Beat Friends</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  infoBox: {
    width: width * 0.25,
    height: height * 0.08,
    backgroundColor: "#FFF",
    borderRadius: width * 0.04,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  infoText: {
    marginTop: 5,
    fontSize: width * 0.035,
    fontWeight: "600",
    color: "#1C1C1E",
    textAlign: "center",
  },
};

export default QuizDetails;
