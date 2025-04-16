import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import React from "react";

const Review = () => {
  const { results, score, total } = useLocalSearchParams();
  const parsedResults = JSON.parse(results);
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar translucent backgroundColor="#000" barStyle="light-content" />
      <Text style={styles.title}>Quiz Review</Text>
      <Text style={styles.score}>You scored {score} out of {total}</Text>

      {parsedResults.map((item, index) => (
        <View key={index} style={styles.questionContainer}>
          <Text style={styles.questionText}>{index + 1}. {item.question}</Text>

          {item.options.map((option, idx) => (
            <Text
              key={idx}
              style={[
                styles.optionText,
                option === item.correctAnswer
                  ? styles.correctAnswer
                  : option === item.userAnswer
                  ? styles.userAnswer
                  : null,
              ]}
            >
              {option}
            </Text>
          ))}

          <Text style={styles.explanation}>
            Explanation: {item.explanation || "No explanation provided."}
          </Text>
        </View>
      ))}

      <TouchableOpacity onPress={() => router.push("quiz/quiz")} style={styles.homeButton}>
        <Text style={styles.homeButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Review;

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  score: { fontSize: 18, marginBottom: 20, textAlign: "center" },
  questionContainer: { marginBottom: 25, padding: 15, backgroundColor: "#f9f9f9", borderRadius: 10 },
  questionText: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  optionText: { fontSize: 14, marginBottom: 5 },
  correctAnswer: { color: "green", fontWeight: "bold" },
  userAnswer: { color: "red" },
  explanation: { fontSize: 14, marginTop: 10, fontStyle: "italic" },
  homeButton: { backgroundColor: "#8a2be2", marginTop: 30, padding: 15, borderRadius: 10, alignItems: "center" },
  homeButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
