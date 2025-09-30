import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ThemeContext } from "../../contexts/ThemeContext";
import { createUser } from "../../services";

export default function UserScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async () => {
    if (!name || !email || !phone) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    setLoading(true);
    try {
      await createUser({ name, email, phone });
      navigation.navigate("Main");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Create Account
        </Text>

        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          placeholder="Full Name"
          placeholderTextColor={colors.placeholder}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          placeholder="Email"
          placeholderTextColor={colors.placeholder}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, color: colors.text },
          ]}
          placeholder="Phone"
          placeholderTextColor={colors.placeholder}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: colors.primary },
            loading && { opacity: 0.7 },
          ]}
          onPress={handleCreateUser}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>
            {loading ? "Creating..." : "Create Account"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: { fontSize: 24, marginBottom: 30 },
  input: { width: "100%", padding: 15, borderRadius: 8, marginBottom: 15 },
  button: { padding: 15, borderRadius: 8, width: "100%", alignItems: "center" },
  buttonText: { fontWeight: "bold", fontSize: 16 },
});
