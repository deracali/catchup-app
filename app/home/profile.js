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
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons, Feather, MaterialIcons, AntDesign } from "@expo/vector-icons";
import TabIcon from "../../components/TabIcon";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Mission from "./mission";

const { width, height } = Dimensions.get("window");

const avatarList = [
  require("../../assets/images/avatar/1.jpg"),
  require("../../assets/images/avatar/2.jpg"),
  require("../../assets/images/avatar/3.jpg"),
  require("../../assets/images/avatar/4.jpg"),
  require("../../assets/images/avatar/5.jpg"),
  require("../../assets/images/avatar/6.jpg"),
  require("../../assets/images/avatar/7.jpg"),
  require("../../assets/images/avatar/8.jpg"),
  require("../../assets/images/avatar/9.jpg"),
];

// Menu options array
const menuOptions = [
  {
    id: "1",
    title: "Your Current Courses",
    route: "course/mycourse",
    icon: <MaterialIcons name="library-books" size={24} color="#6c5ce7" />,
  },
  {
    id: "2",
    title: "Subscription Status",
    route: "subscription/substatus",
    icon: <Ionicons name="document-text-outline" size={24} color="#0984e3" />
    ,
  },
  {
    id: "3",
    title: "Logout",
    route: "Logout",
    icon: <Ionicons name="log-out-outline" size={24} color="#d63031" />,
  },
];



const profilescreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("Profile");
  const [selectedAvatar, setSelectedAvatar] = useState(avatarList[0]);
  const router = useRouter();

 

  const ProfileOption = ({ title, route, icon }) => (
    <TouchableOpacity onPress={() => handleMenuPress(route)} style={styles.optionRow}>
    <View style={styles.iconContainer}>
      {icon}
    </View>
    <Text style={styles.optionText}>{title}</Text>
    <Feather name="chevron-right" size={20} color="#ccc" />
  </TouchableOpacity>
  );

  const handleMenuPress = async (route) => {
    if (route === "Logout") {
      try {
        await AsyncStorage.multiRemove(["teacherId", "teacherToken"]);
        router.replace("/");
      } catch (error) {
        console.error("Error during logout:", error);
      }
    } else {
      router.push(route);
    }
  };


  const fetchUser = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("@userId");
      const storedAvatarIndex = await AsyncStorage.getItem("@profileAvatar");

      if (storedAvatarIndex !== null) {
        setSelectedAvatar(avatarList[parseInt(storedAvatarIndex)]); // Get avatar based on index
      }

      if (!storedUserId) return console.error("No userId found in storage");

      setUserId(storedUserId);
      setLoading(true);

      const response = await axios.get(`https://catchup-project.onrender.com/api/users`);
      const user = response.data.find((u) => u._id === storedUserId);
      if (user) {
        setName(user.name);
        setEmail(user.email);
      } else {
        console.error("User not found in fetched users");
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleEditSave = async () => {
    if (isEditing) {
      try {
        setLoading(true);
        // Save user data to the backend
        await axios.put(`https://catchup-project.onrender.com/api/users/update/${userId}`, {
          name,
          email,
          // If your backend supports image field, you can send the avatar index or URL here
          // avatarIndex: avatarList.indexOf(selectedAvatar),
        });
        Alert.alert("Success", "Profile updated successfully!");
      } catch (error) {
        console.error("Failed to update user:", error);
        Alert.alert("Error", "Failed to update profile.");
      } finally {
        setLoading(false);
      }
    }
    setIsEditing(!isEditing);  // Toggle editing mode
  };
  

  const handleAvatarSelect = async (index) => {
    setSelectedAvatar(avatarList[index]);
    await AsyncStorage.setItem("@profileAvatar", index.toString()); // Save the avatar index
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0084ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9", paddingTop: height * 0.05 }}>
      <StatusBar translucent backgroundColor="#000" barStyle="light-content" />
      {/* Tab Switch */}
       <TouchableOpacity onPress={() => router.back()} style={styles.goBack}>
                      <Text style={styles.goBackText}>← Back</Text>
                    </TouchableOpacity>
      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 20 }}>
        <View style={{
          backgroundColor: "#fff",
          borderRadius: 25,
          flexDirection: "row",
          padding: 4,
          elevation: 2,
        }}>
          <TouchableOpacity onPress={() => setTab("Profile")}>
            <Text style={{
              backgroundColor: tab === "Profile" ? "#0084ff" : "transparent",
              color: tab === "Profile" ? "#fff" : "#888",
              borderRadius: 20,
              paddingVertical: 6,
              paddingHorizontal: 20,
              fontWeight: "bold",
            }}>
              Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab("Statistics")}>
            <Text style={{
              backgroundColor: tab === "Statistics" ? "#0084ff" : "transparent",
              color: tab === "Statistics" ? "#fff" : "#888",
              borderRadius: 20,
              paddingVertical: 6,
              paddingHorizontal: 20,
              fontWeight: "bold",
            }}>
              Tasks
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {tab === "Profile" ? (
          <>
            {/* Profile Card */}
            <View style={{ alignItems: "center", marginBottom: 30 }}>
              <Image
                source={selectedAvatar}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              {isEditing ? (
                <>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter Name"
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      borderBottomWidth: 1,
                      borderColor: "#ccc",
                      marginTop: 10,
                      width: "80%",
                      textAlign: "center",
                    }}
                  />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter Email"
                    style={{
                      fontSize: 14,
                      color: "gray",
                      borderBottomWidth: 1,
                      borderColor: "#ccc",
                      width: "80%",
                      textAlign: "center",
                      marginTop: 5,
                    }}
                  />
                </>
              ) : (
                <>
                  <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>{name}</Text>
                  <Text style={{ fontSize: 14, color: "gray" }}>{email}</Text>
                </>
              )}
              <TouchableOpacity onPress={handleEditSave} style={{ marginTop: 10 }}>
                <Feather name={isEditing ? "save" : "edit-2"} size={20} color="#0084ff" />
              </TouchableOpacity>
            </View>

            {/* Avatar Selection */}
         
{isEditing && (
  <ScrollView
    horizontal
    contentContainerStyle={{ alignItems: "center", marginBottom: 20 }}
  >
    {avatarList.map((avatar, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => handleAvatarSelect(index)}
        style={{
          marginHorizontal: 10,
          alignItems: "center",
        }}
      >
        <Image
          source={avatar}
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            borderWidth: selectedAvatar === avatar ? 2 : 0,
            borderColor: "#0084ff",
          }}
        />
        <Text style={{ marginTop: 5, color: selectedAvatar === avatar ? '#0084ff' : '#888' }}>
          {`Avatar ${index + 1}`}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
)}


            {/* Menu Options */}
            <View style={{
              backgroundColor: "#fff",
              borderRadius: 15,
              marginHorizontal: 20,
              elevation: 2,
            }}>
              <FlatList
                data={menuOptions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ProfileOption {...item} />}
                scrollEnabled={false}
              />
            </View>
          </>
        ) : (
          <Mission />
        )}
      </ScrollView>

      <TabIcon
        style={{ position: "absolute", bottom: 20, alignSelf: "center" }}
        onPress={() => console.log("Navigate to Courses")}
      />
    </View>
  );
};



const styles = StyleSheet.create({
  goBack: {
    position: 'absolute',
    top: 50,
    left: 1,
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
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    justifyContent: 'space-between', // Ensure the text and icon are spaced correctly
  },
  iconContainer: {
    marginRight: 20,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
    color: '#333', // Color for the title text
  },
});


export default profilescreen;
