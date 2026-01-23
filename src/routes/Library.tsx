import { useTranslation } from "react-i18next";

type Highlight = {
  title: string;
  body: string;
};

export default function Library() {
  const { t } = useTranslation("library");
  const highlightsValue = t("highlights", { returnObjects: true });
  const highlights = Array.isArray(highlightsValue)
    ? (highlightsValue as Highlight[])
    : [];

  return (
    <>
      <section className="flex flex-col gap-6 motion-safe:animate-fade-in">
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-lg text-slate-300">{t("subtitle")}</p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {highlights.map((item, index) => (
          <article
            key={item.title}
            className="flex h-full flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 motion-safe:animate-fade-up"
            style={{ animationDelay: `${index * 140 + 120}ms` }}
          >
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="text-slate-300">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 motion-safe:animate-fade-up">
        <h3 className="text-2xl font-semibold">{t("noteTitle")}</h3>
        <p className="text-slate-300">{t("noteBody")}</p>
      </section>
    </>
  );
}
