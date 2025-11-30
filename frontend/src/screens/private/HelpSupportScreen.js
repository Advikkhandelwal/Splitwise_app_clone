import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Linking,
} from "react-native";
import Icon from "@expo/vector-icons/Ionicons";
import { ThemeContext } from "../../contexts/ThemeContext";

export default function HelpSupportScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);

  const helpItems = [
    {
      id: 1,
      icon: "help-circle-outline",
      title: "FAQs",
      subtitle: "Frequently asked questions",
      onPress: () => {
        alert("FAQs coming soon");
      },
    },
    {
      id: 2,
      icon: "mail-outline",
      title: "Contact Support",
      subtitle: "Get help from our support team",
      onPress: () => {
        Linking.openURL("mailto:support@splitly.com?subject=Support Request");
      },
    },
    {
      id: 3,
      icon: "chatbubbles-outline",
      title: "Live Chat",
      subtitle: "Chat with our support team",
      onPress: () => {
        alert("Live chat coming soon");
      },
    },
    {
      id: 4,
      icon: "document-text-outline",
      title: "User Guide",
      subtitle: "Learn how to use the app",
      onPress: () => {
        alert("User guide coming soon");
      },
    },
  ];

  const renderHelpItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.helpItem,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.helpIconContainer,
          { backgroundColor: colors.primary + "20" },
        ]}
      >
        <Icon name={item.icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.helpContent}>
        <Text style={[styles.helpTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.helpSubtitle, { color: colors.textSecondary }]}>
          {item.subtitle}
        </Text>
      </View>
      <Icon
        name="chevron-forward-outline"
        size={20}
        color={colors.textSecondary}
      />
    </TouchableOpacity>
  );

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
          Help & Support
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            GET HELP
          </Text>
          {helpItems.map(renderHelpItem)}
        </View>

        <View style={styles.contactCard}>
          <Icon name="mail" size={32} color={colors.primary} />
          <Text style={[styles.contactTitle, { color: colors.text }]}>
            Need More Help?
          </Text>
          <Text style={[styles.contactText, { color: colors.textSecondary }]}>
            Send us an email and we'll get back to you as soon as possible.
          </Text>
          <TouchableOpacity
            style={[styles.contactButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              Linking.openURL("mailto:support@splitly.com?subject=Support Request");
            }}
          >
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
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
  helpItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  helpIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  helpContent: {
    flex: 1,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  helpSubtitle: {
    fontSize: 13,
  },
  contactCard: {
    alignItems: "center",
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#F0F9FF",
    marginTop: 20,
  },
  contactTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  contactButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  contactButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

