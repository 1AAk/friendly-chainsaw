import type { CSSProperties } from "react";

export type InteractionEasing = "soft" | "balanced" | "snappy";

export type InteractionSettings = {
  revealEnabled: boolean;
  revealDuration: number;
  revealStagger: number;
  revealDistance: number;
  revealEasing: InteractionEasing;
  hoverLift: number;
  hoverScale: number;
  hoverShadow: number;
  forceHover: boolean;
  forceFocus: boolean;
  forceError: boolean;
};

const INTERACTION_STORAGE_KEY = "uiux-interaction-settings";

const DEFAULT_INTERACTION_SETTINGS: InteractionSettings = {
  revealEnabled: true,
  revealDuration: 420,
  revealStagger: 90,
  revealDistance: 18,
  revealEasing: "soft",
  hoverLift: 6,
  hoverScale: 2,
  hoverShadow: 0.22,
  forceHover: false,
  forceFocus: false,
  forceError: false,
};

export const INTERACTION_EASINGS: Record<InteractionEasing, string> = {
  soft: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  balanced: "ease",
  snappy: "cubic-bezier(0.3, 1, 0.3, 1)",
};

const REVEAL_DURATION_RANGE = { min: 200, max: 1200 };
const REVEAL_STAGGER_RANGE = { min: 0, max: 240 };
const REVEAL_DISTANCE_RANGE = { min: 8, max: 40 };
const HOVER_LIFT_RANGE = { min: 0, max: 16 };
const HOVER_SCALE_RANGE = { min: 0, max: 6 };
const HOVER_SHADOW_RANGE = { min: 0, max: 0.4 };

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const isInteractionEasing = (
  value: unknown,
): value is InteractionEasing =>
  typeof value === "string" && value in INTERACTION_EASINGS;

export const getStoredInteractionSettings = (): InteractionSettings => {
  if (typeof window === "undefined") {
    return { ...DEFAULT_INTERACTION_SETTINGS };
  }

  try {
    const raw = window.localStorage.getItem(INTERACTION_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_INTERACTION_SETTINGS };
    }

    const parsed = JSON.parse(raw) as Partial<InteractionSettings> | null;
    return {
      revealEnabled:
        typeof parsed?.revealEnabled === "boolean"
          ? parsed.revealEnabled
          : DEFAULT_INTERACTION_SETTINGS.revealEnabled,
      revealDuration: Number.isFinite(Number(parsed?.revealDuration))
        ? clamp(
            Number(parsed?.revealDuration),
            REVEAL_DURATION_RANGE.min,
            REVEAL_DURATION_RANGE.max,
          )
        : DEFAULT_INTERACTION_SETTINGS.revealDuration,
      revealStagger: Number.isFinite(Number(parsed?.revealStagger))
        ? clamp(
            Number(parsed?.revealStagger),
            REVEAL_STAGGER_RANGE.min,
            REVEAL_STAGGER_RANGE.max,
          )
        : DEFAULT_INTERACTION_SETTINGS.revealStagger,
      revealDistance: Number.isFinite(Number(parsed?.revealDistance))
        ? clamp(
            Number(parsed?.revealDistance),
            REVEAL_DISTANCE_RANGE.min,
            REVEAL_DISTANCE_RANGE.max,
          )
        : DEFAULT_INTERACTION_SETTINGS.revealDistance,
      revealEasing: isInteractionEasing(parsed?.revealEasing)
        ? parsed.revealEasing
        : DEFAULT_INTERACTION_SETTINGS.revealEasing,
      hoverLift: Number.isFinite(Number(parsed?.hoverLift))
        ? clamp(
            Number(parsed?.hoverLift),
            HOVER_LIFT_RANGE.min,
            HOVER_LIFT_RANGE.max,
          )
        : DEFAULT_INTERACTION_SETTINGS.hoverLift,
      hoverScale: Number.isFinite(Number(parsed?.hoverScale))
        ? clamp(
            Number(parsed?.hoverScale),
            HOVER_SCALE_RANGE.min,
            HOVER_SCALE_RANGE.max,
          )
        : DEFAULT_INTERACTION_SETTINGS.hoverScale,
      hoverShadow: Number.isFinite(Number(parsed?.hoverShadow))
        ? clamp(
            Number(parsed?.hoverShadow),
            HOVER_SHADOW_RANGE.min,
            HOVER_SHADOW_RANGE.max,
          )
        : DEFAULT_INTERACTION_SETTINGS.hoverShadow,
      forceHover:
        typeof parsed?.forceHover === "boolean"
          ? parsed.forceHover
          : DEFAULT_INTERACTION_SETTINGS.forceHover,
      forceFocus:
        typeof parsed?.forceFocus === "boolean"
          ? parsed.forceFocus
          : DEFAULT_INTERACTION_SETTINGS.forceFocus,
      forceError:
        typeof parsed?.forceError === "boolean"
          ? parsed.forceError
          : DEFAULT_INTERACTION_SETTINGS.forceError,
    };
  } catch {
    return { ...DEFAULT_INTERACTION_SETTINGS };
  }
};

export const buildInteractionShadow = (value: number) =>
  value <= 0 ? "none" : `0 24px 60px rgba(15, 23, 42, ${value})`;

export const getRevealStyle = (
  settings: InteractionSettings,
  index: number,
): CSSProperties =>
  settings.revealEnabled
    ? {
        animationDelay: `${settings.revealStagger * index}ms`,
      }
    : { opacity: 1, animation: "none" };
