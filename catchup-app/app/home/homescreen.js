import React from 'react';
import { View, Text, TextInput, Image, FlatList, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import TabIcon from '../../components/TabIcon';

const { width } = Dimensions.get('window');

const categories = ['UI & UX', 'Animation', 'Graphic Design'];
const courses = [
  { id: '1', title: 'Visual Design', author: 'Luis John', price: '$250', image: require('../../assets/images/courseImg1.png') },
  { id: '2', title: 'UX Research', author: 'Aina Asif', price: '$250', image: require('../../assets/images/courseImg2.png') },
];

const homescreen = () => {
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
            <TouchableOpacity key={index} style={styles.category}>
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending Courses */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Secondary Courses 🔥</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={courses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.courseList}
          renderItem={({ item }) => (
            <View style={styles.courseCard}>
              <Image source={item.image} style={styles.courseImage} />
              <Text style={styles.coursePrice}>{item.price}</Text>
              <Text style={styles.courseTitle}>{item.title}</Text>
              <Text style={styles.courseAuthor}>By: {item.author}</Text>
            </View>
          )}
        />

        {/* Primary Courses */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Primary Courses 🔥</Text>
          <Text style={styles.seeAll}>See All</Text>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={courses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.courseList}
          renderItem={({ item }) => (
            <View style={styles.courseCard}>
              <Image source={item.image} style={styles.courseImage} />
              <Text style={styles.coursePrice}>{item.price}</Text>
              <Text style={styles.courseTitle}>{item.title}</Text>
              <Text style={styles.courseAuthor}>By: {item.author}</Text>
            </View>
          )}
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
