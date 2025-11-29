import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { ThemeContext } from "../contexts/ThemeContext";

export default function FriendItem({ friend, onPress }) {
  const { colors } = useContext(ThemeContext);
// To generate avatar Image  
  const initials = friend.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

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
// if user has image, it shows the image, else it shows user initials        
      <View style={styles.leftSection}>
        {friend.avatar ? (
          <Image source={{ uri: friend.avatar }} style={styles.avatar} />
        ) : (
          <View
            style={[
              styles.placeholder,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Text style={[styles.initials, { color: colors.primary }]}>
              {initials}
            </Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>
            {friend.name || "Unknown"}
          </Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>
            {friend.email || friend.phone || "No contact info"}
          </Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        {friend.balance !== undefined && (
          <View
            style={[
              styles.balanceContainer,
              {
                backgroundColor:
                  friend.balance > 0
                    ? colors.success + "20"
                    : friend.balance < 0
                    ? colors.accent + "20"
                    : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.balance,
                {
                  color:
                    friend.balance > 0
                      ? colors.success
                      : friend.balance < 0
                      ? colors.accent
                      : colors.textSecondary,
                },
              ]}
            >
              {friend.balance > 0 ? "+" : ""}
              {friend.balance !== 0 ? `${Math.abs(friend.balance).toFixed(2)}` : "Settled"}
            </Text>
          </View>
        )}
        <View style={{ marginLeft: 8 }}>
          <Icon
            name="chevron-forward-outline"
            size={20}
            color={colors.textSecondary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  placeholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    fontSize: 18,
    fontWeight: "600",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  email: {
    fontSize: 13,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  balance: {
    fontSize: 13,
    fontWeight: "600",
  },
});
