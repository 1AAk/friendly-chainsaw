import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "uiux-color-tokens";
const TYPO_STORAGE_KEY = "uiux-typography-tokens";
const SPACE_STORAGE_KEY = "uiux-spacing-tokens";
const VISIBILITY_STORAGE_KEY = "uiux-token-visibility";

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

const DEFAULT_VISIBILITY = {
  colors: true,
  typography: true,
  spacing: true,
} as const;

type TypographyKey = keyof typeof DEFAULT_TYPOGRAPHY;
type SpacingKey = keyof typeof DEFAULT_SPACING;

type TypographyValue = {
  size: number;
  line: number;
  weight: number;
};

type TypographyMap = Record<TypographyKey, TypographyValue>;
type SpacingMap = Record<SpacingKey, number>;
type VisibilityMap = Record<keyof typeof DEFAULT_VISIBILITY, boolean>;

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

const SIZE_RANGE = { min: 10, max: 72 };
const LINE_RANGE = { min: 12, max: 88 };
const SPACING_RANGE = { min: 0, max: 128 };
const WEIGHTS = [300, 400, 500, 600, 700] as const;

const isValidHex = (value: string) => /^#[0-9a-fA-F]{6}$/.test(value);
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

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

const toCssVarName = (key: string) =>
  `--uiux-${key.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)}`;

const toSpaceVarName = (key: SpacingKey) => `--uiux-space-${key}`;

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
    };
  } catch {
    return { ...DEFAULT_VISIBILITY };
  }
};

const getTypographyStyle = (key: TypographyKey): CSSProperties => ({
  fontSize: `var(${toCssVarName(key)}-size)`,
  lineHeight: `var(${toCssVarName(key)}-line)`,
  fontWeight: `var(${toCssVarName(key)}-weight)`,
});

export default function Tokens() {
  const { t } = useTranslation("tokens");
  const [tokens, setTokens] = useState<TokenMap>(() => getStoredTokens());
  const [typography, setTypography] = useState<TypographyMap>(() =>
    getStoredTypography(),
  );
  const [spacing, setSpacing] = useState<SpacingMap>(() =>
    getStoredSpacing(),
  );
  const [visibility, setVisibility] = useState<VisibilityMap>(() =>
    getStoredVisibility(),
  );

  const cssVars = useMemo(
    () => ({
      ...buildCssVars(tokens),
      ...buildTypographyVars(typography),
      ...buildSpacingVars(spacing),
    }),
    [tokens, typography, spacing],
  );
  const cssVarsStyle = cssVars as CSSProperties;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    window.localStorage.setItem(TYPO_STORAGE_KEY, JSON.stringify(typography));
    window.localStorage.setItem(SPACE_STORAGE_KEY, JSON.stringify(spacing));
    const root = document.documentElement;
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [tokens, typography, spacing, cssVars]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      VISIBILITY_STORAGE_KEY,
      JSON.stringify(visibility),
    );
  }, [visibility]);

  const handleChange = (key: TokenKey, value: string) => {
    const nextValue = value.toUpperCase();
    setTokens((prev) => ({
      ...prev,
      [key]: nextValue,
    }));
  };

  const handleResetColors = () => {
    setTokens({ ...DEFAULT_TOKENS });
  };

  const handleResetTypography = () => {
    setTypography({ ...DEFAULT_TYPOGRAPHY });
  };

  const handleResetSpacing = () => {
    setSpacing({ ...DEFAULT_SPACING });
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

  return (
    <div className="flex flex-col gap-10" style={cssVarsStyle}>
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
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{t("sections.picker")}</h2>
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
                onClick={handleResetColors}
                aria-label={t("actions.resetColors")}
                title={t("actions.resetColors")}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-300 transition hover:border-slate-500"
              >
                <span aria-hidden="true">{t("icons.reset")}</span>
              </button>
            </div>
          </div>

          {visibility.colors ? (
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
                      className="h-10 w-10 rounded-full border border-slate-700"
                      style={{ backgroundColor: tokens[key] }}
                    />
                    <input
                      type="color"
                      value={tokens[key]}
                      onChange={(event) => handleChange(key, event.target.value)}
                      className="h-10 w-10 cursor-pointer rounded-full border border-slate-700 bg-transparent"
                      aria-label={t(`fields.${key}.label`)}
                    />
                    <span className="rounded-full border border-slate-800 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                      {tokens[key]}
                    </span>
                  </div>
                </div>
              ))}
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
        </div>

        <div className="flex flex-col gap-6">
          <div
            className="flex flex-col gap-6 rounded-3xl border p-6 shadow-xl"
            style={{
              borderColor: "var(--uiux-neutral600)",
              backgroundColor: "var(--uiux-neutral100)",
              color: "var(--uiux-neutral900)",
            }}
          >
            {visibility.colors ? (
              <div className="flex items-center gap-3">
                <span
                  className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{
                    backgroundColor: "var(--uiux-accent)",
                    color: "var(--uiux-neutral100)",
                  }}
                >
                  {t("preview.badge")}
                </span>
                <span
                  className="text-xs font-semibold uppercase tracking-[0.2em]"
                  style={{ color: "var(--uiux-neutral600)" }}
                >
                  {t("preview.badgeNote")}
                </span>
              </div>
            ) : null}
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-semibold" style={getTypographyStyle("h3")}>
                {t("preview.title")}
              </h3>
              {visibility.colors ? (
                <p
                  style={{
                    ...getTypographyStyle("body"),
                    color: "var(--uiux-neutral600)",
                  }}
                >
                  {t("preview.body")}
                </p>
              ) : null}
            </div>
            {visibility.colors ? (
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-full px-4 py-2 text-sm font-semibold"
                  style={{
                    backgroundColor: "var(--uiux-primary)",
                    color: "var(--uiux-neutral100)",
                  }}
                >
                  {t("preview.primaryButton")}
                </button>
                <button
                  type="button"
                  className="rounded-full border px-4 py-2 text-sm font-semibold"
                  style={{
                    borderColor: "var(--uiux-secondary)",
                    color: "var(--uiux-secondary)",
                  }}
                >
                  {t("preview.secondaryButton")}
                </button>
              </div>
            ) : null}
            {visibility.colors ? (
              <div className="grid gap-2">
                <label
                  className="text-sm font-semibold"
                  htmlFor="token-email"
                  style={getTypographyStyle("body")}
                >
                  {t("preview.inputLabel")}
                </label>
                <input
                  id="token-email"
                  type="email"
                  placeholder={t("preview.inputPlaceholder")}
                  className="rounded-2xl border px-4 py-3 text-sm"
                  style={{
                    borderColor: "var(--uiux-neutral600)",
                    backgroundColor: "var(--uiux-neutral100)",
                    color: "var(--uiux-neutral900)",
                    fontSize: "var(--uiux-body-size)",
                    lineHeight: "var(--uiux-body-line)",
                    fontWeight: "var(--uiux-body-weight)",
                  }}
                />
                <span
                  className="text-xs"
                  style={{
                    ...getTypographyStyle("caption"),
                    color: "var(--uiux-neutral600)",
                  }}
                >
                  {t("preview.helper")}
                </span>
                <span
                  className="text-xs"
                  style={{
                    ...getTypographyStyle("caption"),
                    color: "var(--uiux-error)",
                  }}
                >
                  {t("preview.error")}
                </span>
              </div>
            ) : null}
            {visibility.typography ? (
              <div className="grid gap-2">
                <span className="text-sm font-semibold">
                  {t("typography.sample")}
                </span>
                <div className="grid gap-2">
                  {TYPO_ORDER.map((key) => (
                    <span
                      key={key}
                      style={{
                        ...getTypographyStyle(key),
                        color: "var(--uiux-neutral900)",
                      }}
                    >
                      {t(`fields.${key}.label`)}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {visibility.spacing ? (
              <div className="grid gap-2">
                <span className="text-sm font-semibold">
                  {t("spacing.sample")}
                </span>
                <div className="flex flex-wrap gap-2">
                  {SPACING_ORDER.map((key) => (
                    <div
                      key={key}
                      className="rounded-2xl border"
                      style={{ borderColor: "var(--uiux-neutral600)" }}
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
          </div>
          {t("footer") ? (
            <p className="text-sm text-slate-400">{t("footer")}</p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
