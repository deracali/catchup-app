import React from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { AntDesign, Feather, FontAwesome5 } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const quizdetails = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#F5F7FB", paddingHorizontal: width * 0.05, paddingTop: height * 0.05 }}>
      
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: height * 0.02 }}>
        <TouchableOpacity>
          <AntDesign name="arrowleft" size={width * 0.06} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: width * 0.05, fontWeight: "bold", marginLeft: width * 0.03 }}>Detail Quiz</Text>
      </View>

      {/* Quiz Title */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: height * 0.02 }}>
        <View>
          <Text style={{ fontSize: width * 0.06, fontWeight: "bold" }}>UI UX Design Quiz</Text>
          <Text style={{ color: "gray", fontSize: width * 0.04 }}>GET 100 Points</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: width * 0.045, color: "gold" }}>⭐ 4.8</Text>
        </View>
      </View>

      {/* Explanation Section */}
      <Text style={{ fontSize: width * 0.05, fontWeight: "bold", marginBottom: height * 0.02 }}>Brief explanation about this quiz</Text>

      {/* Quiz Details */}
      <View style={{ marginBottom: height * 0.03 }}>
        {/* Questions */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: height * 0.02 }}>
          <FontAwesome5 name="file-alt" size={width * 0.05} color="black" />
          <View style={{ marginLeft: width * 0.03 }}>
            <Text style={{ fontSize: width * 0.045, fontWeight: "bold" }}>10 Question</Text>
            <Text style={{ color: "gray", fontSize: width * 0.04 }}>10 points for a correct answer</Text>
          </View>
        </View>

        {/* Duration */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: height * 0.02 }}>
          <Feather name="clock" size={width * 0.05} color="black" />
          <View style={{ marginLeft: width * 0.03 }}>
            <Text style={{ fontSize: width * 0.045, fontWeight: "bold" }}>1 hour 15 min</Text>
            <Text style={{ color: "gray", fontSize: width * 0.04 }}>Total duration of the quiz</Text>
          </View>
        </View>

        {/* Stars */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AntDesign name="staro" size={width * 0.05} color="black" />
          <View style={{ marginLeft: width * 0.03 }}>
            <Text style={{ fontSize: width * 0.045, fontWeight: "bold" }}>Win 10 star</Text>
            <Text style={{ color: "gray", fontSize: width * 0.04 }}>Answer all questions correctly</Text>
          </View>
        </View>
      </View>

      {/* Instructions */}
      <Text style={{ fontSize: width * 0.045, fontWeight: "bold", marginBottom: height * 0.015 }}>
        Please read the text below carefully so you can understand it
      </Text>
      <Text style={{ fontSize: width * 0.04, color: "gray", marginBottom: height * 0.01 }}>
        • 10 points awarded for a correct answer and no marks for an incorrect answer
      </Text>
      <Text style={{ fontSize: width * 0.04, color: "gray", marginBottom: height * 0.01 }}>
        • Tap on options to select the correct answer
      </Text>
      <Text style={{ fontSize: width * 0.04, color: "gray", marginBottom: height * 0.01 }}>
        • Tap on the bookmark icon to save interesting questions
      </Text>
      <Text style={{ fontSize: width * 0.04, color: "gray", marginBottom: height * 0.03 }}>
        • Click submit if you are sure you want to complete all the quizzes
      </Text>

    </View>
  );
};

export default quizdetails;
