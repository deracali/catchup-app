import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { AntDesign, Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const TeacherTab = () => {
  const [isOpen, setIsOpen] = useState(false);
  const scaleAnim = useState(new Animated.Value(0.1))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];
  const router = useRouter();
  const pathname = usePathname(); // Get the current route path

  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: newState ? 1 : 0.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: newState ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = (route) => {
    router.push(route);
  };

  return (

    <View style={styles.container}>
      {isOpen && (
        <Animated.View 
          style={[
            styles.menu, 
            { transform: [{ scale: scaleAnim }], opacity: opacityAnim }
          ]}
        >
          {/* Home */}
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handlePress('teachers/home')}
          >
            <Feather 
              name="home" 
              size={24} 
              color={pathname.includes('home') ? '#1a73e8' : '#333'} 
            />
          </TouchableOpacity>
    
          {/* Teachers List */}
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handlePress('teachers/bookingscreen')}
          >
            <MaterialIcons 
              name="people-alt" 
              size={24} 
              color={pathname.includes('bookingscreen') ? '#1a73e8' : '#333'} 
            />
          </TouchableOpacity>

          <TouchableOpacity 
  style={styles.menuItem} 
  onPress={() => handlePress('teachers/createLiveCourse')}
>
  <MaterialIcons 
    name="live-tv" 
    size={24} 
    color={pathname.includes('createLiveCourse') ? '#1a73e8' : '#333'} 
  />
</TouchableOpacity>
    
          {/* Profile */}
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handlePress('teachers/teacherLivecourses')}
          >
            <Feather 
              name="user" 
              size={24} 
              color={pathname.includes('teacherLivecourses') ? '#1a73e8' : '#333'} 
            />
          </TouchableOpacity>
    
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handlePress('help/terms')}
          >
            <Feather 
              name="eye" 
              size={24} 
              color={pathname.includes('terms') ? '#1a73e8' : '#333'} 
            />
          </TouchableOpacity>
    
        
    
        
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handlePress('teachers/teacherprofile')}
          >
            <FontAwesome5
              name="users" 
              size={22} 
              color={pathname.includes('teacherprofile') ? '#1a73e8' : '#333'} 
            />
          </TouchableOpacity>
    
          {/* Help */}
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handlePress('/help/help')}
          >
            <Feather 
              name="help-circle" 
              size={24} 
              color={pathname.includes('help') ? '#1a73e8' : '#333'} 
            />
          </TouchableOpacity>
        </Animated.View>
      )}
    
      <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
        <AntDesign name={isOpen ? 'close' : 'plus'} size={28} color="white" />
      </TouchableOpacity>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 10,  
  },
  menu: {
    position: 'absolute',
    bottom: 70,
    backgroundColor: 'white',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 10,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    justifyContent: 'space-between',
    width: 360, 
  },
  menuItem: {
    padding: 10,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default TeacherTab;
