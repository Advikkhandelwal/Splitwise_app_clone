import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import { LOCALHOST } from "../services";

export default function GroupsScreen() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${LOCALHOST}/groups`) 
      .then(res => res.json())
      .then(data => setGroups(data))
      .catch(err => console.error("Error fetching groups:", err))
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.groupItem}>
      <Text style={styles.groupName}>{item.name}</Text>
      <Text style={styles.groupDesc}>{item.description}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1ABC9C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {groups.length === 0 ? (
        <Text style={styles.emptyText}>No groups found.</Text>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.group_id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E1E", padding: 15 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  groupItem: {
    padding: 15,
    backgroundColor: "#333",
    borderRadius: 8,
    marginBottom: 10,
  },
  groupName: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  groupDesc: { color: "#aaa", fontSize: 14, marginTop: 5 },
  emptyText: { color: "#fff", fontSize: 16, textAlign: "center", marginTop: 20 },
});
