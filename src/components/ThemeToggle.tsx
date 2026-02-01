import { useTranslation } from "react-i18next";

const TONES = ["light", "dark"] as const;

type PreviewTone = (typeof TONES)[number];

type ThemeToggleProps = {
  value: PreviewTone;
  onChange: (tone: PreviewTone) => void;
  className?: string;
};

export default function ThemeToggle({
  value,
  onChange,
  className = "",
}: ThemeToggleProps) {
  const { t } = useTranslation("components");

  return (
    <div className={`flex items-center ${className}`}>
      <span className="sr-only">{t("themeToggle.label")}</span>
      <div className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/40 p-1">
        {TONES.map((tone) => {
          const isActive = tone === value;
          const isLight = tone === "light";
          return (
            <button
              key={tone}
              type="button"
              onClick={() => onChange(tone)}
              aria-label={t(`themeToggle.${tone}`)}
              className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
                isActive
                  ? "bg-amber-400/30 text-amber-100"
                  : "text-slate-300 hover:bg-slate-800/60"
              }`}
            >
              {isLight ? (
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="4.2" />
                  <path d="M12 3.2v2.1M12 18.7v2.1M4.2 12h2.1M17.7 12h2.1M6.2 6.2l1.5 1.5M16.3 16.3l1.5 1.5M6.2 17.8l1.5-1.5M16.3 7.7l1.5-1.5" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7.1 7.1 0 1 0 11.5 11.5Z" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
