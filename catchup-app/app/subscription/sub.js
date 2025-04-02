import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Dimensions } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const plans = [
  { id: "1", title: "Basic Plan", price: "$9.99", description: "Unlock Essential Courses And Features.", selected: false },
  { id: "2", title: "Pro Plan", price: "$9.99", description: "Get Certificates And Offline Access.", selected: false },
  { id: "3", title: "Premium Plan", price: "$9.99", description: "Exclusive Content And VIP Support.", selected: true, perks: [
      "Access To All Courses",
      "Certification On Completion",
      "Offline Access",
      "Premium Support",
      "Access To Exclusive Content"
    ] 
  }
];

const PlanCard = ({ item, onSelect }) => {
  return (
    <TouchableOpacity
      style={[styles.card, item.selected && styles.selectedCard]}
      onPress={() => onSelect(item.id)}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.planTitle, item.selected && styles.selectedText]}>{item.title}</Text>
        <Text style={[styles.planDesc, item.selected && styles.selectedText]}>{item.description}</Text>
      </View>
      <View>
        <Text style={[styles.planPrice, item.selected && styles.selectedText]}>{item.price}</Text>
        <Text style={[styles.planMonthly, item.selected && styles.selectedText]}>Monthly</Text>
      </View>
      
      {item.selected && item.perks && (
        <View style={styles.perksContainer}>
          {item.perks.map((perk, index) => (
            <View key={index} style={styles.perkItem}>
              <Feather name="check-circle" size={18} color="white" />
              <Text style={styles.perkText}>{perk}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const sub = () => {
  const [planList, setPlanList] = useState(plans);

  const handleSelect = (id) => {
    setPlanList(planList.map(plan => ({ ...plan, selected: plan.id === id })));
  };

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
        data={planList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PlanCard item={item} onSelect={handleSelect} />}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.subscribeButton}>
        <Text style={styles.subscribeText}>Subscribe Now</Text>
      </TouchableOpacity>
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
    color: "#008080",
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
    position: "absolute",
    bottom: height * 0.05,
    alignSelf: "center",
    width: width * 0.8,
    paddingVertical: height * 0.02,
    backgroundColor: "#008080",
    borderRadius: 12,
    alignItems: "center",
    elevation: 5,
  },
  subscribeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default sub;
