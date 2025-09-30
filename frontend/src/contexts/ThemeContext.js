import React, { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const colors = {
    dark: {
      background: "#1E1E1E",
      text: "#FFF",
      card: "#333",
      primary: "#1ABC9C",
      placeholder: "#aaa",
    },
    light: {
      background: "#FFF",
      text: "#000",
      card: "#EEE",
      primary: "#1ABC9C",
      placeholder: "#555",
    },
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, colors: colors[theme] }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
