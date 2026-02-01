import { useState } from "react";
import { useTranslation } from "react-i18next";

import StreamableHero from "../components/StreamableHero";
import ThemeToggle from "../components/ThemeToggle";

type Step = {
  title: string;
  body: string;
};

export default function Home() {
  const { t } = useTranslation("home");
  const stepsValue = t("steps", { returnObjects: true });
  const nextMovesValue = t("nextMoves", { returnObjects: true });

  const steps = Array.isArray(stepsValue) ? (stepsValue as Step[]) : [];
  const nextMoves = Array.isArray(nextMovesValue)
    ? (nextMovesValue as string[])
    : [];
  const [heroTone, setHeroTone] = useState<"light" | "dark">("light");

  return (
    <>
      <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 sm:px-6 lg:px-10">
        <StreamableHero
          title={t("title")}
          tone={heroTone}
          className="min-h-[calc(100vh+120px)] w-full rounded-[3.5rem] sm:rounded-[4rem] lg:rounded-[4.5rem]"
        />
        <div className="absolute right-6 top-6 z-30">
          <ThemeToggle value={heroTone} onChange={setHeroTone} />
        </div>
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className="flex h-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 motion-safe:animate-fade-up"
            style={{ animationDelay: `${index * 140 + 120}ms` }}
          >
            <span className="text-sm text-amber-200">
              {t("stepsLabel", { number: index + 1 })}
            </span>
            <h2 className="text-xl font-semibold">{step.title}</h2>
            <p className="text-slate-300">{step.body}</p>
          </article>
        ))}
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 motion-safe:animate-fade-up">
        <h3 className="text-2xl font-semibold">{t("nextMovesTitle")}</h3>
        <ul className="grid gap-2 text-slate-300">
          {nextMoves.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
