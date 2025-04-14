import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const courses = [
  { id: "1", title: "UI & UX Design Basic", description: "UI Refers To The Screens, Buttons, Toggles, Icons, And Other Visual.", selected: false },
  { id: "2", title: "UI & UX Design Basic", description: "UI Refers To The Screens, Buttons, Toggles, Icons, And Other Visual.", selected: true },
];

const CourseCard = ({ item, onSelect }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, item.selected && styles.selectedCard]}
      onPress={() => onSelect(item.id)}
    >
      <View style={styles.iconContainer}>
        <Feather name="book-open" size={20} color={item.selected ? "white" : "#1a73e8"} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.courseTitle, item.selected && styles.selectedText]}>Course 1</Text>
        <Text style={[styles.courseName, item.selected && styles.selectedText]}>{item.title}</Text>
        <Text style={[styles.courseDesc, item.selected && styles.selectedText]}>{item.description}</Text>
      </View>
      <TouchableOpacity onPress={() => onSelect(item.id)}>
        <Feather name="bookmark" size={20} color={item.selected ? "white" : "#1a73e8"} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const offlinecourse = () => {
  const navigation = useNavigation();
  const [courseList, setCourseList] = useState(courses);

  const handleSelect = (id) => {
    setCourseList(courseList.map(course => 
      course.id === id ? { ...course, selected: !course.selected } : course
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity>
          <Feather name="bell" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.byText}>By: <Text style={styles.author}>Luis John</Text></Text>
        <Text style={styles.title}>Visual Design</Text>
        <View style={styles.statsContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>100M+ Students</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>100K+ Reviews</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={courseList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CourseCard item={item} onSelect={handleSelect} />}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.fab}>
        <AntDesign name="plus" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: width * 0.05,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
  },
  headerTitle: {
    fontSize: width * 0.055,
    fontWeight: "bold",
  },
  section: {
    marginBottom: height * 0.02,
  },
  byText: {
    fontSize: width * 0.04,
    color: "gray",
  },
  author: {
    color: "#1a73e8",
    fontWeight: "bold",
  },
  title: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    marginVertical: height * 0.01,
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: height * 0.01,
  },
  badge: {
    backgroundColor: "#1a73e8",
    borderRadius: 20,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.01,
    marginRight: width * 0.03,
  },
  badgeText: {
    color: "white",
    fontSize: width * 0.035,
  },
  listContainer: {
    paddingBottom: height * 0.1,
  },
  card: {
    backgroundColor: "white",
    borderRadius: width * 0.04,
    padding: width * 0.05,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  selectedCard: {
    backgroundColor: "#023047",
  },
  iconContainer: {
    padding: width * 0.02,
    borderRadius: width * 0.02,
  },
  textContainer: {
    flex: 1,
    marginLeft: width * 0.04,
  },
  courseTitle: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    color: "gray",
  },
  courseName: {
    fontSize: width * 0.05,
    fontWeight: "bold",
    marginVertical: height * 0.005,
  },
  courseDesc: {
    fontSize: width * 0.035,
    color: "gray",
  },
  selectedText: {
    color: "white",
  },
  fab: {
    position: "absolute",
    bottom: height * 0.05,
    alignSelf: "center",
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
    backgroundColor: "#1a73e8",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default offlinecourse;
