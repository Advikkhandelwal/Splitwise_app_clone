import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useContext, useState } from "react";
import { loginUser } from "../../services";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setToken } = useContext(AuthContext);
  const [login, setLogin] = useState({
    username: "",
    password: "",
    loading: false,
  });

  const onLogin = async () => {
    try {
      setLogin({ ...login, loading: true });
      const res = await loginUser(login.username, login.password);

      // assuming `res.token` is returned from API
      await setToken(res.token);

      setLogin({ ...login, loading: false });
    } catch (error) {
      console.log(error);
      setLogin({ ...login, loading: false });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

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
        />
        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry
          right={<TextInput.Icon icon="eye" />}
          style={styles.input}
          value={login.password}
          onChangeText={(val) =>
            setLogin({
              ...login,
              password: val,
            })
          }
        />

        <Button
          loading={login.loading}
          mode="contained"
          style={styles.button}
          onPress={onLogin}
        >
          Login
        </Button>

        <Button
          mode="text"
          textColor="#666"
          style={styles.signupButton}
          onPress={() => navigation.navigate("SignUpScreen")}
        >
          Don’t have an account? Sign Up
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#f8f9fb",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#222",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 10,
    borderRadius: 10,
    paddingVertical: 5,
  },
  signupButton: {
    marginTop: 15,
  },
});
