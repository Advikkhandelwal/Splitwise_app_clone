import React, { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const colors = {
    dark: {
      background: "#0F0F0F",
      surface: "#1A1A1A",
      text: "#FFFFFF",
      textSecondary: "#B0B0B0",
      card: "#1F1F1F",
      cardBorder: "#2A2A2A",
      primary: "#1ABC9C",
      primaryDark: "#16A085",
      secondary: "#3498DB",
      accent: "#E74C3C",
      success: "#2ECC71",
      warning: "#F39C12",
      placeholder: "#666",
      border: "#2A2A2A",
      shadow: "rgba(0, 0, 0, 0.3)",
    },
    light: {
      background: "#F5F7FA",
      surface: "#FFFFFF",
      text: "#1A1A1A",
      textSecondary: "#6B7280",
      card: "#FFFFFF",
      cardBorder: "#E5E7EB",
      primary: "#1ABC9C",
      primaryDark: "#16A085",
      secondary: "#3498DB",
      accent: "#E74C3C",
      success: "#2ECC71",
      warning: "#F39C12",
      placeholder: "#9CA3AF",
      border: "#E5E7EB",
      shadow: "rgba(0, 0, 0, 0.1)",
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
