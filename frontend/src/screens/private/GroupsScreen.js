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
  ScrollView,
  RefreshControl,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { fetchGroups, createGroup, sendGroupInvitation } from "../../services";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";
import GroupItem from "../../components/GroupItem";
import InviteModal from "../../components/InviteModal";

export default function GroupsScreen() {
  const { colors } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [inviteInput, setInviteInput] = useState("");
  const [inviteEmails, setInviteEmails] = useState([]);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const totalMembers = groups.reduce(
    (sum, group) => sum + (group.members?.length || 0),
    0
  );

  const loadGroups = (showRefreshing = false) => {
    if (user?.user_id) {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      console.log("Loading groups for user:", user.user_id);
      fetchGroups(user.user_id)
        .then((groups) => {
          console.log("Fetched groups:", groups);
          setGroups(groups || []);
        })
        .catch((error) => {
          console.error("Error fetching groups:", error);
          if (!showRefreshing) {
            Alert.alert("Error", "Failed to load groups. Please try again.");
          }
          setGroups([]);
        })
        .finally(() => {
          setLoading(false);
          setRefreshing(false);
        });
    } else {
      console.log("No user_id, skipping group load");
      setLoading(false);
      setRefreshing(false);
      setGroups([]);
    }
  };

  const onRefresh = () => {
    loadGroups(true);
  };

  useEffect(() => {
    loadGroups();
  }, [user?.user_id]);

  // Reload groups when screen comes into focus (e.g., after joining a group)
  useFocusEffect(
    React.useCallback(() => {
      loadGroups();
    }, [user?.user_id])
  );

  const resetCreateForm = () => {
    setGroupName("");
    setGroupDescription("");
    setInviteInput("");
    setInviteEmails([]);
  };

  const handleAddInviteEmail = () => {
    const trimmed = inviteInput.trim().toLowerCase();
    if (!trimmed) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      Alert.alert("Invalid email", "Please enter a valid email address");
      return;
    }

    if (inviteEmails.includes(trimmed)) {
      Alert.alert("Duplicate email", "This friend is already on the list");
      return;
    }

    setInviteEmails((prev) => [...prev, trimmed]);
    setInviteInput("");
  };

  const handleRemoveInviteEmail = (emailToRemove) => {
    setInviteEmails((prev) => prev.filter((email) => email !== emailToRemove));
  };

  const handleCreateGroup = async () => {
    const trimmedName = groupName.trim();
    if (!trimmedName) {
      Alert.alert("Missing info", "Please enter a group name");
      return;
    }

    if (!user?.user_id) {
      Alert.alert("Not signed in", "Please log in again to create groups");
      return;
    }

    setCreatingGroup(true);
    try {
      const payload = {
        name: trimmedName,
        created_by: user.user_id,
        description: groupDescription.trim() || undefined,
      };

      console.log("Creating group with payload:", payload);
      const newGroup = await createGroup(payload);
      console.log("Group created successfully:", newGroup);

      const emails = [...inviteEmails];
      let failedInvites = [];

      if (emails.length) {
        const results = await Promise.allSettled(
          emails.map((email) =>
            sendGroupInvitation(
              newGroup.group_id,
              email,
              email.split("@")[0],
              user?.name || "Someone"
            )
          )
        );

        failedInvites = results.reduce((acc, result, index) => {
          if (result.status === "rejected") {
            acc.push(emails[index]);
          }
          return acc;
        }, []);
      }

      resetCreateForm();
      setCreateModalVisible(false);

      // Force refresh groups with a small delay to ensure backend is ready
      setTimeout(() => {
        loadGroups();
      }, 500);

      Alert.alert(
        failedInvites.length ? "Group created with warnings" : "Group created",
        failedInvites.length
          ? `The group was created, but we couldn't email: ${failedInvites.join(
            ", "
          )}`
          : "Your group is ready and invites are on the way!",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error creating group:", error);
      Alert.alert("Error", error.message || "Failed to create group");
    } finally {
      setCreatingGroup(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Groups</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {groups.length} {groups.length === 1 ? "group" : "groups"} ·{" "}
            {totalMembers} {totalMembers === 1 ? "member" : "members"}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}
            activeOpacity={0.8}
          >
            <Icon name="search-outline" size={20} color={colors.text} />
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={[
              styles.primaryButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={() => setCreateModalVisible(true)}
            activeOpacity={0.85}
          >
            <Icon name="add-circle-outline" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>New Group</Text>
          </TouchableOpacity> */}
        </View>
      </View>

      <View
        style={[
          styles.summaryCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <View style={styles.summaryRow}>
          <View
            style={[
              styles.summaryIconWrapper,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Icon name="sparkles-outline" size={24} color={colors.primary} />
          </View>
          <View style={styles.summaryCopy}>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>
              Groups Summary
            </Text>
            {/* <Text
              style={[styles.summarySubtitle, { color: colors.textSecondary }]}
            >
              Create groups and send polished EmailJS invites without leaving
              the app.
            </Text> */}
          </View>
        </View>
        <View
          style={[
            styles.summaryDivider,
            { backgroundColor: colors.cardBorder },
          ]}
        />
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Icon
              name="people-outline"
              size={18}
              color={colors.primaryDark}
            />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {groups.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Active groups
            </Text>
          </View>
          <View style={[styles.statCard, styles.statCardLast]}>
            <Icon name="mail-outline" size={18} color={colors.accent} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {inviteEmails.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Pending invites
            </Text>
          </View>
        </View>
      </View>

      {groups.length > 0 && (
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Active groups
        </Text>
      )}
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <View
        style={[
          styles.emptyIconWrapper,
          { backgroundColor: colors.primary + "20" },
        ]}
      >
        <Icon name="people-outline" size={28} color={colors.primary} />
      </View>
      <Text style={[styles.emptyText, { color: colors.text }]}>
        Start your first group
      </Text>
      <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
        Create a group and we'll email your friends an invite automatically via
        EmailJS.
      </Text>
      <TouchableOpacity
        style={[
          styles.emptyButton,
          { backgroundColor: colors.primary },
        ]}
        onPress={() => setCreateModalVisible(true)}
        activeOpacity={0.85}
      >
        <Icon name="add" size={18} color="#FFFFFF" />
        <Text style={styles.emptyButtonText}>Create a group</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={groups}
        keyExtractor={(item) => item.group_id.toString()}
        renderItem={({ item }) => (
          <GroupItem
            group={item}
            onPress={() => navigation.navigate("GroupDetail", { groupId: item.group_id })}
            onInvite={() => {
              setSelectedGroup(item);
              setInviteModalVisible(true);
            }}
          />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={<View style={{ height: 120 }} />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={[
          styles.listContent,
          groups.length === 0 && styles.emptyListContent,
        ]}
      />

      <InviteModal
        visible={inviteModalVisible}
        onClose={() => {
          setInviteModalVisible(false);
          setSelectedGroup(null);
        }}
        groupId={selectedGroup?.group_id}
        groupName={selectedGroup?.name}
      />

      <Modal
        visible={createModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setCreateModalVisible(false);
          resetCreateForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Create a group
                </Text>
                <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                  Send friendly EmailJS invites immediately after saving.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setCreateModalVisible(false);
                  resetCreateForm();
                }}
              >
                <Icon name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalBody}
            >
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Group name *
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
                  placeholder="Roommates, Beach trip..."
                  placeholderTextColor={colors.textSecondary}
                  value={groupName}
                  onChangeText={setGroupName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Description (optional)
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.multilineInput,
                    {
                      backgroundColor: colors.background,
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  placeholder="Add a short note so members know what this group is for."
                  placeholderTextColor={colors.textSecondary}
                  value={groupDescription}
                  onChangeText={setGroupDescription}
                  multiline
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>
                    Invite members via email
                  </Text>
                  {inviteEmails.length > 0 && (
                    <Text style={[styles.helperText, { color: colors.textSecondary }]}>
                      {inviteEmails.length} added
                    </Text>
                  )}
                </View>
                <View
                  style={[
                    styles.inviteInputRow,
                    {
                      borderColor: colors.border,
                      backgroundColor: colors.background,
                    },
                  ]}
                >
                  <Icon name="mail-outline" size={18} color={colors.textSecondary} />
                  <TextInput
                    style={[styles.inviteInput, { color: colors.text }]}
                    placeholder="friend@example.com"
                    placeholderTextColor={colors.textSecondary}
                    value={inviteInput}
                    onChangeText={setInviteInput}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onSubmitEditing={handleAddInviteEmail}
                  />
                  <TouchableOpacity
                    style={[
                      styles.addEmailButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={handleAddInviteEmail}
                    activeOpacity={0.85}
                  >
                    <Icon name="add" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.helperText, { color: colors.textSecondary }]}>
                  Press + after each email to queue multiple invites.
                </Text>

                <View style={styles.chipContainer}>
                  {inviteEmails.map((email) => (
                    <View
                      key={email}
                      style={[
                        styles.emailChip,
                        { backgroundColor: colors.primary + "18" },
                      ]}
                    >
                      <Icon name="mail" size={14} color={colors.primary} />
                      <Text style={[styles.emailChipText, { color: colors.text }]}>
                        {email}
                      </Text>
                      <TouchableOpacity onPress={() => handleRemoveInviteEmail(email)}>
                        <Icon
                          name="close"
                          size={14}
                          color={colors.textSecondary}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[
                styles.modalPrimaryButton,
                { backgroundColor: colors.primary },
                creatingGroup && styles.disabledButton,
              ]}
              onPress={handleCreateGroup}
              disabled={creatingGroup}
              activeOpacity={0.85}
            >
              {creatingGroup ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Icon name="sparkles" size={18} color="#FFFFFF" />
                  <Text style={styles.modalPrimaryButtonText}>
                    Save & invite
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: colors.primary },
        ]}
        activeOpacity={0.8}
        onPress={() => {
          if (groups.length === 1) {
            navigation.navigate("AddExpense", { groupId: groups[0].group_id });
          } else {
            navigation.navigate("AddExpense", { groupId: null });
          }
        }}
      >
        <Icon name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginRight: 12,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    paddingHorizontal: 18,
    height: 44,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  summaryCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  summaryCopy: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  summarySubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  summaryDivider: {
    height: 1,
    marginBottom: 16,
    opacity: 0.6,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    marginRight: 12,
  },
  statCardLast: {
    marginRight: 0,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 6,
  },
  statLabel: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 40,
  },
  emptyIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 44,
    borderRadius: 22,
    marginTop: 20,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  modalSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  modalBody: {
    paddingBottom: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    marginTop: 6,
  },
  inviteInputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  inviteInput: {
    flex: 1,
    paddingHorizontal: 8,
    height: 44,
  },
  addEmailButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  emailChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginTop: 8,
  },
  emailChipText: {
    fontSize: 13,
    marginHorizontal: 6,
  },
  modalPrimaryButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 16,
  },
  modalPrimaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
});
