const COLOR_STORAGE_KEY = "uiux-color-tokens";
const LIGHT_COLOR_STORAGE_KEY = "uiux-light-color-tokens";
const TYPO_STORAGE_KEY = "uiux-typography-tokens";
const SPACE_STORAGE_KEY = "uiux-spacing-tokens";
const RADIUS_STORAGE_KEY = "uiux-radius-tokens";
const BUTTON_STORAGE_KEY = "uiux-button-settings";
const INPUT_STORAGE_KEY = "uiux-input-settings";

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

const DEFAULT_BUTTON_STYLE = {
  primaryHover: DEFAULT_TOKENS.primary,
  secondaryHover: DEFAULT_TOKENS.secondary,
  focusRing: DEFAULT_TOKENS.accent,
  disabledOpacity: 0.5,
} as const;

const DEFAULT_INPUT_STYLE = {
  focusRing: DEFAULT_TOKENS.accent,
  error: DEFAULT_TOKENS.error,
} as const;

type TokenKey = keyof typeof DEFAULT_TOKENS;
type TypographyKey = keyof typeof DEFAULT_TYPOGRAPHY;
type SpacingKey = keyof typeof DEFAULT_SPACING;
type RadiusKey = keyof typeof DEFAULT_RADIUS;

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

const TYPO_ORDER: TypographyKey[] = ["h1", "h2", "h3", "h4", "body", "caption"];

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

const SIZE_RANGE = { min: 10, max: 72 };
const LINE_RANGE = { min: 12, max: 88 };
const SPACING_RANGE = { min: 0, max: 128 };
const RADIUS_RANGE = { min: 0, max: 48 };
const BUTTON_OPACITY_RANGE = { min: 0.2, max: 1 };

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

const normalizeHexValue = (value: unknown, fallback: string) => {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = normalizeHexInput(value);
  return isValidHex(normalized) ? normalized : fallback;
};

const toCssVarName = (key: string) =>
  `--uiux-${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`;

const toSpaceVarName = (key: SpacingKey) => `--uiux-space-${key}`;
const toRadiusVarName = (key: RadiusKey) => `--uiux-radius-${key}`;

const readStorage = (key: string) => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const buildUiKitVars = (
  tone: "light" | "dark" = "dark",
): Record<string, string> => {
  const vars: Record<string, string> = {};
  const storedTokens = readStorage(
    tone === "light" ? LIGHT_COLOR_STORAGE_KEY : COLOR_STORAGE_KEY,
  ) as
    | Record<string, unknown>
    | null;
  const tokens: Record<TokenKey, string> = { ...DEFAULT_TOKENS };

  TOKEN_ORDER.forEach((key) => {
    const value = storedTokens?.[key];
    if (typeof value === "string" && isValidHex(value)) {
      tokens[key] = value.toUpperCase();
    }
    vars[toCssVarName(key)] = tokens[key];
  });

  const storedTypography = readStorage(TYPO_STORAGE_KEY) as
    | Record<string, unknown>
    | null;
  TYPO_ORDER.forEach((key) => {
    const fallback = DEFAULT_TYPOGRAPHY[key];
    const value = storedTypography?.[key] as
      | { size?: number; line?: number; weight?: number }
      | undefined;
    const size = Number(value?.size);
    const line = Number(value?.line);
    const weight = Number(value?.weight);
    vars[`${toCssVarName(key)}-size`] = `${Number.isFinite(size) ? clamp(size, SIZE_RANGE.min, SIZE_RANGE.max) : fallback.size}px`;
    vars[`${toCssVarName(key)}-line`] = `${Number.isFinite(line) ? clamp(line, LINE_RANGE.min, LINE_RANGE.max) : fallback.line}px`;
    vars[`${toCssVarName(key)}-weight`] = `${Number.isFinite(weight) ? weight : fallback.weight}`;
  });

  const storedSpacing = readStorage(SPACE_STORAGE_KEY) as
    | Record<string, unknown>
    | null;
  SPACING_ORDER.forEach((key) => {
    const value = Number(storedSpacing?.[key]);
    const fallback = DEFAULT_SPACING[key];
    vars[toSpaceVarName(key)] = `${Number.isFinite(value) ? clamp(value, SPACING_RANGE.min, SPACING_RANGE.max) : fallback}px`;
  });

  const storedRadius = readStorage(RADIUS_STORAGE_KEY) as
    | Record<string, unknown>
    | null;
  RADIUS_ORDER.forEach((key) => {
    const value = Number(storedRadius?.[key]);
    const fallback = DEFAULT_RADIUS[key];
    vars[toRadiusVarName(key)] = `${Number.isFinite(value) ? clamp(value, RADIUS_RANGE.min, RADIUS_RANGE.max) : fallback}px`;
  });

  const storedButton = readStorage(BUTTON_STORAGE_KEY) as
    | Record<string, unknown>
    | null;
  const primaryHover = normalizeHexValue(
    storedButton?.primaryHover,
    DEFAULT_BUTTON_STYLE.primaryHover,
  );
  const secondaryHover = normalizeHexValue(
    storedButton?.secondaryHover,
    DEFAULT_BUTTON_STYLE.secondaryHover,
  );
  const focusRing = normalizeHexValue(
    storedButton?.focusRing,
    DEFAULT_BUTTON_STYLE.focusRing,
  );
  const disabledOpacityValue = Number(storedButton?.disabledOpacity);
  const disabledOpacity = Number.isFinite(disabledOpacityValue)
    ? clamp(
        disabledOpacityValue,
        BUTTON_OPACITY_RANGE.min,
        BUTTON_OPACITY_RANGE.max,
      )
    : DEFAULT_BUTTON_STYLE.disabledOpacity;

  vars["--uiux-btn-primary-hover"] = primaryHover;
  vars["--uiux-btn-secondary-hover"] = secondaryHover;
  vars["--uiux-btn-focus-ring"] = focusRing;
  vars["--uiux-btn-disabled-opacity"] = `${disabledOpacity}`;

  const storedInput = readStorage(INPUT_STORAGE_KEY) as
    | Record<string, unknown>
    | null;
  const inputFocus = normalizeHexValue(
    storedInput?.focusRing,
    DEFAULT_INPUT_STYLE.focusRing,
  );
  const inputError = normalizeHexValue(
    storedInput?.error,
    DEFAULT_INPUT_STYLE.error,
  );

  vars["--uiux-input-focus"] = inputFocus;
  vars["--uiux-input-error"] = inputError;

  return vars;
};
