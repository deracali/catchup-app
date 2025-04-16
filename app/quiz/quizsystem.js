import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Dimensions, 
  Modal, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  StatusBar
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Feather } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const quizsystem = () => {
  const { quizId } = useLocalSearchParams();
  const router = useRouter();

  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [score, setScore] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [timer, setTimer] = useState(0);  // Time in seconds
  const [answerStatus, setAnswerStatus] = useState(null); // "correct" or "wrong"
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`https://catchup-project.onrender.com/api/quiz/quiz/${quizId}`);
        setQuizData(res.data);
      } catch (err) {
        console.error("Error fetching quiz:", err);
      }
    };
    if (quizId) fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (quizData && quizData.questions && quizData.questions[currentQuestion]) {
      const timeLimit = quizData.questions[currentQuestion].timeLimit || 30;
      setTimer(timeLimit * 60); // Convert timeLimit to seconds

      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            if (!answerStatus) handleNext(); // Only auto move if not answered
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentQuestion, quizData, answerStatus]);

  const handleOptionSelect = (index) => {
    if (answerStatus) return;
  
    setSelectedOptionIndex(index);
    const question = quizData.questions[currentQuestion];
  
    // Save user answer
    setUserAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestion] = question.options[index];
      return newAnswers;
    });
  
    if (question.options[index] === question.answer) {
      setScore((prev) => prev + 1);
      setAnswerStatus("correct");
    } else {
      setAnswerStatus("wrong");
    }
  };

  const handleNext = () => {
    setAnswerStatus(null);
    setSelectedOptionIndex(null);
    if (quizData && quizData.questions && currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowModal(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const userId = await AsyncStorage.getItem("@userId");
  
      await axios.post("https://catchup-project.onrender.com/api/quiz-scores", {
        userId,
        quizId,
        totalScore: score,
      });
  
      setShowModal(false);
  
      // Prepare data to pass
      const results = quizData.questions.map((q, index) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.answer,
        userAnswer: userAnswers[index],
        explanation: q.explanation,
      }));
  
      router.push({
        pathname: "quiz/review",
        params: { results: JSON.stringify(results), score, total: quizData.questions.length }
      });
    } catch (err) {
      console.error("Failed to submit score:", err?.response?.data || err.message);
    }
  };

  // Check loading state properly
  if (!quizData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  
  if (!quizData.questions) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No questions available.</Text>
      </View>
    );
  }
  
  const question = quizData.questions[currentQuestion];

  // Convert timer to MM:SS format
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const formattedTime = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="#000" barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%` }
            ]} 
          />
        </View>
        <View style={styles.timer}>
          <Feather name="clock" size={18} color="black" />
          <Text style={styles.timerText}>{formattedTime}</Text>
        </View>
      </View>

      {/* Question Text */}
      <Text style={styles.questionTitle}>What does this sentence mean?</Text>
      <View style={styles.sentenceContainer}>
        <Text style={styles.sentenceText}>{question.question}</Text>
      </View>

      {/* Options */}
      {question.options.map((option, index) => {
        const isSelected = selectedOptionIndex === index;
        let optionStyle = styles.option;

        if (answerStatus === "correct" && isSelected) {
          optionStyle = styles.correctOption;
        } else if (answerStatus === "wrong" && isSelected) {
          optionStyle = styles.wrongOption;
        }

        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleOptionSelect(index)}
            disabled={answerStatus !== null}
            style={optionStyle}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        );
      })}

      {/* Footer */}
      {answerStatus && (
        <View 
          style={[
            styles.footer,
            answerStatus === "correct" ? styles.correctFooter : styles.wrongFooter
          ]}
        >
          <Text style={styles.footerTitle}>
            {answerStatus === "correct" ? "✅ Correct!" : "❌ Wrong!"}
          </Text>

          {answerStatus === "wrong" && (
            <Text style={styles.footerText}>
              Correct answer: {question.answer}
            </Text>
          )}

          <Text style={styles.explanationText}>
            Explanation: {question.explanation ? question.explanation : "No explanation provided."}
          </Text>

          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Quiz Complete!</Text>
            <Text style={styles.modalScore}>
              Your Score: {score}/{quizData.questions.length}
            </Text>
            <TouchableOpacity onPress={handleSubmit} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  loading: { padding: 20, fontSize: 18 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  progressBarBackground: { flex: 1, height: 6, backgroundColor: "#eee", borderRadius: 5, marginHorizontal: 15 },
  progressBarFill: { height: 6, backgroundColor: "#1a73e8", borderRadius: 5 },
  timer: { flexDirection: "row", alignItems: "center" },
  timerText: { marginLeft: 5, fontWeight: "bold" },
  questionTitle: { marginTop: 30, fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  sentenceContainer: { alignItems: "center", marginBottom: 25 },
  sentenceText: { fontSize: 20, fontWeight: "500", textAlign: "center" },
  option: {
    backgroundColor: "#1a73e8",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  optionText: { fontSize: 16, textAlign: "center", fontWeight: "500", color:'#fff', },
  correctOption: {
    backgroundColor: "#d4edda",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: "#28a745",
    borderWidth: 2,
  },
  wrongOption: {
    backgroundColor: "#f8d7da",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderColor: "#dc3545",
    borderWidth: 2,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: "center",
  },
  correctFooter: { backgroundColor: "#d4edda" },
  wrongFooter: { backgroundColor: "#f8d7da" },
  footerTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  footerText: { fontSize: 16, color: "#6c757d", marginBottom: 10 },
  nextButton: {
    backgroundColor: "#1a73e8",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  explanationText: {
    marginTop: 10,
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
  },  
  modalBackground: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.8,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },
  modalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },
  modalScore: { fontSize: 18, marginBottom: 25 },
  modalButton: {
    backgroundColor: "#8a2be2",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  modalButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

export default quizsystem;
