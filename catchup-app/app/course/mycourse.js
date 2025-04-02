import React from "react";
import { View, Text, FlatList, Dimensions, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TabIcon from "../../components/TabIcon";

const { width, height } = Dimensions.get("window");

const courses = [
  { id: "1", title: "Introduction To Programming", author: "John Smith", lessons: 48, duration: "2hr 45min" },
  { id: "2", title: "Advance Prototyping", author: "John Smith", lessons: 48, duration: "2hr 45min" },
  { id: "3", title: "Build Own Portfolio", author: "John Smith", lessons: 48, duration: "2hr 45min" },
  { id: "4", title: "Advance Prototyping", author: "John Smith", lessons: 48, duration: "2hr 45min" },
];

const CourseCard = ({ title, author, lessons, duration }) => {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: width * 0.04,
        borderRadius: 15,
        marginVertical: width * 0.02,
        width: width * 0.9,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
      }}
    >
      <Text style={{ fontSize: width * 0.045, fontWeight: "bold" }}>{title}</Text>
      <Text style={{ fontSize: width * 0.035, color: "gray" }}>By: {author}</Text>
      <Text style={{ fontSize: width * 0.035, color: "gray" }}>{lessons} Lessons • {duration}</Text>
      <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: width * 0.02 }}>
        <Ionicons name="play-circle" size={width * 0.08} color="#0084ff" />
      </TouchableOpacity>
    </View>
  );
};

const mycourse = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#f8f5f2", paddingTop: height * 0.05 }}>
      <Text style={{ fontSize: width * 0.06, fontWeight: "bold", textAlign: "center" }}>My Courses</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CourseCard {...item} />}
      />
      <TabIcon style={{
            position: 'absolute',
            bottom: 20,
            alignSelf: 'center',
         }} onPress={() => console.log('Navigate to Courses')} />

    </View>
  );
};

export default mycourse;
