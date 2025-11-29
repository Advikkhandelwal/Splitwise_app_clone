import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState("");
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchToken = async () => {
    try {
      const tokenTemp = await AsyncStorage.getItem("userToken");
      const userTemp = await AsyncStorage.getItem("userInfo");
      if (tokenTemp) setTokenState(tokenTemp);
      if (userTemp) setUserState(JSON.parse(userTemp));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  const setToken = async (newToken, userInfo = null) => {
    try {
      if (newToken) {
        await AsyncStorage.setItem("userToken", newToken);
        setTokenState(newToken);
        if (userInfo) {
          await AsyncStorage.setItem("userInfo", JSON.stringify(userInfo));
          setUserState(userInfo);
        }
      } else {
        await AsyncStorage.removeItem("userToken");
        await AsyncStorage.removeItem("userInfo");
        setTokenState("");
        setUserState(null);
      }
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  const values = {
    token,
    user,
    loading,
    setToken,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
