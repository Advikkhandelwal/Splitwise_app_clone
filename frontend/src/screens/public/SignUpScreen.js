import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useState } from "react";
import { signupUser } from "../../services";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [signup, setSignup] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    loading: false,
  });

  const onSignUp = async () => {
    try {
      setSignup({ ...signup, loading: true });

      const res = await signupUser(
        signup.name,
        signup.email,
        signup.phone,
        signup.password
      );

      // Optionally save token if backend returns it
      if (res?.token) {
        await AsyncStorage.setItem("userToken", res.token);
      }

      setSignup({ ...signup, loading: false });

      // Navigate back to login after signup
      navigation.navigate("LoginScreen");
    } catch (error) {
      console.log(error);
      setSignup({ ...signup, loading: false });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

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
        />

        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry
          right={<TextInput.Icon icon="eye" />}
          style={styles.input}
          value={signup.password}
          onChangeText={(val) =>
            setSignup({
              ...signup,
              password: val,
            })
          }
        />

        <Button
          loading={signup.loading}
          mode="contained"
          style={styles.button}
          onPress={onSignUp}
        >
          Sign Up
        </Button>

        <Button
          mode="text"
          textColor="#666"
          style={styles.loginButton}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          Already have an account? Login
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;

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
  loginButton: {
    marginTop: 15,
  },
});
