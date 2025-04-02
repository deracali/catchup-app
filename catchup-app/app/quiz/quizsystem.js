import React, { useState } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const quizsystem = () => {
  const [selectedOption, setSelectedOption] = useState("D");

  const options = [
    { id: "A", text: "User Interface and User Experience" },
    { id: "B", text: "User Introface and User Experience" },
    { id: "C", text: "User Interface and Using Experience" },
    { id: "D", text: "User Interface and User Experience" },
    { id: "E", text: "Using Interface and Using Experience" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F7FB", paddingHorizontal: width * 0.05, paddingTop: height * 0.05 }}>
      
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: height * 0.02 }}>
        <TouchableOpacity>
          <AntDesign name="arrowleft" size={width * 0.06} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: width * 0.05, fontWeight: "bold" }}>UI UX Design Quiz</Text>
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#E0E0E0", borderRadius: width * 0.03, paddingHorizontal: width * 0.03, paddingVertical: height * 0.005 }}>
          <Feather name="clock" size={width * 0.05} color="black" />
          <Text style={{ marginLeft: width * 0.02, fontSize: width * 0.04 }}>16:35</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: height * 0.03 }}>
        {[4, 5, 6, 7, 8, 9, 10].map((num) => (
          <TouchableOpacity key={num} style={{ marginHorizontal: width * 0.02 }}>
            <View
              style={{
                width: width * 0.08,
                height: width * 0.08,
                borderRadius: width * 0.04,
                backgroundColor: num === 10 ? "#007BFF" : "#D3D3D3",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: num === 10 ? "white" : "black", fontWeight: "bold", fontSize: width * 0.04 }}>
                {num}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Question */}
      <Text style={{ fontSize: width * 0.045, fontWeight: "bold", marginBottom: height * 0.02 }}>
        What is the meaning of UI UX Design?
      </Text>

      {/* Options */}
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: selectedOption === option.id ? "#E3F2FD" : "#E0E0E0",
            padding: height * 0.015,
            borderRadius: width * 0.02,
            marginBottom: height * 0.015,
          }}
          onPress={() => setSelectedOption(option.id)}
        >
          <Text style={{ fontSize: width * 0.045, fontWeight: "bold", marginRight: width * 0.03 }}>
            {option.id}
          </Text>
          <Text style={{ fontSize: width * 0.04, color: selectedOption === option.id ? "#007BFF" : "black" }}>
            {option.text}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Bottom Navigation */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: height * 0.05 }}>
        <TouchableOpacity style={{ width: width * 0.15, height: width * 0.15, borderRadius: width * 0.075, backgroundColor: "#E0E0E0", justifyContent: "center", alignItems: "center" }}>
          <AntDesign name="arrowleft" size={width * 0.06} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={{ backgroundColor: "#007BFF", paddingVertical: height * 0.015, paddingHorizontal: width * 0.15, borderRadius: width * 0.02 }}>
          <Text style={{ color: "white", fontSize: width * 0.045, fontWeight: "bold" }}>Submit Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ width: width * 0.15, height: width * 0.15, borderRadius: width * 0.075, backgroundColor: "#E0E0E0", justifyContent: "center", alignItems: "center" }}>
          <AntDesign name="arrowright" size={width * 0.06} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default quizsystem;
