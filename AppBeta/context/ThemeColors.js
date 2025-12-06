// context/ThemeColors.js — FINAL & PERFECT
export const LightTheme = {
  background: "#fbf7ff",
  card: "#ffffff",
  text: "#2c2c2c",
  textSecondary: "#666666",
  primary: "#6F42C1",
  headerGradient: ["#6F42C1", "#9b59b6"],
  sidebarGradient: ["#6F42C1", "#9b59b6"],
  sidebarText: "#ffffff",
  sidebarIconBg: "#ffffff",
  sidebarItemBg: "rgba(255,255,255,0.1)",
  bgGradient: ["#fbf7ff", "#f0e8ff"], // Soft violet gradient
  childrenArea: {
    gradient1: ['#a78bfa', '#f472b6', '#fb923c'],
    gradient2: ['#60a5fa', '#a78bfa', '#f472b6'],
    gradient3: ['#60a5fa', '#6366f1', '#8b5cf6'],
    gradient4: ['#fbbf24', '#fb923c', '#f87171'],
    gradient5: ['#a78bfa', '#f472b6', '#f87171'],
    gradient6: ['#34d399', '#10b981', '#059669'],
    gradient7: ['#fb923c', '#f87171', '#f472b6'],
    badgeText: '#6F42C1',
    cardBg: '#ffffff',
    cardText: '#1f2937',
    cardTextSecondary: '#6b7280',
  },

  // MAP COLORS — Clean & grouped
  map: {
    pinColor: "#E91E63",
    routeColor: "#6F42C1",
    labelBg: "rgba(255,255,255,0.98)",
    labelText: "#2c2c2c",
  },
};

export const DarkTheme = {
  background: "#0a0a1a",
  card: "rgba(0, 0, 0, 0.6)", // Dark with 60% opacity - adaptable to background
  cardSolid: "#1a1a2e", // Solid fallback if needed
  text: "#e0d4ff",
  textSecondary: "#b0a8d9",
  bgGradient: ["#0a0a1a", "#0f0f1f"], // Pure dark gradient - NO purple tones
  primary: "#050307ff",
  headerGradient: ["#1a1a2e", "#2d1b69"], // Header keeps purple for accent
  sidebarGradient: ["#1a1a2e", "#050017ff"], // Sidebar keeps purple for accent
  sidebarText: "#e6d9ff",
  sidebarIconBg: "rgba(255,255,255,0.15)",
  sidebarItemBg: "rgba(255,255,255,0.08)",

  // Card opacity variations for different contexts
  cardLight: "rgba(0, 0, 0, 0.4)", // Light cards - 40% opacity
  cardMedium: "rgba(0, 0, 0, 0.6)", // Medium cards - 60% opacity
  cardHeavy: "rgba(0, 0, 0, 0.8)", // Heavy cards - 80% opacity
  childrenArea: {
    // Keep gradients colorful for visual appeal in kids area
    gradient1: ['#a78bfa', '#f472b6', '#fb923c'],
    gradient2: ['#60a5fa', '#a78bfa', '#f472b6'],
    gradient3: ['#60a5fa', '#6366f1', '#8b5cf6'],
    gradient4: ['#fbbf24', '#fb923c', '#f87171'],
    gradient5: ['#a78bfa', '#f472b6', '#f87171'],
    gradient6: ['#34d399', '#10b981', '#059669'],
    gradient7: ['#fb923c', '#f87171', '#f472b6'],
    // Cards use dark with opacity
    cardBg: 'rgba(0, 0, 0, 0.6)', // 60% opacity
    badgeText: '#f6f5f7ff',
    cardText: '#ffffff',
    cardTextSecondary: '#e0d4ff',
  },
  // MAP COLORS — Clean & grouped
  map: {
    pinColor: "#FF4081",
    routeColor: "#07010fff",
    labelBg: "rgba(0, 0, 0, 0.85)",
    labelText: "#e6d9ff",
  },
};