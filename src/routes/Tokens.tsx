import {
  type CSSProperties,
  type MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import Button, {
  type ButtonRadiusToken,
  type ButtonSize,
} from "../components/Button";
import Card, {
  type CardPaddingToken,
  type CardRadiusToken,
} from "../components/Card";
import Input, {
  type InputPreviewState,
  type InputRadiusToken,
  type InputSize,
} from "../components/Input";
import Section, {
  type SectionPaddingToken,
  type SectionSize,
} from "../components/Section";
const STORAGE_KEY = "uiux-color-tokens";
const LIGHT_STORAGE_KEY = "uiux-light-color-tokens";
const TYPO_STORAGE_KEY = "uiux-typography-tokens";
const SPACE_STORAGE_KEY = "uiux-spacing-tokens";
const RADIUS_STORAGE_KEY = "uiux-radius-tokens";
const BUTTON_STORAGE_KEY = "uiux-button-settings";
const INPUT_STORAGE_KEY = "uiux-input-settings";
const CARD_STORAGE_KEY = "uiux-card-settings";
const SECTION_STORAGE_KEY = "uiux-section-settings";
const VISIBILITY_STORAGE_KEY = "uiux-token-visibility";
const INTERACTION_STORAGE_KEY = "uiux-interaction-settings";
const PREVIEW_TONE_STORAGE_KEY = "uiux-preview-tone";

const DEFAULT_TOKENS = {
  primary: "#F59E0B",
  secondary: "#38BDF8",
  accent: "#F472B6",
  neutral900: "#0F172A",
  neutral600: "#475569",
  neutral100: "#F8FAFC",
  success: "#22C55E",
  error: "#EF4444",
} as const;

type TokenKey = keyof typeof DEFAULT_TOKENS;

type TokenMap = Record<TokenKey, string>;
const DEFAULT_LIGHT_TOKENS: TokenMap = { ...DEFAULT_TOKENS };

const DEFAULT_TYPOGRAPHY = {
  h1: { size: 48, line: 56, weight: 600 },
  h2: { size: 36, line: 44, weight: 600 },
  h3: { size: 28, line: 36, weight: 600 },
  h4: { size: 22, line: 30, weight: 600 },
  body: { size: 16, line: 26, weight: 400 },
  caption: { size: 12, line: 18, weight: 500 },
} as const;

const DEFAULT_SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
  "4xl": 64,
} as const;

const DEFAULT_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

const DEFAULT_BUTTON_SETTINGS = {
  size: "md",
  radius: "lg",
  primaryHover: "#F59E0B",
  secondaryHover: "#38BDF8",
  focusRing: "#F472B6",
  disabledOpacity: 0.5,
} as const;

const DEFAULT_INPUT_SETTINGS = {
  size: "md",
  radius: "md",
  focusRing: "#F472B6",
  error: "#EF4444",
} as const;

const DEFAULT_CARD_SETTINGS = {
  padding: "xl",
  radius: "xl",
  shadow: 0.18,
} as const;

const DEFAULT_SECTION_SETTINGS = {
  size: "lg",
  paddingY: "xl",
} as const;

const DEFAULT_INTERACTION_SETTINGS = {
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
} as const;

const DEFAULT_VISIBILITY = {
  colors: true,
  typography: true,
  spacing: true,
  radius: true,
  button: true,
  input: true,
  card: true,
  section: true,
  interaction: true,
} as const;

type TypographyKey = keyof typeof DEFAULT_TYPOGRAPHY;
type SpacingKey = keyof typeof DEFAULT_SPACING;
type RadiusKey = keyof typeof DEFAULT_RADIUS;

type TypographyValue = {
  size: number;
  line: number;
  weight: number;
};

type TypographyMap = Record<TypographyKey, TypographyValue>;
type SpacingMap = Record<SpacingKey, number>;
type RadiusMap = Record<RadiusKey, number>;
type ButtonSettings = {
  size: ButtonSize;
  radius: ButtonRadiusToken;
  primaryHover: string;
  secondaryHover: string;
  focusRing: string;
  disabledOpacity: number;
};
type ButtonHexKey = "primaryHover" | "secondaryHover" | "focusRing";
type InputSettings = {
  size: InputSize;
  radius: InputRadiusToken;
  focusRing: string;
  error: string;
};
type InputHexKey = "focusRing" | "error";
type CardSettings = {
  padding: CardPaddingToken;
  radius: CardRadiusToken;
  shadow: number;
};
type SectionSettings = {
  size: SectionSize;
  paddingY: SectionPaddingToken;
};
type VisibilityMap = Record<keyof typeof DEFAULT_VISIBILITY, boolean>;
type InteractionEasing = "soft" | "balanced" | "snappy";
type InteractionSettings = {
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

type LabCard = {
  title: string;
  body: string;
};

type PreviewTone = "light" | "dark";

const TOKEN_ORDER: TokenKey[] = [
  "primary",
  "secondary",
  "accent",
  "neutral900",
  "neutral600",
  "neutral100",
  "success",
  "error",
];

const TYPO_ORDER: TypographyKey[] = [
  "h1",
  "h2",
  "h3",
  "h4",
  "body",
  "caption",
];

const SPACING_ORDER: SpacingKey[] = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
];

const RADIUS_ORDER: RadiusKey[] = ["xs", "sm", "md", "lg", "xl"];
const BUTTON_SIZES: ButtonSize[] = ["sm", "md", "lg"];
const BUTTON_RADII: ButtonRadiusToken[] = ["xs", "sm", "md", "lg", "xl"];
const INPUT_SIZES: InputSize[] = ["sm", "md", "lg"];
const INPUT_RADII: InputRadiusToken[] = ["xs", "sm", "md", "lg", "xl"];
const CARD_PADDING_OPTIONS: CardPaddingToken[] = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
];
const CARD_RADII: CardRadiusToken[] = ["xs", "sm", "md", "lg", "xl"];
const SECTION_SIZES: SectionSize[] = ["sm", "md", "lg", "xl"];
const SECTION_PADDING_OPTIONS: SectionPaddingToken[] = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
];
const SECTION_PREVIEW_WIDTHS: Record<SectionSize, number> = {
  sm: 0.62,
  md: 0.74,
  lg: 0.88,
  xl: 1,
};
const INTERACTION_EASINGS: Record<InteractionEasing, string> = {
  soft: "cubic-bezier(0.2, 0.8, 0.2, 1)",
  balanced: "ease",
  snappy: "cubic-bezier(0.3, 1, 0.3, 1)",
};
const PREVIEW_TONES: PreviewTone[] = ["light", "dark"];
const BUTTON_OPACITY_RANGE = { min: 0.2, max: 1 };
const CARD_SHADOW_RANGE = { min: 0, max: 0.35 };
const REVEAL_DURATION_RANGE = { min: 200, max: 1200 };
const REVEAL_STAGGER_RANGE = { min: 0, max: 240 };
const REVEAL_DISTANCE_RANGE = { min: 8, max: 40 };
const HOVER_LIFT_RANGE = { min: 0, max: 16 };
const HOVER_SCALE_RANGE = { min: 0, max: 6 };
const HOVER_SHADOW_RANGE = { min: 0, max: 0.4 };

const SIZE_RANGE = { min: 10, max: 72 };
const LINE_RANGE = { min: 12, max: 88 };
const SPACING_RANGE = { min: 0, max: 128 };
const RADIUS_RANGE = { min: 0, max: 48 };
const WEIGHTS = [300, 400, 500, 600, 700] as const;

const isValidHex = (value: string) => /^#[0-9a-fA-F]{6}$/.test(value);
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
const normalizeHexInput = (value: string) => {
  const trimmed = value.trim().toUpperCase();
  if (/^[0-9A-F]{6}$/.test(trimmed)) {
    return `#${trimmed}`;
  }

  return trimmed;
};
const buildCardShadow = (value: number) =>
  value <= 0 ? "none" : `0 24px 60px rgba(15, 23, 42, ${value})`;
const buildInteractionShadow = (value: number) => {
  if (value <= 0) {
    return "none";
  }

  const darkAlpha = clamp(value + 0.08, 0, 0.6);
  const lightAlpha = clamp(value * 0.35, 0, 0.35);
  return `0 24px 60px rgba(15, 23, 42, ${darkAlpha}), 0 12px 30px rgba(248, 250, 252, ${lightAlpha})`;
};
const normalizeButtonHex = (value: unknown, fallback: string) => {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = normalizeHexInput(value);
  return isValidHex(normalized) ? normalized : fallback;
};

const normalizeTokens = (raw: unknown): TokenMap => {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_TOKENS };
  }

  const record = raw as Record<string, unknown>;
  const next: TokenMap = { ...DEFAULT_TOKENS };

  TOKEN_ORDER.forEach((key) => {
    const value = record[key];
    if (typeof value === "string" && isValidHex(value)) {
      next[key] = value.toUpperCase();
    }
  });

  return next;
};

const normalizeTypography = (raw: unknown): TypographyMap => {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_TYPOGRAPHY };
  }

  const record = raw as Record<string, unknown>;
  const next: TypographyMap = { ...DEFAULT_TYPOGRAPHY };

  TYPO_ORDER.forEach((key) => {
    const value = record[key] as Partial<TypographyValue> | undefined;
    if (!value || typeof value !== "object") {
      return;
    }

    const size = Number(value.size);
    const line = Number(value.line);
    const weight = Number(value.weight);

    next[key] = {
      size: Number.isFinite(size)
        ? clamp(size, SIZE_RANGE.min, SIZE_RANGE.max)
        : next[key].size,
      line: Number.isFinite(line)
        ? clamp(line, LINE_RANGE.min, LINE_RANGE.max)
        : next[key].line,
      weight: Number.isFinite(weight) ? weight : next[key].weight,
    };
  });

  return next;
};

const normalizeSpacing = (raw: unknown): SpacingMap => {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_SPACING };
  }

  const record = raw as Record<string, unknown>;
  const next: SpacingMap = { ...DEFAULT_SPACING };

  SPACING_ORDER.forEach((key) => {
    const value = Number(record[key]);
    if (Number.isFinite(value)) {
      next[key] = clamp(value, SPACING_RANGE.min, SPACING_RANGE.max);
    }
  });

  return next;
};

const normalizeRadius = (raw: unknown): RadiusMap => {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_RADIUS };
  }

  const record = raw as Record<string, unknown>;
  const next: RadiusMap = { ...DEFAULT_RADIUS };

  RADIUS_ORDER.forEach((key) => {
    const value = Number(record[key]);
    if (Number.isFinite(value)) {
      next[key] = clamp(value, RADIUS_RANGE.min, RADIUS_RANGE.max);
    }
  });

  return next;
};

const isButtonSize = (value: unknown): value is ButtonSize =>
  BUTTON_SIZES.includes(value as ButtonSize);

const isButtonRadius = (value: unknown): value is ButtonRadiusToken =>
  BUTTON_RADII.includes(value as ButtonRadiusToken);

const isInputSize = (value: unknown): value is InputSize =>
  INPUT_SIZES.includes(value as InputSize);

const isInputRadius = (value: unknown): value is InputRadiusToken =>
  INPUT_RADII.includes(value as InputRadiusToken);

const isCardPadding = (value: unknown): value is CardPaddingToken =>
  CARD_PADDING_OPTIONS.includes(value as CardPaddingToken);

const isCardRadius = (value: unknown): value is CardRadiusToken =>
  CARD_RADII.includes(value as CardRadiusToken);

const isSectionSize = (value: unknown): value is SectionSize =>
  SECTION_SIZES.includes(value as SectionSize);

const isSectionPadding = (value: unknown): value is SectionPaddingToken =>
  SECTION_PADDING_OPTIONS.includes(value as SectionPaddingToken);

const isInteractionEasing = (
  value: unknown,
): value is InteractionEasing =>
  typeof value === "string" && value in INTERACTION_EASINGS;

const toCssVarName = (key: string) =>
  `--uiux-${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`;

const toSpaceVarName = (key: SpacingKey) => `--uiux-space-${key}`;
const toRadiusVarName = (key: RadiusKey) => `--uiux-radius-${key}`;
const spaceVar = (key: SpacingKey) => `var(${toSpaceVarName(key)})`;
const radiusVar = (key: RadiusKey) => `var(${toRadiusVarName(key)})`;

const buildCssVars = (tokens: TokenMap) => {
  const vars: Record<string, string> = {};
  TOKEN_ORDER.forEach((key) => {
    vars[toCssVarName(key)] = tokens[key];
  });
  return vars;
};

const buildTypographyVars = (typography: TypographyMap) => {
  const vars: Record<string, string> = {};
  TYPO_ORDER.forEach((key) => {
    vars[`${toCssVarName(key)}-size`] = `${typography[key].size}px`;
    vars[`${toCssVarName(key)}-line`] = `${typography[key].line}px`;
    vars[`${toCssVarName(key)}-weight`] = `${typography[key].weight}`;
  });
  return vars;
};

const buildSpacingVars = (spacing: SpacingMap) => {
  const vars: Record<string, string> = {};
  SPACING_ORDER.forEach((key) => {
    vars[toSpaceVarName(key)] = `${spacing[key]}px`;
  });
  return vars;
};

const buildRadiusVars = (radius: RadiusMap) => {
  const vars: Record<string, string> = {};
  RADIUS_ORDER.forEach((key) => {
    vars[toRadiusVarName(key)] = `${radius[key]}px`;
  });
  return vars;
};

const getStoredTokens = (): TokenMap => {
  if (typeof window === "undefined") {
    return { ...DEFAULT_TOKENS };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_TOKENS };
    }

    return normalizeTokens(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_TOKENS };
  }
};

const getStoredLightTokens = (): TokenMap => {
  if (typeof window === "undefined") {
    return { ...DEFAULT_LIGHT_TOKENS };
  }

  try {
    const raw = window.localStorage.getItem(LIGHT_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_LIGHT_TOKENS };
    }

    const parsed = JSON.parse(raw) as Partial<TokenMap> | null;
    const next: TokenMap = { ...DEFAULT_LIGHT_TOKENS };
    TOKEN_ORDER.forEach((key) => {
      if (typeof parsed?.[key] === "string") {
        next[key] = parsed[key] as string;
      }
    });
    return next;
  } catch {
    return { ...DEFAULT_LIGHT_TOKENS };
  }
};

const getStoredTypography = (): TypographyMap => {
  if (typeof window === "undefined") {
    return { ...DEFAULT_TYPOGRAPHY };
  }

  try {
    const raw = window.localStorage.getItem(TYPO_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_TYPOGRAPHY };
    }

    return normalizeTypography(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_TYPOGRAPHY };
  }
};

const getStoredSpacing = (): SpacingMap => {
  if (typeof window === "undefined") {
    return { ...DEFAULT_SPACING };
  }

  try {
    const raw = window.localStorage.getItem(SPACE_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_SPACING };
    }

    return normalizeSpacing(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_SPACING };
  }
};

const getStoredRadius = (): RadiusMap => {
  if (typeof window === "undefined") {
    return { ...DEFAULT_RADIUS };
  }

  try {
    const raw = window.localStorage.getItem(RADIUS_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_RADIUS };
    }

    return normalizeRadius(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_RADIUS };
  }
};

const getStoredButtonSettings = (): ButtonSettings => {
  if (typeof window === "undefined") {
    return { ...DEFAULT_BUTTON_SETTINGS };
  }

  try {
    const raw = window.localStorage.getItem(BUTTON_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_BUTTON_SETTINGS };
    }

    const parsed = JSON.parse(raw) as Partial<ButtonSettings> | null;
    const opacityValue = Number(parsed?.disabledOpacity);
    return {
      size: isButtonSize(parsed?.size)
        ? parsed.size
        : DEFAULT_BUTTON_SETTINGS.size,
      radius: isButtonRadius(parsed?.radius)
        ? parsed.radius
        : DEFAULT_BUTTON_SETTINGS.radius,
      primaryHover: normalizeButtonHex(
        parsed?.primaryHover,
        DEFAULT_BUTTON_SETTINGS.primaryHover,
      ),
      secondaryHover: normalizeButtonHex(
        parsed?.secondaryHover,
        DEFAULT_BUTTON_SETTINGS.secondaryHover,
      ),
      focusRing: normalizeButtonHex(
        parsed?.focusRing,
        DEFAULT_BUTTON_SETTINGS.focusRing,
      ),
      disabledOpacity: Number.isFinite(opacityValue)
        ? clamp(
            opacityValue,
            BUTTON_OPACITY_RANGE.min,
            BUTTON_OPACITY_RANGE.max,
          )
        : DEFAULT_BUTTON_SETTINGS.disabledOpacity,
    };
  } catch {
    return { ...DEFAULT_BUTTON_SETTINGS };
  }
};

const getStoredInputSettings = (): InputSettings => {
  if (typeof window === "undefined") {
    return { ...DEFAULT_INPUT_SETTINGS };
  }

  try {
    const raw = window.localStorage.getItem(INPUT_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_INPUT_SETTINGS };
    }

    const parsed = JSON.parse(raw) as Partial<InputSettings> | null;
    return {
      size: isInputSize(parsed?.size)
        ? parsed.size
        : DEFAULT_INPUT_SETTINGS.size,
      radius: isInputRadius(parsed?.radius)
        ? parsed.radius
        : DEFAULT_INPUT_SETTINGS.radius,
      focusRing: normalizeButtonHex(
        parsed?.focusRing,
        DEFAULT_INPUT_SETTINGS.focusRing,
      ),
      error: normalizeButtonHex(parsed?.error, DEFAULT_INPUT_SETTINGS.error),
    };
  } catch {
    return { ...DEFAULT_INPUT_SETTINGS };
  }
};

const getStoredCardSettings = (): CardSettings => {
  if (typeof window === "undefined") {
    return { ...DEFAULT_CARD_SETTINGS };
  }

  try {
    const raw = window.localStorage.getItem(CARD_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_CARD_SETTINGS };
    }

    const parsed = JSON.parse(raw) as Partial<CardSettings> | null;
    const shadowValue = Number(parsed?.shadow);
    return {
      padding: isCardPadding(parsed?.padding)
        ? parsed.padding
        : DEFAULT_CARD_SETTINGS.padding,
      radius: isCardRadius(parsed?.radius)
        ? parsed.radius
        : DEFAULT_CARD_SETTINGS.radius,
      shadow: Number.isFinite(shadowValue)
        ? clamp(shadowValue, CARD_SHADOW_RANGE.min, CARD_SHADOW_RANGE.max)
        : DEFAULT_CARD_SETTINGS.shadow,
    };
  } catch {
    return { ...DEFAULT_CARD_SETTINGS };
  }
};

const getStoredSectionSettings = (): SectionSettings => {
  if (typeof window === "undefined") {
    return { ...DEFAULT_SECTION_SETTINGS };
  }

  try {
    const raw = window.localStorage.getItem(SECTION_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_SECTION_SETTINGS };
    }

    const parsed = JSON.parse(raw) as Partial<SectionSettings> | null;
    return {
      size: isSectionSize(parsed?.size)
        ? parsed.size
        : DEFAULT_SECTION_SETTINGS.size,
      paddingY: isSectionPadding(parsed?.paddingY)
        ? parsed.paddingY
        : DEFAULT_SECTION_SETTINGS.paddingY,
    };
  } catch {
    return { ...DEFAULT_SECTION_SETTINGS };
  }
};

const getStoredVisibility = (): VisibilityMap => {
  if (typeof window === "undefined") {
    return { ...DEFAULT_VISIBILITY };
  }

  try {
    const raw = window.localStorage.getItem(VISIBILITY_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_VISIBILITY };
    }

    const parsed = JSON.parse(raw) as Partial<VisibilityMap> | null;
    return {
      colors:
        typeof parsed?.colors === "boolean"
          ? parsed.colors
          : DEFAULT_VISIBILITY.colors,
      typography:
        typeof parsed?.typography === "boolean"
          ? parsed.typography
          : DEFAULT_VISIBILITY.typography,
      spacing:
        typeof parsed?.spacing === "boolean"
          ? parsed.spacing
          : DEFAULT_VISIBILITY.spacing,
      radius:
        typeof parsed?.radius === "boolean"
          ? parsed.radius
          : DEFAULT_VISIBILITY.radius,
      button:
        typeof parsed?.button === "boolean"
          ? parsed.button
          : DEFAULT_VISIBILITY.button,
      input:
        typeof parsed?.input === "boolean"
          ? parsed.input
          : DEFAULT_VISIBILITY.input,
      card:
        typeof parsed?.card === "boolean"
          ? parsed.card
          : DEFAULT_VISIBILITY.card,
      section:
        typeof parsed?.section === "boolean"
          ? parsed.section
          : DEFAULT_VISIBILITY.section,
      interaction:
        typeof parsed?.interaction === "boolean"
          ? parsed.interaction
          : DEFAULT_VISIBILITY.interaction,
    };
  } catch {
    return { ...DEFAULT_VISIBILITY };
  }
};

const getStoredInteractionSettings = (): InteractionSettings => {
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

const getStoredPreviewTone = (): PreviewTone => {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(PREVIEW_TONE_STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
};

const getTypographyStyle = (key: TypographyKey): CSSProperties => ({
  fontSize: `var(${toCssVarName(key)}-size)`,
  lineHeight: `var(${toCssVarName(key)}-line)`,
  fontWeight: `var(${toCssVarName(key)}-weight)`,
});

export default function Tokens() {
  const { t } = useTranslation("tokens");
  const [tokens, setTokens] = useState<TokenMap>(() => getStoredTokens());
  const [lightTokens, setLightTokens] = useState<TokenMap>(() =>
    getStoredLightTokens(),
  );
  const [typography, setTypography] = useState<TypographyMap>(() =>
    getStoredTypography(),
  );
  const [spacing, setSpacing] = useState<SpacingMap>(() =>
    getStoredSpacing(),
  );
  const [radius, setRadius] = useState<RadiusMap>(() => getStoredRadius());
  const [hexDrafts, setHexDrafts] = useState<TokenMap>(() => getStoredTokens());
  const [lightHexDrafts, setLightHexDrafts] = useState<TokenMap>(() =>
    getStoredLightTokens(),
  );
  const [buttonSettings, setButtonSettings] = useState<ButtonSettings>(() =>
    getStoredButtonSettings(),
  );
  const [buttonHexDrafts, setButtonHexDrafts] = useState<
    Record<ButtonHexKey, string>
  >(() => ({
    primaryHover: DEFAULT_BUTTON_SETTINGS.primaryHover,
    secondaryHover: DEFAULT_BUTTON_SETTINGS.secondaryHover,
    focusRing: DEFAULT_BUTTON_SETTINGS.focusRing,
  }));
  const [inputSettings, setInputSettings] = useState<InputSettings>(() =>
    getStoredInputSettings(),
  );
  const [inputHexDrafts, setInputHexDrafts] = useState<
    Record<InputHexKey, string>
  >(() => ({
    focusRing: DEFAULT_INPUT_SETTINGS.focusRing,
    error: DEFAULT_INPUT_SETTINGS.error,
  }));
  const [cardSettings, setCardSettings] = useState<CardSettings>(() =>
    getStoredCardSettings(),
  );
  const [sectionSettings, setSectionSettings] = useState<SectionSettings>(() =>
    getStoredSectionSettings(),
  );
  const [visibility, setVisibility] = useState<VisibilityMap>(() =>
    getStoredVisibility(),
  );
  const [interactionSettings, setInteractionSettings] =
    useState<InteractionSettings>(() => getStoredInteractionSettings());
  const [previewTone, setPreviewTone] = useState<PreviewTone>(() =>
    getStoredPreviewTone(),
  );
  const [interactionPlayKey, setInteractionPlayKey] = useState(0);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [hoveredLabButton, setHoveredLabButton] = useState<
    "primary" | "confirm" | "play" | null
  >(null);
  const [isLabInputFocused, setIsLabInputFocused] = useState(false);
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [labErrorActive, setLabErrorActive] = useState(false);
  const [labSuccessActive, setLabSuccessActive] = useState(false);
  const errorTimeoutRef = useRef<number | null>(null);
  const successTimeoutRef = useRef<number | null>(null);
  const buttonVariants = [
    { key: "primary", variant: "primary" },
    { key: "secondary", variant: "secondary" },
    { key: "ghost", variant: "ghost" },
  ] as const;
  const buttonStates = [
    { key: "default", state: "default" },
    { key: "hover", state: "hover" },
    { key: "focus", state: "focus" },
    { key: "disabled", state: "disabled" },
  ] as const;
  const inputStates: Array<{
    key: "default" | "focus" | "error" | "disabled";
    previewState: InputPreviewState;
    disabled?: boolean;
  }> = [
    { key: "default", previewState: "default" },
    { key: "focus", previewState: "focus" },
    { key: "error", previewState: "error" },
    { key: "disabled", previewState: "default", disabled: true },
  ];
  const labCardsValue = t("interaction.preview.cards", { returnObjects: true });
  const labCards = Array.isArray(labCardsValue)
    ? (labCardsValue as LabCard[])
    : [];
  const sectionPreviewWidth = SECTION_PREVIEW_WIDTHS[sectionSettings.size];

  const cssVars = useMemo(
    () => ({
      ...buildCssVars(tokens),
      ...buildTypographyVars(typography),
      ...buildSpacingVars(spacing),
      ...buildRadiusVars(radius),
    }),
    [tokens, typography, spacing, radius],
  );
  const previewTokens = previewTone === "light" ? lightTokens : tokens;
  const previewTokenVars = useMemo(
    () => buildCssVars(previewTokens),
    [previewTokens],
  );
  const cssVarsStyle = cssVars as CSSProperties;
  const buttonStyleVars = useMemo(
    () =>
      ({
        "--uiux-btn-primary-hover": buttonSettings.primaryHover,
        "--uiux-btn-secondary-hover": buttonSettings.secondaryHover,
        "--uiux-btn-focus-ring": buttonSettings.focusRing,
        "--uiux-btn-disabled-opacity": `${buttonSettings.disabledOpacity}`,
      }) as CSSProperties,
    [buttonSettings],
  );
  const inputStyleVars = useMemo(
    () =>
      ({
        "--uiux-input-focus": inputSettings.focusRing,
        "--uiux-input-error": inputSettings.error,
      }) as CSSProperties,
    [inputSettings],
  );
  const cardShadow = useMemo(
    () => buildCardShadow(cardSettings.shadow),
    [cardSettings.shadow],
  );
  const cardStyleVars = useMemo(
    () =>
      ({
        backgroundColor: "var(--uiux-preview-surface, var(--uiux-neutral100))",
        borderColor: "var(--uiux-preview-border, var(--uiux-neutral600))",
      }) as CSSProperties,
    [],
  );
  const isPreviewDark = previewTone === "dark";
  const previewSurface = isPreviewDark
    ? "var(--uiux-neutral900)"
    : "var(--uiux-neutral100)";
  const previewText = isPreviewDark
    ? "var(--uiux-neutral100)"
    : "var(--uiux-neutral900)";
  const previewMuted = isPreviewDark
    ? "color-mix(in srgb, var(--uiux-neutral100) 70%, transparent)"
    : "var(--uiux-neutral600)";
  const previewBorder = isPreviewDark
    ? "color-mix(in srgb, var(--uiux-neutral100) 20%, transparent)"
    : "var(--uiux-neutral600)";
  const previewInputBg = isPreviewDark
    ? "color-mix(in srgb, var(--uiux-neutral900) 88%, var(--uiux-neutral100))"
    : "var(--uiux-neutral100)";
  const previewInputText = isPreviewDark
    ? "var(--uiux-neutral100)"
    : "var(--uiux-neutral900)";
  const previewInputPlaceholder = isPreviewDark
    ? "color-mix(in srgb, var(--uiux-neutral100) 60%, transparent)"
    : "var(--uiux-neutral600)";
  const previewInputBorder = isPreviewDark
    ? "color-mix(in srgb, var(--uiux-neutral100) 20%, transparent)"
    : "var(--uiux-neutral600)";
  const previewToneVars: CSSProperties = {
    ["--uiux-preview-surface" as string]: previewSurface,
    ["--uiux-preview-text" as string]: previewText,
    ["--uiux-preview-muted" as string]: previewMuted,
    ["--uiux-preview-border" as string]: previewBorder,
    ["--uiux-input-bg" as string]: previewInputBg,
    ["--uiux-input-text" as string]: previewInputText,
    ["--uiux-input-placeholder" as string]: previewInputPlaceholder,
    ["--uiux-input-border" as string]: previewInputBorder,
  };
  const revealTiming = INTERACTION_EASINGS[interactionSettings.revealEasing];
  const hoverScaleValue = 1 + interactionSettings.hoverScale / 100;
  const labHoverShadow = useMemo(
    () => buildInteractionShadow(interactionSettings.hoverShadow),
    [interactionSettings.hoverShadow],
  );
  const buttonHoverShadow = useMemo(
    () =>
      buildInteractionShadow(
        Math.min(interactionSettings.hoverShadow, 0.24),
      ),
    [interactionSettings.hoverShadow],
  );
  const getRevealStyle = (index: number): CSSProperties =>
    interactionSettings.revealEnabled
      ? {
          animationName: "uiux-reveal",
          animationDuration: `${interactionSettings.revealDuration}ms`,
          animationTimingFunction: revealTiming,
          animationDelay: `${interactionSettings.revealStagger * index}ms`,
          animationFillMode: "both",
        }
      : { opacity: 1, transform: "none" };

  const clearLabTimeout = (ref: MutableRefObject<number | null>) => {
    if (ref.current !== null) {
      window.clearTimeout(ref.current);
      ref.current = null;
    }
  };

  const triggerLabState = (state: "error" | "success") => {
    if (typeof window === "undefined") {
      return;
    }

    clearLabTimeout(errorTimeoutRef);
    clearLabTimeout(successTimeoutRef);

    if (state === "error") {
      setLabSuccessActive(false);
      setLabErrorActive(true);
      errorTimeoutRef.current = window.setTimeout(() => {
        setLabErrorActive(false);
      }, 2000);
    } else {
      setLabErrorActive(false);
      setLabSuccessActive(true);
      successTimeoutRef.current = window.setTimeout(() => {
        setLabSuccessActive(false);
      }, 2000);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    window.localStorage.setItem(LIGHT_STORAGE_KEY, JSON.stringify(lightTokens));
    window.localStorage.setItem(TYPO_STORAGE_KEY, JSON.stringify(typography));
    window.localStorage.setItem(SPACE_STORAGE_KEY, JSON.stringify(spacing));
    window.localStorage.setItem(RADIUS_STORAGE_KEY, JSON.stringify(radius));
    const root = document.documentElement;
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [tokens, lightTokens, typography, spacing, radius, cssVars]);

  useEffect(() => {
    return () => {
      if (typeof window === "undefined") {
        return;
      }
      clearLabTimeout(errorTimeoutRef);
      clearLabTimeout(successTimeoutRef);
    };
  }, []);

  useEffect(() => {
    setHexDrafts(tokens);
  }, [tokens]);

  useEffect(() => {
    setLightHexDrafts(lightTokens);
  }, [lightTokens]);

  useEffect(() => {
    setButtonHexDrafts({
      primaryHover: buttonSettings.primaryHover,
      secondaryHover: buttonSettings.secondaryHover,
      focusRing: buttonSettings.focusRing,
    });
  }, [
    buttonSettings.primaryHover,
    buttonSettings.secondaryHover,
    buttonSettings.focusRing,
  ]);

  useEffect(() => {
    setInputHexDrafts({
      focusRing: inputSettings.focusRing,
      error: inputSettings.error,
    });
  }, [inputSettings.focusRing, inputSettings.error]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      VISIBILITY_STORAGE_KEY,
      JSON.stringify(visibility),
    );
  }, [visibility]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      BUTTON_STORAGE_KEY,
      JSON.stringify(buttonSettings),
    );
    const root = document.documentElement;
    root.style.setProperty("--uiux-btn-primary-hover", buttonSettings.primaryHover);
    root.style.setProperty(
      "--uiux-btn-secondary-hover",
      buttonSettings.secondaryHover,
    );
    root.style.setProperty("--uiux-btn-focus-ring", buttonSettings.focusRing);
    root.style.setProperty(
      "--uiux-btn-disabled-opacity",
      `${buttonSettings.disabledOpacity}`,
    );
  }, [buttonSettings]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      INPUT_STORAGE_KEY,
      JSON.stringify(inputSettings),
    );
    const root = document.documentElement;
    root.style.setProperty("--uiux-input-focus", inputSettings.focusRing);
    root.style.setProperty("--uiux-input-error", inputSettings.error);
  }, [inputSettings]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      CARD_STORAGE_KEY,
      JSON.stringify(cardSettings),
    );
  }, [cardSettings]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      SECTION_STORAGE_KEY,
      JSON.stringify(sectionSettings),
    );
  }, [sectionSettings]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      INTERACTION_STORAGE_KEY,
      JSON.stringify(interactionSettings),
    );
  }, [interactionSettings]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(PREVIEW_TONE_STORAGE_KEY, previewTone);
  }, [previewTone]);

  const handleChange = (key: TokenKey, value: string) => {
    const nextValue = value.toUpperCase();
    setTokens((prev) => ({
      ...prev,
      [key]: nextValue,
    }));
  };

  const handleHexChange = (key: TokenKey, value: string) => {
    const normalized = normalizeHexInput(value);
    setHexDrafts((prev) => ({
      ...prev,
      [key]: normalized,
    }));
    if (isValidHex(normalized)) {
      setTokens((prev) => ({
        ...prev,
        [key]: normalized,
      }));
    }
  };

  const handleHexBlur = (key: TokenKey) => {
    setHexDrafts((prev) => ({
      ...prev,
      [key]: isValidHex(prev[key]) ? prev[key] : tokens[key],
    }));
  };

  const handleLightChange = (key: TokenKey, value: string) => {
    const nextValue = value.toUpperCase();
    setLightTokens((prev) => ({
      ...prev,
      [key]: nextValue,
    }));
  };

  const handleLightHexChange = (key: TokenKey, value: string) => {
    const normalized = normalizeHexInput(value);
    setLightHexDrafts((prev) => ({
      ...prev,
      [key]: normalized,
    }));
    if (isValidHex(normalized)) {
      setLightTokens((prev) => ({
        ...prev,
        [key]: normalized,
      }));
    }
  };

  const handleLightHexBlur = (key: TokenKey) => {
    setLightHexDrafts((prev) => ({
      ...prev,
      [key]: isValidHex(prev[key]) ? prev[key] : lightTokens[key],
    }));
  };

  const handleEyeDropperPick = async (tone: "light" | "dark", key: TokenKey) => {
    if (typeof window === "undefined") {
      return;
    }

    const EyeDropperCtor = (window as Window & { EyeDropper?: any }).EyeDropper;
    if (!EyeDropperCtor) {
      const fallback = document.getElementById(
        `${tone}-color-${key}`,
      ) as HTMLInputElement | null;
      fallback?.click();
      return;
    }

    try {
      const picker = new EyeDropperCtor();
      const result = await picker.open();
      const nextValue =
        typeof result?.sRGBHex === "string"
          ? result.sRGBHex.toUpperCase()
          : null;
      if (!nextValue) {
        return;
      }
      if (tone === "light") {
        setLightTokens((prev) => ({ ...prev, [key]: nextValue }));
      } else {
        setTokens((prev) => ({ ...prev, [key]: nextValue }));
      }
    } catch {
      // ignore cancel
    }
  };

  const handleResetColors = () => {
    setTokens({ ...DEFAULT_TOKENS });
  };

  const handleResetLightColors = () => {
    setLightTokens({ ...DEFAULT_LIGHT_TOKENS });
  };

  const handleResetTypography = () => {
    setTypography({ ...DEFAULT_TYPOGRAPHY });
  };

  const handleResetSpacing = () => {
    setSpacing({ ...DEFAULT_SPACING });
  };

  const handleResetRadius = () => {
    setRadius({ ...DEFAULT_RADIUS });
  };

  const toggleVisibility = (key: keyof VisibilityMap) => {
    setVisibility((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleTypographyChange = (
    key: TypographyKey,
    field: keyof TypographyValue,
    value: number,
  ) => {
    setTypography((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]:
          field === "weight"
            ? value
            : clamp(
                value,
                field === "size" ? SIZE_RANGE.min : LINE_RANGE.min,
                field === "size" ? SIZE_RANGE.max : LINE_RANGE.max,
              ),
      },
    }));
  };

  const handleSpacingChange = (key: SpacingKey, value: number) => {
    setSpacing((prev) => ({
      ...prev,
      [key]: clamp(value, SPACING_RANGE.min, SPACING_RANGE.max),
    }));
  };

  const handleRadiusChange = (key: RadiusKey, value: number) => {
    setRadius((prev) => ({
      ...prev,
      [key]: clamp(value, RADIUS_RANGE.min, RADIUS_RANGE.max),
    }));
  };

  const handleResetButton = () => {
    setButtonSettings({ ...DEFAULT_BUTTON_SETTINGS });
  };

  const handleButtonSize = (size: ButtonSize) => {
    setButtonSettings((prev) => ({ ...prev, size }));
  };

  const handleButtonRadius = (radiusToken: ButtonRadiusToken) => {
    setButtonSettings((prev) => ({ ...prev, radius: radiusToken }));
  };

  const handleButtonOpacity = (value: number) => {
    setButtonSettings((prev) => ({
      ...prev,
      disabledOpacity: clamp(
        value,
        BUTTON_OPACITY_RANGE.min,
        BUTTON_OPACITY_RANGE.max,
      ),
    }));
  };

  const handleButtonHexChange = (key: ButtonHexKey, value: string) => {
    const normalized = normalizeHexInput(value);
    setButtonHexDrafts((prev) => ({
      ...prev,
      [key]: normalized,
    }));
    if (isValidHex(normalized)) {
      setButtonSettings((prev) => ({
        ...prev,
        [key]: normalized,
      }));
    }
  };

  const handleButtonHexBlur = (key: ButtonHexKey) => {
    setButtonHexDrafts((prev) => ({
      ...prev,
      [key]: isValidHex(prev[key]) ? prev[key] : buttonSettings[key],
    }));
  };

  const handleResetInput = () => {
    setInputSettings({ ...DEFAULT_INPUT_SETTINGS });
  };

  const handleInputSize = (size: InputSize) => {
    setInputSettings((prev) => ({ ...prev, size }));
  };

  const handleInputRadius = (radiusToken: InputRadiusToken) => {
    setInputSettings((prev) => ({ ...prev, radius: radiusToken }));
  };

  const handleInputHexChange = (key: InputHexKey, value: string) => {
    const normalized = normalizeHexInput(value);
    setInputHexDrafts((prev) => ({
      ...prev,
      [key]: normalized,
    }));
    if (isValidHex(normalized)) {
      setInputSettings((prev) => ({
        ...prev,
        [key]: normalized,
      }));
    }
  };

  const handleInputHexBlur = (key: InputHexKey) => {
    setInputHexDrafts((prev) => ({
      ...prev,
      [key]: isValidHex(prev[key]) ? prev[key] : inputSettings[key],
    }));
  };

  const handleResetCard = () => {
    setCardSettings({
      padding: DEFAULT_CARD_SETTINGS.padding,
      radius: DEFAULT_CARD_SETTINGS.radius,
      shadow: DEFAULT_CARD_SETTINGS.shadow,
    });
  };

  const handleCardPadding = (padding: CardPaddingToken) => {
    setCardSettings((prev) => ({ ...prev, padding }));
  };

  const handleCardRadius = (radiusToken: CardRadiusToken) => {
    setCardSettings((prev) => ({ ...prev, radius: radiusToken }));
  };

  const handleCardShadow = (value: number) => {
    setCardSettings((prev) => ({
      ...prev,
      shadow: clamp(value, CARD_SHADOW_RANGE.min, CARD_SHADOW_RANGE.max),
    }));
  };

  const handleResetSection = () => {
    setSectionSettings({ ...DEFAULT_SECTION_SETTINGS });
  };

  const handleSectionSize = (size: SectionSize) => {
    setSectionSettings((prev) => ({ ...prev, size }));
  };

  const handleSectionPadding = (paddingY: SectionPaddingToken) => {
    setSectionSettings((prev) => ({ ...prev, paddingY }));
  };

  const handleInteractionToggle = (key: keyof InteractionSettings) => {
    setInteractionSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleInteractionNumber = (
    key: keyof InteractionSettings,
    value: number,
  ) => {
    setInteractionSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleInteractionEasing = (value: InteractionEasing) => {
    setInteractionSettings((prev) => ({ ...prev, revealEasing: value }));
  };

  const handleResetInteraction = () => {
    setInteractionSettings({ ...DEFAULT_INTERACTION_SETTINGS });
  };

  const resetPreviewForm = () => {
    setBirthYear("");
    setGender("");
    setEmail("");
    setIsLabInputFocused(false);
    setLabErrorActive(false);
    setLabSuccessActive(false);
    if (typeof window !== "undefined") {
      clearLabTimeout(errorTimeoutRef);
      clearLabTimeout(successTimeoutRef);
    }
  };

  const SELECT_SIZE_STYLES: Record<InputSize, string> = {
    sm: "text-[var(--uiux-body-size,16px)] px-[var(--uiux-space-md,12px)] py-[var(--uiux-space-xs,4px)]",
    md: "text-[var(--uiux-body-size,16px)] px-[var(--uiux-space-lg,16px)] py-[var(--uiux-space-sm,8px)]",
    lg: "text-[var(--uiux-body-size,16px)] px-[var(--uiux-space-xl,24px)] py-[var(--uiux-space-md,12px)]",
  };

  const chipClass = (active: boolean) =>
    `rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em] transition ${
      active
        ? "border-amber-300/60 bg-amber-400/20 text-amber-100"
        : "border-slate-800 text-slate-300 hover:border-slate-600"
    }`;

  const showLabButtonHoverPrimary =
    interactionSettings.forceHover || hoveredLabButton === "primary";
  const showLabButtonHoverConfirm =
    interactionSettings.forceHover || hoveredLabButton === "confirm";
  const showLabButtonHoverPlay =
    interactionSettings.forceHover || hoveredLabButton === "play";
  const showLabFocus = interactionSettings.forceFocus || isLabInputFocused;
  const showLabError = labErrorActive;
  const showLabSuccess = labSuccessActive;
  const isFormComplete =
    birthYear.trim().length > 0 &&
    gender.trim().length > 0 &&
    email.trim().length > 0;
  const showConfirmHover = showLabButtonHoverConfirm && isFormComplete;
  const labInputState: InputPreviewState = showLabError
    ? "error"
    : showLabSuccess
      ? "success"
      : showLabFocus
        ? "focus"
        : "default";
  const getHoverTransform = (active: boolean) =>
    active
      ? `translateY(-${interactionSettings.hoverLift}px) scale(${hoverScaleValue})`
      : "translateY(0) scale(1)";
  const getCardHoverStyle = (active: boolean): CSSProperties => ({
    transform: getHoverTransform(active),
    boxShadow: active ? labHoverShadow : cardShadow,
    transition: `transform 180ms ${revealTiming}, box-shadow 180ms ${revealTiming}`,
  });
  const getButtonHoverStyle = (active: boolean): CSSProperties => ({
    transform: getHoverTransform(active),
    boxShadow: active ? buttonHoverShadow : "none",
    transition: `transform 180ms ${revealTiming}, box-shadow 180ms ${revealTiming}`,
  });


  return (
    <div className="flex flex-col gap-10" style={cssVarsStyle}>
      <style>{`
        @keyframes uiux-reveal {
          from {
            opacity: 0;
            transform: translateY(var(--uiux-reveal-distance, 16px));
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <section className="flex flex-col gap-6 motion-safe:animate-fade-in">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-200">
          {t("tagline")}
        </p>
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">{t("subtitle")}</p>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col gap-6 lg:self-start">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{t("sections.lightPicker")}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggleVisibility("colors")}
                aria-label={
                  visibility.colors
                    ? t("actions.hideColors")
                    : t("actions.showColors")
                }
                title={
                  visibility.colors
                    ? t("actions.hideColors")
                    : t("actions.showColors")
                }
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
              >
                <span aria-hidden="true">
                  {visibility.colors
                    ? t("icons.expanded")
                    : t("icons.collapsed")}
                </span>
              </button>
              <button
                type="button"
                onClick={handleResetLightColors}
                aria-label={t("actions.resetLightColors")}
                title={t("actions.resetLightColors")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
              >
                <span aria-hidden="true">{t("icons.reset")}</span>
              </button>
            </div>
          </div>

          {visibility.colors ? (
            <div className="grid gap-6">
              <div className="grid gap-4">
                {TOKEN_ORDER.map((key) => (
                  <div
                    key={`light-${key}`}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold">
                        {t(`fields.${key}.label`)}
                      </span>
                      <span className="text-xs text-slate-400">
                        {t(`fields.${key}.hint`)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-700"
                        style={{ backgroundColor: lightTokens[key] }}
                        title={t(`fields.${key}.label`)}
                      >
                        <input
                          id={`light-color-${key}`}
                          type="color"
                          value={lightTokens[key]}
                          onChange={(event) =>
                            handleLightChange(key, event.target.value)
                          }
                          className="absolute inset-0 cursor-pointer opacity-0"
                          aria-label={t(`fields.${key}.label`)}
                        />
                        <button
                          type="button"
                          onClick={() => handleEyeDropperPick("light", key)}
                          onMouseDown={(event) => event.preventDefault()}
                          className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white transition hover:border-white/70"
                          aria-label={t("actions.pickColor")}
                          title={t("actions.pickColor")}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M12 3.5l8.5 8.5-3 3-8.5-8.5z" />
                            <path d="M3.5 12l5.1-5.1" />
                            <path d="M14.5 6.5l3 3" />
                            <path d="M5 19h6" />
                          </svg>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={lightHexDrafts[key]}
                        onChange={(event) =>
                          handleLightHexChange(key, event.target.value)
                        }
                        onBlur={() => handleLightHexBlur(key)}
                        className="w-24 rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
                        aria-label={t(`fields.${key}.label`)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold">
                  {t("sections.picker")}
                </h3>
                <button
                  type="button"
                  onClick={handleResetColors}
                  aria-label={t("actions.resetColors")}
                  title={t("actions.resetColors")}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
                >
                  <span aria-hidden="true">{t("icons.reset")}</span>
                </button>
              </div>
              <div className="grid gap-4">
                {TOKEN_ORDER.map((key) => (
                  <div
                    key={key}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold">
                        {t(`fields.${key}.label`)}
                      </span>
                      <span className="text-xs text-slate-400">
                        {t(`fields.${key}.hint`)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-700"
                        style={{ backgroundColor: tokens[key] }}
                        title={t(`fields.${key}.label`)}
                      >
                        <input
                          id={`dark-color-${key}`}
                          type="color"
                          value={tokens[key]}
                          onChange={(event) =>
                            handleChange(key, event.target.value)
                          }
                          className="absolute inset-0 cursor-pointer opacity-0"
                          aria-label={t(`fields.${key}.label`)}
                        />
                        <button
                          type="button"
                          onClick={() => handleEyeDropperPick("dark", key)}
                          onMouseDown={(event) => event.preventDefault()}
                          className="absolute left-1/2 top-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/40 text-white transition hover:border-white/70"
                          aria-label={t("actions.pickColor")}
                          title={t("actions.pickColor")}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M12 3.5l8.5 8.5-3 3-8.5-8.5z" />
                            <path d="M3.5 12l5.1-5.1" />
                            <path d="M14.5 6.5l3 3" />
                            <path d="M5 19h6" />
                          </svg>
                        </button>
                      </div>
                      <input
                        type="text"
                        value={hexDrafts[key]}
                        onChange={(event) =>
                          handleHexChange(key, event.target.value)
                        }
                        onBlur={() => handleHexBlur(key)}
                        className="w-24 rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
                        aria-label={t(`fields.${key}.label`)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-2 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">
              {t("sections.typography")}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggleVisibility("typography")}
                aria-label={
                  visibility.typography
                    ? t("actions.hideTypography")
                    : t("actions.showTypography")
                }
                title={
                  visibility.typography
                    ? t("actions.hideTypography")
                    : t("actions.showTypography")
                }
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
              >
                <span aria-hidden="true">
                  {visibility.typography
                    ? t("icons.expanded")
                    : t("icons.collapsed")}
                </span>
              </button>
              <button
                type="button"
                onClick={handleResetTypography}
                aria-label={t("actions.resetTypography")}
                title={t("actions.resetTypography")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
              >
                <span aria-hidden="true">{t("icons.reset")}</span>
              </button>
            </div>
          </div>

          {visibility.typography ? (
            <div className="grid gap-4">
              {TYPO_ORDER.map((key) => (
                <div
                  key={key}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">
                      {t(`fields.${key}.label`)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {t(`fields.${key}.hint`)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {t("typography.sizeLabel")}
                    </label>
                    <input
                      type="number"
                      min={SIZE_RANGE.min}
                      max={SIZE_RANGE.max}
                      value={typography[key].size}
                      onChange={(event) =>
                        handleTypographyChange(
                          key,
                          "size",
                          Number(event.target.value),
                        )
                      }
                      className="w-20 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
                    />
                    <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {t("typography.lineLabel")}
                    </label>
                    <input
                      type="number"
                      min={LINE_RANGE.min}
                      max={LINE_RANGE.max}
                      value={typography[key].line}
                      onChange={(event) =>
                        handleTypographyChange(
                          key,
                          "line",
                          Number(event.target.value),
                        )
                      }
                      className="w-20 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
                    />
                    <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {t("typography.weightLabel")}
                    </label>
                    <select
                      value={typography[key].weight}
                      onChange={(event) =>
                        handleTypographyChange(
                          key,
                          "weight",
                          Number(event.target.value),
                        )
                      }
                      className="rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
                    >
                      {WEIGHTS.map((weight) => (
                        <option key={weight} value={weight}>
                          {weight}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-2 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{t("sections.spacing")}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggleVisibility("spacing")}
                aria-label={
                  visibility.spacing
                    ? t("actions.hideSpacing")
                    : t("actions.showSpacing")
                }
                title={
                  visibility.spacing
                    ? t("actions.hideSpacing")
                    : t("actions.showSpacing")
                }
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
              >
                <span aria-hidden="true">
                  {visibility.spacing
                    ? t("icons.expanded")
                    : t("icons.collapsed")}
                </span>
              </button>
              <button
                type="button"
                onClick={handleResetSpacing}
                aria-label={t("actions.resetSpacing")}
                title={t("actions.resetSpacing")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
              >
                <span aria-hidden="true">{t("icons.reset")}</span>
              </button>
            </div>
          </div>

          {visibility.spacing ? (
            <div className="grid gap-4">
              {SPACING_ORDER.map((key) => (
                <div
                  key={key}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">
                      {t(`spacing.steps.${key}.label`)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {t(`spacing.steps.${key}.hint`)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {t("spacing.valueLabel")}
                    </label>
                    <input
                      type="number"
                      min={SPACING_RANGE.min}
                      max={SPACING_RANGE.max}
                      value={spacing[key]}
                      onChange={(event) =>
                        handleSpacingChange(key, Number(event.target.value))
                      }
                      className="w-24 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
                    />
                    <span className="text-xs text-slate-400">
                      {t("spacing.unit")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-2 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{t("sections.radius")}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggleVisibility("radius")}
                aria-label={
                  visibility.radius
                    ? t("actions.hideRadius")
                    : t("actions.showRadius")
                }
                title={
                  visibility.radius
                    ? t("actions.hideRadius")
                    : t("actions.showRadius")
                }
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
              >
                <span aria-hidden="true">
                  {visibility.radius
                    ? t("icons.expanded")
                    : t("icons.collapsed")}
                </span>
              </button>
              <button
                type="button"
                onClick={handleResetRadius}
                aria-label={t("actions.resetRadius")}
                title={t("actions.resetRadius")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
              >
                <span aria-hidden="true">{t("icons.reset")}</span>
              </button>
            </div>
          </div>

          {visibility.radius ? (
            <div className="grid gap-4">
              {RADIUS_ORDER.map((key) => (
                <div
                  key={key}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">
                      {t(`radius.steps.${key}.label`)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {t(`radius.steps.${key}.hint`)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {t("radius.valueLabel")}
                    </label>
                    <input
                      type="number"
                      min={RADIUS_RANGE.min}
                      max={RADIUS_RANGE.max}
                      value={radius[key]}
                      onChange={(event) =>
                        handleRadiusChange(key, Number(event.target.value))
                      }
                      className="w-24 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-200"
                    />
                    <span className="text-xs text-slate-400">
                      {t("radius.unit")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-2 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{t("sections.button")}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggleVisibility("button")}
                aria-label={
                  visibility.button
                    ? t("actions.hideButton")
                    : t("actions.showButton")
                }
                title={
                  visibility.button
                    ? t("actions.hideButton")
                    : t("actions.showButton")
                }
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
              >
                <span aria-hidden="true">
                  {visibility.button
                    ? t("icons.expanded")
                    : t("icons.collapsed")}
                </span>
              </button>
              <button
                type="button"
                onClick={handleResetButton}
                aria-label={t("actions.resetButton")}
                title={t("actions.resetButton")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
              >
                <span aria-hidden="true">{t("icons.reset")}</span>
              </button>
            </div>
          </div>

          {visibility.button ? (
            <div className="grid gap-4">
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t("buttonControls.sizeLabel")}
                </span>
                <div className="flex flex-wrap gap-2">
                  {BUTTON_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleButtonSize(size)}
                      className={chipClass(buttonSettings.size === size)}
                    >
                      {t(`buttonControls.sizes.${size}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t("buttonControls.radiusLabel")}
                </span>
                <div className="flex flex-wrap gap-2">
                  {BUTTON_RADII.map((radiusToken) => (
                    <button
                      key={radiusToken}
                      type="button"
                      onClick={() => handleButtonRadius(radiusToken)}
                      className={chipClass(
                        buttonSettings.radius === radiusToken,
                      )}
                    >
                      {t(`buttonControls.radii.${radiusToken}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t("buttonControls.primaryHoverLabel")}
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={buttonSettings.primaryHover}
                    onChange={(event) =>
                      handleButtonHexChange(
                        "primaryHover",
                        event.target.value,
                      )
                    }
                    className="h-10 w-10 cursor-pointer rounded-full border border-slate-700 bg-transparent"
                    aria-label={t("buttonControls.primaryHoverLabel")}
                  />
                  <input
                    type="text"
                    value={buttonHexDrafts.primaryHover}
                    onChange={(event) =>
                      handleButtonHexChange("primaryHover", event.target.value)
                    }
                    onBlur={() => handleButtonHexBlur("primaryHover")}
                    className="w-28 rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t("buttonControls.secondaryHoverLabel")}
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={buttonSettings.secondaryHover}
                    onChange={(event) =>
                      handleButtonHexChange(
                        "secondaryHover",
                        event.target.value,
                      )
                    }
                    className="h-10 w-10 cursor-pointer rounded-full border border-slate-700 bg-transparent"
                    aria-label={t("buttonControls.secondaryHoverLabel")}
                  />
                  <input
                    type="text"
                    value={buttonHexDrafts.secondaryHover}
                    onChange={(event) =>
                      handleButtonHexChange(
                        "secondaryHover",
                        event.target.value,
                      )
                    }
                    onBlur={() => handleButtonHexBlur("secondaryHover")}
                    className="w-28 rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t("buttonControls.focusRingLabel")}
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={buttonSettings.focusRing}
                    onChange={(event) =>
                      handleButtonHexChange("focusRing", event.target.value)
                    }
                    className="h-10 w-10 cursor-pointer rounded-full border border-slate-700 bg-transparent"
                    aria-label={t("buttonControls.focusRingLabel")}
                  />
                  <input
                    type="text"
                    value={buttonHexDrafts.focusRing}
                    onChange={(event) =>
                      handleButtonHexChange("focusRing", event.target.value)
                    }
                    onBlur={() => handleButtonHexBlur("focusRing")}
                    className="w-28 rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t("buttonControls.opacityLabel")}
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={BUTTON_OPACITY_RANGE.min}
                    max={BUTTON_OPACITY_RANGE.max}
                    step="0.05"
                    value={buttonSettings.disabledOpacity}
                    onChange={(event) =>
                      handleButtonOpacity(Number(event.target.value))
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-slate-300">
                    {Math.round(buttonSettings.disabledOpacity * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-2 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{t("sections.input")}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggleVisibility("input")}
                aria-label={
                  visibility.input
                    ? t("actions.hideInput")
                    : t("actions.showInput")
                }
                title={
                  visibility.input
                    ? t("actions.hideInput")
                    : t("actions.showInput")
                }
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
              >
                <span aria-hidden="true">
                  {visibility.input
                    ? t("icons.expanded")
                    : t("icons.collapsed")}
                </span>
              </button>
              <button
                type="button"
                onClick={handleResetInput}
                aria-label={t("actions.resetInput")}
                title={t("actions.resetInput")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
              >
                <span aria-hidden="true">{t("icons.reset")}</span>
              </button>
            </div>
          </div>

          {visibility.input ? (
            <div className="grid gap-4">
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t("inputControls.sizeLabel")}
                </span>
                <div className="flex flex-wrap gap-2">
                  {INPUT_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleInputSize(size)}
                      className={chipClass(inputSettings.size === size)}
                    >
                      {t(`inputControls.sizes.${size}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t("inputControls.radiusLabel")}
                </span>
                <div className="flex flex-wrap gap-2">
                  {INPUT_RADII.map((radiusToken) => (
                    <button
                      key={radiusToken}
                      type="button"
                      onClick={() => handleInputRadius(radiusToken)}
                      className={chipClass(
                        inputSettings.radius === radiusToken,
                      )}
                    >
                      {t(`inputControls.radii.${radiusToken}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t("inputControls.focusLabel")}
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={inputSettings.focusRing}
                    onChange={(event) =>
                      handleInputHexChange("focusRing", event.target.value)
                    }
                    className="h-10 w-10 cursor-pointer rounded-full border border-slate-700 bg-transparent"
                    aria-label={t("inputControls.focusLabel")}
                  />
                  <input
                    type="text"
                    value={inputHexDrafts.focusRing}
                    onChange={(event) =>
                      handleInputHexChange("focusRing", event.target.value)
                    }
                    onBlur={() => handleInputHexBlur("focusRing")}
                    className="w-28 rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t("inputControls.errorLabel")}
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={inputSettings.error}
                    onChange={(event) =>
                      handleInputHexChange("error", event.target.value)
                    }
                    className="h-10 w-10 cursor-pointer rounded-full border border-slate-700 bg-transparent"
                    aria-label={t("inputControls.errorLabel")}
                  />
                  <input
                    type="text"
                    value={inputHexDrafts.error}
                    onChange={(event) =>
                      handleInputHexChange("error", event.target.value)
                    }
                    onBlur={() => handleInputHexBlur("error")}
                    className="w-28 rounded-full border border-slate-800 bg-slate-950/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-2 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{t("sections.card")}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggleVisibility("card")}
                aria-label={
                  visibility.card ? t("actions.hideCard") : t("actions.showCard")
                }
                title={
                  visibility.card ? t("actions.hideCard") : t("actions.showCard")
                }
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
              >
                <span aria-hidden="true">
                  {visibility.card ? t("icons.expanded") : t("icons.collapsed")}
                </span>
              </button>
              <button
                type="button"
                onClick={handleResetCard}
                aria-label={t("actions.resetCard")}
                title={t("actions.resetCard")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
              >
                <span aria-hidden="true">{t("icons.reset")}</span>
              </button>
            </div>
          </div>

          {visibility.card ? (
            <div className="grid gap-4">
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t("cardControls.paddingLabel")}
                </span>
                <div className="flex flex-wrap gap-2">
                  {CARD_PADDING_OPTIONS.map((padding) => (
                    <button
                      key={padding}
                      type="button"
                      onClick={() => handleCardPadding(padding)}
                      className={chipClass(cardSettings.padding === padding)}
                    >
                      {t(`cardControls.padding.${padding}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t("cardControls.radiusLabel")}
                </span>
                <div className="flex flex-wrap gap-2">
                  {CARD_RADII.map((radiusToken) => (
                    <button
                      key={radiusToken}
                      type="button"
                      onClick={() => handleCardRadius(radiusToken)}
                      className={chipClass(cardSettings.radius === radiusToken)}
                    >
                      {t(`cardControls.radii.${radiusToken}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t("cardControls.shadowLabel")}
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={CARD_SHADOW_RANGE.min}
                    max={CARD_SHADOW_RANGE.max}
                    step="0.02"
                    value={cardSettings.shadow}
                    onChange={(event) =>
                      handleCardShadow(Number(event.target.value))
                    }
                    className="w-full"
                  />
                  <span className="text-xs text-slate-300">
                    {Math.round(cardSettings.shadow * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-2 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{t("sections.section")}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggleVisibility("section")}
                aria-label={
                  visibility.section
                    ? t("actions.hideSection")
                    : t("actions.showSection")
                }
                title={
                  visibility.section
                    ? t("actions.hideSection")
                    : t("actions.showSection")
                }
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
              >
                <span aria-hidden="true">
                  {visibility.section
                    ? t("icons.expanded")
                    : t("icons.collapsed")}
                </span>
              </button>
              <button
                type="button"
                onClick={handleResetSection}
                aria-label={t("actions.resetSection")}
                title={t("actions.resetSection")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
              >
                <span aria-hidden="true">{t("icons.reset")}</span>
              </button>
            </div>
          </div>

          {visibility.section ? (
            <div className="grid gap-4">
              <p className="text-sm text-slate-400">
                {t("sectionControls.hint")}
              </p>
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t("sectionControls.sizeLabel")}
                </span>
                <p className="text-xs text-slate-400">
                  {t("sectionControls.sizeHint")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {SECTION_SIZES.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSectionSize(size)}
                      className={chipClass(sectionSettings.size === size)}
                    >
                      {t(`sectionControls.sizes.${size}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {t("sectionControls.paddingLabel")}
                </span>
                <p className="text-xs text-slate-400">
                  {t("sectionControls.paddingHint")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {SECTION_PADDING_OPTIONS.map((padding) => (
                    <button
                      key={padding}
                      type="button"
                      onClick={() => handleSectionPadding(padding)}
                      className={chipClass(sectionSettings.paddingY === padding)}
                    >
                      {t(`sectionControls.padding.${padding}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-2 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{t("interaction.title")}</h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggleVisibility("interaction")}
                aria-label={
                  visibility.interaction
                    ? t("actions.hideInteraction")
                    : t("actions.showInteraction")
                }
                title={
                  visibility.interaction
                    ? t("actions.hideInteraction")
                    : t("actions.showInteraction")
                }
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
              >
                <span aria-hidden="true">
                  {visibility.interaction
                    ? t("icons.expanded")
                    : t("icons.collapsed")}
                </span>
              </button>
              <button
                type="button"
                onClick={handleResetInteraction}
                aria-label={t("interaction.actions.reset")}
                title={t("interaction.actions.reset")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
              >
                <span aria-hidden="true">{t("icons.reset")}</span>
              </button>
            </div>
          </div>

          {visibility.interaction ? (
            <div className="grid gap-4">
              <p className="text-sm text-slate-400">
                {t("interaction.subtitle")}
              </p>
              <div className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">
                      {t("interaction.controls.reveal.title")}
                    </p>
                    <p className="text-xs text-slate-400">
                      {t("interaction.controls.reveal.hint")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInteractionToggle("revealEnabled")}
                    className={chipClass(interactionSettings.revealEnabled)}
                  >
                    {t("interaction.controls.reveal.toggle")}
                  </button>
                </div>
                <div className="grid gap-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {t("interaction.controls.reveal.duration")}
                  </span>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={REVEAL_DURATION_RANGE.min}
                      max={REVEAL_DURATION_RANGE.max}
                      step="20"
                      value={interactionSettings.revealDuration}
                      onChange={(event) =>
                        handleInteractionNumber(
                          "revealDuration",
                          Number(event.target.value),
                        )
                      }
                      className="w-full"
                    />
                    <span className="text-xs text-slate-300">
                      {interactionSettings.revealDuration}
                      {t("interaction.units.ms")}
                    </span>
                  </div>
                </div>
                <div className="grid gap-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {t("interaction.controls.reveal.stagger")}
                  </span>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={REVEAL_STAGGER_RANGE.min}
                      max={REVEAL_STAGGER_RANGE.max}
                      step="10"
                      value={interactionSettings.revealStagger}
                      onChange={(event) =>
                        handleInteractionNumber(
                          "revealStagger",
                          Number(event.target.value),
                        )
                      }
                      className="w-full"
                    />
                    <span className="text-xs text-slate-300">
                      {interactionSettings.revealStagger}
                      {t("interaction.units.ms")}
                    </span>
                  </div>
                </div>
                <div className="grid gap-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {t("interaction.controls.reveal.distance")}
                  </span>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={REVEAL_DISTANCE_RANGE.min}
                      max={REVEAL_DISTANCE_RANGE.max}
                      step="2"
                      value={interactionSettings.revealDistance}
                      onChange={(event) =>
                        handleInteractionNumber(
                          "revealDistance",
                          Number(event.target.value),
                        )
                      }
                      className="w-full"
                    />
                    <span className="text-xs text-slate-300">
                      {interactionSettings.revealDistance}
                      {t("interaction.units.px")}
                    </span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {t("interaction.controls.reveal.easing")}
                  </span>
                  <select
                    value={interactionSettings.revealEasing}
                    onChange={(event) =>
                      handleInteractionEasing(
                        event.target.value as InteractionEasing,
                      )
                    }
                    className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 px-3 py-2 text-sm text-slate-200"
                  >
                    {Object.keys(INTERACTION_EASINGS).map((key) => (
                      <option key={key} value={key}>
                        {t(`interaction.easing.${key}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">
                      {t("interaction.controls.hover.title")}
                    </p>
                    <p className="text-xs text-slate-400">
                      {t("interaction.controls.hover.hint")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleInteractionToggle("forceHover")}
                    className={chipClass(interactionSettings.forceHover)}
                  >
                    {t("interaction.controls.hover.toggle")}
                  </button>
                </div>
                <div className="grid gap-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {t("interaction.controls.hover.lift")}
                  </span>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={HOVER_LIFT_RANGE.min}
                      max={HOVER_LIFT_RANGE.max}
                      step="1"
                      value={interactionSettings.hoverLift}
                      onChange={(event) =>
                        handleInteractionNumber(
                          "hoverLift",
                          Number(event.target.value),
                        )
                      }
                      className="w-full"
                    />
                    <span className="text-xs text-slate-300">
                      {interactionSettings.hoverLift}
                      {t("interaction.units.px")}
                    </span>
                  </div>
                </div>
                <div className="grid gap-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {t("interaction.controls.hover.scale")}
                  </span>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={HOVER_SCALE_RANGE.min}
                      max={HOVER_SCALE_RANGE.max}
                      step="0.5"
                      value={interactionSettings.hoverScale}
                      onChange={(event) =>
                        handleInteractionNumber(
                          "hoverScale",
                          Number(event.target.value),
                        )
                      }
                      className="w-full"
                    />
                    <span className="text-xs text-slate-300">
                      {interactionSettings.hoverScale}
                      {t("interaction.units.percent")}
                    </span>
                  </div>
                </div>
                <div className="grid gap-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {t("interaction.controls.hover.shadow")}
                  </span>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={HOVER_SHADOW_RANGE.min}
                      max={HOVER_SHADOW_RANGE.max}
                      step="0.02"
                      value={interactionSettings.hoverShadow}
                      onChange={(event) =>
                        handleInteractionNumber(
                          "hoverShadow",
                          Number(event.target.value),
                        )
                      }
                      className="w-full"
                    />
                    <span className="text-xs text-slate-300">
                      {Math.round(interactionSettings.hoverShadow * 100)}%
                    </span>
                  </div>
                </div>
              </div>

            </div>
          ) : null}

        </div>

        <div className="flex flex-col gap-6">
          <Card
            className="sticky top-6 flex flex-col gap-6"
            paddingToken={cardSettings.padding}
            radiusToken={cardSettings.radius}
            shadow={cardShadow}
            style={{
              ...cardStyleVars,
              ...previewTokenVars,
              ...previewToneVars,
              color: "var(--uiux-preview-text, var(--uiux-neutral900))",
              gap: spaceVar("lg"),
              ["--uiux-reveal-distance" as string]: `${interactionSettings.revealDistance}px`,
            }}
          >
            <div
              className="flex flex-wrap items-center justify-between gap-3"
              style={{ gap: spaceVar("sm") }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{
                    backgroundColor: "var(--uiux-accent)",
                    color: "var(--uiux-neutral100)",
                    borderRadius: radiusVar("xl"),
                    padding: `${spaceVar("xs")} ${spaceVar("sm")}`,
                  }}
                >
                  {t("preview.badge")}
                </span>
                <span
                  className="text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "var(--uiux-preview-muted, var(--uiux-neutral600))" }}
                >
                  {t("preview.badgeNote")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="sr-only">{t("preview.tone.label")}</span>
                <div className="flex items-center gap-1 rounded-full border p-1"
                  style={{
                    borderColor: "var(--uiux-preview-border, var(--uiux-neutral600))",
                  }}
                >
                  {PREVIEW_TONES.map((tone) => {
                    const isActive = tone === previewTone;
                    const isLight = tone === "light";
                    return (
                      <button
                        key={tone}
                        type="button"
                        onClick={() => setPreviewTone(tone)}
                        aria-label={t(`preview.tone.${tone}`)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border transition"
                        style={{
                          borderColor: "transparent",
                          backgroundColor: isActive
                            ? "var(--uiux-accent)"
                            : "transparent",
                          color: isActive
                            ? "var(--uiux-neutral100)"
                            : "var(--uiux-preview-muted, var(--uiux-neutral600))",
                        }}
                      >
                        {isLight ? (
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="4.2" />
                            <path d="M12 3.2v2.1M12 18.7v2.1M4.2 12h2.1M17.7 12h2.1M6.2 6.2l1.5 1.5M16.3 16.3l1.5 1.5M6.2 17.8l1.5-1.5M16.3 7.7l1.5-1.5" />
                          </svg>
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7.1 7.1 0 1 0 11.5 11.5Z" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2" style={{ gap: spaceVar("xs") }}>
              <h3 className="text-2xl font-semibold" style={getTypographyStyle("h3")}>
                {t("preview.title")}
              </h3>
              <p
                style={{
                  ...getTypographyStyle("body"),
                  color: "var(--uiux-preview-muted, var(--uiux-neutral600))",
                }}
              >
                {t("preview.body")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3" style={{ gap: spaceVar("sm") }}>
              <Button
                variant="primary"
                size={buttonSettings.size}
                radiusToken={buttonSettings.radius}
                previewState={showLabButtonHoverPrimary ? "hover" : "default"}
                onMouseEnter={() => setHoveredLabButton("primary")}
                onMouseLeave={() => setHoveredLabButton(null)}
                onClick={() => triggerLabState("error")}
                style={{
                  ...buttonStyleVars,
                  ...getButtonHoverStyle(showLabButtonHoverPrimary),
                  ...(isPreviewDark ? { color: "var(--uiux-neutral900)" } : {}),
                }}
              >
                {t("interaction.controls.focus.error")}
              </Button>
              <Button
                variant="secondary"
                size={buttonSettings.size}
                radiusToken={buttonSettings.radius}
                previewState={showLabButtonHoverPlay ? "hover" : "default"}
                onMouseEnter={() => setHoveredLabButton("play")}
                onMouseLeave={() => setHoveredLabButton(null)}
                onClick={() => {
                  setInteractionPlayKey((prev) => prev + 1);
                  resetPreviewForm();
                }}
                style={{
                  ...buttonStyleVars,
                  ...getButtonHoverStyle(showLabButtonHoverPlay),
                  ...(showLabButtonHoverPlay && isPreviewDark
                    ? { color: "var(--uiux-neutral900)" }
                    : {}),
                }}
              >
                {t("interaction.actions.reset")}
              </Button>
            </div>
            <>
              <div
                className="grid gap-4 md:grid-cols-3"
                style={{ gap: spaceVar("md") }}
              >
                {labCards.map((item, index) => {
                  const isHovered =
                    interactionSettings.forceHover ||
                    hoveredCardIndex === index;
                  return (
                    <div
                      key={`${interactionPlayKey}-preview-${index}`}
                      style={getRevealStyle(index)}
                    >
                      <Card
                        paddingToken="lg"
                        radiusToken="xl"
                        className="border"
                        onMouseEnter={() => setHoveredCardIndex(index)}
                        onMouseLeave={() => setHoveredCardIndex(null)}
                        style={{
                          ...cardStyleVars,
                          color: "var(--uiux-preview-text, var(--uiux-neutral900))",
                          ...getCardHoverStyle(isHovered),
                        }}
                      >
                        <h5 className="text-sm font-semibold">
                          {item.title}
                        </h5>
                        <p
                          className="text-xs"
                          style={{
                            color: "var(--uiux-preview-muted, var(--uiux-neutral600))",
                          }}
                        >
                          {item.body}
                        </p>
                      </Card>
                    </div>
                  );
                })}
              </div>
              <div
                className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]"
                key={`preview-form-${interactionPlayKey}`}
                style={{
                  gap: spaceVar("lg"),
                  ...getRevealStyle(labCards.length + 1),
                }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <span
                      className="text-xs uppercase tracking-[0.2em] text-slate-400"
                      style={{ color: "var(--uiux-preview-muted, var(--uiux-neutral600))" }}
                    >
                      {t("interaction.preview.profileTitle")}
                    </span>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <label className="flex flex-col gap-1">
                        <span
                          className="text-[10px] uppercase tracking-[0.2em] text-slate-400"
                          style={{ color: "var(--uiux-preview-muted, var(--uiux-neutral600))" }}
                        >
                          {t("interaction.preview.yearLabel")}
                        </span>
                        <Input
                          type="number"
                          placeholder={t("interaction.preview.yearPlaceholder")}
                          size={inputSettings.size}
                          radiusToken={inputSettings.radius}
                          value={birthYear}
                          onFocus={() => {
                            if (!birthYear.trim()) {
                              setBirthYear("1998");
                            }
                          }}
                          onChange={(event) => setBirthYear(event.target.value)}
                          style={inputStyleVars}
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span
                          className="text-[10px] uppercase tracking-[0.2em] text-slate-400"
                          style={{ color: "var(--uiux-preview-muted, var(--uiux-neutral600))" }}
                        >
                          {t("interaction.preview.genderLabel")}
                        </span>
                        <select
                          value={gender}
                          onChange={(event) => setGender(event.target.value)}
                          className={`w-full border border-[var(--uiux-input-border,var(--uiux-neutral600,#475569))] bg-[var(--uiux-input-bg,var(--uiux-neutral100,#F8FAFC))] text-[var(--uiux-input-text,var(--uiux-neutral900,#0F172A))] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--uiux-input-focus,var(--uiux-accent,#F472B6))] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${SELECT_SIZE_STYLES[inputSettings.size]}`}
                          style={{
                            ...inputStyleVars,
                            borderRadius: `var(--uiux-radius-${inputSettings.radius})`,
                          }}
                        >
                          <option value="">
                            {t("interaction.preview.genderPlaceholder")}
                          </option>
                          <option value="female">
                            {t("interaction.preview.genderOptions.female")}
                          </option>
                          <option value="male">
                            {t("interaction.preview.genderOptions.male")}
                          </option>
                          <option value="other">
                            {t("interaction.preview.genderOptions.other")}
                          </option>
                        </select>
                      </label>
                    </div>
                    <p
                      className="text-xs text-slate-400"
                      style={{ color: "var(--uiux-preview-muted, var(--uiux-neutral600))" }}
                    >
                      {t("interaction.preview.profileHint")}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span
                      className="text-xs uppercase tracking-[0.2em] text-slate-400"
                      style={{ color: "var(--uiux-preview-muted, var(--uiux-neutral600))" }}
                    >
                      {t("interaction.preview.inputLabel")}
                    </span>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder={t("interaction.preview.inputPlaceholder")}
                        size={inputSettings.size}
                        radiusToken={inputSettings.radius}
                        previewState={labInputState}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        onFocus={() => setIsLabInputFocused(true)}
                        onBlur={() => setIsLabInputFocused(false)}
                        style={inputStyleVars}
                        className="w-auto min-w-[160px] flex-1"
                      />
                      <Button
                        variant="primary"
                        size="sm"
                        radiusToken={buttonSettings.radius}
                        previewState={showConfirmHover ? "hover" : "default"}
                        onMouseEnter={() => setHoveredLabButton("confirm")}
                        onMouseLeave={() => setHoveredLabButton(null)}
                        onClick={() => {
                          if (!isFormComplete) {
                            return;
                          }
                          triggerLabState("success");
                        }}
                        style={{
                          ...buttonStyleVars,
                          ...getButtonHoverStyle(showConfirmHover),
                          ...(isPreviewDark ? { color: "var(--uiux-neutral900)" } : {}),
                        }}
                        disabled={!isFormComplete}
                      >
                        {t("interaction.preview.confirm")}
                      </Button>
                    </div>
                    {showLabError ? (
                      <span className="text-xs" style={{ color: "var(--uiux-error)" }}>
                        {t("interaction.preview.error")}
                      </span>
                    ) : showLabSuccess ? (
                      <span
                        className="text-xs"
                        style={{ color: "var(--uiux-success)" }}
                      >
                        {t("interaction.preview.success")}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div />
              </div>
            </>
            {visibility.typography ? (
              <div className="grid gap-2" style={{ gap: spaceVar("xs") }}>
                <span className="text-sm font-semibold">
                  {t("typography.sample")}
                </span>
                <div className="grid gap-2" style={{ gap: spaceVar("xs") }}>
                  {TYPO_ORDER.map((key) => (
                    <span
                      key={key}
                      style={{
                        ...getTypographyStyle(key),
                        color: "var(--uiux-preview-text, var(--uiux-neutral900))",
                      }}
                    >
                      {t(`fields.${key}.label`)}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {visibility.spacing ? (
              <div className="grid gap-2" style={{ gap: spaceVar("xs") }}>
                <span className="text-sm font-semibold">
                  {t("spacing.sample")}
                </span>
                <div
                  className="flex flex-wrap gap-2"
                  style={{ gap: spaceVar("xs") }}
                >
                  {SPACING_ORDER.map((key) => (
                    <div
                      key={key}
                      className="rounded-2xl border"
                      style={{
                        borderColor:
                          "var(--uiux-preview-border, var(--uiux-neutral600))",
                      }}
                    >
                      <div
                        className="rounded-xl"
                        style={{
                          padding: `var(${toSpaceVarName(key)})`,
                          backgroundColor: "var(--uiux-secondary)",
                        }}
                      >
                        <span
                          className="text-[10px] font-semibold uppercase tracking-[0.2em]"
                          style={{ color: "var(--uiux-neutral100)" }}
                        >
                          {t(`spacing.steps.${key}.label`)} {spacing[key]}
                          {t("spacing.unit")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {visibility.radius ? (
              <div className="grid gap-2" style={{ gap: spaceVar("xs") }}>
                <span className="text-sm font-semibold">
                  {t("radius.sample")}
                </span>
                <div
                  className="flex flex-wrap gap-2"
                  style={{ gap: spaceVar("xs") }}
                >
                  {RADIUS_ORDER.map((key) => (
                    <div
                      key={key}
                      className="border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
                      style={{
                        borderColor:
                          "var(--uiux-preview-border, var(--uiux-neutral600))",
                        borderRadius: `var(${toRadiusVarName(key)})`,
                        color: "var(--uiux-preview-text, var(--uiux-neutral900))",
                        padding: `${spaceVar("xs")} ${spaceVar("md")}`,
                      }}
                    >
                      {t(`radius.steps.${key}.label`)} {radius[key]}
                      {t("radius.unit")}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {visibility.button ? (
              <div
                className="grid gap-4 rounded-2xl border p-4"
                style={{
                  borderColor:
                    "var(--uiux-preview-border, var(--uiux-neutral600))",
                }}
              >
                <div className="flex flex-col gap-2">
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--uiux-preview-muted, var(--uiux-neutral600))",
                    }}
                  >
                    {t("uiKit.subtitle")}
                  </p>
                  <p
                    className="text-xs text-slate-400"
                    style={{
                      color: "var(--uiux-preview-muted, var(--uiux-neutral600))",
                    }}
                  >
                    {t("uiKit.usage")}
                  </p>
                </div>
                <div className="grid gap-4">
                  {buttonVariants.map((variantItem) => (
                    <div
                      key={variantItem.key}
                      className="grid gap-3 rounded-2xl border p-4"
                      style={{
                        borderColor:
                          "var(--uiux-preview-border, var(--uiux-neutral600))",
                      }}
                    >
                      <h5 className="text-sm font-semibold uppercase tracking-[0.2em]">
                        {t(`uiKit.variants.${variantItem.key}`)}
                      </h5>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {buttonStates.map((stateItem) => (
                          <div
                            key={stateItem.key}
                            className="flex flex-col gap-2"
                          >
                            <span
                              className="text-xs uppercase tracking-[0.2em] text-slate-400"
                              style={{
                                color:
                                  "var(--uiux-preview-muted, var(--uiux-neutral600))",
                              }}
                            >
                              {t(`uiKit.states.${stateItem.key}`)}
                            </span>
                            <Button
                              variant={variantItem.variant}
                              size={buttonSettings.size}
                              radiusToken={buttonSettings.radius}
                              style={buttonStyleVars}
                              previewState={
                                stateItem.state === "disabled"
                                  ? "default"
                                  : stateItem.state
                              }
                              disabled={stateItem.state === "disabled"}
                            >
                              {t("uiKit.label")}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {visibility.input ? (
              <div
                className="grid gap-4 rounded-2xl border p-4"
                style={{
                  borderColor:
                    "var(--uiux-preview-border, var(--uiux-neutral600))",
                }}
              >
                <div className="flex flex-col gap-2">
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--uiux-preview-muted, var(--uiux-neutral600))",
                    }}
                  >
                    {t("uiKitInput.subtitle")}
                  </p>
                  <p
                    className="text-xs text-slate-400"
                    style={{
                      color: "var(--uiux-preview-muted, var(--uiux-neutral600))",
                    }}
                  >
                    {t("uiKitInput.usage")}
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {inputStates.map((stateItem) => (
                    <div key={stateItem.key} className="flex flex-col gap-2">
                      <span
                        className="text-xs uppercase tracking-[0.2em] text-slate-400"
                        style={{
                          color:
                            "var(--uiux-preview-muted, var(--uiux-neutral600))",
                        }}
                      >
                        {t(`uiKitInput.states.${stateItem.key}`)}
                      </span>
                      <Input
                        placeholder={t("uiKitInput.placeholder")}
                        size={inputSettings.size}
                        radiusToken={inputSettings.radius}
                        style={inputStyleVars}
                        previewState={stateItem.previewState}
                        disabled={stateItem.disabled}
                        aria-label={t(`uiKitInput.states.${stateItem.key}`)}
                      />
                      {stateItem.key === "error" ? (
                        <span
                          className="text-xs"
                          style={{
                            ...getTypographyStyle("caption"),
                            color: "var(--uiux-error)",
                          }}
                        >
                          {t("uiKitInput.errorText")}
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {visibility.card ? (
              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--uiux-preview-muted, var(--uiux-neutral600))",
                    }}
                  >
                    {t("uiKitCard.subtitle")}
                  </p>
                  <p
                    className="text-xs text-slate-400"
                    style={{
                      color: "var(--uiux-preview-muted, var(--uiux-neutral600))",
                    }}
                  >
                    {t("uiKitCard.usage")}
                  </p>
                </div>
                <Card
                  className="flex flex-col gap-2"
                  paddingToken={cardSettings.padding}
                  radiusToken={cardSettings.radius}
                  shadow={cardShadow}
                  style={{
                    ...cardStyleVars,
                    color: "var(--uiux-preview-text, var(--uiux-neutral900))",
                  }}
                >
                  <h5 className="text-base font-semibold">
                    {t("uiKitCard.sampleTitle")}
                  </h5>
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--uiux-preview-muted, var(--uiux-neutral600))",
                    }}
                  >
                    {t("uiKitCard.sampleBody")}
                  </p>
                </Card>
              </div>
            ) : null}
            {visibility.section ? (
              <div className="grid gap-4">
                <div className="flex flex-col gap-2">
                  <p
                    className="text-sm"
                    style={{
                      color: "var(--uiux-preview-muted, var(--uiux-neutral600))",
                    }}
                  >
                    {t("uiKitSection.subtitle")}
                  </p>
                  <p
                    className="text-xs text-slate-400"
                    style={{
                      color: "var(--uiux-preview-muted, var(--uiux-neutral600))",
                    }}
                  >
                    {t("uiKitSection.usage")}
                  </p>
                </div>
                <div
                  className="rounded-2xl border border-dashed p-3"
                  style={{
                    borderColor:
                      "var(--uiux-preview-border, var(--uiux-neutral600))",
                  }}
                >
                  <Section
                    size={sectionSettings.size}
                    paddingY={sectionSettings.paddingY}
                    paddingX="lg"
                    className="rounded-2xl border"
                    style={{
                      width: `${sectionPreviewWidth * 100}%`,
                      maxWidth: "100%",
                      backgroundColor:
                        "var(--uiux-preview-surface, var(--uiux-neutral100))",
                      borderColor:
                        "var(--uiux-preview-border, var(--uiux-neutral600))",
                    }}
                  >
                    <h5 className="text-sm font-semibold">
                      {t("uiKitSection.sampleTitle")}
                    </h5>
                    <p
                      className="text-sm"
                      style={{
                        color:
                          "var(--uiux-preview-muted, var(--uiux-neutral600))",
                      }}
                    >
                      {t("uiKitSection.sampleBody")}
                    </p>
                  </Section>
                </div>
              </div>
            ) : null}
          </Card>
          {t("footer") ? (
            <p className="text-sm text-slate-400">{t("footer")}</p>
          ) : null}
        </div>
      </section>

    </div>
  );
}
