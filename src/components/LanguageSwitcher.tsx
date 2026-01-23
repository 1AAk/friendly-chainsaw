import { useTranslation } from "react-i18next";

const LANGUAGES = ["en", "ru"] as const;

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation("components");
  const activeLanguage = i18n.language.startsWith("ru") ? "ru" : "en";

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
        {t("languageSwitcher.label")}
      </span>
      <div className="flex rounded-full border border-slate-800 bg-slate-950/60 p-1">
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => i18n.changeLanguage(lang)}
            aria-pressed={activeLanguage === lang}
            className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
              activeLanguage === lang
                ? "bg-amber-400/20 text-amber-100"
                : "text-slate-300 hover:bg-slate-800/60"
            }`}
          >
            {t(`languageSwitcher.languages.${lang}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
