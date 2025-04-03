import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, Dimensions, ScrollView, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from 'expo-router'; // for navigation
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage for role

const { width, height } = Dimensions.get("window");

const quiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [categories, setCategories] = useState([]); // Now dynamic categories
  const [selectedCategory, setSelectedCategory] = useState("Popular"); // Default category
  const [selectedSubject, setSelectedSubject] = useState(null); // Subject selected for filtering
  const [role, setRole] = useState(null); // Role from AsyncStorage
  const router = useRouter();

  useEffect(() => {
    // Fetch role from AsyncStorage
    AsyncStorage.getItem("role").then((roleData) => {
      setRole(roleData);
    });

    // Fetch quizzes from your database
    axios.get("https://catchup-project.onrender.com/api/quiz") // Replace with your actual API
      .then((response) => {
        setQuizData(response.data);
        setFilteredQuizzes(response.data); // Initial setting of all quizzes

        // Extract unique categories from quizzes
        const uniqueCategories = [...new Set(response.data.map(quiz => quiz.category))];
        setCategories(uniqueCategories); // Set dynamic categories
      })
      .catch((error) => console.error("Error fetching quizzes", error));
  }, []);

  useEffect(() => {
    // Filter quizzes based on role (category) and subject
    if (role) {
      const filtered = quizData.filter((quiz) => quiz.category === role);

      if (selectedSubject) {
        setFilteredQuizzes(filtered.filter((quiz) => quiz.questions.some((question) => question.subject === selectedSubject)));
      } else {
        setFilteredQuizzes(filtered);
      }
    }
  }, [role, quizData, selectedSubject]);

  // Handle category click to filter quizzes
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubject(null); // Reset subject filter when category changes
    const filtered = quizData.filter((quiz) => quiz.category === category);
    setFilteredQuizzes(filtered);
  };

  // Handle subject click to filter quizzes
  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    const filtered = quizData.filter((quiz) => quiz.category === selectedCategory);
    setFilteredQuizzes(filtered.filter((quiz) => quiz.questions.some((question) => question.subject === subject)));
  };

  // Handle quiz click to navigate to quiz details screen
  const handleQuizClick = (quizId) => {
    router.push(`/quiz/quizdetail/${quizId}`); // Redirect to quiz details screen with quizId
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F7FB", paddingHorizontal: width * 0.05, paddingTop: height * 0.08 }}>
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

      {/* Category Tabs - Dynamically mapped categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: height * 0.02 }}>
        {categories && categories.length > 0 && categories.map((category, index) => (
          <TouchableOpacity key={index} onPress={() => handleCategoryClick(category)}>
            <Text
              style={{
                fontSize: width * 0.04,
                color: selectedCategory === category ? "blue" : "gray",
                fontWeight: "bold",
                marginRight: width * 0.05,
              }}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

       {/* Scrollable Quiz List */}
       <ScrollView style={{ marginTop: height * 0.02 }} contentContainerStyle={{ paddingBottom: height * 0.02 }}>
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((item) => (
            <TouchableOpacity key={item._id} onPress={() => handleQuizClick(item._id)}>
              <View style={{ backgroundColor: "#fff", borderRadius: width * 0.03, padding: width * 0.04, marginBottom: height * 0.02, flexDirection: "row" }}>
                {/* Image Placeholder */}
                <View style={{ width: width * 0.15, height: width * 0.15, backgroundColor: "gray", borderRadius: width * 0.02 }}>
                  <Image
                    source={{ uri: item.imageUrl }} // Assuming the quiz object has an imageUrl field
                    style={{ width: "100%", height: "100%", borderRadius: width * 0.02 }}
                    resizeMode="cover" // You can change this to 'contain' if the aspect ratio should be preserved
                  />
                </View>

                <View style={{ marginLeft: width * 0.04, flex: 1 }}>
                  <Text style={{ fontSize: width * 0.045, fontWeight: "bold" }}>{item.title}</Text>
                  <Text style={{ color: "gray" }}>{item.questions?.length} Questions • {item.timeLimit} min</Text>
                </View>
                <Text style={{ fontSize: width * 0.04, color: "gold" }}>⭐ {item.rating}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: height * 0.05 }}>No quizzes available</Text>
        )}
      </ScrollView>


      {/* Start Quiz Button */}
      <TouchableOpacity style={{ backgroundColor: "blue", padding: width * 0.04, borderRadius: width * 0.03, alignItems: "center", marginTop: height * 0.03 }}>
        <Text style={{ color: "white", fontSize: width * 0.045, fontWeight: "bold" }}>Start Quiz</Text>
      </TouchableOpacity>
    </View>
  );
};

export default quiz;
