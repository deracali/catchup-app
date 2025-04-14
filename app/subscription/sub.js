import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Linking,
  ActivityIndicator
} from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const plans = [
  { id: "1", title: "Per Subject", price: 1000 },
  { id: "2", title: "All Subjects", price: 5000 },
  { id: "3", title: "Live Classes (Students & Adults)", price: 10000 },
  { id: "4", title: "Web App: 1-year Access", price: 1000 }
];

const PlanCard = ({ item, user }) => {
  const handleSubscribe = () => {
    const title = encodeURIComponent(item.title);
    const price = encodeURIComponent(item.price);
    const name = encodeURIComponent(user?.name || "");
    const email = encodeURIComponent(user?.email || "");
    const studentId = encodeURIComponent(user?._id || ""); // Add user ID here
  
    const url = `https://catchup.com?title=${title}&price=${price}&name=${name}&email=${email}&studentId=${studentId}`;
    Linking.openURL(url);
  };
  
  return (
    <View style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={styles.planTitle}>{item.title}</Text>
        <Text style={styles.planPrice}>₦{item.price.toLocaleString()}</Text>
      </View>
      <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
        <Text style={styles.subscribeText}>Subscribe</Text>
      </TouchableOpacity>
    </View>
  );
};

const Sub = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const userId = await AsyncStorage.getItem("@userId");
      if (!userId) throw new Error("User ID not found in storage.");

      const response = await fetch(`https://catchup-project.onrender.com/api/users/profile/${userId}`);
      const data = await response.json();
      setUser(data);
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Loading user info...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription Plans</Text>
        <TouchableOpacity>
          <Feather name="bell" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Choose The Right Plan For Your Learning Journey.</Text>

      <FlatList
        data={plans}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PlanCard item={item} user={user} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: width * 0.05,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: height * 0.03,
    marginBottom: height * 0.02,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: height * 0.02,
  },
  listContainer: {
    paddingBottom: height * 0.1,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: height * 0.02,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  selectedCard: {
    backgroundColor: "#023047",
    paddingBottom: height * 0.02,
  },
  textContainer: {
    flex: 1,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  planDesc: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a73e8",
  },
  planMonthly: {
    fontSize: 14,
    color: "gray",
  },
  selectedText: {
    color: "white",
  },
  perksContainer: {
    marginTop: height * 0.02,
  },
  perkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  perkText: {
    color: "white",
    fontSize: 14,
    marginLeft: 8,
  },
  subscribeButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center"
  },
  subscribeText: {
    color: "#fff",
    fontSize: 13,
   fontFamily:"Manrope-Bold",
  }
});

export default Sub;
