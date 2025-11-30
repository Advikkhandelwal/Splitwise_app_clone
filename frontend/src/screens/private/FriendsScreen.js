import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import FriendItem from "../../components/FriendItem";
import { fetchUsers, sendFriendInvitation } from "../../services";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";

export default function FriendsScreen() {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteVisible, setInviteVisible] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);

  useEffect(() => {
    fetchUsers()
      .then(setFriends)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  
  const handleSendInvite = async () => {
    if (!inviteEmail.trim()) {
      Alert.alert("Error", "Please enter an email address");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail.trim())) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setSendingInvite(true);
    try {
      await sendFriendInvitation(
        inviteEmail.trim(),
        inviteName.trim() || inviteEmail.trim().split("@")[0],
        user?.name || "Someone"
      );
      Alert.alert("Success", "Invitation sent successfully", [
        {
          text: "OK",
          onPress: () => {
            setInviteVisible(false);
            setInviteEmail("");
            setInviteName("");
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to send invitation");
    } finally {
      setSendingInvite(false);
    }
  };

  const totalBalance = friends.reduce((sum, friend) => {
    return sum + (friend.balance || 0);
  }, 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Friends</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {friends.length} {friends.length === 1 ? "friend" : "friends"}
          </Text>
        </View>
        <View style={styles.headerActions}>
        <TouchableOpacity
            style={[
              styles.searchButton,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}
        >
          <Icon name="search-outline" size={22} color={colors.text} />
        </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addFriendButton, { backgroundColor: colors.primary }]}
            onPress={() => setInviteVisible(true)}
            activeOpacity={0.85}
          >
            <Icon name="person-add-outline" size={18} color="#FFFFFF" />
            <Text style={styles.addFriendText}>Add Friend</Text>
          </TouchableOpacity>
        </View>
      </View>

      {totalBalance !== 0 && (
        <View
          style={[
            styles.balanceCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <View style={styles.balanceRow}>
            <View>
              <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
                Total Balance
              </Text>
              <Text
                style={[
                  styles.balanceAmount,
                  {
                    color:
                      totalBalance > 0 ? colors.success : colors.accent,
                  },
                ]}
              >
                {totalBalance > 0 ? "+" : ""}${Math.abs(totalBalance).toFixed(2)}
              </Text>
            </View>
            <Icon
              name={totalBalance > 0 ? "arrow-down-circle" : "arrow-up-circle"}
              size={32}
              color={totalBalance > 0 ? colors.success : colors.accent}
            />
          </View>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : friends.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="people-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No friends yet
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Add friends to start splitting expenses
          </Text>
        </View>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={({ item }) => <FriendItem friend={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: colors.primary },
        ]}
        activeOpacity={0.8}
        onPress={() => navigation.navigate("AddExpense", { groupId: null })}
      >
        <Icon name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={inviteVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setInviteVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Invite a Friend
              </Text>
              <TouchableOpacity onPress={() => setInviteVisible(false)}>
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Email Address *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="friend@example.com"
                placeholderTextColor={colors.textSecondary}
                value={inviteEmail}
                onChangeText={setInviteEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                Name (Optional)
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.background,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Friend's name"
                placeholderTextColor={colors.textSecondary}
                value={inviteName}
                onChangeText={setInviteName}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.inviteButton,
                { backgroundColor: colors.primary },
                sendingInvite && styles.disabledButton,
              ]}
              onPress={handleSendInvite}
              activeOpacity={0.85}
              disabled={sendingInvite}
            >
              {sendingInvite ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.inviteButtonText}>Send Invite</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setInviteVisible(false)}
            >
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  addFriendButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    paddingHorizontal: 16,
    height: 44,
    marginLeft: 12,
  },
  addFriendText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 6,
  },
  balanceCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  fab: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  inviteButton: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  inviteButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  cancelButton: {
    marginTop: 16,
    alignItems: "center",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
