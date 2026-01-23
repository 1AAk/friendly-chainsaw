export const APP_NAMESPACES = ["common", "components", "home", "library"] as const;

export type AppNamespace = (typeof APP_NAMESPACES)[number];
