import { StyleSheet, Text, View, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useContext, useState } from "react";
import { loginUser } from "../../services";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import Icon from "react-native-vector-icons/Ionicons";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setToken } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);
  const [login, setLogin] = useState({
    username: "",
    password: "",
    loading: false,
    showPassword: false,
  });

  const onLogin = async () => {
    try {
      setLogin({ ...login, loading: true });
      const res = await loginUser(login.username, login.password);

      // Save token and user info
      await setToken(res.token, res.user);

      setLogin({ ...login, loading: false });
    } catch (error) {
      console.log(error);
      setLogin({ ...login, loading: false });
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
              <Icon name="wallet-outline" size={40} color={colors.primary} />
            </View>
            <Text style={[styles.title, { color: colors.text }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Sign in to manage your expenses
            </Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
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
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
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
              outlineColor={colors.border}
              activeOutlineColor={colors.primary}
              textColor={colors.text}
            />

            <Button
              loading={login.loading}
              mode="contained"
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={onLogin}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Sign In
            </Button>

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

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
