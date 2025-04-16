import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Welcome to CATCHUP',
    description: 'Practice past questions, book private teachers, and join live classes to excel academically.',
    image: require('../assets/images/onboard1.png'), // Replace with your image path
  },
  {
    id: '2',
    title: 'Explore Past Questions',
    description: 'Master every topic with curated past questions and detailed solutions.',
    image: require('../assets/images/onboard2.png'),
  },
  {
    id: '3',
    title: 'Book Private Teachers',
    description: 'Learn 1-on-1 with qualified teachers tailored to your learning style and goals.',
    image: require('../assets/images/onboard3.png'),
  },
  {
    id: '4',
    title: 'Join Live Classes',
    description: 'Attend engaging live sessions with expert instructors and interactive discussions.',
    image: require('../assets/images/onboard4.png'),
  },
];


export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  const [fontsLoaded] = useFonts({
    ManropeBold: require('../assets/fonts/Manrope-Bold.ttf'),
    ManropeRegular: require('../assets/fonts/Manrope-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Show loading state while fonts load
  }

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      router.push('auth/role'); // Navigate to main screen
    }
  };

  const handleScrollEnd = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={[styles.title, { fontFamily: 'ManropeBold' }]}>{item.title}</Text>
      <Text style={[styles.description, { fontFamily: 'ManropeRegular' }]}>{item.description}</Text>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotContainer}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[styles.dot, { backgroundColor: index === currentIndex ? '#0052cc' : '#cccccc' }]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        snapToInterval={width}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
      />

      {renderDots()}

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={[styles.nextButtonText, { fontFamily: 'ManropeBold' }]}>
          {currentIndex === onboardingData.length - 1 ? 'Start Learning' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
  },
  title: {
    color: '#002244',
    fontSize: 24,
    textAlign: 'center',
    fontFamily:"Manrope-Regular",
    marginTop: 20,
  },
  description: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    fontFamily:"Manrope-Regular",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  nextButton: {
    backgroundColor: '#0052cc',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily:"Manrope-Regular",
  },
});
