// context/ThemeColors.js — Updated for wallet-style design

export const LightTheme = {
  background: "#fbf7ff",
  card: "#ffffff",
  text: "#2c2c2c",
  textSecondary: "#666666",
  primary: "#6F42C1",
  headerGradient: ["#6F42C1", "#b300faff"], // Purple Gradient
  sidebarGradient: ["#010003ff", "#000000ff"],
  sidebarText: "#ffffff",
  sidebarIconBg: "#ffffff",
  sidebarItemBg: "rgba(255,255,255,0.1)",
  bgGradient: ["#fbf7ff", "#f0e8ff"],
  
  // Top section (fixed area)
  topSectionBg: "#000000ff",
  topCardBg: "rgba(2, 0, 0, 0.69)",
  topCardPressedBg: "#ffffff",
  topCardText: "#ffffff",
  topCardPressedText: "#2c2c2c",
  
  // Bottom section (scrollable children area)
  bottomSectionBg: "#ffffff",
  bottomCardBg: "rgba(111, 66, 193, 0.08)",
  bottomCardPressedBg: "#ffffff",
  bottomCardText: "#2c2c2c",
  bottomCardPressedText: "#2c2c2c",
  dotColor: ["#fff700ff", "#945429ff"],
  
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


  map: {
    pinColor: "#E91E63",
    routeColor: "#6F42C1",
    labelBg: "rgba(255,255,255,0.98)",
    labelText: "#2c2c2c",
  },
};

export const DarkTheme = {
  background: "#0a0a1a",
  card: "rgba(0, 0, 0, 0.6)",
  cardSolid: "#1a1a2e",
  text: "#e0d4ff",
  textSecondary: "#b0a8d9",
  bgGradient: ["#0a0a1a", "#0f0f1f"],
  primary: "#6F42C1",
  
  // --- UPDATED: Forces Purple Gradient even in Dark Mode ---
  headerGradient: ["#6F42C1", "#9b59b6"], 
  // --------------------------------------------------------

  sidebarGradient: ["#1a1a2e", "#050017ff"],
  sidebarText: "#000000ff",
  sidebarIconBg: "rgba(255,255,255,0.15)",
  sidebarItemBg: "rgba(255,255,255,0.08)",

  // Top section (fixed area) - Dark background
  topSectionBg: "#1a1a2e",
  topCardBg: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark cards
  topCardPressedBg: "#ffffff", // White when pressed
  topCardText: "#ffffff",
  topCardPressedText: "#1a1a2e", // Dark text when pressed
  
  // Bottom section (scrollable children area) - WHITE even in dark theme
  bottomSectionBg: "#ffffff", // ALWAYS WHITE - even in dark theme
  bottomCardBg: "rgba(26, 26, 46, 0.8)", // Semi-transparent dark cards
  bottomCardPressedBg: "#ffffff", // White when pressed with shadow
  bottomCardText: "#ffffff",
  bottomCardPressedText: "#1a1a2e",

  cardLight: "rgba(0, 0, 0, 0.4)",
  cardMedium: "rgba(0, 0, 0, 0.6)",
  cardHeavy: "rgba(0, 0, 0, 0.8)",
  
  childrenArea: {
    gradient1: ['#a78bfa', '#f472b6', '#fb923c'],
    gradient2: ['#60a5fa', '#a78bfa', '#f472b6'],
    gradient3: ['#60a5fa', '#6366f1', '#8b5cf6'],
    gradient4: ['#fbbf24', '#fb923c', '#f87171'],
    gradient5: ['#a78bfa', '#f472b6', '#f87171'],
    gradient6: ['#34d399', '#10b981', '#059669'],
    gradient7: ['#fb923c', '#f87171', '#f472b6'],
    cardBg: 'rgba(0, 0, 0, 0.6)',
    badgeText: '#f6f5f7ff',
    cardText: '#ffffff',
    cardTextSecondary: '#e0d4ff',
  },
  
  map: {
    pinColor: "#FF4081",
    routeColor: "#07010fff",
    labelBg: "rgba(0, 0, 0, 0.85)",
    labelText: "#e6d9ff",
  },
};