import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { AntDesign, FontAwesome, Feather, Entypo } from "@expo/vector-icons";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get("window");

const faqs = [ 
  {
    question: "How do I subscribe?",
    answer: "Choose a plan, make payment, and start learning instantly!",
  },
  {
    question: "Can I use Catchup offline?",
    answer: "Yes! Download your subjects and learn without internet access.",
  },
  {
    question: "How do live classes work?",
    answer: "Book a session, join via video call, and interact with expert tutors.",
  },
  {
    question: "Is Catchup for adults too?",
    answer: "Yes! We offer literacy programs in Math, English & Financial Accounting.",
  },
];

const contactOptions = [
  { icon: <Feather name="headphones" size={24} color="black" />, label: "Customer Services" },
  { icon: <FontAwesome name="whatsapp" size={24} color="green" />, label: "WhatsApp" },
  { icon: <Entypo name="link" size={24} color="black" />, label: "Website" },
  { icon: <FontAwesome name="facebook" size={24} color="#4267B2" />, label: "Facebook" },
  { icon: <Entypo name="twitter" size={24} color="#1DA1F2" />, label: "Twitter" },
  { icon: <Entypo name="instagram" size={24} color="#C13584" />, label: "Instagram" },
];

export default function help() {
  const [activeTab, setActiveTab] = useState("FAQ");
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleAccordion = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <View style={styles.container}>
<StatusBar translucent backgroundColor="#000" barStyle="light-content" />
      {/* Header */}
      <Text style={styles.header}>Help Center</Text>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {["FAQ", "Contact Us"].map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "FAQ" ? (
        <>
        

          {/* FAQ List */}
          <ScrollView style={styles.faqList}>
            {faqs.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleAccordion(index)}
                style={styles.accordion}
              >
                <View style={styles.accordionHeader}>
                  <Text style={styles.question}>{item.question}</Text>
                  <AntDesign
                    name={expandedIndex === index ? "up" : "down"}
                    size={16}
                    color="#000"
                  />
                </View>
                {expandedIndex === index && (
                  <Text style={styles.answer}>{item.answer}</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      ) : (
        <ScrollView style={styles.contactList}>
          {contactOptions.map((item, index) => (
            <TouchableOpacity key={index} style={styles.contactItem}>
              {item.icon}
              <Text style={styles.contactText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.06,
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    fontSize: width * 0.06,
    fontWeight: "bold",
    marginBottom: height * 0.02,
  },
  tabRow: {
    flexDirection: "row",
    marginBottom: height * 0.02,
  },
  tab: {
    paddingVertical: height * 0.008,
    paddingHorizontal: width * 0.04,
    borderRadius: 20,
    backgroundColor: "#eee",
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: "#1a73e8",
  },
  tabText: {
    fontSize: width * 0.035,
    color: "#555",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    paddingHorizontal: width * 0.04,
    paddingVertical: height * 0.012,
    marginBottom: height * 0.025,
    justifyContent: "space-between",
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.035,
    color: "#000",
  },
  faqList: {
    marginBottom: height * 0.02,
  },
  accordion: {
    backgroundColor: "#fdfdfd",
    borderRadius: 12,
    padding: width * 0.04,
    marginBottom: height * 0.015,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontSize: width * 0.04,
    fontWeight: "600",
    flex: 1,
    marginRight: 10,
  },
  answer: {
    marginTop: height * 0.01,
    fontSize: width * 0.035,
    color: "#555",
  },
  contactList: {
    marginTop: 10,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: width * 0.04,
    backgroundColor: "#fdfdfd",
    borderRadius: 12,
    marginBottom: height * 0.015,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  contactText: {
    marginLeft: 15,
    fontSize: width * 0.04,
    fontWeight: "500",
    color: "#333",
  },
});
