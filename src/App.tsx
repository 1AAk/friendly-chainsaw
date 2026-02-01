import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "./components/LanguageSwitcher";
import Navigation from "./components/Navigation";
import { getRouteNamespaces } from "./i18n/routeNamespaces";
import Home from "./routes/Home";
import Library from "./routes/Library";
import Screens from "./routes/Screens";
import StreamableCanvas from "./routes/StreamableCanvas";
import Tokens from "./routes/Tokens";

function AppLayout() {
  const location = useLocation();
  const { t, i18n, ready } = useTranslation("common");
  const isWide =
    location.pathname.startsWith("/library") ||
    location.pathname.startsWith("/screens");
  const isStreamableCanvas = location.pathname === "/streamable-canvas";

  useEffect(() => {
    const namespaces = getRouteNamespaces(location.pathname);
    i18n.loadNamespaces(namespaces);
  }, [location.pathname, i18n.language, i18n]);

  useEffect(() => {
    if (ready && typeof document !== "undefined") {
      document.title = isStreamableCanvas ? "Streamable Canvas" : t("appName");
    }
  }, [ready, t, i18n.language, isStreamableCanvas]);

  return (
    <div
      className={
        isStreamableCanvas
          ? "min-h-screen bg-white text-slate-900"
          : "relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900/40 to-slate-950 text-slate-100"
      }
    >
      {!isStreamableCanvas && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        </div>
      )}
      <main
        className={
          isStreamableCanvas
            ? "relative w-full"
            : `relative mx-auto flex w-full flex-col gap-12 px-6 py-16 ${
                isWide ? "max-w-7xl" : "max-w-5xl"
              }`
        }
      >
        {!isStreamableCanvas && (
          <header className="flex flex-wrap items-center justify-between gap-4">
            <Navigation />
            <LanguageSwitcher />
          </header>
        )}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/streamable-canvas" element={<StreamableCanvas />} />
          <Route path="/library" element={<Library />} />
          <Route path="/screens" element={<Screens />} />
          <Route path="/tokens" element={<Tokens />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
