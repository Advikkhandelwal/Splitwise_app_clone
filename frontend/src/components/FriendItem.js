import React, { useContext, useRef } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "../contexts/ThemeContext";

export default function FriendItem({ friend, onPress }) {
  const { colors, shadows, borderRadius } = useContext(ThemeContext);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // To generate avatar Image  
  const initials = friend.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
            borderRadius: borderRadius.lg,
          },
          shadows.md,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* if user has image, it shows the image, else it shows user initials */}
        <View style={styles.leftSection}>
          {friend.avatar ? (
            <Image source={{ uri: friend.avatar }} style={styles.avatar} />
          ) : (
            <LinearGradient
              colors={[colors.primary + "30", colors.primary + "15"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.placeholder, { borderRadius: borderRadius.round }]}
            >
              <Text style={[styles.initials, { color: colors.primary }]}>
                {initials}
              </Text>
            </LinearGradient>
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
            <LinearGradient
              colors={
                friend.balance > 0
                  ? [colors.success + "30", colors.success + "15"]
                  : friend.balance < 0
                    ? [colors.error + "30", colors.error + "15"]
                    : [colors.textSecondary + "20", colors.textSecondary + "10"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.balanceContainer, { borderRadius: borderRadius.md }]}
            >
              <Text
                style={[
                  styles.balance,
                  {
                    color:
                      friend.balance > 0
                        ? colors.success
                        : friend.balance < 0
                          ? colors.error
                          : colors.textSecondary,
                  },
                ]}
              >
                {friend.balance > 0 ? "+" : ""}
                {friend.balance !== 0 ? `$${Math.abs(friend.balance).toFixed(2)}` : "Settled"}
              </Text>
            </LinearGradient>
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    overflow: "hidden",
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
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
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
    overflow: "hidden",
  },
  balance: {
    fontSize: 13,
    fontWeight: "600",
  },
});
