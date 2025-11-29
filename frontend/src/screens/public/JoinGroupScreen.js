import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";
import { joinGroupViaInvitation, fetchUserById } from "../../services";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function JoinGroupScreen() {
  const { colors } = useContext(ThemeContext);
  const { token } = useContext(AuthContext);
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId, email } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [joining, setJoining] = useState(false);
  const [groupInfo, setGroupInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!groupId) {
      setError("Invalid invitation link");
      return;
    }

    // You might want to fetch group info here
    // For now, we'll just show the join button
  }, [groupId]);

  const handleJoinGroup = async () => {
    if (!token) {
      Alert.alert(
        "Login Required",
        "Please login or sign up to join this group",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Sign Up",
            onPress: () => navigation.navigate("SignUpScreen"),
          },
          {
            text: "Login",
            onPress: () => navigation.navigate("LoginScreen"),
          },
        ]
      );
      return;
    }

    setJoining(true);
    try {
      // Get current user ID from token or context
      // For now, we'll use email
      const result = await joinGroupViaInvitation(groupId, email);

      Alert.alert(
        "Success!",
        `You've successfully joined "${result.group.name}"!`,
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("Main", { screen: "Groups" });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to join group");
    } finally {
      setJoining(false);
    }
  };

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={64} color={colors.error || "#FF3B30"} />
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("LoginScreen")}
            style={[styles.button, { backgroundColor: colors.primary }]}
          >
            Go to Login
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + "20" }]}>
            <Icon name="mail-outline" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>
            Group Invitation
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            You've been invited to join a group
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={styles.infoRow}>
            <Icon name="people-outline" size={24} color={colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Group ID
              </Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>
                {groupId}
              </Text>
            </View>
          </View>

          {email && (
            <View style={styles.infoRow}>
              <Icon name="mail-outline" size={24} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                  Invited Email
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {email}
                </Text>
              </View>
            </View>
          )}

          {!token && (
            <View style={[styles.warningBox, { backgroundColor: colors.primary + "10" }]}>
              <Icon name="information-circle-outline" size={20} color={colors.primary} />
              <Text style={[styles.warningText, { color: colors.text }]}>
                You need to login or sign up to join this group
              </Text>
            </View>
          )}
        </View>

        <Button
          mode="contained"
          onPress={handleJoinGroup}
          loading={joining}
          disabled={joining}
          style={[styles.joinButton, { backgroundColor: colors.primary }]}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          {token ? "Join Group" : "Login to Join"}
        </Button>

        {!token && (
          <View style={styles.authButtons}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("SignUpScreen")}
              style={[styles.authButton, { borderColor: colors.primary }]}
              labelStyle={[styles.authButtonLabel, { color: colors.primary }]}
            >
              Sign Up
            </Button>
            <Button
              mode="text"
              onPress={() => navigation.navigate("LoginScreen")}
              labelStyle={[styles.authButtonLabel, { color: colors.primary }]}
            >
              Already have an account? Login
            </Button>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  infoContent: {
    marginLeft: 16,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  warningText: {
    marginLeft: 8,
    fontSize: 14,
    flex: 1,
  },
  joinButton: {
    borderRadius: 12,
    marginBottom: 16,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  authButtons: {
    alignItems: "center",
  },
  authButton: {
    marginBottom: 12,
    borderRadius: 12,
  },
  authButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
});

