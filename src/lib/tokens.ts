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

// ── Font size scale (5 levels, responsive via clamp) ─────────────────────────
// hero    → KPIs, big numbers, nav card labels
// title   → headers, modal titles, user name, match scores
// body    → team names, subtitles, body copy
// caption → pills, meta, timestamps, labels
// micro   → sub-labels (3 pts, 1 pt) — fixed, not below legibility
export const FS = {
  hero:    "clamp(22px, 5.5vw, 28px)",
  title:   "clamp(17px, 4.5vw, 22px)",
  body:    "clamp(13px, 3.5vw, 15px)",
  caption: "clamp(11px, 3vw, 13px)",
  micro:   "11px",
} as const;

// ── Font weight scale ─────────────────────────────────────────────────────────
export const FW = {
  medium:    500,
  semibold:  600,
  bold:      700,
  extrabold: 800,
} as const;

// ── Spacing tokens (inline style values only — Tailwind covers the rest) ──────
export const SPACE = {
  pill:  "6px 12px",  // status pill padding
  board: 10,          // scoreboard inner padding
} as const;

// ── Composed typography styles ────────────────────────────────────────────────
export const LABEL: CSSProperties = {
  fontSize: FS.caption, fontWeight: FW.bold,
  color: C.textSecondary, letterSpacing: "0.02em",
};

export const SCORE: CSSProperties = {
  fontSize: FS.title, fontWeight: FW.medium,
  color: C.scoreText, letterSpacing: "-0.01em", lineHeight: 1.1,
};

// ── Gradients ─────────────────────────────────────────────────────────────────
export const GRADIENT = {
  adminHero: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
} as const;

// ── Score separator ───────────────────────────────────────────────────────────
export const SEP = " - ";
