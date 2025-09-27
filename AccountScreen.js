import React from "react";
import { View, Text } from "react-native";

export default function AccountScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#1E1E1E",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fff" }}>Account Screen</Text>
    </View>
  );
}
