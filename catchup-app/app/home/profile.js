import React from "react";
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TabIcon from "../../components/TabIcon";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const menuOptions = [
    { id: "1", title: "Your Current Courses", route: "course/mycourse" },
    { id: "2", title: "Your History", route: "/history" },
    { id: "3", title: "Certifications Earned", route: "/certifications" },
    { id: "4", title: "Settings", route: "/settings" },
];

const ProfileOption = ({ title, route, navigation }) => {
    const router = useRouter()
  return (
    <TouchableOpacity
    onPress={() => router.push(route)}
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

const profile = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#f8f5f2", paddingTop: height * 0.05 }}>
      <Text style={{ fontSize: width * 0.06, fontWeight: "bold", textAlign: "center" }}>Profile</Text>
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
        }}
      >
        <Image
          source={require('../../assets/images/profileImage.png')}
          style={{ width: width * 0.15, height: width * 0.15, borderRadius: width * 0.075 }}
        />
        <View style={{ marginLeft: width * 0.04 }}>
          <Text style={{ fontSize: width * 0.045, fontWeight: "bold" }}>Muhammad Ahmed</Text>
          <Text style={{ fontSize: width * 0.035, color: "gray" }}>mahmed1212@gmail.com</Text>
        </View>
      </View>
      <FlatList
        data={menuOptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProfileOption {...item} />}
      />
    
         <TabIcon style={{
            position: 'absolute',
            bottom: 20,
            alignSelf: 'center',
         }} onPress={() => console.log('Navigate to Courses')} />

    </View>
  );
};


export default profile;
