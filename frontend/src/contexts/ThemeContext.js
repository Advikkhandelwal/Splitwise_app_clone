import React, { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Design tokens and theme configuration
  const themeConfig = {
    dark: {
      // Base colors with vibrant HSL-based palette
      background: "#0A0E27",
      backgroundGradient: ["#0A0E27", "#1a1f3a"],
      surface: "#151B3D",
      surfaceElevated: "#1E2749",
      text: "#FFFFFF",
      textSecondary: "#A0AEC0",
      textTertiary: "#718096",
      
      // Card styles
      card: "#1E2749",
      cardBorder: "#2D3A5F",
      cardHover: "#252E54",
      
      // Vibrant primary gradient
      primary: "#667eea",
      primaryLight: "#7c8ff0",
      primaryDark: "#5568d3",
      primaryGradient: ["#667eea", "#764ba2"],
      primaryGradientString: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      
      // Accent gradient
      secondary: "#f093fb",
      secondaryLight: "#f5a3fc",
      secondaryDark: "#e683f7",
      accentGradient: ["#f093fb", "#f5576c"],
      accentGradientString: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      
      // Success gradient
      success: "#4facfe",
      successLight: "#6fbdff",
      successDark: "#3a9bec",
      successGradient: ["#4facfe", "#00f2fe"],
      successGradientString: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      
      // Warning gradient
      warning: "#f6d365",
      warningLight: "#f8dc7a",
      warningDark: "#f4ca50",
      warningGradient: ["#f6d365", "#fda085"],
      warningGradientString: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
      
      // Error/Accent
      error: "#ff6b9d",
      errorLight: "#ff85b0",
      errorDark: "#ff5189",
      errorGradient: ["#ff6b9d", "#c86dd7"],
      errorGradientString: "linear-gradient(135deg, #ff6b9d 0%, #c86dd7 100%)",
      
      // Glassmorphism
      glassBackground: "rgba(30, 39, 73, 0.7)",
      glassBorder: "rgba(255, 255, 255, 0.1)",
      glassHighlight: "rgba(255, 255, 255, 0.05)",
      
      // Overlays
      overlay: "rgba(10, 14, 39, 0.85)",
      overlayLight: "rgba(10, 14, 39, 0.6)",
      
      // Input colors
      placeholder: "#4A5568",
      inputBackground: "#1E2749",
      inputBorder: "#2D3A5F",
      inputFocus: "#667eea",
      
      // Shadows
      shadow: "rgba(0, 0, 0, 0.4)",
      shadowColor: "#000000",
    },
    light: {
      // Base colors with clean, modern palette
      background: "#F7F9FC",
      backgroundGradient: ["#F7F9FC", "#E9EEF5"],
      surface: "#FFFFFF",
      surfaceElevated: "#FFFFFF",
      text: "#1A202C",
      textSecondary: "#4A5568",
      textTertiary: "#718096",
      
      // Card styles
      card: "#FFFFFF",
      cardBorder: "#E2E8F0",
      cardHover: "#F7FAFC",
      
      // Vibrant primary gradient
      primary: "#667eea",
      primaryLight: "#7c8ff0",
      primaryDark: "#5568d3",
      primaryGradient: ["#667eea", "#764ba2"],
      primaryGradientString: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      
      // Accent gradient
      secondary: "#f093fb",
      secondaryLight: "#f5a3fc",
      secondaryDark: "#e683f7",
      accentGradient: ["#f093fb", "#f5576c"],
      accentGradientString: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      
      // Success gradient
      success: "#4facfe",
      successLight: "#6fbdff",
      successDark: "#3a9bec",
      successGradient: ["#4facfe", "#00f2fe"],
      successGradientString: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      
      // Warning gradient
      warning: "#f6d365",
      warningLight: "#f8dc7a",
      warningDark: "#f4ca50",
      warningGradient: ["#f6d365", "#fda085"],
      warningGradientString: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
      
      // Error/Accent
      error: "#ff6b9d",
      errorLight: "#ff85b0",
      errorDark: "#ff5189",
      errorGradient: ["#ff6b9d", "#c86dd7"],
      errorGradientString: "linear-gradient(135deg, #ff6b9d 0%, #c86dd7 100%)",
      
      // Glassmorphism
      glassBackground: "rgba(255, 255, 255, 0.7)",
      glassBorder: "rgba(255, 255, 255, 0.3)",
      glassHighlight: "rgba(255, 255, 255, 0.9)",
      
      // Overlays
      overlay: "rgba(0, 0, 0, 0.5)",
      overlayLight: "rgba(0, 0, 0, 0.3)",
      
      // Input colors
      placeholder: "#A0AEC0",
      inputBackground: "#F7FAFC",
      inputBorder: "#E2E8F0",
      inputFocus: "#667eea",
      
      // Shadows
      shadow: "rgba(0, 0, 0, 0.1)",
      shadowColor: "#000000",
    },
  };

  // Spacing scale (in pixels)
  const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  };

  // Typography scale
  const typography = {
    h1: {
      fontSize: 32,
      fontWeight: "700",
      lineHeight: 40,
      letterSpacing: -0.5,
    },
    h2: {
      fontSize: 28,
      fontWeight: "700",
      lineHeight: 36,
      letterSpacing: -0.5,
    },
    h3: {
      fontSize: 24,
      fontWeight: "600",
      lineHeight: 32,
      letterSpacing: -0.3,
    },
    h4: {
      fontSize: 20,
      fontWeight: "600",
      lineHeight: 28,
      letterSpacing: 0,
    },
    body1: {
      fontSize: 16,
      fontWeight: "400",
      lineHeight: 24,
      letterSpacing: 0,
    },
    body2: {
      fontSize: 14,
      fontWeight: "400",
      lineHeight: 20,
      letterSpacing: 0,
    },
    caption: {
      fontSize: 12,
      fontWeight: "400",
      lineHeight: 16,
      letterSpacing: 0.2,
    },
    button: {
      fontSize: 16,
      fontWeight: "600",
      lineHeight: 24,
      letterSpacing: 0.5,
    },
  };

  // Shadow elevations
  const shadows = {
    none: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
      elevation: 0,
    },
    sm: {
      shadowColor: themeConfig[theme].shadowColor,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme === "dark" ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: themeConfig[theme].shadowColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme === "dark" ? 0.35 : 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: themeConfig[theme].shadowColor,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: theme === "dark" ? 0.4 : 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowColor: themeConfig[theme].shadowColor,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: theme === "dark" ? 0.45 : 0.18,
      shadowRadius: 24,
      elevation: 12,
    },
  };

  // Border radius scale
  const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    round: 9999,
  };

  // Animation timings (in milliseconds)
  const animations = {
    fast: 150,
    normal: 250,
    slow: 350,
    verySlow: 500,
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        colors: themeConfig[theme],
        spacing,
        typography,
        shadows,
        borderRadius,
        animations,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
