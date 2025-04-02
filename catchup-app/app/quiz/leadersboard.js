import React from "react";
import { View, Text, TouchableOpacity, Image, FlatList, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// Sample leaderboard data
const leaderboardData = [
  { rank: 1, name: "Davis Curtis", points: 2569, color: "#FF5A5F", image: require("../../assets/images/Avatar.png") },
  { rank: 2, name: "Alena Donin", points: 1469, color: "#1976D2", image: require("../../assets/images/Avatar.png") },
  { rank: 3, name: "Craig Gouse", points: 1053, color: "#8E44AD", image: require("../../assets/images/Avatar.png") },
];

const otherPlayers = [
  { rank: 4, name: "Madelyn Dias", points: 590, image: require("../../assets/images/Avatar.png") },
  { rank: 5, name: "Zain Vaccaro", points: 448, image: require("../../assets/images/Avatar.png") },
  { rank: 6, name: "Skylar Geidt", points: 448, image: require("../../assets/images/Avatar.png") },
];

const leadersboard = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#F8F2EB", paddingHorizontal: width * 0.05 }}>
      
      {/* Header */}
      <Text style={{ fontSize: width * 0.07, fontWeight: "bold", marginTop: height * 0.05 }}>Leaderboard</Text>

      {/* Toggle Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: height * 0.02 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#0000FF",
            paddingVertical: height * 0.015,
            paddingHorizontal: width * 0.1,
            borderTopLeftRadius: width * 0.1,
            borderBottomLeftRadius: width * 0.1,
          }}
        >
          <Text style={{ color: "white", fontSize: width * 0.04 }}>Weekly</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: "white",
            paddingVertical: height * 0.015,
            paddingHorizontal: width * 0.1,
            borderTopRightRadius: width * 0.1,
            borderBottomRightRadius: width * 0.1,
          }}
        >
          <Text style={{ color: "#0000FF", fontSize: width * 0.04 }}>All Time</Text>
        </TouchableOpacity>
      </View>

      {/* Top 3 Players Podium */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "flex-end", height: height * 0.3 }}>
        {leaderboardData.map((player, index) => (
          <View key={player.rank} style={{ alignItems: "center" }}>
            <Image
              source={player.image}
              style={{ width: width * 0.15, height: width * 0.15, borderRadius: width * 0.075 }}
            />
            <View
              style={{
                backgroundColor: player.color,
                width: width * 0.2,
                height: height * (index === 0 ? 0.15 : 0.12),
                borderTopLeftRadius: width * 0.03,
                borderTopRightRadius: width * 0.03,
                alignItems: "center",
                justifyContent: "center",
                marginTop: height * 0.01,
              }}
            >
              <Text style={{ color: "white", fontSize: width * 0.04, fontWeight: "bold" }}>{player.name}</Text>
              <Text style={{ color: "white", fontSize: width * 0.035 }}>{player.points} points</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Other Players List */}
      <FlatList
        data={otherPlayers}
        keyExtractor={(item) => item.rank.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "white",
              paddingVertical: height * 0.015,
              marginVertical: height * 0.005,
              borderRadius: width * 0.02,
              paddingHorizontal: width * 0.05,
            }}
          >
            <Text style={{ fontSize: width * 0.05, fontWeight: "bold", marginRight: width * 0.05 }}>{item.rank}</Text>
            <Image
              source={item.image}
              style={{ width: width * 0.12, height: width * 0.12, borderRadius: width * 0.06 }}
            />
            <View style={{ marginLeft: width * 0.05 }}>
              <Text style={{ fontSize: width * 0.04, fontWeight: "bold" }}>{item.name}</Text>
              <Text style={{ fontSize: width * 0.035 }}>{item.points} points</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default leadersboard;
