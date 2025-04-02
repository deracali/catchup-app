import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const signup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
const router = useRouter();



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <Text style={styles.subtitle}>Enter your details to Sign up</Text>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#777" style={styles.icon} />
        <TextInput placeholder="abc@email.com" style={styles.input} keyboardType="email-address" />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.icon} />
        <TextInput 
          placeholder="Enter your password" 
          style={styles.input} 
          secureTextEntry={!passwordVisible} 
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons name={passwordVisible ? "eye-outline" : "eye-off-outline"} size={20} color="#777" />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.icon} />
        <TextInput 
          placeholder="Confirm password" 
          style={styles.input} 
          secureTextEntry={!confirmPasswordVisible} 
        />
        <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
          <Ionicons name={confirmPasswordVisible ? "eye-outline" : "eye-off-outline"} size={20} color="#777" />
        </TouchableOpacity>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.button} onPress={() => router.push('home/homescreen')}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      {/* Already have an account */}
      <Text style={styles.signupText}>
        Joined us before?  
        <TouchableOpacity onPress={() => router.push('auth/login')}>
          <Text style={styles.signupLink}> Sign In</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F8F3F0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004D40',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    borderRadius: 8,
    width: '100%',
    height: 50,
    marginBottom: 15,
    elevation: 2,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    height: 40,
  },
  icon: {
    marginRight: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#004D40',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupText: {
    marginTop: 20,
    color: '#777',
  },
  signupLink: {
    color: '#00796B',
    fontWeight: 'bold',
  },
};

export default signup;
