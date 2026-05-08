import type { CSSProperties } from "react";

// ── Brand colors ─────────────────────────────────────────────────────────────
export const C = {
  primary:       "#1E8E3E",
  bgApp:         "#F5F6F7",
  surface:       "#FFFFFF",
  textPrimary:   "#111827",
  textSecondary: "#6B7280",
  divider:       "#EEF2F7",
  scoreboardBg:  "#F8FAFC",
  scoreText:     "#374151",   // score values (lighter than textPrimary)
  borderDefault: "#E5E7EB",   // inputs, stepper buttons
  textMuted:     "#9CA3AF",   // cancel links, placeholder text
  white:         "#FFFFFF",
  pendingAmber:  "#F59E0B",   // home card pending badge (amber on white bg)

  // Semantic status pills — 4 groups replace 8 specific ones
  successBg:     "#F0FDF4",   // PENDING match, +3 pts, Activo
  successText:   "#15803D",
  successBorder: "#BBF7D0",

  warningBg:     "#FFFBEB",   // LOCKED match, +1 pt
  warningText:   "#B45309",
  warningBorder: "#FDE68A",

  dangerBg:      "#FEE2E2",   // LIVE match, Rechazar
  dangerText:    "#B91C1C",
  dangerBorder:  "#FECACA",

  neutralBg:     "#F3F4F6",   // FINISHED match, 0 pts
  neutralText:   "#6B7280",
  neutralBorder: "#E5E7EB",
} as const;

// ── Typography tokens ─────────────────────────────────────────────────────────
export const LABEL: CSSProperties = {
  fontSize: 12, fontWeight: 700, color: C.textSecondary, letterSpacing: "0.02em",
};

export const SCORE: CSSProperties = {
  fontSize: 24, fontWeight: 500, color: C.scoreText,
  letterSpacing: "-0.01em", lineHeight: 1.1,
};

// ── Score separator ───────────────────────────────────────────────────────────
export const SEP = " - ";
