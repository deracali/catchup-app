import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const TabIcon = () => {
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
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handlePress('home/homescreen')}
          >
            <Feather name="grid" size={24} color={pathname.includes('homescreen') ? '#008080' : '#333'} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handlePress('course/courselist')}
          >
            <Feather name="bookmark" size={24} color={pathname.includes('courselist') ? '#008080' : '#333'} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handlePress('home/profile')}
          >
            <Feather name="user" size={24} color={pathname.includes('profile') ? '#008080' : '#333'} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handlePress('/settings')}
          >
            <Feather name="settings" size={24} color={pathname.includes('settings') ? '#008080' : '#333'} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => handlePress('/notifications')}
          >
            <Feather name="bell" size={24} color={pathname.includes('notifications') ? '#008080' : '#333'} />
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
    width: 280,
  },
  menuItem: {
    padding: 10,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#008080',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default TabIcon;
