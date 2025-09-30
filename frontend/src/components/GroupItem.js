import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function GroupItem({ group }) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{group.name}</Text>
      <Text style={styles.members}>{group.members} members</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
  },
  name: { color: "#fff", fontSize: 16 },
  members: { color: "#aaa", fontSize: 12 },
});
