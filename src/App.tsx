import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import LanguageSwitcher from "./components/LanguageSwitcher";
import Navigation from "./components/Navigation";
import { getRouteNamespaces } from "./i18n/routeNamespaces";
import Home from "./routes/Home";
import Library from "./routes/Library";
import Tokens from "./routes/Tokens";

function AppLayout() {
  const location = useLocation();
  const { t, i18n, ready } = useTranslation("common");

  useEffect(() => {
    const namespaces = getRouteNamespaces(location.pathname);
    i18n.loadNamespaces(namespaces);
  }, [location.pathname, i18n.language, i18n]);

  useEffect(() => {
    if (ready && typeof document !== "undefined") {
      document.title = t("appName");
    }
  }, [ready, t, i18n.language]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900/40 to-slate-950 text-slate-100">
      <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      <main className="relative mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <Navigation />
          <LanguageSwitcher />
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
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
