import type { InputHTMLAttributes } from "react";

export type CheckboxSize = "sm" | "md" | "lg";
export type CheckboxPreviewState = "default" | "focus" | "error" | "success";
export type CheckboxRadiusToken = "xs" | "sm" | "md" | "lg" | "xl";

type CheckboxProps = InputHTMLAttributes<HTMLInputElement> & {
  size?: CheckboxSize;
  previewState?: CheckboxPreviewState;
  radiusToken?: CheckboxRadiusToken;
};

const BASE_STYLES =
  "relative inline-grid appearance-none place-content-center border bg-[var(--uiux-input-bg,var(--uiux-neutral100,#F8FAFC))] text-[var(--uiux-input-text,var(--uiux-neutral900,#0F172A))] transition focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-[var(--uiux-input-disabled-opacity,0.6)]";

const SIZE_STYLES: Record<CheckboxSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const BORDER_STYLES = "border-[var(--uiux-input-border,var(--uiux-neutral600,#475569))]";
const CHECK_STYLES =
  "checked:border-[var(--uiux-primary,#F59E0B)] checked:bg-[var(--uiux-primary,#F59E0B)] after:pointer-events-none after:absolute after:h-2 after:w-1 after:rotate-45 after:border-b-2 after:border-r-2 after:border-[var(--uiux-neutral100,#F8FAFC)] after:opacity-0 checked:after:opacity-100";
const FOCUS_RING =
  "focus-visible:ring-2 focus-visible:ring-[var(--uiux-input-focus,var(--uiux-accent,#F472B6))] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";
const PREVIEW_FOCUS =
  "ring-2 ring-[var(--uiux-input-focus,var(--uiux-accent,#F472B6))] ring-offset-2 ring-offset-slate-950";
const ERROR_STYLES =
  "border-[var(--uiux-input-error,var(--uiux-error,#EF4444))] ring-2 ring-[var(--uiux-input-error,var(--uiux-error,#EF4444))] ring-offset-2 ring-offset-slate-950";
const SUCCESS_STYLES =
  "border-[var(--uiux-success,#22C55E)] ring-2 ring-[var(--uiux-success,#22C55E)] ring-offset-2 ring-offset-slate-950";

export default function Checkbox({
  size = "md",
  previewState = "default",
  radiusToken = "sm",
  className = "",
  style,
  type = "checkbox",
  ...props
}: CheckboxProps) {
  const previewFocus = previewState === "focus" ? PREVIEW_FOCUS : "";
  const previewError = previewState === "error" ? ERROR_STYLES : "";
  const previewSuccess = previewState === "success" ? SUCCESS_STYLES : "";
  const mergedStyle = {
    ...style,
    borderRadius: `var(--uiux-radius-${radiusToken})`,
  };

  return (
    <input
      type={type}
      className={`${BASE_STYLES} ${BORDER_STYLES} ${CHECK_STYLES} ${FOCUS_RING} ${SIZE_STYLES[size]} ${previewFocus} ${previewError} ${previewSuccess} ${className}`}
      style={mergedStyle}
      {...props}
    />
  );
}
