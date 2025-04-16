import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ImageBackground } from 'react-native';

const LearningCards = () => {
  const cards = [
    {
      title: 'CatchUp with Friends!',
      subtitle: 'Practice Past Questions Together',
    
      backgroundColor: ['#6C63FF', '#A594F9'],
    },
    {
      title: 'Ace Your Exams!',
      subtitle: 'Revise Exam Topics With Ease',
      
      backgroundColor: ['#FFB300', '#FFA500'],
    },
    {
      title: 'Boost Your Skills!',
      subtitle: 'Private Learning Made Simple',
      
      backgroundColor: ['#FF6F91', '#FF9472'],
    },
    {
      title: 'Weekly Learning Contest',
      subtitle: 'Top Learners Win CatchUp Points',
     
      backgroundColor: ['#B721FF', '#21D4FD'],
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {cards.map((card, index) => (
        <View
          key={index}
          style={[
            styles.card,
            { backgroundColor: card.backgroundColor[0] },
          ]}
        >
          <Text style={styles.title}>{card.title}</Text>
          <Text style={styles.subtitle}>{card.subtitle}</Text>
          
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#ffffff30',
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default LearningCards;
