import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { LOCALHOST } from "../services";
import FriendItem from "../components/FriendItem";

export default function FriendsScreen() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${LOCALHOST}/users`)
      .then(res => res.json())
      .then(data => setFriends(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#1E1E1E", padding: 15 }}>
      <Text style={{ color: "#fff", fontSize: 16, marginBottom: 15 }}>
        You are all settled up!
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#1ABC9C" />
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={({ item }) => <FriendItem friend={item} />}
        />
      )}

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 80,
          right: 20,
          backgroundColor: "#1ABC9C",
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 30,
          flexDirection: "row",
          alignItems: "center",
          elevation: 5,
        }}
      >
        <Icon name="receipt-outline" size={20} color="#fff" style={{ marginRight: 5 }} />
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Add expense</Text>
      </TouchableOpacity>
    </View>
  );
}
