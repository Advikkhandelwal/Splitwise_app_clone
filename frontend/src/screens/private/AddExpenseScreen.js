import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Button } from "react-native-paper";
import Icon from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "../../contexts/ThemeContext";
import { createExpense, fetchGroupById, fetchUsers } from "../../services";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function AddExpenseScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useContext(ThemeContext);
  const { groupId } = route.params || {};

  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(null);
  const [splitMethod, setSplitMethod] = useState("equal"); // "equal" or "custom"
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [customAmounts, setCustomAmounts] = useState({});
  const [users, setUsers] = useState([]);
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (groupId) {
        const groupData = await fetchGroupById(groupId);
        setGroup(groupData);
        setMembers(groupData.members || []);
        // Set all members as selected by default
        const memberIds = groupData.members.map((m) => m.user_id);
        setSelectedUsers(memberIds);
        if (memberIds.length > 0) {
          setPaidBy(memberIds[0]);
        }
      } else {
        const allUsers = await fetchUsers();
        setUsers(allUsers);
        // Set all users as selected by default
        const userIds = allUsers.map((u) => u.user_id);
        setSelectedUsers(userIds);
        if (userIds.length > 0) {
          setPaidBy(userIds[0]);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert("Error", "Failed to load data");
    }
  };

  const availableUsers = groupId ? members : users;

  const toggleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      if (selectedUsers.length === 1) {
        Alert.alert("Error", "At least one person must be selected");
        return;
      }
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
      // Remove custom amount if user is deselected
      const newCustomAmounts = { ...customAmounts };
      delete newCustomAmounts[userId];
      setCustomAmounts(newCustomAmounts);
    } else {
      setSelectedUsers([...selectedUsers, userId]);
      if (splitMethod === "equal") {
        calculateEqualSplit();
      }
    }
  };

  const calculateEqualSplit = () => {
    if (!amount || selectedUsers.length === 0) return;
    const total = parseFloat(amount);
    const share = total / selectedUsers.length;
    const newCustomAmounts = {};
    selectedUsers.forEach((userId) => {
      newCustomAmounts[userId] = share.toFixed(2);
    });
    setCustomAmounts(newCustomAmounts);
  };

  useEffect(() => {
    if (splitMethod === "equal" && amount && selectedUsers.length > 0) {
      calculateEqualSplit();
    }
  }, [amount, selectedUsers.length, splitMethod]);

  const updateCustomAmount = (userId, value) => {
    setCustomAmounts({
      ...customAmounts,
      [userId]: value,
    });
  };

  const getTotalCustomAmount = () => {
    return Object.values(customAmounts).reduce(
      (sum, val) => sum + parseFloat(val || 0),
      0
    );
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    if (!paidBy) {
      Alert.alert("Error", "Please select who paid");
      return;
    }
    if (selectedUsers.length === 0) {
      Alert.alert("Error", "Please select at least one person to split with");
      return;
    }

    if (splitMethod === "custom") {
      const total = getTotalCustomAmount();
      const expenseAmount = parseFloat(amount);
      if (Math.abs(total - expenseAmount) > 0.01) {
        Alert.alert(
          "Error",
          `Custom amounts must equal the total amount ($${expenseAmount.toFixed(2)})`
        );
        return;
      }
    }

    setLoading(true);
    try {
      const splits = selectedUsers.map((userId) => ({
        user_id: userId,
        share:
          splitMethod === "equal"
            ? parseFloat(amount) / selectedUsers.length
            : parseFloat(customAmounts[userId] || 0),
      }));

      const expenseData = {
        group_id: groupId || null,
        paid_by: paidBy,
        amount: parseFloat(amount),
        description: description.trim(),
        splits: splits,
      };

      await createExpense(expenseData);
      Alert.alert("Success", "Expense added successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error("Error creating expense:", error);
      Alert.alert("Error", error.message || "Failed to create expense");
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userId) => {
    const user = availableUsers.find((u) => u.user_id === userId);
    return user?.name || "Unknown";
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Add Expense
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.label, { color: colors.text }]}>Description</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.surface || colors.background,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="What was this expense for?"
            placeholderTextColor={colors.placeholder}
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.label, { color: colors.text }]}>Amount</Text>
          <View style={styles.amountContainer}>
            <Text style={[styles.currency, { color: colors.textSecondary }]}>$</Text>
            <TextInput
              style={[
                styles.amountInput,
                {
                  color: colors.text,
                },
              ]}
              placeholder="0.00"
              placeholderTextColor={colors.placeholder}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.label, { color: colors.text }]}>Paid by</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.userScroll}>
            {availableUsers.map((user) => (
              <TouchableOpacity
                key={user.user_id}
                style={[
                  styles.userChip,
                  paidBy === user.user_id && {
                    backgroundColor: colors.primary,
                  },
                  paidBy !== user.user_id && {
                    backgroundColor: colors.surface || colors.background,
                    borderColor: colors.border,
                    borderWidth: 1,
                  },
                ]}
                onPress={() => setPaidBy(user.user_id)}
              >
                <Text
                  style={[
                    styles.userChipText,
                    {
                      color: paidBy === user.user_id ? "#FFFFFF" : colors.text,
                    },
                  ]}
                >
                  {user.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.label, { color: colors.text }]}>Split method</Text>
          <View style={styles.splitMethodContainer}>
            <TouchableOpacity
              style={[
                styles.splitMethodButton,
                splitMethod === "equal" && {
                  backgroundColor: colors.primary,
                },
                splitMethod !== "equal" && {
                  backgroundColor: colors.surface || colors.background,
                  borderColor: colors.border,
                  borderWidth: 1,
                },
              ]}
              onPress={() => setSplitMethod("equal")}
            >
              <Text
                style={[
                  styles.splitMethodText,
                  {
                    color: splitMethod === "equal" ? "#FFFFFF" : colors.text,
                  },
                ]}
              >
                Equal
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.splitMethodButton,
                { marginLeft: 12 },
                splitMethod === "custom" && {
                  backgroundColor: colors.primary,
                },
                splitMethod !== "custom" && {
                  backgroundColor: colors.surface || colors.background,
                  borderColor: colors.border,
                  borderWidth: 1,
                },
              ]}
              onPress={() => setSplitMethod("custom")}
            >
              <Text
                style={[
                  styles.splitMethodText,
                  {
                    color: splitMethod === "custom" ? "#FFFFFF" : colors.text,
                  },
                ]}
              >
                Custom
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <Text style={[styles.label, { color: colors.text }]}>
            Split between ({selectedUsers.length} {selectedUsers.length === 1 ? "person" : "people"})
          </Text>
          {availableUsers.map((user) => {
            const isSelected = selectedUsers.includes(user.user_id);
            const share =
              splitMethod === "equal"
                ? amount && selectedUsers.length > 0
                  ? (parseFloat(amount) / selectedUsers.length).toFixed(2)
                  : "0.00"
                : customAmounts[user.user_id] || "0.00";

            return (
              <TouchableOpacity
                key={user.user_id}
                style={[
                  styles.splitRow,
                  {
                    backgroundColor: isSelected
                      ? colors.primary + "10"
                      : colors.surface || colors.background,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => toggleUserSelection(user.user_id)}
              >
                <View style={styles.splitRowLeft}>
                  <View
                    style={[
                      styles.checkbox,
                      {
                        backgroundColor: isSelected ? colors.primary : "transparent",
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    {isSelected && (
                      <Icon name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={[styles.splitUserName, { color: colors.text }]}>
                    {user.name}
                  </Text>
                </View>
                {isSelected && (
                  <View style={styles.splitAmountContainer}>
                    {splitMethod === "custom" ? (
                      <TextInput
                        style={[
                          styles.customAmountInput,
                          {
                            color: colors.text,
                            borderColor: colors.border,
                          },
                        ]}
                        value={customAmounts[user.user_id] || ""}
                        onChangeText={(value) => updateCustomAmount(user.user_id, value)}
                        keyboardType="decimal-pad"
                        placeholder="0.00"
                        placeholderTextColor={colors.placeholder}
                      />
                    ) : (
                      <Text style={[styles.splitAmount, { color: colors.primary }]}>
                        ${share}
                      </Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {splitMethod === "custom" && (
          <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
                Total split:
              </Text>
              <Text
                style={[
                  styles.summaryAmount,
                  {
                    color:
                      Math.abs(getTotalCustomAmount() - parseFloat(amount || 0)) < 0.01
                        ? colors.success
                        : colors.accent,
                  },
                ]}
              >
                ${getTotalCustomAmount().toFixed(2)} / ${parseFloat(amount || 0).toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        <Button
          mode="contained"
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          contentStyle={styles.submitButtonContent}
          labelStyle={styles.submitButtonLabel}
        >
          Add Expense
        </Button>
      </ScrollView>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currency: {
    fontSize: 24,
    fontWeight: "700",
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: "700",
  },
  userScroll: {
    marginTop: 8,
  },
  userChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  userChipText: {
    fontSize: 14,
    fontWeight: "600",
  },
  splitMethodContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  splitMethodButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  splitMethodText: {
    fontSize: 14,
    fontWeight: "600",
  },
  splitRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
  },
  splitRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  splitUserName: {
    fontSize: 16,
    fontWeight: "500",
  },
  splitAmountContainer: {
    minWidth: 80,
  },
  customAmountInput: {
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    textAlign: "right",
    borderWidth: 1,
  },
  splitAmount: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "right",
  },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: "700",
  },
  submitButton: {
    borderRadius: 12,
    marginTop: 8,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});

