import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "../../contexts/ThemeContext";

export default function NotificationsScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [expenseReminders, setExpenseReminders] = useState(true);
  const [settlementAlerts, setSettlementAlerts] = useState(true);
  const [groupInvites, setGroupInvites] = useState(true);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Notifications
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            NOTIFICATION PREFERENCES
          </Text>

          <View
            style={[
              styles.settingCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Icon
                  name="notifications-outline"
                  size={22}
                  color={colors.primary}
                  style={styles.settingIcon}
                />
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Push Notifications
                  </Text>
                  <Text
                    style={[styles.settingSubtitle, { color: colors.textSecondary }]}
                  >
                    Receive push notifications on your device
                  </Text>
                </View>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={setPushNotifications}
                trackColor={{
                  false: colors.border,
                  true: colors.primary,
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <View
            style={[
              styles.settingCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Icon
                  name="mail-outline"
                  size={22}
                  color={colors.primary}
                  style={styles.settingIcon}
                />
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Email Notifications
                  </Text>
                  <Text
                    style={[styles.settingSubtitle, { color: colors.textSecondary }]}
                  >
                    Receive notifications via email
                  </Text>
                </View>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{
                  false: colors.border,
                  true: colors.primary,
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            NOTIFICATION TYPES
          </Text>

          <View
            style={[
              styles.settingCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Icon
                  name="receipt-outline"
                  size={22}
                  color={colors.primary}
                  style={styles.settingIcon}
                />
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Expense Reminders
                  </Text>
                  <Text
                    style={[styles.settingSubtitle, { color: colors.textSecondary }]}
                  >
                    Get reminded about pending expenses
                  </Text>
                </View>
              </View>
              <Switch
                value={expenseReminders}
                onValueChange={setExpenseReminders}
                trackColor={{
                  false: colors.border,
                  true: colors.primary,
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <View
            style={[
              styles.settingCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Icon
                  name="cash-outline"
                  size={22}
                  color={colors.primary}
                  style={styles.settingIcon}
                />
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Settlement Alerts
                  </Text>
                  <Text
                    style={[styles.settingSubtitle, { color: colors.textSecondary }]}
                  >
                    Notify when settlements are made
                  </Text>
                </View>
              </View>
              <Switch
                value={settlementAlerts}
                onValueChange={setSettlementAlerts}
                trackColor={{
                  false: colors.border,
                  true: colors.primary,
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <View
            style={[
              styles.settingCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Icon
                  name="people-outline"
                  size={22}
                  color={colors.primary}
                  style={styles.settingIcon}
                />
                <View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>
                    Group Invites
                  </Text>
                  <Text
                    style={[styles.settingSubtitle, { color: colors.textSecondary }]}
                  >
                    Notify when you're invited to groups
                  </Text>
                </View>
              </View>
              <Switch
                value={groupInvites}
                onValueChange={setGroupInvites}
                trackColor={{
                  false: colors.border,
                  true: colors.primary,
                }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>
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
    borderBottomColor: "#E5E5E5",
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  settingCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
  },
});

