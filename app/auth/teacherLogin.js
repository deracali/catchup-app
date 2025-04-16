import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const teacherlogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const router = useRouter();

  useEffect(() => {
    const loadRememberedCredentials = async () => {
      const savedEmail = await AsyncStorage.getItem('rememberedEmail');
      const savedPassword = await AsyncStorage.getItem('rememberedPassword');
      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
        setRememberMe(true);
      }
    };
    loadRememberedCredentials();
  }, []);

  const handleLogin = async () => {
    setLoading(true); // Start loading when login is triggered
    try {
      const response = await axios.post('https://catchup-project.onrender.com/api/teachers/login', {
        email,
        password,
      });
      const data = response.data; // ✅ axios parses JSON
      console.log(data);
  
      const { token } = data;
      const { _id: teacherId } = data.teacher;
  
      await AsyncStorage.setItem('teacherToken', token);
      await AsyncStorage.setItem('teacherId', teacherId);
  
      if (rememberMe) {
        await AsyncStorage.setItem('rememberedEmail', email);
        await AsyncStorage.setItem('rememberedPassword', password);
      } else {
        await AsyncStorage.removeItem('rememberedEmail');
        await AsyncStorage.removeItem('rememberedPassword');
      }

      Alert.alert('Success', 'Login successful!');
      router.push('teachers/home');
    } catch (error) {
      console.error(error);
      Alert.alert('Login Failed', error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false); // Stop loading after request is complete
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="#000" barStyle="light-content" />
         <TouchableOpacity onPress={() => router.back()} style={styles.goBack}>
              <Text style={styles.goBackText}>← Back</Text>
            </TouchableOpacity>
      {/* Top angled background shapes */}
      <View style={styles.topBackground}>
        <View style={styles.blueAngle} />
        <View style={styles.grayAngle} />
      </View>

      <Text style={styles.logoText}>CATCHUP</Text>

      <Text style={styles.welcomeTitle}>Welcome back!</Text>
      <Text style={styles.subtitle}>Log in to existing CATCHUP account</Text>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#999"
        />
      </View>

      {/* Password */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons name={passwordVisible ? 'eye-outline' : 'eye-off-outline'} size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Remember Me */}
      <View style={styles.rememberMeContainer}>
        <TouchableOpacity onPress={() => setRememberMe(!rememberMe)} style={styles.checkbox}>
          <Ionicons
            name={rememberMe ? 'checkbox-outline' : 'square-outline'}
            size={20}
            color="#007AFF"
          />
          <Text style={styles.rememberMeText}>Remember Me</Text>
        </TouchableOpacity>

        
      </View>

      {/* Login Button with Loading */}
      <TouchableOpacity
        style={[styles.loginButton, loading && styles.buttonDisabled]} 
        onPress={handleLogin} 
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>LOG IN</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.orText}>Or sign up using</Text>

      {/* Sign up */}
      <Text style={styles.bottomText}>
        Don’t have an account?
        <Text style={styles.signUpLink} onPress={() => router.push('auth/teacherSignup')}> Apply</Text>
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  goBack: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  goBackText: {
    fontSize: 16,
    fontWeight: '600',
  },
  topBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  blueAngle: {
    backgroundColor: "#1a73e8",
    position: "absolute",
    top: -100,
    right: -80,
    width: 180,
    height: 180,
    borderRadius: 90,
    transform: [{ rotate: "45deg" }],
  },
  grayAngle: {
    backgroundColor: "#1a73e8",
    position: "absolute",
    top: -50,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    transform: [{ rotate: "25deg" }],
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a73e8",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 14,
    color: "#000",
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 5,
  },
  rememberMeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  rememberMeText: {
    marginLeft: 5,
    color: "#555",
    fontSize: 14,
  },
  forgotPassword: {},
  forgotText: {
    color: "#007AFF",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#1a73e8",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    shadowColor: "#1a73e8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orText: {
    textAlign: "center",
    marginVertical: 20,
    color: "#777",
  },
  bottomText: {
    textAlign: "center",
    color: "#888",
    marginTop: 10,
  },
  signUpLink: {
    color: "#1a73e8",
    fontWeight: "bold",
  },
});


export default teacherlogin;
