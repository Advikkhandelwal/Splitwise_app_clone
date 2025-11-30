import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import Icon from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";
import { updateUser } from "../../services";

export default function EditProfileScreen({ navigation }) {
  const { colors, borderRadius, shadows } = useContext(ThemeContext);
  const { user, setToken } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const updateData = { name, email, phone };
      if (password.trim()) {
        updateData.password = password;
      }

      const updatedUser = await updateUser(user.user_id, updateData);

      // Update stored user info
      await setToken("Token", {
        ...user,
        ...updatedUser,
      });

      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Edit Profile
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <TextInput
                label="Full Name"
                mode="outlined"
                style={[styles.input, { backgroundColor: colors.card }]}
                value={name}
                onChangeText={setName}
                left={
                  <TextInput.Icon
                    icon={({ size, color }) => (
                      <Icon name="person-outline" size={size} color={color} />
                    )}
                  />
                }
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                textColor={colors.text}
                theme={{ roundness: 12 }}
              />
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                label="Email"
                mode="outlined"
                style={[styles.input, { backgroundColor: colors.card }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                left={
                  <TextInput.Icon
                    icon={({ size, color }) => (
                      <Icon name="mail-outline" size={size} color={color} />
                    )}
                  />
                }
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                textColor={colors.text}
                theme={{ roundness: 12 }}
              />
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                label="Phone"
                mode="outlined"
                style={[styles.input, { backgroundColor: colors.card }]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                left={
                  <TextInput.Icon
                    icon={({ size, color }) => (
                      <Icon name="call-outline" size={size} color={color} />
                    )}
                  />
                }
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                textColor={colors.text}
                theme={{ roundness: 12 }}
              />
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                label="New Password (optional)"
                mode="outlined"
                style={[styles.input, { backgroundColor: colors.card }]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                left={
                  <TextInput.Icon
                    icon={({ size, color }) => (
                      <Icon name="lock-closed-outline" size={size} color={color} />
                    )}
                  />
                }
                right={
                  <TextInput.Icon
                    icon={({ size, color }) => (
                      <Icon
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={size}
                        color={color}
                      />
                    )}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                outlineColor={colors.border}
                activeOutlineColor={colors.primary}
                textColor={colors.text}
                theme={{ roundness: 12 }}
              />
            </View>

            <Button
              mode="contained"
              onPress={handleSave}
              loading={loading}
              disabled={loading}
              style={[styles.saveButton, { backgroundColor: colors.primary, borderRadius: borderRadius.lg }]}
              contentStyle={styles.saveButtonContent}
              labelStyle={styles.saveButtonLabel}
              icon={({ size, color }) => (
                <Icon name="checkmark-circle-outline" size={size} color={color} />
              )}
            >
              Save Changes
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  scrollContent: {
    padding: 20,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
  },
  saveButton: {
    marginTop: 24,
  },
  saveButtonContent: {
    paddingVertical: 8,
  },
  saveButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});

