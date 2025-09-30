import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { fetchGroups } from "../../services";
import { ThemeContext } from "../../contexts/ThemeContext";

export default function GroupsScreen() {
  const { colors } = useContext(ThemeContext);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups()
      .then(setGroups)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.groupItem, { backgroundColor: colors.card }]}
    >
      <Text style={[styles.groupName, { color: colors.text }]}>
        {item.name}
      </Text>
      <Text style={[styles.groupDesc, { color: colors.placeholder }]}>
        {item.description}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {groups.length === 0 ? (
        <Text style={[styles.emptyText, { color: colors.text }]}>
          No groups found.
        </Text>
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
  container: { flex: 1, padding: 15 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  groupItem: { padding: 15, borderRadius: 8, marginBottom: 10 },
  groupName: { fontSize: 18, fontWeight: "bold" },
  groupDesc: { fontSize: 14, marginTop: 5 },
  emptyText: { fontSize: 16, textAlign: "center", marginTop: 20 },
});
