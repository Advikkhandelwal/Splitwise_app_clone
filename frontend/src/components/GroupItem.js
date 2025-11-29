import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { ThemeContext } from "../contexts/ThemeContext";

export default function GroupItem({ group, onPress, onInvite }) {
  const { colors } = useContext(ThemeContext);
  const memberCount = group.members?.length || 0;
  const expenseCount = group.expenseCount || 0;

  const handleInvitePress = (e) => {
    e.stopPropagation();
    if (onInvite) {
      onInvite();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.primary + "20" }]}>
        <Icon name="people" size={24} color={colors.primary} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
          {group.name}
        </Text>
        {group.description && (
          <Text
            style={[styles.description, { color: colors.textSecondary }]}
            numberOfLines={2}
          >
            {group.description}
          </Text>
        )}
        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Icon
              name="people-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={[styles.metaText, { color: colors.textSecondary, marginLeft: 4 }]}>
              {memberCount} {memberCount === 1 ? "member" : "members"}
            </Text>
          </View>
          {expenseCount > 0 && (
            <View style={styles.metaItem}>
              <Icon
                name="receipt-outline"
                size={14}
                color={colors.textSecondary}
              />
              <Text style={[styles.metaText, { color: colors.textSecondary, marginLeft: 4 }]}>
                {expenseCount} {expenseCount === 1 ? "expense" : "expenses"}
              </Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.actions}>
        {onInvite && (
          <TouchableOpacity
            onPress={handleInvitePress}
            style={[styles.inviteButton, { backgroundColor: colors.primary + "20" }]}
          >
            <Icon name="mail-outline" size={18} color={colors.primary} />
          </TouchableOpacity>
        )}
        <Icon
          name="chevron-forward-outline"
          size={20}
          color={colors.textSecondary}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
  },
  meta: {
    flexDirection: "row",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inviteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
