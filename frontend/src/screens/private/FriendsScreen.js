import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FriendItem from "../../components/FriendItem";
import { fetchUsers } from "../../services";
import { ThemeContext } from "../../contexts/ThemeContext";

export default function FriendsScreen() {
  const { colors } = useContext(ThemeContext);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers()
      .then(setFriends)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 15 }}>
      <Text style={{ color: colors.text, fontSize: 16, marginBottom: 15 }}>
        You are all settled up!
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
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
          backgroundColor: colors.primary,
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderRadius: 30,
          flexDirection: "row",
          alignItems: "center",
          elevation: 5,
        }}
      >
        <Icon
          name="receipt-outline"
          size={20}
          color={colors.text}
          style={{ marginRight: 5 }}
        />
        <Text style={{ color: colors.text, fontWeight: "bold" }}>
          Add expense
        </Text>
      </TouchableOpacity>
    </View>
  );
}
