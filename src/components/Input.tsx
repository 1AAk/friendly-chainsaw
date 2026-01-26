import type { InputHTMLAttributes } from "react";

export type InputSize = "sm" | "md" | "lg";
export type InputPreviewState = "default" | "focus" | "error";
export type InputRadiusToken = "xs" | "sm" | "md" | "lg" | "xl";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  size?: InputSize;
  previewState?: InputPreviewState;
  radiusToken?: InputRadiusToken;
};

const BASE_STYLES =
  "w-full border bg-[var(--uiux-input-bg,var(--uiux-neutral100,#F8FAFC))] text-[var(--uiux-input-text,var(--uiux-neutral900,#0F172A))] placeholder:text-[var(--uiux-input-placeholder,var(--uiux-neutral600,#475569))] transition focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-[var(--uiux-input-disabled-opacity,0.6)]";

const SIZE_STYLES: Record<InputSize, string> = {
  sm: "text-[var(--uiux-body-size,16px)] px-[var(--uiux-space-md,12px)] py-[var(--uiux-space-xs,4px)]",
  md: "text-[var(--uiux-body-size,16px)] px-[var(--uiux-space-lg,16px)] py-[var(--uiux-space-sm,8px)]",
  lg: "text-[var(--uiux-body-size,16px)] px-[var(--uiux-space-xl,24px)] py-[var(--uiux-space-md,12px)]",
};

const BORDER_STYLES = "border-[var(--uiux-input-border,var(--uiux-neutral600,#475569))]";
const FOCUS_RING =
  "focus-visible:ring-2 focus-visible:ring-[var(--uiux-input-focus,var(--uiux-accent,#F472B6))] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";
const PREVIEW_FOCUS =
  "ring-2 ring-[var(--uiux-input-focus,var(--uiux-accent,#F472B6))] ring-offset-2 ring-offset-slate-950";
const ERROR_STYLES =
  "border-[var(--uiux-input-error,var(--uiux-error,#EF4444))] ring-2 ring-[var(--uiux-input-error,var(--uiux-error,#EF4444))] ring-offset-2 ring-offset-slate-950";

export default function Input({
  size = "md",
  previewState = "default",
  radiusToken,
  className = "",
  style,
  type = "text",
  ...props
}: InputProps) {
  const previewFocus = previewState === "focus" ? PREVIEW_FOCUS : "";
  const previewError = previewState === "error" ? ERROR_STYLES : "";
  const mergedStyle = radiusToken
    ? { ...style, borderRadius: `var(--uiux-radius-${radiusToken})` }
    : style;

  return (
    <input
      type={type}
      className={`${BASE_STYLES} ${BORDER_STYLES} ${FOCUS_RING} ${SIZE_STYLES[size]} ${previewFocus} ${previewError} ${className}`}
      style={mergedStyle}
      {...props}
    />
  );
}
