import type { AppNamespace } from "./namespaces";

const ROUTE_NAMESPACES: Record<string, AppNamespace[]> = {
  "/": ["home", "components"],
  "/library": ["library", "components"],
};

const normalizePath = (pathname: string) => {
  if (pathname.length > 1) {
    return pathname.replace(/\/+$/, "");
  }

  return pathname;
};

export const getRouteNamespaces = (pathname: string): AppNamespace[] => {
  const normalized = normalizePath(pathname);
  return ROUTE_NAMESPACES[normalized] ?? ["components"];
};
