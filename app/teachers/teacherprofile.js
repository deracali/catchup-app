import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import TeacherTab from "../../components/TeacherTab";

const { width, height } = Dimensions.get("window");

const menuOptions = [
  { id: "1", title: "Bookings", route: "teachers/bookingscreen" },
  { id: "2", title: "Live Courses", route: "teachers/teacherslist" },
  { id: "3", title: "Go Live", route: "teachers/createLivecourses" },
  { id: "4", title: "Terms and Condition", route: "help/terms" },
  { id: "5", title: "Logout", route: "Logout" },
];

const teacherprofile = () => {
  const [teacher, setTeacher] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teacherId, setTeacherId] = useState(null);
  const router = useRouter();

  const ProfileOption = ({ title, handlePress }) => {
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={{
          backgroundColor: "#fff",
          padding: width * 0.04,
          borderRadius: 15,
          marginVertical: width * 0.02,
          width: width * 0.9,
          alignSelf: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 3,
        }}
      >
        <Text style={{ fontSize: width * 0.045 }}>{title}</Text>
        <Ionicons name="document-text" size={width * 0.08} color="#0084ff" />
      </TouchableOpacity>
    );
  };

  const handleMenuPress = async (route) => {
    if (route === "Logout") {
      try {
        await AsyncStorage.multiRemove(["teacherId", "teacherToken"]);
        router.replace("/"); // Redirect to login/home screen
      } catch (error) {
        console.error("Error during logout:", error);
      }
    } else {
      router.push(route);
    }
  };

  const fetchTeacher = async () => {
    try {
      const storedTeacherId = await AsyncStorage.getItem("teacherId");
      if (!storedTeacherId) {
        console.error("No teacherId found in storage");
        return;
      }
      setTeacherId(storedTeacherId);
      setLoading(true);

      const response = await axios.get("https://catchup-project.onrender.com/api/teachers");
      const fetchedTeacher = response.data.find((t) => t._id === storedTeacherId);

      if (fetchedTeacher) {
        setTeacher(fetchedTeacher);
      } else {
        console.error("Teacher not found in fetched teachers");
      }
    } catch (error) {
      console.error("Failed to fetch teacher:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (isEditing) {
      try {
        setLoading(true);
        await axios.put(
          `https://catchup-project.onrender.com/api/teachers/update/${teacherId}`,
          {
            name: teacher.name,
            email: teacher.email,
            // Add other fields if needed
          }
        );
        Alert.alert("Success", "Profile updated successfully!");
      } catch (error) {
        console.error("Failed to update teacher:", error);
        Alert.alert("Error", "Failed to update profile.");
      } finally {
        setLoading(false);
      }
    }
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    fetchTeacher();
  }, []);

  if (loading || !teacher) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0084ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f5f2", paddingTop: height * 0.05 }}>
      <Text style={{ fontSize: width * 0.06, fontWeight: "bold", textAlign: "center" }}>
        Profile
      </Text>

      <View
        style={{
          backgroundColor: "#fff",
          padding: width * 0.05,
          borderRadius: 15,
          width: width * 0.9,
          alignSelf: "center",
          flexDirection: "row",
          alignItems: "center",
          marginTop: height * 0.02,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 3,
          position: "relative",
        }}
      >
        <Image
          source={{ uri: teacher.profileImage }}
          style={{ width: width * 0.15, height: width * 0.15, borderRadius: width * 0.075 }}
        />
        <View style={{ marginLeft: width * 0.04, flex: 1 }}>
          {isEditing ? (
            <>
              <TextInput
                value={teacher.name}
                onChangeText={(text) => setTeacher({ ...teacher, name: text })}
                placeholder="Enter Name"
                style={{
                  fontSize: width * 0.045,
                  fontWeight: "bold",
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                  marginBottom: 5,
                }}
              />
              <TextInput
                value={teacher.email}
                onChangeText={(text) => setTeacher({ ...teacher, email: text })}
                placeholder="Enter Email"
                style={{
                  fontSize: width * 0.035,
                  color: "gray",
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                }}
              />
            </>
          ) : (
            <>
              <Text style={{ fontSize: width * 0.045, fontWeight: "bold" }}>{teacher.name}</Text>
              <Text style={{ fontSize: width * 0.035, color: "gray" }}>{teacher.email}</Text>
              <Text style={{ fontSize: width * 0.03, color: "gray", marginTop: 5 }}>
                {teacher.designation}
              </Text>
            </>
          )}
        </View>

        <TouchableOpacity onPress={handleEditSave} style={{ marginLeft: 10 }}>
          <Feather name={isEditing ? "save" : "edit-2"} size={24} color="#0084ff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={menuOptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProfileOption title={item.title} handlePress={() => handleMenuPress(item.route)} />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TeacherTab />
    </View>
  );
};

export default teacherprofile;
