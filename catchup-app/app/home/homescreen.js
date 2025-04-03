import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, FlatList, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import TabIcon from '../../components/TabIcon';
import axios from 'axios';
import { useRouter } from "expo-router";


const { width } = Dimensions.get('window');



const homescreen = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [primaryCourses, setPrimaryCourses] = useState([]);
  const [secondaryCourses, setSecondaryCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("https://catchup-project.onrender.com/api/offlinecourse")
      .then((response) => {
        const courses = response.data;
        setAllCourses(courses);

        // Separate courses by category
        const primary = courses.filter(course => course.category === "Primary");
        const secondary = courses.filter(course => course.category === "Secondary");
        setPrimaryCourses(primary);
        setSecondaryCourses(secondary);

        // Extract unique subjects from all courses
        const uniqueSubjects = [...new Set(courses.map(course => course.subject))];
        setCategories(uniqueSubjects);
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  // Function to filter courses by subject within each category
  const filterByCategory = (subject) => {
    if (subject === selectedCategory) {
      setPrimaryCourses(allCourses.filter(course => course.category === "Primary"));
      setSecondaryCourses(allCourses.filter(course => course.category === "Secondary"));
      setSelectedCategory(null);
    } else {
      setPrimaryCourses(allCourses.filter(course => course.category === "Primary" && course.subject === subject));
      setSecondaryCourses(allCourses.filter(course => course.category === "Secondary" && course.subject === subject));
      setSelectedCategory(subject);
    }
  };

   // Function to navigate to course detail page
   const navigateToCourseDetail = (id) => {
    router.push(`/course/${id}`); // Use Expo Router's push method for navigation
  };

  const renderCourse = ({ item }) => (
    <TouchableOpacity onPress={() => navigateToCourseDetail(item._id)}>
      <View style={styles.courseCard}>
        <Image source={{ uri: item.courseImage }} style={styles.courseImage} />
        <Text style={styles.courseTitle}>{item.title}</Text>
        <Text style={styles.courseAuthor}>By: {item.instructor?.name || "Unknown"}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, Ahmed</Text>
          <View style={styles.icons}>
            <Ionicons name="notifications-outline" size={24} color="black" style={styles.icon} />
            <Image source={require('../../assets/images/profileImage.png')} style={styles.profileImage} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Let's Learn 🎓</Text>
        <Text style={styles.subtitle}>Something New</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="gray" style={styles.searchIcon} />
          <TextInput placeholder="Search Course" style={styles.searchInput} />
          <FontAwesome name="sliders" size={20} color="black" />
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.category, selectedCategory === category && styles.selectedCategory]}
            onPress={() => filterByCategory(category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>



        {/* Trending Courses */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Secondary Courses </Text>
          {/* <Text style={styles.seeAll}>See All</Text> */}
        </View>
        <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={secondaryCourses}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.courseList}
        renderItem={renderCourse}
      />

        {/* Primary Courses */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Primary Courses </Text>
          {/* <Text style={styles.seeAll}>See All</Text> */}
        </View>
        <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={primaryCourses}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.courseList}
        renderItem={renderCourse}
      />

        {/* Extra spacing for better scroll experience */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed Tab Icon */}
      <TabIcon style={styles.fixedTabIcon} onPress={() => console.log('Navigate to Courses')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F5F3' },
  scrollContainer: { flexGrow: 1, padding: 20 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 18, fontWeight: 'bold' },
  icons: { flexDirection: 'row', alignItems: 'center' },
  icon: { marginRight: 10 },
  profileImage: { width: 40, height: 40, borderRadius: 20 },

  title: { fontSize: 26, fontWeight: 'bold', marginTop: 10 },
  subtitle: { fontSize: 26, fontWeight: 'bold', color: 'black' },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },

  categoryContainer: { flexDirection: 'row', marginVertical: 10 },
  category: { backgroundColor: '#008080', padding: 8, borderRadius: 15, marginRight: 10 },
  categoryText: { color: '#fff', fontWeight: 'bold' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  seeAll: { color: '#008080' },

  courseList: { paddingVertical: 10 },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginRight: 15,
    width: width * 0.55, // More space for better display
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  courseImage: { width: '100%', height: 120, borderRadius: 10 },
  coursePrice: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  courseTitle: { fontWeight: 'bold', fontSize: 16, marginTop: 5 },
  courseAuthor: { color: 'gray', fontSize: 12, marginTop: 2 },

  fixedTabIcon: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
 
});

export default homescreen;
