import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { all } from "axios";

const { width } = Dimensions.get("window");

export default function Teachers() {
  const [courses, setCourses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [teacherId, setTeacherId] = useState(null);
  const [teacherImage, setTeacherImage] = useState(null);



  useEffect(() => {
    const fetchTeacherIdAndData = async () => {
      try {
        const storedId = await AsyncStorage.getItem("teacherId");
        if (storedId) {
          setTeacherId(storedId);
        }
      } catch (err) {
        console.error("Failed to load teacherId:", err);
      }
    };

    fetchTeacherIdAndData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!teacherId) return;
  
      try {
        // 1. Fetch Courses
        const courseResponse = await axios.get(
          `https://catchup-project.onrender.com/api/livecourses/getbyid/${teacherId}`
        );
        let allCourses = courseResponse.data || [];
        console.log(allCourses);
  
        const now = new Date();
  
        allCourses = allCourses
          .filter(course => {
            const courseDate = new Date(course.createdAt);
            return courseDate >= now;
          })
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .slice(0, 8);
  
        setCourses(allCourses);
        setLoadingCourses(false);
  
        // 2. Fetch Bookings
        const bookingResponse = await axios.get(
          `https://catchup-project.onrender.com/api/bookings/teacher/${teacherId}`
        );
        let allBookings = bookingResponse.data || [];
        allBookings = allBookings
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 8);
        setBookings(allBookings);
        setLoadingBookings(false);
  
        // 3. Fetch Teacher Info (for profileImage)
        const teacherResponse = await axios.get(
          `https://catchup-project.onrender.com/api/teachers/${teacherId}`
        );
        const teacherData = teacherResponse.data;
       
  
        
          setTeacherImage(teacherData.profileImage);
        
  
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoadingCourses(false);
        setLoadingBookings(false);
      }
    };
  
    fetchData();
  }, [teacherId]);
  

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>We help find your dream job!</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Job or Company"
          placeholderTextColor="#aaa"
        />
      </View>

      {/* Recommended Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Live Class</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>

      {loadingCourses ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {courses.map((course, index) => (
            <TouchableOpacity key={index} style={styles.recommendedCard}>
              <Image
                source={require("../../assets/images/online-class.jpeg")}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{course.title}</Text>
                <Text style={styles.cardLocation}>Online</Text>
                <Text style={styles.cardType}>Live Class</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Bookings Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>New Listing</Text>
      </View>

      {loadingBookings ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        bookings.map((booking, index) => (
          <View key={index} style={styles.bookingCard}>
       

       <Image
  source={{ uri: teacherImage }} // Pass the image URL here
  style={styles.bookingImage}
/>

            <View style={styles.bookingContent}>
              <Text style={styles.bookingTitle}>{booking.teacherName}</Text>
              <Text style={styles.bookingDate}>
                {new Date(booking.date).toLocaleDateString()}
              </Text>
              <Text style={styles.bookingStatus}>{booking.status}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFD",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: "#ECECEC",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  sectionHeader: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  seeAll: {
    fontSize: 14,
    color: "#5A67D8",
  },
  horizontalScroll: {
    marginVertical: 15,
  },
  recommendedCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: width * 0.6,
    marginRight: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 100,
    borderRadius: 12,
    marginBottom: 10,
  },
  cardContent: {
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  cardLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  cardType: {
    fontSize: 12,
    color: "#4CAF50",
  },
  bookingCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  bookingImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  bookingContent: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  bookingDate: {
    fontSize: 14,
    color: "#888",
  },
  bookingStatus: {
    fontSize: 12,
    color: "#5A67D8",
    marginTop: 2,
  },
});
