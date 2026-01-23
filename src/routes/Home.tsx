import { useTranslation } from "react-i18next";

type Step = {
  title: string;
  body: string;
};

export default function Home() {
  const { t } = useTranslation("home");
  const stepsValue = t("steps", { returnObjects: true });
  const badgesValue = t("badges", { returnObjects: true });
  const nextMovesValue = t("nextMoves", { returnObjects: true });

  const steps = Array.isArray(stepsValue) ? (stepsValue as Step[]) : [];
  const badges = Array.isArray(badgesValue) ? (badgesValue as string[]) : [];
  const nextMoves = Array.isArray(nextMovesValue)
    ? (nextMovesValue as string[])
    : [];

  return (
    <>
      <section className="flex flex-col gap-6 motion-safe:animate-fade-in">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-200">
          {t("tagline")}
        </p>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">{t("subtitle")}</p>
        <div className="flex flex-wrap gap-3">
          {badges.map((label) => (
            <span
              key={label}
              className="rounded-full border border-slate-700 px-3 py-1 text-sm text-slate-200"
            >
              {label}
            </span>
          ))}
        </div>
      </section>

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
