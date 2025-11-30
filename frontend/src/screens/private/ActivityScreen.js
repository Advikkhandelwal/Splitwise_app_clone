import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";
import { fetchUserActivity } from "../../services";

export default function ActivityScreen() {
  const { colors, shadows, borderRadius, typography } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all, expenses, settlements

  const loadActivities = useCallback(async () => {
    if (!user?.user_id) return;
    setLoading(true);
    setError("");
    try {
      const data = await fetchUserActivity(user.user_id);
      setActivities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load activity:", err);
      setError(err.message || "Failed to load activity");
    } finally {
      setLoading(false);
    }
  }, [user?.user_id]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  useEffect(() => {
    if (!user?.user_id) {
      setActivities([]);
    }
  }, [user?.user_id]);

  const filteredActivities = activities.filter((activity) => {
    if (filter === "all") return true;
    return activity.type === filter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const renderActivity = ({ item }) => {
    const isCredit = item.flow === "in";
    const amount = Number(item.amount) || 0;

    return (
      <View
        style={[
          styles.activityCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
          },
          shadows.md,
        ]}
      >
        <LinearGradient
          colors={[
            item.type === "expense" ? colors.primary + "15" : colors.success + "15",
            item.type === "expense" ? colors.primary + "05" : colors.success + "05",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.iconContainer,
            { borderRadius: borderRadius.md },
          ]}
        >
          <Icon
            name={
              item.type === "expense"
                ? "receipt-outline"
                : isCredit
                  ? "cash-outline"
                  : "swap-horizontal-outline"
            }
            size={24}
            color={item.type === "expense" ? colors.primary : colors.success}
          />
        </LinearGradient>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.group}
            {item.details ? ` • ${item.details}` : ""}
          </Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {formatDate(item.date)}
          </Text>
        </View>
        <View style={styles.amountContainer}>
          <Text
            style={[
              styles.amount,
              {
                color: isCredit ? colors.success : colors.text,
              },
            ]}
          >
            {isCredit ? "+" : "-"}${amount.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Activity
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Recent transactions
          </Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === "all" && {
              backgroundColor: colors.primary,
            },
            filter !== "all" && {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
              borderWidth: 1,
            },
          ]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              {
                color: filter === "all" ? "#FFFFFF" : colors.text,
              },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { marginLeft: 8 },
            filter === "expenses" && {
              backgroundColor: colors.primary,
            },
            filter !== "expenses" && {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
              borderWidth: 1,
            },
          ]}
          onPress={() => setFilter("expenses")}
        >
          <Text
            style={[
              styles.filterText,
              {
                color: filter === "expenses" ? "#FFFFFF" : colors.text,
              },
            ]}
          >
            Expenses
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            { marginLeft: 8 },
            filter === "settlements" && {
              backgroundColor: colors.primary,
            },
            filter !== "settlements" && {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
              borderWidth: 1,
            },
          ]}
          onPress={() => setFilter("settlements")}
        >
          <Text
            style={[
              styles.filterText,
              {
                color: filter === "settlements" ? "#FFFFFF" : colors.text,
              },
            ]}
          >
            Settlements
          </Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.emptyContainer}>
          <Icon name="warning-outline" size={48} color={colors.primary} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            Could not load activity
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            {error}
          </Text>
          <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={loadActivities}>
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : filteredActivities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="document-text-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyText, { color: colors.text }]}>
            No activity yet
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Your expenses and settlements will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredActivities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderActivity}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={loadActivities}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
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
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  iconContainer: {
    width: 52,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
    overflow: "hidden",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
