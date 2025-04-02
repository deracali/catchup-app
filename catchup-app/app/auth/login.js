import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
const router = useRouter();


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <Text style={styles.subtitle}>Enter your details to log in</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#777" style={styles.icon} />
        <TextInput placeholder="abc@email.com" style={styles.input} keyboardType="email-address" />
      </View>

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

      <View style={styles.row}>
        <View style={styles.switchContainer}>
          <Switch value={rememberMe} onValueChange={setRememberMe} />
          <Text>Remember Me</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

   
        <TouchableOpacity style={styles.button} onPress={() => router.push('home/homescreen')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
    

      <Text style={styles.orText}>Or</Text>

      <TouchableOpacity style={styles.socialButton}>
        <Ionicons name="logo-google" size={20} color="#000" />
        <Text style={styles.socialText}>Sign in with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButton}>
        <Ionicons name="logo-apple" size={20} color="#000" />
        <Text style={styles.socialText}>Sign in with Apple</Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>
        Don’t have an account?  
        <TouchableOpacity onPress={() => router.push('auth/login')}>
          <Text style={styles.signupLink}> Sign Up</Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgotText: {
    color: '#00796B',
    fontWeight: '500',
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
  orText: {
    marginBottom: 15,
    color: '#777',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 12,
    width: '100%',
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
    elevation: 2,
  },
  socialText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
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

export default login;
