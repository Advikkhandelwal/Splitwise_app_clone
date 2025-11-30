import { StyleSheet, Text, View, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useContext, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { loginUser } from "../../services";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setToken } = useContext(AuthContext);
  const { colors, spacing, typography, shadows, borderRadius } = useContext(ThemeContext);
  const [login, setLogin] = useState({
    username: "",
    password: "",
    loading: false,
    showPassword: false,
    error: "",
  });

  const onLogin = async () => {
    try {
      setLogin({ ...login, loading: true, error: "" });
      const res = await loginUser(login.username, login.password);

      // Save token and user info
      await setToken(res.token, res.user);

      setLogin({ ...login, loading: false });
    } catch (error) {
      console.log(error);
      setLogin({
        ...login,
        loading: false,
        error: error.message || "Login failed. Please check your credentials."
      });
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.primaryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBackground}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.header}>
                <View style={[styles.iconContainer, shadows.lg]}>
                  <LinearGradient
                    colors={[colors.primaryLight, colors.primary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iconGradient}
                  >
                    <Icon name="wallet-outline" size={48} color="#FFFFFF" />
                  </LinearGradient>
                </View>
                <Text style={[styles.title, { ...typography.h1, color: "#FFFFFF" }]}>
                  Welcome Back
                </Text>
                <Text style={[styles.subtitle, { ...typography.body1, color: "rgba(255, 255, 255, 0.9)" }]}>
                  Sign in to manage your expenses
                </Text>
              </View>

              <View style={[styles.card, { borderRadius: borderRadius.xxl }, shadows.xl]}>
                <View style={styles.cardInner}>
                  <TextInput
                    label="Email"
                    mode="outlined"
                    style={styles.input}
                    value={login.username}
                    onChangeText={(val) =>
                      setLogin({
                        ...login,
                        username: val,
                      })
                    }
                    left={<TextInput.Icon icon="email-outline" />}
                    outlineColor={colors.inputBorder}
                    activeOutlineColor={colors.primary}
                    textColor={colors.text}
                    theme={{
                      colors: {
                        background: colors.inputBackground,
                      },
                    }}
                  />
                  <TextInput
                    label="Password"
                    mode="outlined"
                    secureTextEntry={!login.showPassword}
                    style={styles.input}
                    value={login.password}
                    onChangeText={(val) =>
                      setLogin({
                        ...login,
                        password: val,
                      })
                    }
                    left={<TextInput.Icon icon="lock-outline" />}
                    right={
                      <TextInput.Icon
                        icon={login.showPassword ? "eye-off-outline" : "eye-outline"}
                        onPress={() =>
                          setLogin({ ...login, showPassword: !login.showPassword })
                        }
                      />
                    }
                    outlineColor={colors.inputBorder}
                    activeOutlineColor={colors.primary}
                    textColor={colors.text}
                    theme={{
                      colors: {
                        background: colors.inputBackground,
                      },
                    }}
                  />

                  {login.error ? (
                    <Text style={[styles.errorText, { color: colors.error }]}>
                      {login.error}
                    </Text>
                  ) : null}

                  <LinearGradient
                    colors={colors.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.buttonGradient, { borderRadius: borderRadius.md }, shadows.md]}
                  >
                    <Button
                      loading={login.loading}
                      mode="text"
                      onPress={onLogin}
                      contentStyle={styles.buttonContent}
                      labelStyle={styles.buttonLabel}
                      textColor="#FFFFFF"
                    >
                      Sign In
                    </Button>
                  </LinearGradient>

                  <View style={styles.divider}>
                    <View style={[styles.dividerLine, { backgroundColor: colors.cardBorder }]} />
                    <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
                    <View style={[styles.dividerLine, { backgroundColor: colors.cardBorder }]} />
                  </View>

                  <Button
                    mode="text"
                    style={styles.signupButton}
                    labelStyle={[styles.signupButtonLabel, { color: colors.primary }]}
                    onPress={() => navigation.navigate("SignUpScreen")}
                  >
                    Don't have an account? Sign Up
                  </Button>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 24,
    overflow: "hidden",
  },
  iconGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 28,
    overflow: "hidden",
  },
  cardInner: {
    width: "100%",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  buttonGradient: {
    marginTop: 8,
    overflow: "hidden",
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
    marginBottom: -4,
    paddingHorizontal: 16,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  signupButton: {
    marginTop: 0,
  },
  signupButtonLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
});

