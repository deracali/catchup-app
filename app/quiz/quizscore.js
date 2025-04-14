import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const quizscore = () => {
  const [scores, setScores] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(true);


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: width * 0.05,
      }}
    >
      {/* Score Circle */}
      <View
        style={{
          width: width * 0.4,
          height: width * 0.4,
          borderRadius: width * 0.2,
          backgroundColor: "#0D47A1",
          justifyContent: "center",
          alignItems: "center",
          borderWidth: width * 0.02,
          borderColor: "#1976D2",
          marginBottom: height * 0.03,
        }}
      >
        <Text style={{ color: "white", fontSize: width * 0.05, fontWeight: "bold" }}>
          Your Score
        </Text>
        <Text style={{ color: "white", fontSize: width * 0.07, fontWeight: "bold" }}>
          {totalScore}/{scores.length * 100}
        </Text>
      </View>

      {/* Congratulations Text */}
      <Text
        style={{
          fontSize: width * 0.05,
          fontWeight: "bold",
          color: "#0D47A1",
          marginBottom: height * 0.01,
        }}
      >
        Congratulations!
      </Text>
      <Text
        style={{
          fontSize: width * 0.04,
          color: "#0D47A1",
          textAlign: "center",
          marginBottom: height * 0.05,
        }}
      >
        Great job! You scored {percentage}%!
      </Text>

      {/* Buttons */}
      <TouchableOpacity
        style={{
          width: width * 0.7,
          paddingVertical: height * 0.015,
          backgroundColor: "#0D47A1",
          borderRadius: width * 0.02,
          alignItems: "center",
          marginBottom: height * 0.02,
        }}
      >
        <Text style={{ color: "white", fontSize: width * 0.045, fontWeight: "bold" }}>Share</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          width: width * 0.7,
          paddingVertical: height * 0.015,
          backgroundColor: "#0D47A1",
          borderRadius: width * 0.02,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: width * 0.045, fontWeight: "bold" }}>
          Back to Home
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default quizscore;
