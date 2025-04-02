import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, TextInput, Dimensions } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const quizData = [
  { id: 1, title: "UI UX Design", questions: 10, time: "1 hour 15 min", rating: 4.8 },
  { id: 2, title: "Graphic Design", questions: 10, time: "1 hour 15 min", rating: 4.8 },
];

const continueQuiz = { title: "3D Animation", completed: "8/10", time: "35 min" };

const quiz = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#F5F7FB", paddingHorizontal: width * 0.05, paddingTop: height * 0.05 }}>
      
      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: width * 0.05, fontWeight: "bold" }}>Hello, James</Text>
        <Feather name="menu" size={width * 0.07} />
      </View>

      <Text style={{ fontSize: width * 0.06, fontWeight: "bold", marginVertical: height * 0.02 }}>Let's test your knowledge</Text>

      {/* Search Box */}
      <View style={{ flexDirection: "row", backgroundColor: "#fff", borderRadius: width * 0.03, padding: width * 0.03, alignItems: "center" }}>
        <Feather name="search" size={width * 0.05} color="gray" />
        <TextInput placeholder="Search" style={{ marginLeft: width * 0.03, flex: 1 }} />
      </View>

      {/* Category Tabs */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: height * 0.02 }}>
        {["Popular", "Science", "Mathematic", "Computer"].map((category, index) => (
          <Text key={index} style={{ fontSize: width * 0.04, color: category === "Computer" ? "blue" : "gray", fontWeight: "bold" }}>
            {category}
          </Text>
        ))}
      </View>

      {/* Quiz List */}
      <FlatList
        data={quizData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: "#fff", borderRadius: width * 0.03, padding: width * 0.04, marginBottom: height * 0.02, flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: width * 0.15, height: width * 0.15, backgroundColor: "gray", borderRadius: width * 0.02 }} />
            <View style={{ marginLeft: width * 0.04, flex: 1 }}>
              <Text style={{ fontSize: width * 0.045, fontWeight: "bold" }}>{item.title}</Text>
              <Text style={{ color: "gray" }}>{item.questions} Questions • {item.time}</Text>
            </View>
            <Text style={{ fontSize: width * 0.04, color: "gold" }}>⭐ {item.rating}</Text>
          </View>
        )}
      />

      {/* Continue Quiz Section */}
      <Text style={{ fontSize: width * 0.05, fontWeight: "bold", marginVertical: height * 0.02 }}>Continue Quiz</Text>
      <View style={{ backgroundColor: "#fff", borderRadius: width * 0.03, padding: width * 0.04, flexDirection: "row", alignItems: "center" }}>
        <View style={{ width: width * 0.15, height: width * 0.15, backgroundColor: "gray", borderRadius: width * 0.02 }} />
        <View style={{ marginLeft: width * 0.04, flex: 1 }}>
          <Text style={{ fontSize: width * 0.045, fontWeight: "bold" }}>{continueQuiz.title}</Text>
          <Text style={{ color: "gray" }}>{continueQuiz.completed} • {continueQuiz.time}</Text>
        </View>
        <TouchableOpacity style={{ backgroundColor: "black", padding: width * 0.03, borderRadius: width * 0.03 }}>
          <Text style={{ color: "white" }}>Continue Quiz</Text>
        </TouchableOpacity>
      </View>

      {/* Start Quiz Button */}
      <TouchableOpacity style={{ backgroundColor: "blue", padding: width * 0.04, borderRadius: width * 0.03, alignItems: "center", marginTop: height * 0.03 }}>
        <Text style={{ color: "white", fontSize: width * 0.045, fontWeight: "bold" }}>Start Quiz</Text>
      </TouchableOpacity>

    </View>
  );
};

export default quiz;
