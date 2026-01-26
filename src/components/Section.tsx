import type { HTMLAttributes } from "react";

export type SectionSize = "sm" | "md" | "lg" | "xl";
export type SectionPaddingToken =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl";

type SectionProps = HTMLAttributes<HTMLElement> & {
  size?: SectionSize;
  paddingY?: SectionPaddingToken;
  paddingX?: SectionPaddingToken;
};

const MAX_WIDTHS: Record<SectionSize, string> = {
  sm: "40rem",
  md: "52rem",
  lg: "64rem",
  xl: "100%",
};

const BASE_STYLES = "w-full";

export default function Section({
  size = "lg",
  paddingY = "xl",
  paddingX = "lg",
  className = "",
  style,
  ...props
}: SectionProps) {
  const mergedStyle = {
    maxWidth: MAX_WIDTHS[size],
    marginInline: "auto",
    paddingTop: `var(--uiux-space-${paddingY}, 16px)`,
    paddingBottom: `var(--uiux-space-${paddingY}, 16px)`,
    paddingInline: `var(--uiux-space-${paddingX}, 16px)`,
    ...style,
  };

  return (
    <section className={`${BASE_STYLES} ${className}`} style={mergedStyle} {...props} />
  );
}
