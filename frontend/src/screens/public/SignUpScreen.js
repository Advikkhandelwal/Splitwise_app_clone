import { StyleSheet, Text, View, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useState, useContext } from "react";
import { signupUser } from "../../services";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AuthContext } from "../../contexts/AuthContext";
import Icon from "react-native-vector-icons/Ionicons";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + "20" }]}>
              <Icon name="person-add-outline" size={40} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Join us to start splitting expenses
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
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
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
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
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
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
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
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
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
            />

            {signup.error ? (
              <Text style={[styles.errorText, { color: colors.error || "#FF3B30" }]}>
                {signup.error}
              </Text>
            ) : null}

            <Button
              loading={signup.loading}
              mode="contained"
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={onSignUp}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Create Account
            </Button>

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            <Button
              mode="text"
              style={styles.loginButton}
              labelStyle={[styles.loginButtonLabel, { color: colors.primary }]}
              onPress={() => navigation.navigate("LoginScreen")}
            >
              Already have an account? Sign In
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  card: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
    elevation: 0,
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
