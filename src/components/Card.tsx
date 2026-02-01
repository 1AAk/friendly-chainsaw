import type { HTMLAttributes } from "react";

export type CardPaddingToken =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl";
export type CardRadiusToken = "xs" | "sm" | "md" | "lg" | "xl";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  paddingToken?: CardPaddingToken;
  radiusToken?: CardRadiusToken;
  shadow?: string;
};

const BASE_STYLES =
  "border bg-[var(--uiux-card-bg,var(--uiux-neutral100,#F8FAFC))] text-[var(--uiux-neutral900,#0F172A)]";

export default function Card({
  paddingToken = "lg",
  radiusToken = "xl",
  shadow,
  className = "",
  style,
  ...props
}: CardProps) {
  const baseShadow = shadow ?? "0 24px 60px rgba(15, 23, 42, 0.18)";
  const mergedStyle = {
    padding: `var(--uiux-space-${paddingToken}, 16px)`,
    borderRadius: `var(--uiux-radius-${radiusToken}, 16px)`,
    ["--uiux-card-shadow-base" as string]: baseShadow,
    boxShadow: "var(--uiux-card-shadow, var(--uiux-card-shadow-base))",
    ...style,
  };

  return (
    <div className={`${BASE_STYLES} ${className}`} style={mergedStyle} {...props} />
  );
}
