import React, { useState, useEffect, useContext, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";
import {
    fetchGroupById,
    fetchExpensesByGroup,
    createSettlement,
} from "../../services";
import InviteModal from "../../components/InviteModal";

export default function GroupDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { groupId } = route.params;
    const { colors, shadows, borderRadius } = useContext(ThemeContext);
    const { user } = useContext(AuthContext);

    const [group, setGroup] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [inviteModalVisible, setInviteModalVisible] = useState(false);
    const [balances, setBalances] = useState({});

    const loadGroupData = async (showRefreshing = false) => {
        try {
            if (showRefreshing) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const [groupData, expensesData] = await Promise.all([
                fetchGroupById(groupId),
                fetchExpensesByGroup(groupId),
            ]);

            setGroup(groupData);
            setExpenses(expensesData || []);
            calculateBalances(groupData, expensesData || []);
        } catch (error) {
            console.error("Error loading group data:", error);
            Alert.alert("Error", "Failed to load group details");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadGroupData();
    }, [groupId]);

    // Reload data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadGroupData(true);
        }, [groupId])
    );

    const calculateBalances = (groupData, expensesData) => {
        const memberBalances = {};

        // Initialize balances for all members
        groupData.members?.forEach((member) => {
            memberBalances[member.user_id] = 0;
        });

        // Calculate balances from expenses
        expensesData.forEach((expense) => {
            // Person who paid gets positive balance
            if (memberBalances[expense.paid_by] !== undefined) {
                memberBalances[expense.paid_by] += parseFloat(expense.amount);
            }

            // Each person in the split gets negative balance
            expense.splits?.forEach((split) => {
                if (memberBalances[split.user_id] !== undefined) {
                    memberBalances[split.user_id] -= parseFloat(split.share);
                }
            });
        });

        setBalances(memberBalances);
    };

    const getMemberName = (userId) => {
        const member = group?.members?.find((m) => m.user_id === userId);
        return member?.name || "Unknown";
    };

    const handleSettleUp = async (fromUserId, toUserId, amount) => {
        try {
            await createSettlement({
                group_id: groupId,
                paid_by: fromUserId,
                paid_to: toUserId,
                amount: Math.abs(amount),
            });

            Alert.alert("Success", "Settlement recorded successfully!", [
                {
                    text: "OK",
                    onPress: () => loadGroupData(true),
                },
            ]);
        } catch (error) {
            console.error("Error creating settlement:", error);
            Alert.alert("Error", "Failed to record settlement");
        }
    };

    const onRefresh = () => {
        loadGroupData(true);
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    if (!group) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: colors.text }]}>
                        Group not found
                    </Text>
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: colors.primary }]}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={styles.backButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const memberCount = group.members?.length || 0;
    const expenseCount = expenses.length;
    const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]} numberOfLines={1}>
                    {group.name}
                </Text>
                <TouchableOpacity onPress={() => setInviteModalVisible(true)}>
                    <Icon name="person-add-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
            >
                {/* Group Info Card */}
                <View style={styles.content}>
                    <LinearGradient
                        colors={[colors.primary + "20", colors.primary + "05"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                            styles.infoCard,
                            { borderRadius: borderRadius.lg, borderColor: colors.cardBorder },
                        ]}
                    >
                        {group.description && (
                            <Text style={[styles.description, { color: colors.textSecondary }]}>
                                {group.description}
                            </Text>
                        )}
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Icon name="people" size={20} color={colors.primary} />
                                <Text style={[styles.statValue, { color: colors.text }]}>
                                    {memberCount}
                                </Text>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                                    Members
                                </Text>
                            </View>
                            <View style={styles.statItem}>
                                <Icon name="receipt" size={20} color={colors.accent} />
                                <Text style={[styles.statValue, { color: colors.text }]}>
                                    {expenseCount}
                                </Text>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                                    Expenses
                                </Text>
                            </View>
                            <View style={styles.statItem}>
                                <Icon name="cash" size={20} color={colors.success} />
                                <Text style={[styles.statValue, { color: colors.text }]}>
                                    ${totalSpent.toFixed(2)}
                                </Text>
                                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                                    Total
                                </Text>
                            </View>
                        </View>
                    </LinearGradient>

                    {/* Quick Actions */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.cardBorder,
                                    borderRadius: borderRadius.md,
                                },
                                shadows.sm,
                            ]}
                            onPress={() => navigation.navigate("AddExpense", { groupId })}
                        >
                            <Icon name="add-circle" size={24} color={colors.primary} />
                            <Text style={[styles.actionButtonText, { color: colors.text }]}>
                                Add Expense
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.cardBorder,
                                    borderRadius: borderRadius.md,
                                },
                                shadows.sm,
                            ]}
                            onPress={() => setInviteModalVisible(true)}
                        >
                            <Icon name="person-add" size={24} color={colors.accent} />
                            <Text style={[styles.actionButtonText, { color: colors.text }]}>
                                Add Member
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Members Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Members ({memberCount})
                        </Text>
                        <View
                            style={[
                                styles.membersCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.cardBorder,
                                    borderRadius: borderRadius.lg,
                                },
                                shadows.sm,
                            ]}
                        >
                            {group.members?.map((member, index) => (
                                <View
                                    key={member.user_id}
                                    style={[
                                        styles.memberRow,
                                        index !== group.members.length - 1 && {
                                            borderBottomWidth: 1,
                                            borderBottomColor: colors.border,
                                        },
                                    ]}
                                >
                                    <View style={styles.memberInfo}>
                                        <View
                                            style={[
                                                styles.memberAvatar,
                                                { backgroundColor: colors.primary + "20" },
                                            ]}
                                        >
                                            <Icon name="person" size={20} color={colors.primary} />
                                        </View>
                                        <Text style={[styles.memberName, { color: colors.text }]}>
                                            {member.name}
                                        </Text>
                                    </View>
                                    <View style={styles.balanceContainer}>
                                        {balances[member.user_id] !== undefined && (
                                            <Text
                                                style={[
                                                    styles.balanceText,
                                                    {
                                                        color:
                                                            balances[member.user_id] > 0
                                                                ? colors.success
                                                                : balances[member.user_id] < 0
                                                                    ? colors.accent
                                                                    : colors.textSecondary,
                                                    },
                                                ]}
                                            >
                                                {balances[member.user_id] > 0 ? "+" : ""}$
                                                {Math.abs(balances[member.user_id]).toFixed(2)}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Balances Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Balances
                        </Text>
                        <View
                            style={[
                                styles.balancesCard,
                                {
                                    backgroundColor: colors.card,
                                    borderColor: colors.cardBorder,
                                    borderRadius: borderRadius.lg,
                                },
                                shadows.sm,
                            ]}
                        >
                            {Object.entries(balances).map(([userId, balance], index) => {
                                if (Math.abs(balance) < 0.01) return null; // Skip settled balances

                                const userName = getMemberName(parseInt(userId));
                                const isPositive = balance > 0;

                                return (
                                    <View
                                        key={userId}
                                        style={[
                                            styles.balanceRow,
                                            index !== Object.entries(balances).length - 1 && {
                                                borderBottomWidth: 1,
                                                borderBottomColor: colors.border,
                                            },
                                        ]}
                                    >
                                        <View style={styles.balanceInfo}>
                                            <Text style={[styles.balanceName, { color: colors.text }]}>
                                                {userName}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.balanceStatus,
                                                    { color: colors.textSecondary },
                                                ]}
                                            >
                                                {isPositive ? "is owed" : "owes"}
                                            </Text>
                                        </View>
                                        <View style={styles.balanceRight}>
                                            <Text
                                                style={[
                                                    styles.balanceAmount,
                                                    { color: isPositive ? colors.success : colors.accent },
                                                ]}
                                            >
                                                ${Math.abs(balance).toFixed(2)}
                                            </Text>
                                            {!isPositive && (
                                                <TouchableOpacity
                                                    style={[
                                                        styles.settleButton,
                                                        { backgroundColor: colors.primary },
                                                    ]}
                                                    onPress={() => {
                                                        // Find who to pay (simplified - in real app, you'd need more logic)
                                                        const owedMember = Object.entries(balances).find(
                                                            ([id, bal]) => bal > 0
                                                        );
                                                        if (owedMember) {
                                                            Alert.alert(
                                                                "Settle Up",
                                                                `Settle $${Math.abs(balance).toFixed(2)} with ${getMemberName(
                                                                    parseInt(owedMember[0])
                                                                )}?`,
                                                                [
                                                                    { text: "Cancel", style: "cancel" },
                                                                    {
                                                                        text: "Settle",
                                                                        onPress: () =>
                                                                            handleSettleUp(
                                                                                parseInt(userId),
                                                                                parseInt(owedMember[0]),
                                                                                balance
                                                                            ),
                                                                    },
                                                                ]
                                                            );
                                                        }
                                                    }}
                                                >
                                                    <Text style={styles.settleButtonText}>Settle</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    </View>
                                );
                            })}
                            {Object.values(balances).every((bal) => Math.abs(bal) < 0.01) && (
                                <View style={styles.emptyBalances}>
                                    <Icon
                                        name="checkmark-circle"
                                        size={48}
                                        color={colors.success}
                                    />
                                    <Text style={[styles.emptyBalancesText, { color: colors.success }]}>
                                        All settled up!
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Expenses Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>
                            Recent Expenses ({expenseCount})
                        </Text>
                        {expenses.length === 0 ? (
                            <View
                                style={[
                                    styles.emptyCard,
                                    {
                                        backgroundColor: colors.card,
                                        borderColor: colors.cardBorder,
                                        borderRadius: borderRadius.lg,
                                    },
                                ]}
                            >
                                <Icon name="receipt-outline" size={48} color={colors.textSecondary} />
                                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                                    No expenses yet
                                </Text>
                                <TouchableOpacity
                                    style={[
                                        styles.emptyButton,
                                        { backgroundColor: colors.primary, borderRadius: borderRadius.md },
                                    ]}
                                    onPress={() => navigation.navigate("AddExpense", { groupId })}
                                >
                                    <Text style={styles.emptyButtonText}>Add First Expense</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View
                                style={[
                                    styles.expensesCard,
                                    {
                                        backgroundColor: colors.card,
                                        borderColor: colors.cardBorder,
                                        borderRadius: borderRadius.lg,
                                    },
                                    shadows.sm,
                                ]}
                            >
                                {expenses.slice(0, 10).map((expense, index) => (
                                    <View
                                        key={expense.expense_id}
                                        style={[
                                            styles.expenseRow,
                                            index !== Math.min(expenses.length, 10) - 1 && {
                                                borderBottomWidth: 1,
                                                borderBottomColor: colors.border,
                                            },
                                        ]}
                                    >
                                        <View style={styles.expenseLeft}>
                                            <View
                                                style={[
                                                    styles.expenseIcon,
                                                    { backgroundColor: colors.accent + "20" },
                                                ]}
                                            >
                                                <Icon name="receipt" size={16} color={colors.accent} />
                                            </View>
                                            <View style={styles.expenseInfo}>
                                                <Text style={[styles.expenseDescription, { color: colors.text }]}>
                                                    {expense.description}
                                                </Text>
                                                <Text
                                                    style={[styles.expensePaidBy, { color: colors.textSecondary }]}
                                                >
                                                    Paid by {getMemberName(expense.paid_by)}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={[styles.expenseAmount, { color: colors.text }]}>
                                            ${parseFloat(expense.amount).toFixed(2)}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* Floating Action Button */}
            <TouchableOpacity
                style={[
                    styles.fab,
                    { backgroundColor: colors.primary },
                    shadows.lg,
                ]}
                onPress={() => navigation.navigate("AddExpense", { groupId })}
            >
                <Icon name="add" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Invite Modal */}
            <InviteModal
                visible={inviteModalVisible}
                onClose={() => {
                    setInviteModalVisible(false);
                    loadGroupData(true); // Refresh after potential new member
                }}
                groupId={groupId}
                groupName={group.name}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 20,
    },
    backButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    backButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "600",
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
        flex: 1,
        marginHorizontal: 16,
        textAlign: "center",
    },
    content: {
        padding: 20,
    },
    infoCard: {
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
    },
    description: {
        fontSize: 14,
        marginBottom: 16,
        lineHeight: 20,
    },
    statsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    statItem: {
        alignItems: "center",
    },
    statValue: {
        fontSize: 20,
        fontWeight: "700",
        marginTop: 8,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
    },
    actionsContainer: {
        flexDirection: "row",
        marginBottom: 24,
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        borderWidth: 1,
        gap: 8,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: "600",
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 12,
    },
    membersCard: {
        borderWidth: 1,
        overflow: "hidden",
    },
    memberRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
    },
    memberInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    memberAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    memberName: {
        fontSize: 16,
        fontWeight: "600",
    },
    balanceContainer: {
        alignItems: "flex-end",
    },
    balanceText: {
        fontSize: 14,
        fontWeight: "600",
    },
    balancesCard: {
        borderWidth: 1,
        overflow: "hidden",
    },
    balanceRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
    },
    balanceInfo: {
        flex: 1,
    },
    balanceName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 2,
    },
    balanceStatus: {
        fontSize: 12,
    },
    balanceRight: {
        alignItems: "flex-end",
        gap: 8,
    },
    balanceAmount: {
        fontSize: 18,
        fontWeight: "700",
    },
    settleButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
    },
    settleButtonText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "600",
    },
    emptyBalances: {
        alignItems: "center",
        padding: 32,
    },
    emptyBalancesText: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 12,
    },
    expensesCard: {
        borderWidth: 1,
        overflow: "hidden",
    },
    expenseRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
    },
    expenseLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    expenseIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    expenseInfo: {
        flex: 1,
    },
    expenseDescription: {
        fontSize: 15,
        fontWeight: "600",
        marginBottom: 2,
    },
    expensePaidBy: {
        fontSize: 12,
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: "700",
    },
    emptyCard: {
        borderWidth: 1,
        padding: 40,
        alignItems: "center",
    },
    emptyText: {
        fontSize: 16,
        marginTop: 12,
        marginBottom: 20,
    },
    emptyButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    emptyButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
    },
    fab: {
        position: "absolute",
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
    },
});
