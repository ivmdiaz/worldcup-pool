export function haptic(type: "light" | "medium" | "heavy" = "light") {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  const patterns = { light: 8, medium: 15, heavy: 30 };
  navigator.vibrate(patterns[type]);
}
