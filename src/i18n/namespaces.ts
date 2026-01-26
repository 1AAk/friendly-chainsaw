export const APP_NAMESPACES = [
  "common",
  "components",
  "home",
  "library",
  "screens",
  "tokens",
] as const;

export type AppNamespace = (typeof APP_NAMESPACES)[number];
