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

export default function AboutScreen({ navigation }) {
  const { colors } = useContext(ThemeContext);

  const aboutItems = [
    {
      id: 1,
      icon: "document-text-outline",
      title: "Terms of Service",
      onPress: () => {
        alert("Terms of Service coming soon");
      },
    },
    {
      id: 2,
      icon: "shield-checkmark-outline",
      title: "Privacy Policy",
      onPress: () => {
        alert("Privacy Policy coming soon");
      },
    },
    {
      id: 3,
      icon: "code-outline",
      title: "Open Source Licenses",
      onPress: () => {
        alert("Open source licenses coming soon");
      },
    },
  ];

  const renderAboutItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.aboutItem,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <Icon name={item.icon} size={22} color={colors.primary} style={styles.aboutIcon} />
      <Text style={[styles.aboutTitle, { color: colors.text }]}>
        {item.title}
      </Text>
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>About</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <View style={[styles.logo, { backgroundColor: colors.primary + "20" }]}>
            <Icon name="wallet" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>Splitly</Text>
          <Text style={[styles.appVersion, { color: colors.textSecondary }]}>
            Version 1.0.0
          </Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={[styles.description, { color: colors.text }]}>
            Splitly helps you split expenses and manage shared costs with friends
            and groups. Keep track of who owes what and settle up easily.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            LEGAL
          </Text>
          {aboutItems.map(renderAboutItem)}
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            © 2024 Splitly. All rights reserved.
          </Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity
              onPress={() => {
                // Add social media links if needed
                alert("Social media links coming soon");
              }}
            >
              <Icon name="logo-twitter" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                alert("Social media links coming soon");
              }}
            >
              <Icon name="logo-facebook" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                alert("Social media links coming soon");
              }}
            >
              <Icon name="logo-instagram" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
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
  logoContainer: {
    alignItems: "center",
    marginVertical: 32,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
  },
  descriptionContainer: {
    marginBottom: 32,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
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
  aboutItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  aboutIcon: {
    marginRight: 12,
  },
  aboutTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  footerText: {
    fontSize: 12,
    marginBottom: 16,
  },
  socialLinks: {
    flexDirection: "row",
    gap: 16,
  },
});

