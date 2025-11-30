import { StyleSheet, Text, View, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useState, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { signupUser } from "../../services";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";
import Icon from "react-native-vector-icons/Ionicons";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const { colors, typography, shadows, borderRadius } = useContext(ThemeContext);
  const { setToken } = useContext(AuthContext);
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    loading: false,
    showPassword: false,
    error: "",
  });

  const onSignUp = async () => {
    try {
      setSignup({ ...signup, loading: true, error: "" });

      const res = await signupUser(
        signup.name,
        signup.email,
        signup.phone,
        signup.password
      );

      // If backend returns user info, save it
      // Otherwise, create user object from signup data
      const userInfo = res?.user || {
        user_id: res.user_id,
        name: signup.name,
        email: signup.email,
        phone: signup.phone
      };

      if (res?.token) {
        await setToken(res.token, userInfo);
      } else if (userInfo.user_id) {
        // If no token but we have user_id, save user info anyway
        await setToken("temp-token", userInfo);
      }

      setSignup({ ...signup, loading: false });

      // Navigate back to login after signup (or to main if token was provided)
      if (res?.token) {
        // If we got a token, user is logged in
        navigation.navigate("Main");
      } else {
        navigation.navigate("LoginScreen");
      }
    } catch (error) {
      console.log("Signup error:", error);
      setSignup({
        ...signup,
        loading: false,
        error: error.message || "Failed to create account. Please try again."
      });
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors.accentGradient}
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
                    colors={[colors.secondaryLight, colors.secondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iconGradient}
                  >
                    <Icon name="person-add-outline" size={48} color="#FFFFFF" />
                  </LinearGradient>
                </View>
                <Text style={[styles.title, { ...typography.h1, color: "#FFFFFF" }]}>
                  Create Account
                </Text>
                <Text style={[styles.subtitle, { ...typography.body1, color: "rgba(255, 255, 255, 0.9)" }]}>
                  Join us to start splitting expenses
                </Text>
              </View>

              <View style={[styles.card, { borderRadius: borderRadius.xxl }, shadows.xl]}>
                <View style={styles.cardInner}>
                  <TextInput
                    label="Full Name"
                    mode="outlined"
                    style={styles.input}
                    value={signup.name}
                    onChangeText={(val) =>
                      setSignup({
                        ...signup,
                        name: val,
                      })
                    }
                    left={<TextInput.Icon icon="person-outline" />}
                    outlineColor={colors.inputBorder}
                    activeOutlineColor={colors.secondary}
                    textColor={colors.text}
                    theme={{
                      colors: {
                        background: colors.inputBackground,
                      },
                    }}
                  />

                  <TextInput
                    label="Email"
                    mode="outlined"
                    style={styles.input}
                    value={signup.email}
                    onChangeText={(val) =>
                      setSignup({
                        ...signup,
                        email: val,
                      })
                    }
                    left={<TextInput.Icon icon="mail-outline" />}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    outlineColor={colors.inputBorder}
                    activeOutlineColor={colors.secondary}
                    textColor={colors.text}
                    theme={{
                      colors: {
                        background: colors.inputBackground,
                      },
                    }}
                  />

                  <TextInput
                    label="Phone"
                    mode="outlined"
                    style={styles.input}
                    keyboardType="phone-pad"
                    value={signup.phone}
                    onChangeText={(val) =>
                      setSignup({
                        ...signup,
                        phone: val,
                      })
                    }
                    left={<TextInput.Icon icon="call-outline" />}
                    outlineColor={colors.inputBorder}
                    activeOutlineColor={colors.secondary}
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
                    secureTextEntry={!signup.showPassword}
                    right={
                      <TextInput.Icon
                        icon={signup.showPassword ? "eye-off-outline" : "eye-outline"}
                        onPress={() =>
                          setSignup({ ...signup, showPassword: !signup.showPassword })
                        }
                      />
                    }
                    style={styles.input}
                    value={signup.password}
                    onChangeText={(val) =>
                      setSignup({
                        ...signup,
                        password: val,
                      })
                    }
                    left={<TextInput.Icon icon="lock-outline" />}
                    outlineColor={colors.inputBorder}
                    activeOutlineColor={colors.secondary}
                    textColor={colors.text}
                    theme={{
                      colors: {
                        background: colors.inputBackground,
                      },
                    }}
                  />

                  {signup.error ? (
                    <Text style={[styles.errorText, { color: colors.error }]}>
                      {signup.error}
                    </Text>
                  ) : null}

                  <LinearGradient
                    colors={colors.accentGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.buttonGradient, { borderRadius: borderRadius.md }, shadows.md]}
                  >
                    <Button
                      loading={signup.loading}
                      mode="text"
                      onPress={onSignUp}
                      contentStyle={styles.buttonContent}
                      labelStyle={styles.buttonLabel}
                      textColor="#FFFFFF"
                    >
                      Create Account
                    </Button>
                  </LinearGradient>

                  <View style={styles.divider}>
                    <View style={[styles.dividerLine, { backgroundColor: colors.cardBorder }]} />
                    <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
                    <View style={[styles.dividerLine, { backgroundColor: colors.cardBorder }]} />
                  </View>

                  <Button
                    mode="text"
                    style={styles.loginButton}
                    labelStyle={[styles.loginButtonLabel, { color: colors.secondary }]}
                    onPress={() => navigation.navigate("LoginScreen")}
                  >
                    Already have an account? Sign In
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

export default SignUpScreen;

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
    marginTop: 8,
    marginBottom: 8,
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
  loginButton: {
    marginTop: 0,
  },
  loginButtonLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
});

