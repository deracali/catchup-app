import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';


const signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Primary"); // Default role
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roleDropdownVisible, setRoleDropdownVisible] = useState(false);
  const [name, setName] = useState(""); // Add name state

  const router = useRouter();

  const roles = ["Primary", "Secondary"];


  const handleSignup = async () => {
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
    console.log("Role:", role);
  
    // if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !role.trim()) {
    //   Alert.alert("Error", "All fields are required!");
    //   return;
    // }
  
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await fetch("https://catchup-project.onrender.com/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }), // Include name in the body
      });
  
      const data = await response.json();
  
      if (!response) {
        throw new Error(data.message || "Signup failed");
      }
  
      const { _id, email, role } = data;
      await AsyncStorage.setItem('userData', JSON.stringify({ userId: _id, email, role }));
  
      Alert.alert("Success", "Account created successfully!");
      router.push("home/homescreen");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  
  

  return (
  
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <View style={{ width: "100%", maxWidth: 400 }}> 
        <Text style={styles.title}>Sign up</Text>
        <Text style={styles.subtitle}>Enter your details to sign up</Text>

        <View style={styles.inputContainer}>
  <Ionicons name="person-outline" size={20} color="#777" style={styles.icon} />
  <TextInput
    placeholder="Enter your name"
    style={styles.input}
    value={name}
    onChangeText={setName}
  />
</View>
        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#777" style={styles.icon} />
          <TextInput
            placeholder="abc@email.com"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.icon} />
          <TextInput
            placeholder="Enter your password"
            style={styles.input}
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
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
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
            <Ionicons name={confirmPasswordVisible ? "eye-outline" : "eye-off-outline"} size={20} color="#777" />
          </TouchableOpacity>
        </View>

        {/* Custom Role Dropdown */}
        <TouchableOpacity style={styles.inputContainer} onPress={() => setRoleDropdownVisible(true)}>
          <Ionicons name="people-outline" size={20} color="#777" style={styles.icon} />
          <Text style={[styles.input, { color: "#000" }]}>{role}</Text>
          <Ionicons name="chevron-down-outline" size={20} color="#777" />
        </TouchableOpacity>

        {/* Role Selection Modal */}
        <Modal visible={roleDropdownVisible} transparent animationType="fade">
          <View style={styles.modalOverlay} onTouchEnd={() => setRoleDropdownVisible(false)} />
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Role</Text>
            <FlatList
              data={roles}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setRole(item);
                    setRoleDropdownVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign up</Text>}
        </TouchableOpacity>

        {/* Already have an account */}
        <Text style={styles.signupText}>
          Joined us before?
          <TouchableOpacity onPress={() => router.push("auth/login")}>
            <Text style={styles.signupLink}> Sign In</Text>
          </TouchableOpacity>
        </Text>
        </View>
      </ScrollView>

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
  scrollContainer: { flexGrow:1, padding: 20, alignItems: "center", justifyContent: "center" },

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


    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      position: "absolute",
      width: "100%",
      height: "100%",
    },
    modalContainer: {
      position: "absolute",
      top: "40%",
      left: "10%",
      width: "80%",
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 15,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    modalTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
    modalItem: { paddingVertical: 12, alignItems: "center" },
    modalItemText: { fontSize: 16, fontWeight: "bold" },
};

export default signup;
