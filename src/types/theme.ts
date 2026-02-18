export type ThemeName =
  | "dracula"
  | "tokyoNight"
  | "catppuccin"
  | "synthwave"
  | "nord"
  | "gruvbox"
  | "rosePine"
  | "oneDark";

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  bg: string;
  bgSecondary: string;
  bgTertiary: string;
  fg: string;
  fgMuted: string;
  fgDim: string;
  accent: string;
  accentRgb: string;
  accentSecondary: string;
  accentSecondaryRgb: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  promptPath: string;
}

export const themes: Record<ThemeName, ThemeConfig> = {
  dracula: {
    name: "dracula",
    label: "Dracula",
    bg: "#282a36",
    bgSecondary: "#21222c",
    bgTertiary: "#44475a",
    fg: "#f8f8f2",
    fgMuted: "#bfbfbf",
    fgDim: "#6272a4",
    accent: "#bd93f9",
    accentRgb: "189, 147, 249",
    accentSecondary: "#ff79c6",
    accentSecondaryRgb: "255, 121, 198",
    red: "#ff5555",
    green: "#50fa7b",
    yellow: "#f1fa8c",
    blue: "#8be9fd",
    promptPath: "#8be9fd",
  },
  tokyoNight: {
    name: "tokyoNight",
    label: "Tokyo Night",
    bg: "#1a1b26",
    bgSecondary: "#16161e",
    bgTertiary: "#283457",
    fg: "#c0caf5",
    fgMuted: "#a9b1d6",
    fgDim: "#565f89",
    accent: "#7aa2f7",
    accentRgb: "122, 162, 247",
    accentSecondary: "#bb9af7",
    accentSecondaryRgb: "187, 154, 247",
    red: "#f7768e",
    green: "#9ece6a",
    yellow: "#e0af68",
    blue: "#7dcfff",
    promptPath: "#7dcfff",
  },
  catppuccin: {
    name: "catppuccin",
    label: "Catppuccin",
    bg: "#1e1e2e",
    bgSecondary: "#181825",
    bgTertiary: "#313244",
    fg: "#cdd6f4",
    fgMuted: "#bac2de",
    fgDim: "#585b70",
    accent: "#cba6f7",
    accentRgb: "203, 166, 247",
    accentSecondary: "#f5c2e7",
    accentSecondaryRgb: "245, 194, 231",
    red: "#f38ba8",
    green: "#a6e3a1",
    yellow: "#f9e2af",
    blue: "#89b4fa",
    promptPath: "#89b4fa",
  },
  synthwave: {
    name: "synthwave",
    label: "Synthwave '84",
    bg: "#262335",
    bgSecondary: "#241b2f",
    bgTertiary: "#34294f",
    fg: "#ffffff",
    fgMuted: "#bbbbbb",
    fgDim: "#848bbd",
    accent: "#36f9f6",
    accentRgb: "54, 249, 246",
    accentSecondary: "#ff7edb",
    accentSecondaryRgb: "255, 126, 219",
    red: "#fe4450",
    green: "#72f1b8",
    yellow: "#fede5d",
    blue: "#03edf9",
    promptPath: "#ff7edb",
  },
  nord: {
    name: "nord",
    label: "Nord",
    bg: "#2e3440",
    bgSecondary: "#272c36",
    bgTertiary: "#3b4252",
    fg: "#d8dee9",
    fgMuted: "#c0c8d8",
    fgDim: "#4c566a",
    accent: "#88c0d0",
    accentRgb: "136, 192, 208",
    accentSecondary: "#81a1c1",
    accentSecondaryRgb: "129, 161, 193",
    red: "#bf616a",
    green: "#a3be8c",
    yellow: "#ebcb8b",
    blue: "#5e81ac",
    promptPath: "#81a1c1",
  },
  gruvbox: {
    name: "gruvbox",
    label: "Gruvbox",
    bg: "#282828",
    bgSecondary: "#1d2021",
    bgTertiary: "#3c3836",
    fg: "#ebdbb2",
    fgMuted: "#d5c4a1",
    fgDim: "#665c54",
    accent: "#fe8019",
    accentRgb: "254, 128, 25",
    accentSecondary: "#fabd2f",
    accentSecondaryRgb: "250, 189, 47",
    red: "#fb4934",
    green: "#b8bb26",
    yellow: "#fabd2f",
    blue: "#83a598",
    promptPath: "#8ec07c",
  },
  rosePine: {
    name: "rosePine",
    label: "Rose Pine",
    bg: "#232136",
    bgSecondary: "#1f1d2e",
    bgTertiary: "#393552",
    fg: "#e0def4",
    fgMuted: "#908caa",
    fgDim: "#6e6a86",
    accent: "#c4a7e7",
    accentRgb: "196, 167, 231",
    accentSecondary: "#eb6f92",
    accentSecondaryRgb: "235, 111, 146",
    red: "#eb6f92",
    green: "#9ccfd8",
    yellow: "#f6c177",
    blue: "#3e8fb0",
    promptPath: "#9ccfd8",
  },
  oneDark: {
    name: "oneDark",
    label: "One Dark",
    bg: "#282c34",
    bgSecondary: "#21252b",
    bgTertiary: "#3e4452",
    fg: "#abb2bf",
    fgMuted: "#8b929e",
    fgDim: "#5c6370",
    accent: "#61afef",
    accentRgb: "97, 175, 239",
    accentSecondary: "#c678dd",
    accentSecondaryRgb: "198, 120, 221",
    red: "#e06c75",
    green: "#98c379",
    yellow: "#e5c07b",
    blue: "#56b6c2",
    promptPath: "#56b6c2",
  },
};
