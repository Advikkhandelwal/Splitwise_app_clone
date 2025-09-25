import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default function FriendItem({ friend }) {
  return (
    <View style={styles.container}>
      {friend.avatar ? (
        <Image source={{ uri: friend.avatar }} style={styles.avatar} />
      ) : (
        <View style={styles.placeholder}>
          <Icon name="person-outline" size={20} color="#fff" />
        </View>
      )}
      <View>
        <Text style={styles.name}>{friend.name}</Text>
        <Text style={styles.status}>{friend.status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  placeholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#555",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  name: { color: "#fff", fontSize: 16 },
  status: { color: "#aaa", fontSize: 12 },
});
