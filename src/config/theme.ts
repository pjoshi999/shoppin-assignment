// src/config/theme.ts - Ensure this file exists and is used in ThemeProvider
export const theme = {
  colors: {
    primary: "#4285F4", // Google Blue
    secondary: "#34A853", // Google Green
    background: "#1f2125",
    surface: "#1f2125", // Google Search bar is often white, not grey F1F3F4
    textPrimary: "#fff", // Very Dark Grey
    textSecondary: "#fff", // Medium Grey (for icons)
    border: "#DFE1E5", // Standard Google border color
    borderFocus: "#4285F4", // Or sometimes slightly darker grey on focus depending on context
    white: "#1f2125",
    black: "#000000",
    iconHoverBg: "rgba(60, 64, 67, 0.08)", // Subtle grey for icon hover
  },
  fonts: {
    main: "Roboto, Arial, sans-serif", // Google typically uses Roboto or its own sans-serif stack
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px", // Adjusted for typical Google padding
    lg: "16px",
    xl: "24px", // Adjusted
    xxl: "32px",
  },
  borderRadius: {
    small: "4px",
    medium: "8px",
    large: "24px", // Key for the search bar shape
    round: "50%",
  },
  shadows: {
    // Google's search bar shadow is subtle and specific
    searchBar: "0 1px 6px rgba(32,33,36,.28)",
    searchBarFocus: "0 1px 6px rgba(32,33,36,.28)", // Often same shadow on focus, border changes
  },
};

export type ThemeType = typeof theme;
