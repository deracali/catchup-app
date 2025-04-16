import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Image,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QuizTabIcon from "../../components/QuizTabIcon";

const { width, height } = Dimensions.get("window");

const quiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Popular");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem("@role").then((roleData) => {
      setRole(roleData);
    });

    axios
      .get("https://catchup-project.onrender.com/api/quiz")
      .then((response) => {
        setQuizData(response.data);
        setFilteredQuizzes(response.data);

        const uniqueCategories = [
          ...new Set(response.data.map((quiz) => quiz.category)),
        ];
        setCategories(uniqueCategories);
      })
      .catch((error) => console.error("Error fetching quizzes", error));
  }, []);

  useEffect(() => {
    if (role) {
      const normalizedRole = role.trim().toLowerCase();
      const filtered = quizData.filter((quiz) =>
        quiz.category.trim().toLowerCase() === normalizedRole
      );
      console.log("Filtered quizzes:", filtered);
      setFilteredQuizzes(filtered);
    }
  }, [role, quizData]);
  

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSelectedSubject(null);
    const filtered = quizData.filter((quiz) => quiz.category === category);
    setFilteredQuizzes(filtered);
  };

  

  const handleQuizClick = async (quizId) => {
    try {
      const studentId = await AsyncStorage.getItem("@userId");
  
      if (!studentId) {
        alert("You must be logged in to view quiz details.");
        return;
      }
  
      const res = await axios.get(`https://catchup-project.onrender.com/api/users/profile/${studentId}`);
      const user = res.data;
  
      const now = new Date();
      const hasSubscription =
        user.subscriptions &&
        user.subscriptions.some(
          (sub) =>
            (sub.plan === "Per Subject" || sub.plan === "All Subjects") &&
            new Date(sub.endDate) > now
        );
  
      if (!hasSubscription) {
        alert("You must have an active 'Per Subject' or 'All Subjects' plan. Redirecting to pricing.");
        router.push("/pricing"); // 🔁 Update this to your actual pricing screen path
        return;
      }
  
      // ✅ Subscribed – proceed to quiz
      router.push({
        pathname: `/quiz/${quizId}`,
        query: { id: quizId },
      });
    } catch (error) {
      console.error("Error checking subscription:", error);
      alert("Something went wrong while verifying your subscription.");
    }
  };
  

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.08,
      }}
    >
      <StatusBar translucent backgroundColor="#000" barStyle="light-content" />
      {/* Greeting + Quiz Code Box */}
      <View style={styles.headerCard}>
        <Text style={styles.greetingText}>👋 Hello</Text>

        <View style={styles.quizCodeBox}>
        <Text style={styles.boxTitle}>Start a Quiz</Text>
<Text style={styles.boxSubtitle}>
  Ready to boost your skills? Dive into exciting quizzes and rack up points!
</Text>

        </View>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: height * 0.02 }}
      >
        {categories &&
          categories.length > 0 &&
          categories.map((category, index) => (
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


    
      {/* Quiz List */}
      <ScrollView
        style={{ marginTop: height * 0.02 }}
        contentContainerStyle={{ paddingBottom: height * 0.02 }}
      >
        {filteredQuizzes.length > 0 ? (
          filteredQuizzes.map((item) => (
            <TouchableOpacity key={item._id} onPress={() => handleQuizClick(item._id)}>
              <View style={styles.quizCard}>
                <View style={styles.quizImageContainer}>
                  <Image
                    source={require("../../assets/images/quizImg.jpeg")}
                    style={styles.quizImage}
                    resizeMode="cover"
                  />
                </View>

                <View style={styles.quizInfo}>
                  <Text style={styles.quizTitle}>{item.title}</Text>
                  <Text style={styles.quizDetails}>
                    {item.questions?.length} Questions • {item.timeLimit} min
                  </Text>
                </View>

                <Text style={styles.quizRating}>⭐ {item.rating}</Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ textAlign: "center", marginTop: height * 0.05 }}>
            No quizzes available
          </Text>
        )}
      </ScrollView>

      {/* Bottom Nav Icon */}
      <QuizTabIcon style={styles.fixedTabIcon} onPress={() => console.log("Navigate to Courses")} />
    </View>
  );
};

const styles = StyleSheet.create({
  fixedTabIcon: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
  },

  headerCard: {
    marginTop: 20,
    marginBottom: 10,
  },

  greetingText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },

  quizCodeBox: {
    backgroundColor: "#1a73e8",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },

  boxTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },

  boxSubtitle: {
    color: "#fff",
    fontSize: 13,
    marginBottom: 15,
  },

  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    height: 40,
  },

  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    paddingHorizontal: 10,
    color: "#000",
  },

  quizCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: height * 0.02,
    flexDirection: "row",
    alignItems: "center",
  },

  quizImageContainer: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#ddd",
  },

  quizImage: {
    width: "100%",
    height: "100%",
  },

  quizInfo: {
    marginLeft: width * 0.04,
    flex: 1,
  },

  quizTitle: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#333",
  },

  quizDetails: {
    color: "gray",
    fontSize: 12,
    marginTop: 4,
  },

  quizRating: {
    fontSize: width * 0.04,
    color: "gold",
    fontWeight: "600",
  },
});

export default quiz;
