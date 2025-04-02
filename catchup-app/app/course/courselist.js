import React from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import TabIcon from '../../components/TabIcon';  // Ensure this is correctly imported

const { width } = Dimensions.get('window');

const courses = [
  {
    id: '1',
    title: 'Introduction To Programming',
    instructor: 'John Smith',
    price: '$250',
    image: require('../../assets/images/image(3).png'), // Using require() for images
  },
  {
    id: '2',
    title: 'Cybersecurity Essentials',
    instructor: 'Milly Davis',
    price: '$250',
    image: require('../../assets/images/image(3).png'),
  },
  {
    id: '3',
    title: 'UI/UX Design Fundamentals',
    instructor: 'Sarah Lee',
    price: '$250',
    image: require('../../assets/images/image(3).png'),
  },
];

const courselist = () => {
  return (
    <View style={styles.container}>
      {/* 🔎 Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color="#888" style={styles.searchIcon} />
        <TextInput placeholder="Search Course" style={styles.searchInput} />
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="sliders" size={20} color="#008080" />
        </TouchableOpacity>
      </View>

      {/* 📚 Course List with ScrollView */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {courses.map((item) => (
          <View key={item.id} style={styles.courseCard}>
            <Image source={item.image} style={styles.courseImage} />
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>{item.price}</Text>
            </View>
            <TouchableOpacity style={styles.bookmark}>
              <Feather name="bookmark" size={18} color="#008080" />
            </TouchableOpacity>
            <Text style={styles.courseTitle}>{item.title}</Text>
            <Text style={styles.courseInstructor}>By: {item.instructor}</Text>
          </View>
        ))}
      </ScrollView>

      {/* ➕ Floating Tab Icon (Fixed) */}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  filterButton: {
    padding: 8,
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
    color: '#008080',
    marginTop: 2,
  },
  fixedTabIcon: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});

export default courselist;
