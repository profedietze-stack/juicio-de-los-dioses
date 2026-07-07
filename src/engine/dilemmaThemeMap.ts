// Curated mapping of dilemma id -> EV_THEMES index. Replaces blind cyclic
// reuse ((evId-1) % EV_THEMES.length), which paired many dilemmas with art
// that had nothing to do with their content. Every id below was assigned by
// reading its title/description and picking the closest thematic fit among
// the available canvas art styles.
export const DILEMMA_THEME_MAP: Record<number, number> = {
  // Block 1 (1-30)
  1: 15, 2: 3, 3: 20, 4: 4, 5: 2, 6: 6, 7: 4, 8: 27, 9: 2, 10: 0,
  11: 25, 12: 22, 13: 23, 14: 11, 15: 3, 16: 17, 17: 4, 18: 18, 19: 12, 20: 5,
  21: 20, 22: 23, 23: 26, 24: 14, 25: 15, 26: 27, 27: 20, 28: 12, 29: 19, 30: 11,
  // Block 2 (31-59)
  31: 4, 32: 23, 33: 6, 34: 26, 35: 16, 36: 18, 37: 16, 38: 0, 39: 21, 40: 26,
  41: 0, 42: 25, 43: 21, 44: 15, 45: 6, 46: 9, 47: 26, 48: 24, 49: 13, 50: 14,
  51: 2, 52: 23, 53: 0, 54: 3, 55: 7, 56: 19, 57: 12, 58: 27, 59: 13,
  // Finale
  60: 29,
  // Block 3 (61-80) — intimate personal dramas
  61: 30, 62: 30, 63: 30, 64: 30, 65: 30, 66: 30, 67: 30, 68: 27, 69: 28, 70: 30,
  71: 4, 72: 30, 73: 30, 74: 30, 75: 30, 76: 21, 77: 30, 78: 0, 79: 12, 80: 30,
  // Block 4 (81-85)
  81: 32, 82: 2, 83: 3, 84: 31, 85: 32,
};
