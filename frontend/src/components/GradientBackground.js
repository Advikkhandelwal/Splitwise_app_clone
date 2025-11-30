import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from '../contexts/ThemeContext';

export default function GradientBackground({ children, style, variant = 'primary' }) {
    const { colors } = useContext(ThemeContext);

    const gradientColors = {
        primary: colors.primaryGradient,
        accent: colors.accentGradient,
        success: colors.successGradient,
        warning: colors.warningGradient,
        error: colors.errorGradient,
        background: colors.backgroundGradient,
    };

    return (
        <LinearGradient
            colors={gradientColors[variant] || gradientColors.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.gradient, style]}
        >
            {children}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
});
