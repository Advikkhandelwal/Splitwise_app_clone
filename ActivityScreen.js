import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ActivityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Activity Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1E1E1E", justifyContent: "center", alignItems: "center" },
  text: { color: "#fff" },
});
