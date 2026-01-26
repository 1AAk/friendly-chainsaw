import type { ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";
export type ButtonPreviewState = "default" | "hover" | "focus";
export type ButtonRadiusToken = "xs" | "sm" | "md" | "lg" | "xl";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  previewState?: ButtonPreviewState;
  radiusToken?: ButtonRadiusToken;
};

const BASE_STYLES =
  "inline-flex items-center justify-center gap-2 font-semibold transition duration-150 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-[var(--uiux-btn-disabled-opacity,0.5)]";

const FOCUS_RING =
  "focus-visible:ring-2 focus-visible:ring-[var(--uiux-btn-focus-ring,#F472B6)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";
const PREVIEW_FOCUS =
  "ring-2 ring-[var(--uiux-btn-focus-ring,#F472B6)] ring-offset-2 ring-offset-slate-950";

const VARIANT_STYLES: Record<
  ButtonVariant,
  {
    base: string;
    hover: string;
    previewHover: string;
    focus: string;
    previewFocus: string;
  }
> = {
  primary: {
    base: "border border-transparent bg-[var(--uiux-primary,#F59E0B)] text-[var(--uiux-neutral100,#F8FAFC)]",
    hover:
      "hover:bg-[var(--uiux-btn-primary-hover,var(--uiux-primary,#F59E0B))]",
    previewHover:
      "bg-[var(--uiux-btn-primary-hover,var(--uiux-primary,#F59E0B))]",
    focus: FOCUS_RING,
    previewFocus: PREVIEW_FOCUS,
  },
  secondary: {
    base: "border border-[var(--uiux-secondary,#38BDF8)] text-[var(--uiux-secondary,#38BDF8)]",
    hover:
      "hover:bg-[var(--uiux-btn-secondary-hover,var(--uiux-secondary,#38BDF8))] hover:text-[var(--uiux-neutral100,#F8FAFC)]",
    previewHover:
      "bg-[var(--uiux-btn-secondary-hover,var(--uiux-secondary,#38BDF8))] text-[var(--uiux-neutral100,#F8FAFC)]",
    focus: FOCUS_RING,
    previewFocus: PREVIEW_FOCUS,
  },
  ghost: {
    base: "border border-transparent text-[var(--uiux-neutral100,#F8FAFC)]",
    hover: "hover:bg-white/10",
    previewHover: "bg-white/10",
    focus: FOCUS_RING,
    previewFocus: PREVIEW_FOCUS,
  },
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: "text-[var(--uiux-body-size,16px)] px-[var(--uiux-space-md,12px)] py-[var(--uiux-space-xs,4px)] rounded-[var(--uiux-radius-md,12px)]",
  md: "text-[var(--uiux-body-size,16px)] px-[var(--uiux-space-lg,16px)] py-[var(--uiux-space-sm,8px)] rounded-[var(--uiux-radius-lg,16px)]",
  lg: "text-[var(--uiux-body-size,16px)] px-[var(--uiux-space-xl,24px)] py-[var(--uiux-space-md,12px)] rounded-[var(--uiux-radius-xl,24px)]",
};

export default function Button({
  variant = "primary",
  size = "md",
  previewState = "default",
  radiusToken,
  className = "",
  style,
  type = "button",
  ...props
}: ButtonProps) {
  const styles = VARIANT_STYLES[variant];
  const previewStyles =
    previewState === "hover"
      ? styles.previewHover
      : previewState === "focus"
        ? styles.previewFocus
        : "";

  const mergedStyle = radiusToken
    ? { ...style, borderRadius: `var(--uiux-radius-${radiusToken})` }
    : style;

  return (
    <button
      type={type}
      className={`${BASE_STYLES} ${styles.base} ${styles.hover} ${styles.focus} ${SIZE_STYLES[size]} ${previewStyles} ${className}`}
      style={mergedStyle}
      {...props}
    />
  );
}
