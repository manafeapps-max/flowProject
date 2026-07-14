/**
 * @file motion.ts
 * @description Motion constants for spring/smooth easing parameters and durations defined in the Design Manifesto.
 */

export const easings = {
  spring: [0.34, 1.56, 0.64, 1] as const,
  smooth: [0.25, 1, 0.5, 1] as const,
  bounce: [0.68, -0.6, 0.32, 1.6] as const,
};

export const durations = {
  micro: 0.15,
  base: 0.25,
  macro: 0.4,
};
