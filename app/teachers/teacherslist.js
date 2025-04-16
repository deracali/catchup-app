import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import TabIcon from '../../components/TabIcon';
import axios from 'axios';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const teacherslist = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [subject, setSubject] = useState('All');
  const [subjects, setSubjects] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('https://catchup-project.onrender.com/api/teachers');
        const teachers = response.data || [];

        // Extract unique courses
        const allCourses = ['All', ...new Set(
          teachers.flatMap(t => t.courses || []).filter(Boolean)
        )];
        setSubjects(allCourses);
        setAllTeachers(teachers);

        const formattedCourses = teachers.map((teacher) => ({
          id: teacher._id,
          title: `Course by ${teacher.name}`,
          instructor: teacher.name,
          courses: Array.isArray(teacher.courses) ? teacher.courses : [],
          image: { uri: teacher.profileImage },
        }));

        setCourses(formattedCourses);
        setFilteredCourses(formattedCourses);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (subject === 'All') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
        course.courses.includes(subject)
      );
      setFilteredCourses(filtered);
    }
  }, [subject, courses]);

  const navigateToTeacherProfile = (teacherId) => {
    router.push({ pathname: `/teachers/${teacherId}` });
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="#000" barStyle="light-content" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
        {subjects.map((subj, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSubject(subj)}
            style={[
              styles.tabButton,
              subject === subj && styles.tabButtonActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                subject === subj && styles.tabTextActive,
              ]}
            >
              {subj}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {filteredCourses.map((item) => (
          <TouchableOpacity key={item.id} onPress={() => navigateToTeacherProfile(item.id)}>
            <View style={styles.courseCard}>
              <Image source={item.image} style={styles.courseImage} />
              <View style={styles.courseTags}>
                {item.courses.map((course, index) => (
                  <View key={index} style={styles.courseTag}>
                    <Text style={styles.courseTagText}>{course}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.courseTitle}>{item.title}</Text>
              <Text style={styles.courseInstructor}>By: {item.instructor}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TabIcon style={styles.fixedTabIcon} onPress={() => console.log('Add New Course')} />
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 15,
  },

  scrollContainer: {
    paddingBottom: 100, // Ensure space for the fixed TabIcon
  },
  courseCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  courseImage: {
    width: '100%',
    height: width * 0.4,
    borderRadius: 12,
  },
  priceTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'black',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  priceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  bookmark: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 6,
    borderRadius: 15,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  courseInstructor: {
    fontSize: 14,
    color: '#1a73e8',
    marginTop: 2,
  },
  fixedTabIcon: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  tabScroll: {
    paddingVertical: 10,
    maxHeight: 55,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 10,
  },
  tabButtonActive: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    color: '#555',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default teacherslist;
