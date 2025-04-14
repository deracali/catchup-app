import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import TabIcon from '../../components/TabIcon';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');


const avatarImages = [
  require("../../assets/images/avatar/1.jpg"),
  require("../../assets/images/avatar/2.jpg"),
  require("../../assets/images/avatar/3.jpg"),
  require("../../assets/images/avatar/4.jpg"),
  require("../../assets/images/avatar/5.jpg"),
  require("../../assets/images/avatar/6.jpg"),
  require("../../assets/images/avatar/7.jpg"),
  require("../../assets/images/avatar/8.jpg"),
  require("../../assets/images/avatar/9.jpg"),
];

const HomeScreen = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [primaryCourses, setPrimaryCourses] = useState([]);
  const [secondaryCourses, setSecondaryCourses] = useState([]);
  const [inProgressCourses, setInProgressCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [role, setRole] = useState('');
  const [tasks, setTasks] = useState([]);
  const [userName, setUserName] = useState('');
  const [profileImageIndex, setProfileImageIndex] = useState(null);

  const getStoredProfileImage = async () => {
    try {
      const storedIndex = await AsyncStorage.getItem("@profileAvatar");
      if (storedIndex !== null) {
        setProfileImageIndex(parseInt(storedIndex, 10));
      }
    } catch (err) {
      console.error("Error fetching profile avatar index:", err);
    }
  };

  const router = useRouter();

  // Fetch user name
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userId = await AsyncStorage.getItem('@userId');
        if (!userId) return;
        const response = await axios.get(
          `https://catchup-project.onrender.com/api/users/profile/${userId}`
        );
        setUserName(response.data.name);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    getStoredProfileImage();
    fetchUserDetails();
  }, []);

  const hasValidSubscription = async (userId) => {
    try {
      const res = await fetch(`https://catchup-project.onrender.com/api/users/profile/${userId}`);
      const user = await res.json();
      const now = new Date();
      return (
        user.subscriptions &&
        user.subscriptions.some((sub) => (
          (sub.plan === "Per Subject" || sub.plan === "All Subjects") &&
          new Date(sub.endDate) > now
        ))
      );
    } catch (err) {
      console.error('Subscription check failed:', err);
      return false;
    }
  };

  // Fetch courses based on role
  useEffect(() => {
    const fetchCoursesByRole = async () => {
      try {
        const storedRole = await AsyncStorage.getItem('@role');
        const userId = await AsyncStorage.getItem('@userId');

        if (!storedRole || !userId) {
          Alert.alert("Error", "User not logged in properly.");
          return;
        }

        const response = await axios.get('https://catchup-project.onrender.com/api/offlinecourse');
        const allCoursesData = response.data;
        const filteredCourses = allCoursesData.filter(
          (course) => course.category.toLowerCase() === storedRole.toLowerCase()
        );

        setAllCourses(filteredCourses);

        if (storedRole === 'primary') {
          setPrimaryCourses(filteredCourses);
          setSecondaryCourses([]);
        } else if (storedRole === 'secondary') {
          setSecondaryCourses(filteredCourses);
          setPrimaryCourses([]);
        } else {
          console.warn('Unexpected role:', storedRole);
          setPrimaryCourses([]);
          setSecondaryCourses([]);
        }

        const subjects = Array.from(
          new Set(filteredCourses.map((course) => course.subject).filter(Boolean))
        );
        setCategories(subjects);

        handleStreak();
        fetchInProgressCourses();
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCoursesByRole();
  }, []);

  // Fetch role & daily tasks
  useEffect(() => {
    const fetchRoleAndTasks = async () => {
      const storedRole = await AsyncStorage.getItem('@role');
      setRole(storedRole);
      const today = new Date().toDateString();
      try {
        const savedTasksDate = await AsyncStorage.getItem('tasksDate');
        const savedTasks = await AsyncStorage.getItem('dailyTasks');

        // If tasks are already set for today, skip reinitializing
        if (savedTasks && savedTasksDate === today) {
          setTasks(JSON.parse(savedTasks));
          return;
        }

        const todayIndex = new Date().getDay();

        const primaryWeeklyTasks = [
          [
            { title: 'English', count: 10, percent: 30 },
            { title: 'Maths', count: 15, percent: 40 },
            { title: 'Science', count: 12, percent: 35 },
          ],
          [
            { title: 'Reading', count: 8, percent: 25 },
            { title: 'Maths', count: 20, percent: 50 },
            { title: 'Social Studies', count: 10, percent: 40 },
          ],
          [
            { title: 'Writing', count: 9, percent: 33 },
            { title: 'English', count: 14, percent: 42 },
            { title: 'Science', count: 13, percent: 39 },
          ],
          [
            { title: 'Maths', count: 18, percent: 60 },
            { title: 'Creative Arts', count: 7, percent: 28 },
            { title: 'English', count: 10, percent: 45 },
          ],
          [
            { title: 'Science', count: 11, percent: 31 },
            { title: 'Social Studies', count: 9, percent: 35 },
            { title: 'Maths', count: 16, percent: 55 },
          ],
          [
            { title: 'English', count: 12, percent: 38 },
            { title: 'Reading', count: 10, percent: 30 },
            { title: 'Writing', count: 8, percent: 25 },
          ],
          [
            { title: 'Maths', count: 13, percent: 41 },
            { title: 'Science', count: 15, percent: 50 },
            { title: 'English', count: 11, percent: 36 },
          ],
        ];

        const secondaryWeeklyTasks = [
          [
            { title: 'Biology', count: 15, percent: 45 },
            { title: 'Chemistry', count: 20, percent: 50 },
            { title: 'Physics', count: 18, percent: 40 },
          ],
          [
            { title: 'Maths', count: 22, percent: 60 },
            { title: 'Biology', count: 14, percent: 35 },
            { title: 'English', count: 19, percent: 42 },
          ],
          [
            { title: 'Chemistry', count: 17, percent: 48 },
            { title: 'Physics', count: 20, percent: 55 },
            { title: 'Biology', count: 13, percent: 33 },
          ],
          [
            { title: 'English', count: 16, percent: 39 },
            { title: 'Maths', count: 24, percent: 67 },
            { title: 'Physics', count: 18, percent: 47 },
          ],
          [
            { title: 'Biology', count: 15, percent: 52 },
            { title: 'Chemistry', count: 20, percent: 60 },
            { title: 'Maths', count: 21, percent: 58 },
          ],
          [
            { title: 'English', count: 17, percent: 45 },
            { title: 'Physics', count: 23, percent: 62 },
            { title: 'Chemistry', count: 16, percent: 50 },
          ],
          [
            { title: 'Maths', count: 20, percent: 55 },
            { title: 'Biology', count: 14, percent: 38 },
            { title: 'English', count: 18, percent: 46 },
          ],
        ];

        let todayTasks = [];
        if (storedRole === 'primary') {
          todayTasks = primaryWeeklyTasks[todayIndex];
        } else if (storedRole === 'secondary') {
          todayTasks = secondaryWeeklyTasks[todayIndex];
        }

        setTasks(todayTasks);
        await AsyncStorage.setItem('tasksDate', today);
        await AsyncStorage.setItem('dailyTasks', JSON.stringify(todayTasks));
      } catch (error) {
        console.error('Error setting daily tasks:', error);
      }
    };
    fetchRoleAndTasks();
  }, []);

  // Fetch in-progress courses
  const fetchInProgressCourses = async () => {
    try {
      const storedInProgressCourses = await AsyncStorage.getItem('@inProgressLessons');
      if (storedInProgressCourses) {
        setInProgressCourses(JSON.parse(storedInProgressCourses));
      } else {
        console.log('No in-progress courses found');
      }
    } catch (error) {
      console.error('Error fetching in-progress courses:', error);
    }
  };

  // Streak handling
  const handleStreak = async () => {
    try {
      const today = new Date().toDateString();
      const lastActive = await AsyncStorage.getItem('lastActiveDate');
      let streak = parseInt((await AsyncStorage.getItem('streak')) || '0', 10);

      if (lastActive === today) return;

      if (lastActive) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (new Date(lastActive).toDateString() === yesterday.toDateString()) {
          streak += 1;
        } else {
          streak = 1;
        }
      } else {
        streak = 1;
      }

      await AsyncStorage.setItem('lastActiveDate', today);
      await AsyncStorage.setItem('streak', streak.toString());

      if (streak === 5) {
        router.push('home/streakscreen');
      }
    } catch (error) {
      console.error('Error handling streak:', error);
    }
  };

  // Category filter
  const filterByCategory = (subject) => {
    if (subject === selectedCategory) {
      setPrimaryCourses(allCourses.filter((course) => course.category === 'Primary'));
      setSecondaryCourses(allCourses.filter((course) => course.category === 'Secondary'));
      setSelectedCategory(null);
    } else {
      setPrimaryCourses(
        allCourses.filter(
          (course) =>
            course.category === 'Primary' && course.subject === subject
        )
      );
      setSecondaryCourses(
        allCourses.filter(
          (course) =>
            course.category === 'Secondary' && course.subject === subject
        )
      );
      setSelectedCategory(subject);
    }
  };

  // Navigate to course detail
  const navigateToCourseDetail = async (id) => {
    try {
      const userId = await AsyncStorage.getItem('@userId');
      if (!userId) {
        Alert.alert("Error", "User ID not found.");
        return;
      }

      const hasSubscription = await hasValidSubscription(userId);
      if (!hasSubscription) {
        Alert.alert(
          "Subscription Required",
          "You need a Live Class subscription to access this course.",
          [
            {
              text: "Go to Subscription",
              onPress: () => router.push('/subscription/sub'),
            }
          ]
        );
        return;
      }

      // User is subscribed, navigate to course
      router.push(`/course/${id}`);
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Error", "Something went wrong while checking subscription.");
    }
  };

  // Render an icon for a task
  const renderTaskIcon = (title) => {
    switch (title.toLowerCase()) {
      case 'english':
      case 'reading':
      case 'writing':
        return <Ionicons name="book-outline" size={24} color="black" />;
      case 'maths':
        return <Ionicons name="calculator-outline" size={24} color="black" />;
      case 'science':
      case 'biology':
      case 'chemistry':
      case 'physics':
        return <FontAwesome name="flask" size={24} color="black" />;
      case 'social studies':
        return <Ionicons name="earth-outline" size={24} color="black" />;
      case 'creative arts':
        return <FontAwesome name="paint-brush" size={24} color="black" />;
      default:
        return <Ionicons name="school-outline" size={24} color="black" />;
    }
  };

  const renderCourse = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigateToCourseDetail(item._id)}
      style={styles.smallCourseCard}
    >
      <Image source={{ uri: item.courseImage }} style={styles.smallCourseImage} />
      <Text style={styles.smallCourseTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.smallCourseAuthor}>
        {item?.meta.postedBy ? `By: ${item?.meta.postedBy}` : 'By: Unknown'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Purple Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerGreeting}>
              Hello, {userName || '...'}!
            </Text>
            <Text style={styles.headerSubGreeting}>
              What do you want to learn today?
            </Text>
          </View>
          <Image
            source={
              profileImageIndex !== null
                ? avatarImages[profileImageIndex]
                : require('../../assets/images/avatar/1.jpg')
            }
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TouchableOpacity
            onPress={() => router.push('subscription/sub')}
            style={styles.subscribeButton}
          >
            <Text style={styles.subscribeButtonText}>Subscribe</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Courses */}
        <Text style={styles.sectionLabel}>In Progress</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {inProgressCourses.length > 0 ? (
            inProgressCourses.map((course) => (
              <TouchableOpacity
                key={course._id}
                onPress={() => navigateToCourseDetail(course._id)}
                style={styles.featuredCourseCard}
              >
                <View style={styles.featuredImageContainer}>
                  <Image
                    source={
                      course.courseImage
                        ? { uri: course.courseImage }
                        : require('../../assets/images/inprogress.jpeg')
                    }
                    style={styles.featuredCourseImage}
                  />
                </View>
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.featuredTitle} numberOfLines={1}>
                    {course.title}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.ratingNumber}>4.8</Text>
                    <Ionicons name="star" size={16} color="#FFC107" style={{ marginLeft: 2 }} />
                    <Text style={styles.reviewCount}>(120 Reviews)</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.placeholderCard}>
              <Text style={styles.placeholderText}>
                No featured/in-progress courses yet.
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Task Groups */}
        <Text style={styles.sectionLabel}>Task Groups</Text>
        <View style={styles.taskGroup}>
          {tasks.map((task, index) => (
            <View key={index} style={styles.groupCard}>
              <View style={styles.groupText}>
                <View style={styles.iconAndTitle}>
                  {renderTaskIcon(task.title)}
                  <Text style={styles.groupTitle}>{task.title}</Text>
                </View>
                <Text style={styles.taskCount}>{task.count} Tasks</Text>
              </View>
              <Text style={styles.groupPercent}>{task.percent}%</Text>
              <View style={styles.progressBar}>
                <View
                  style={[styles.progressFill, { width: `${task.percent}%` }]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Categories (horizontal list) */}
        <Text style={styles.sectionLabel}>Recommended Courses</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.category,
                selectedCategory === category && styles.selectedCategory,
              ]}
              onPress={() => filterByCategory(category)}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={secondaryCourses.length > 0 ? secondaryCourses : primaryCourses}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.courseList}
          renderItem={renderCourse}
        />
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Tab Icon */}
      <TabIcon style={styles.fixedTabIcon} onPress={() => console.log('Navigate to Courses')} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  scrollContainer: {
    flex: 1,
  },
  subscribeButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    // Push towards the position of the search input
    marginTop: -10, // Adjust this value to match your search input's vertical positioning
    alignSelf: 'center', // Center horizontally within container (optional)
    width: '50%', // Adjust width as needed
    justifyContent: 'center',
  },
  subscribeButtonText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
  },
  /* Header Styles */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a73e8',
    paddingTop: 50,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  headerGreeting: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
  },
  headerSubGreeting: {
    color: '#FFF',
    fontSize: 14,
    marginTop: 5,
    opacity: 0.9,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  /* Section Label */
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 20,
    color: '#333',
  },

  /* Featured Courses */
  featuredCourseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginLeft: 20,
    marginRight: 10,
    borderRadius: 15,
    padding: 10,
    width: width * 0.75,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 10,
  },
  featuredImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#EEE',
  },
  featuredCourseImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  featuredSub: {
    fontSize: 12,
    color: '#888',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingNumber: {
    fontSize: 14,
    color: '#333',
  },
  reviewCount: {
    marginLeft: 5,
    fontSize: 12,
    color: '#666',
  },

  placeholderCard: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 15,
    padding: 20,
    width: width * 0.75,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
  },

  /* Task Groups */
  taskGroup: {
    marginHorizontal: 20,
  },
  groupCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  groupText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconAndTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    color: '#333',
  },
  taskCount: {
    fontSize: 12,
    color: '#888',
  },
  groupPercent: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: '600',
    color: '#1a73e8',
  },
  progressBar: {
    marginTop: 5,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EEE',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1a73e8',
  },

  /* Categories */
  categoryContainer: {
    paddingLeft: 20,
    paddingBottom: 20,
  },
  category: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedCategory: {
    backgroundColor: '#1a73e8',
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },

  /* Our Courses - small card */
  courseList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  smallCourseCard: {
    width: 140,
    marginRight: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  smallCourseImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  smallCourseTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  smallCourseAuthor: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },

  /* Fixed Tab Icon */
  fixedTabIcon: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
