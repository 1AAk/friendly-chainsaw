import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Section from "../components/Section";
import { buildUiKitVars } from "../utils/uiKitTokens";

type Stat = {
  value: string;
  label: string;
};

type Feature = {
  title: string;
  body: string;
};

type ShowcaseItem = {
  title: string;
  body: string;
  tag: string;
};

type Plan = {
  name: string;
  price: string;
  body: string;
  cta: string;
  featured?: boolean;
};

export default function Library() {
  const { t } = useTranslation("library");
  const statsValue = t("stats", { returnObjects: true });
  const stats = Array.isArray(statsValue) ? (statsValue as Stat[]) : [];
  const featuresValue = t("features", { returnObjects: true });
  const features = Array.isArray(featuresValue)
    ? (featuresValue as Feature[])
    : [];
  const showcaseValue = t("showcaseItems", { returnObjects: true });
  const showcaseItems = Array.isArray(showcaseValue)
    ? (showcaseValue as ShowcaseItem[])
    : [];
  const plansValue = t("plans", { returnObjects: true });
  const plans = Array.isArray(plansValue) ? (plansValue as Plan[]) : [];

  const [uiKitVars, setUiKitVars] = useState<Record<string, string>>(() =>
    buildUiKitVars(),
  );

  useEffect(() => {
    setUiKitVars(buildUiKitVars());
  }, []);

  const uiKitStyle = useMemo(() => uiKitVars as CSSProperties, [uiKitVars]);

  return (
    <div className="flex flex-col gap-12">
      <div className="rounded-[32px] border border-slate-800 bg-slate-900/60 p-6 shadow-2xl">
        <div className="flex items-center gap-2 pb-4">
          <span className="h-3 w-3 rounded-full bg-slate-700" />
          <span className="h-3 w-3 rounded-full bg-slate-700" />
          <span className="h-3 w-3 rounded-full bg-slate-700" />
        </div>
        <div
          className="rounded-[28px] border"
          style={{
            ...uiKitStyle,
            backgroundColor: "var(--uiux-neutral100)",
            color: "var(--uiux-neutral900)",
            borderColor: "var(--uiux-neutral600)",
          }}
        >
          <div className="flex flex-col gap-16 p-8">
            <div
              className="rounded-3xl border"
              style={{
                borderColor: "var(--uiux-neutral600)",
                backgroundColor: "var(--uiux-neutral100)",
              }}
            >
              <Section
                size="xl"
                paddingY="2xl"
                paddingX="xl"
                className="flex flex-col gap-8"
              >
                <div className="flex flex-col gap-3">
                  <p
                    className="text-xs uppercase tracking-[0.3em]"
                    style={{ color: "var(--uiux-accent)" }}
                  >
                    {t("hero.kicker")}
                  </p>
                  <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                    {t("hero.title")}
                  </h1>
                  <p
                    className="max-w-2xl text-lg"
                    style={{ color: "var(--uiux-neutral600)" }}
                  >
                    {t("hero.subtitle")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">{t("hero.primary")}</Button>
                  <Button variant="secondary">{t("hero.secondary")}</Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {stats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border p-4"
                      style={{
                        borderColor: "var(--uiux-neutral600)",
                        backgroundColor: "var(--uiux-neutral100)",
                      }}
                    >
                      <p
                        className="text-2xl font-semibold"
                        style={{ color: "var(--uiux-primary)" }}
                      >
                        {item.value}
                      </p>
                      <p
                        className="text-xs uppercase tracking-[0.2em]"
                        style={{ color: "var(--uiux-neutral600)" }}
                      >
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </Section>
            </div>

            <Section
              size="xl"
              paddingY="xl"
              paddingX="lg"
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-semibold">{t("featuresTitle")}</h2>
                <p style={{ color: "var(--uiux-neutral600)" }}>
                  {t("featuresSubtitle")}
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {features.map((item) => (
                  <Card
                    key={item.title}
                    className="flex h-full flex-col gap-3"
                    paddingToken="lg"
                    radiusToken="xl"
                    shadow="0 18px 40px rgba(15, 23, 42, 0.2)"
                    style={{
                      backgroundColor: "var(--uiux-neutral100)",
                      borderColor: "var(--uiux-neutral600)",
                      color: "var(--uiux-neutral900)",
                    }}
                  >
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-full"
                      style={{
                        backgroundColor: "var(--uiux-primary)",
                        color: "var(--uiux-neutral100)",
                      }}
                    >
                      ●
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p
                      className="text-sm"
                      style={{ color: "var(--uiux-neutral600)" }}
                    >
                      {item.body}
                    </p>
                  </Card>
                ))}
              </div>
            </Section>

            <Section
              size="xl"
              paddingY="xl"
              paddingX="lg"
              className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
            >
              <Card
                className="flex flex-col gap-5"
                paddingToken="lg"
                radiusToken="xl"
                shadow="0 22px 48px rgba(15, 23, 42, 0.2)"
                style={{
                  backgroundColor: "var(--uiux-neutral100)",
                  borderColor: "var(--uiux-neutral600)",
                  color: "var(--uiux-neutral900)",
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {t("showcase.title")}
                    </h3>
                    <p
                      className="text-sm"
                      style={{ color: "var(--uiux-neutral600)" }}
                    >
                      {t("showcase.subtitle")}
                    </p>
                  </div>
                  <span
                    className="rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em]"
                    style={{
                      borderColor: "var(--uiux-neutral600)",
                      color: "var(--uiux-neutral600)",
                    }}
                  >
                    {t("showcase.badge")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className="rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em]"
                    style={{
                      borderColor: "var(--uiux-neutral600)",
                      color: "var(--uiux-neutral600)",
                    }}
                  >
                    {t("showcase.filterPrimary")}
                  </span>
                  <span
                    className="rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em]"
                    style={{
                      borderColor: "var(--uiux-neutral600)",
                      color: "var(--uiux-neutral600)",
                    }}
                  >
                    {t("showcase.filterSecondary")}
                  </span>
                  <span
                    className="rounded-full border px-3 py-1 text-xs uppercase tracking-[0.2em]"
                    style={{
                      borderColor: "var(--uiux-neutral600)",
                      color: "var(--uiux-neutral600)",
                    }}
                  >
                    {t("showcase.filterTertiary")}
                  </span>
                </div>
                <div className="grid gap-3">
                  {showcaseItems.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border p-4"
                      style={{
                        borderColor: "var(--uiux-neutral600)",
                        backgroundColor: "var(--uiux-neutral100)",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">{item.title}</h4>
                        <span
                          className="text-xs uppercase tracking-[0.2em]"
                          style={{ color: "var(--uiux-neutral600)" }}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: "var(--uiux-neutral600)" }}
                      >
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
                <Button variant="primary">{t("showcase.primaryAction")}</Button>
              </Card>

              <Card
                className="flex flex-col gap-4"
                paddingToken="lg"
                radiusToken="xl"
                shadow="0 18px 40px rgba(15, 23, 42, 0.2)"
                style={{
                  backgroundColor: "var(--uiux-neutral100)",
                  borderColor: "var(--uiux-neutral600)",
                  color: "var(--uiux-neutral900)",
                }}
              >
                <h3 className="text-lg font-semibold">{t("form.title")}</h3>
                <p
                  className="text-sm"
                  style={{ color: "var(--uiux-neutral600)" }}
                >
                  {t("form.subtitle")}
                </p>
                <div className="grid gap-3">
                  <label className="text-sm font-semibold" htmlFor="library-search">
                    {t("form.searchLabel")}
                  </label>
                  <Input
                    id="library-search"
                    placeholder={t("form.searchPlaceholder")}
                  />
                </div>
                <div className="grid gap-3">
                  <label className="text-sm font-semibold" htmlFor="library-email">
                    {t("form.emailLabel")}
                  </label>
                  <Input
                    id="library-email"
                    type="email"
                    placeholder={t("form.emailPlaceholder")}
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">{t("form.primary")}</Button>
                  <Button variant="secondary">{t("form.secondary")}</Button>
                </div>
              </Card>
            </Section>

            <Section
              size="xl"
              paddingY="xl"
              paddingX="lg"
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-3">
                <h2 className="text-2xl font-semibold">{t("pricing.title")}</h2>
                <p style={{ color: "var(--uiux-neutral600)" }}>
                  {t("pricing.subtitle")}
                </p>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan) => (
                  <Card
                    key={plan.name}
                    className="flex h-full flex-col gap-4"
                    paddingToken="lg"
                    radiusToken="xl"
                    shadow={
                      plan.featured
                        ? "0 28px 70px rgba(15, 23, 42, 0.25)"
                        : "0 16px 36px rgba(15, 23, 42, 0.18)"
                    }
                    style={{
                      backgroundColor: "var(--uiux-neutral100)",
                      borderColor: plan.featured
                        ? "var(--uiux-primary)"
                        : "var(--uiux-neutral600)",
                      color: "var(--uiux-neutral900)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      {plan.featured ? (
                        <span
                          className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]"
                          style={{
                            backgroundColor: "var(--uiux-primary)",
                            color: "var(--uiux-neutral100)",
                          }}
                        >
                          {t("pricing.popular")}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-3xl font-semibold">{plan.price}</p>
                    <p
                      className="text-sm"
                      style={{ color: "var(--uiux-neutral600)" }}
                    >
                      {plan.body}
                    </p>
                    <Button variant={plan.featured ? "primary" : "secondary"}>
                      {plan.cta}
                    </Button>
                  </Card>
                ))}
              </div>
            </Section>

            <div
              className="rounded-3xl border"
              style={{
                borderColor: "var(--uiux-neutral600)",
                backgroundColor: "var(--uiux-neutral100)",
              }}
            >
              <Section
                size="xl"
                paddingY="2xl"
                paddingX="xl"
                className="flex flex-col gap-6"
              >
                <h2 className="text-2xl font-semibold">{t("cta.title")}</h2>
                <p
                  className="max-w-2xl"
                  style={{ color: "var(--uiux-neutral600)" }}
                >
                  {t("cta.subtitle")}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">{t("cta.primary")}</Button>
                  <Button variant="secondary">{t("cta.secondary")}</Button>
                </div>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
