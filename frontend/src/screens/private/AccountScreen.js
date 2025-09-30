import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ThemeContext } from "../../contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AccountScreen() {
  const { colors, toggleTheme, theme } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>Account Screen</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => {
          (async () => {
            await AsyncStorage.removeItem("userToken");
          })();
        }}
      >
        <Text style={[styles.buttonText, { color: colors.text }]}>
          Switch to {theme === "dark" ? "Light" : "Dark"} Theme
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: { fontSize: 16, marginBottom: 20 },
  button: { padding: 15, borderRadius: 8, width: "70%", alignItems: "center" },
  buttonText: { fontWeight: "bold", fontSize: 16 },
});
