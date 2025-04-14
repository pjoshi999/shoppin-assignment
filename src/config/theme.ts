export const theme = {
  colors: {
    primary: "#4285F4",
    secondary: "#34A853",
    background: "#1f2125",
    surface: "#1f2125", 
    textPrimary: "#fff",
    textSecondary: "#fff",
    border: "#DFE1E5",
    borderFocus: "#4285F4",
    black: "#000000",
    iconHoverBg: "rgba(60, 64, 67, 0.08)", 
  },
  fonts: {
    main: "Roboto, Arial, sans-serif",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
  },
  borderRadius: {
    small: "4px",
    medium: "8px",
    large: "24px",
    round: "50%",
  },
  shadows: {
    searchBar: "0 1px 6px rgba(32,33,36,.28)",
    searchBarFocus: "0 1px 6px rgba(32,33,36,.28)", 
  },
};

export type ThemeType = typeof theme;
