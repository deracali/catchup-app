import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Image,
  TextInput
} from 'react-native';
import { Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import TeacherTab from '../../components/TeacherTab';
import { usePathname } from 'expo-router';

const { width } = Dimensions.get('window');

export default function TasksScreen() {
  const [teacherId, setTeacherId] = useState('');
  const [courses, setCourses] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeDateIndex, setActiveDateIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const [teacherName, setTeacherName] = useState('');




  // Fetch teacher ID from AsyncStorage
  useEffect(() => {
    const fetchTeacherId = async () => {
      const storedId = await AsyncStorage.getItem("teacherId");
      if (storedId) setTeacherId(storedId);
    };
    fetchTeacherId();
  }, []);


  useEffect(() => {
    const fetchTeacherName = async () => {
      try {
      
        if (teacherId) {
          const response = await axios.get(`https://catchup-project.onrender.com/api/teachers/${teacherId}`);
          const fullName = response.data.name; // e.g. "John Smith"
          const firstName = fullName.split(' ')[0]; // Get "John"
          setTeacherName(firstName);
        }
      } catch (error) {
        console.error('Failed to fetch teacher info:', error);
      }
    };

    fetchTeacherName();
  }, [teacherId]);

  // Fetch courses and bookings data from your endpoint that already populates user info
  useEffect(() => {
    if (!teacherId) return;

    const fetchData = async () => {
      try {
        const [courseRes, bookingRes] = await Promise.all([
          axios.get(`https://catchup-project.onrender.com/api/livecourses/getbyid/${teacherId}`),
          axios.get(`https://catchup-project.onrender.com/api/bookings/teacher/${teacherId}`)
        ]);

        setCourses(courseRes.data || []);
        // No need for extra fetches here because the backend endpoint uses populate.
        setBookings(bookingRes.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

  // Helper functions
  const handleJoin = (link) => {
    if (link) Linking.openURL(link);
  };

  const handleAccept = (bookingId) => {
    console.log("Accepted booking:", bookingId);
  };

  // Return future courses only (with a createdAt date in the future)
  const getFutureLiveCourses = () => {
    const now = new Date();
    return courses.filter(course => new Date(course.createdAt) > now);
  };

  // Render a single course card
  const renderCourseCard = (item) => (
    <View key={item._id} style={[styles.card, { backgroundColor: '#E6F4FF' }]}>
      <Text style={styles.cardSubtitle}>{item.lessons}</Text>
      <View style={styles.cardRow}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: '#1a73e820' }]}>
          <Text style={[styles.statusText, { color: '#1a73e8' }]}>Live Course</Text>
        </View>
      </View>
      <Text style={styles.cardTime}>{item.time}</Text>
      {item.googleMeetLink && (
        <TouchableOpacity style={[styles.joinButton, { backgroundColor: '#1a73e8' }]} onPress={() => handleJoin(item.googleMeetLink)}>
          <Text style={styles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Render a single booking card using populated userId data
  const renderBookingCard = (item) => (
    <View key={item._id} style={[styles.card, { backgroundColor: '#FFF2E5' }]}>
      <Text style={styles.cardSubtitle}>
        {item.userId && item.userId.name ? item.userId.name : 'No Name'}
      </Text>
      <View style={styles.cardRow}>
        <Text style={styles.cardTitle}>
          {item.userId && item.userId.email ? item.userId.email : 'No Email'}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: '#FF6F0020' }]}>
          <Text style={[styles.statusText, { color: '#FF6F00' }]}>Booking</Text>
        </View>
      </View>
      <Text style={styles.cardTime}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
      <TouchableOpacity style={[styles.acceptButton, { backgroundColor: '#FF6F00' }]} onPress={() => handleAccept(item._id)}>
        <Text style={styles.acceptButtonText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );

  // Render "Best Experiences" card (for example) using the booking's user data
  const renderExperienceCard = (booking) => {
    const imageSource = booking.imageUrl
    ? { uri: booking.imageUrl }
    : require('../../assets/images/3d2.jpg');  
    return (
      <TouchableOpacity key={booking._id} style={styles.experienceCard}>
        <Image source={imageSource} style={styles.experienceImage} />
        <Text style={styles.expCardTitle}>
          {booking.userId && booking.userId.name ? booking.userId.name : 'No Name'}
        </Text>
      </TouchableOpacity>
    );
  };


  // Helper function to generate date labels for the next 5 days
const generateDateLabels = (numDays = 5) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const labels = [];
  const today = new Date();
  
  for (let i = 0; i < numDays; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);
    const month = months[currentDate.getMonth()];
    const day = currentDate.getDate();
    const dayName = daysOfWeek[currentDate.getDay()];
    labels.push(`${month}\n${day}\n${dayName}`);
  }
  return labels;
};


  // Determine which items to show based on activeFilter.
  // When filtering for Live Courses, show only future courses.
  const filteredTasks = () => {
    const courseTasks = getFutureLiveCourses().map(renderCourseCard);
    const bookingTasks = bookings.map(renderBookingCard);
    
    switch (activeFilter) {
      case 'Live Courses':
        return courseTasks;
      case 'Bookings':
        return bookingTasks;
      default:
        return [...courseTasks, ...bookingTasks];
    }
  };

  // UI Rendering
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top greeting & notification */}
        <View style={styles.topBar}>
        <Text style={styles.greeting}>Hi, {teacherName}!</Text>
        
        </View>

       

        {/* Navigation icons row */}
        <View style={styles.navIconRow}>
          <TouchableOpacity 
            style={styles.navIconButton}
            onPress={() => handlePress('teachers/home')}
          >
            <Feather 
              name="home" 
              size={24} 
              color={pathname.includes('home') ? '#1a73e8' : '#1a73e8'}
            />
            <Text style={styles.navIconText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navIconButton}
            onPress={() => handlePress('teachers/bookingscreen')}
          >
            <MaterialIcons 
              name="people-alt" 
              size={24} 
              color={pathname.includes('bookingscreen') ? '#1a73e8' : '#1a73e8'}
            />
            <Text style={styles.navIconText}>Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navIconButton}
            onPress={() => handlePress('teachers/teacherLivecourses')}
          >
            <Feather 
              name="user" 
              size={24} 
              color={pathname.includes('teacherLivecourses') ? '#1a73e8' : '#1a73e8'}
            />
            <Text style={styles.navIconText}>Live Courses</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navIconButton}
            onPress={() => handlePress('/help/community')}
          >
            <FontAwesome5 
              name="users" 
              size={22} 
              color={pathname.includes('community') ? '#1a73e8' : '#1a73e8'}
            />
            <Text style={styles.navIconText}>Community</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.navIconButton}
            onPress={() => handlePress('/help/help')}
          >
            <Feather 
              name="help-circle" 
              size={24} 
              color={pathname.includes('help') ? '#1a73e8' : '#1a73e8'}
            />
            <Text style={styles.navIconText}>Help</Text>
          </TouchableOpacity>
        </View>

        {/* "Best Experiences" section populated with live bookings */}
        <Text style={styles.sectionTitle}>Bookings</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.experienceScroll}>
          {bookings.length > 0 ? (
            bookings.map(renderExperienceCard)
          ) : (
            <Text style={{ paddingHorizontal: 15, color: '#777' }}>No live bookings available</Text>
          )}
        </ScrollView>

        {/* Date Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateTabs}>
  {generateDateLabels().map((dateLabel, index) => (
    <TouchableOpacity
      key={index}
      style={[styles.dateItem, activeDateIndex === index && styles.activeDate]}
      onPress={() => setActiveDateIndex(index)}
    >
      <Text style={[styles.dateText, activeDateIndex === index && styles.activeDateText]}>
        {dateLabel}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>


        {/* Filter Buttons */}
        <View style={styles.filters}>
          {['All', 'Live Courses', 'Bookings'].map((filter, index) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={index}
                style={[styles.filterButton, isActive && styles.activeFilterButton]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Task Cards Container (Live Courses & Bookings) */}
        <View style={styles.tasksContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#1a73e8" style={{ marginTop: 30 }} />
          ) : (
            filteredTasks()
          )}
        </View>
      </ScrollView>

      {/* Bottom Tab (TeacherTab) */}
      <TeacherTab />
    </View>
  );
}


// --------------------------------------------------
// Styles
// --------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 80, // Provide extra space for TeacherTab if needed
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 50,
    marginBottom: 15,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    marginHorizontal: 15,
    borderRadius: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#000',
  },
  navIconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  navIconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconText: {
    marginTop: 4,
    fontSize: 12,
    color: '#1a73e8',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 15,
    marginTop: 10,
  },
  experienceScroll: {
    marginTop: 10,
    paddingLeft: 15,
  },
  experienceCard: {
    width: 120,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 2,
  },
  experienceImage: {
    width: '100%',
    height: 80,
  },
  expCardTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
    marginLeft: 8,
    color: '#333',
  },
  dateTabs: {
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  dateItem: {
    width: 60,
    paddingVertical: 10,
    marginRight: 15,
    borderRadius: 8,
    backgroundColor: '#EFEFEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDate: {
    backgroundColor: '#1a73e8',
  },
  dateText: {
    textAlign: 'center',
    color: '#333',
    fontSize: 12,
  },
  activeDateText: {
    color: '#FFF',
  },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#EFEFEF',
  },
  activeFilterButton: {
    backgroundColor: '#1a73e8',
  },
  filterText: {
    color: '#333',
    fontSize: 14,
  },
  activeFilterText: {
    color: '#FFF',
  },
  tasksContainer: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  card: {
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardTime: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
  joinButton: {
    marginTop: 10,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  acceptButton: {
    marginTop: 10,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
