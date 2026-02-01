import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import Button from "../components/Button";
import Card from "../components/Card";
import Checkbox from "../components/Checkbox";
import Input from "../components/Input";
import Radio from "../components/Radio";
import Select from "../components/Select";
import Section from "../components/Section";
import Textarea from "../components/Textarea";
import ThemeToggle from "../components/ThemeToggle";
import {
  INTERACTION_EASINGS,
  buildInteractionShadow,
  getRevealStyle,
  getStoredInteractionSettings,
} from "../utils/interactionSettings";
import { buildUiKitVars } from "../utils/uiKitTokens";

const PREVIEW_TONE_STORAGE_KEY = "uiux-preview-tone";

type PreviewTone = "light" | "dark";

const getStoredPreviewTone = (): PreviewTone => {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = window.localStorage.getItem(PREVIEW_TONE_STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
};

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

type RevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const Reveal = ({ children, className = "", style }: RevealProps) => (
  <div className={`uiux-reveal ${className}`.trim()} style={style}>
    {children}
  </div>
);

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

  const [previewTone, setPreviewTone] = useState<PreviewTone>(() =>
    getStoredPreviewTone(),
  );
  const [uiKitVars, setUiKitVars] = useState<Record<string, string>>(() =>
    buildUiKitVars(previewTone),
  );
  const [interactionSettings, setInteractionSettings] = useState(() =>
    getStoredInteractionSettings(),
  );

  useEffect(() => {
    setUiKitVars(buildUiKitVars(previewTone));
  }, [previewTone]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(PREVIEW_TONE_STORAGE_KEY, previewTone);
  }, [previewTone]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "uiux-interaction-settings") {
        setInteractionSettings(getStoredInteractionSettings());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toneOverrides = useMemo(() => {
    if (previewTone !== "dark") {
      return {};
    }
    const neutral100 = uiKitVars["--uiux-neutral100"] ?? "#F8FAFC";
    const neutral900 = uiKitVars["--uiux-neutral900"] ?? "#0F172A";
    return {
      "--uiux-neutral100": neutral900,
      "--uiux-neutral900": neutral100,
      "--uiux-neutral600": `color-mix(in srgb, ${neutral100} 70%, transparent)`,
      "--uiux-input-bg": `color-mix(in srgb, ${neutral900} 88%, ${neutral100})`,
      "--uiux-input-text": neutral100,
      "--uiux-input-placeholder": `color-mix(in srgb, ${neutral100} 60%, transparent)`,
      "--uiux-input-border": `color-mix(in srgb, ${neutral100} 20%, transparent)`,
    } as CSSProperties;
  }, [previewTone, uiKitVars]);

  const uiKitStyle = useMemo(
    () => ({ ...uiKitVars, ...toneOverrides }) as CSSProperties,
    [uiKitVars, toneOverrides],
  );
  const interactionVars = useMemo(() => {
    const revealTiming = INTERACTION_EASINGS[interactionSettings.revealEasing];
    const hoverScaleValue = 1 + interactionSettings.hoverScale / 100;
    return {
      "--uiux-hover-lift": `${interactionSettings.hoverLift}px`,
      "--uiux-hover-scale": `${hoverScaleValue}`,
      "--uiux-hover-shadow": buildInteractionShadow(
        interactionSettings.hoverShadow,
      ),
      "--uiux-reveal-duration": `${interactionSettings.revealDuration}ms`,
      "--uiux-reveal-ease": revealTiming,
      "--uiux-reveal-distance": `${interactionSettings.revealDistance}px`,
    } as CSSProperties;
  }, [interactionSettings]);
  const forcedInputState = interactionSettings.forceError
    ? "error"
    : interactionSettings.forceFocus
      ? "focus"
      : "default";
  let revealIndex = 0;
  const nextRevealStyle = () =>
    getRevealStyle(interactionSettings, revealIndex++);

  return (
    <div className="flex flex-col gap-12">
      <style>{`
        @keyframes uiux-reveal {
          from {
            opacity: 0;
            transform: translateY(var(--uiux-reveal-distance, 16px));
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .uiux-reveal {
          animation-name: uiux-reveal;
          animation-duration: var(--uiux-reveal-duration, 420ms);
          animation-timing-function: var(--uiux-reveal-ease, ease);
          animation-fill-mode: both;
        }
        .uiux-interactive {
          --uiux-card-shadow: none;
          transition: transform 180ms var(--uiux-reveal-ease, ease),
            box-shadow 180ms var(--uiux-reveal-ease, ease);
          will-change: transform, box-shadow;
        }
        .uiux-interactive:hover:not(:has(.uiux-interactive:hover)),
        [data-force-hover="true"] .uiux-interactive {
          transform: translateY(calc(-1 * var(--uiux-hover-lift, 0px)))
            scale(var(--uiux-hover-scale, 1));
          box-shadow: var(--uiux-hover-shadow, none);
          --uiux-card-shadow: var(--uiux-hover-shadow, none);
        }
      `}</style>
      <div className="rounded-[32px] border border-slate-800 bg-slate-900/60 p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-slate-700" />
            <span className="h-3 w-3 rounded-full bg-slate-700" />
            <span className="h-3 w-3 rounded-full bg-slate-700" />
          </div>
          <ThemeToggle value={previewTone} onChange={setPreviewTone} />
        </div>
        <div
          className="rounded-[28px] border"
          data-force-hover={interactionSettings.forceHover ? "true" : "false"}
          style={{
            ...uiKitStyle,
            ...interactionVars,
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
                  <Reveal className="inline-flex" style={nextRevealStyle()}>
                    <Button variant="primary" className="uiux-interactive">
                      {t("hero.primary")}
                    </Button>
                  </Reveal>
                  <Reveal className="inline-flex" style={nextRevealStyle()}>
                    <Button variant="secondary" className="uiux-interactive">
                      {t("hero.secondary")}
                    </Button>
                  </Reveal>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {stats.map((item) => (
                    <Reveal key={item.label} style={nextRevealStyle()}>
                      <div
                        className="uiux-interactive rounded-2xl border p-4"
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
                    </Reveal>
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
                  <Reveal key={item.title} style={nextRevealStyle()}>
                    <Card
                      className="uiux-interactive flex h-full flex-col gap-3"
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
                  </Reveal>
                ))}
              </div>
            </Section>

            <Section
              size="xl"
              paddingY="xl"
              paddingX="lg"
              className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
            >
              <Reveal style={nextRevealStyle()}>
                <Card
                  className="uiux-interactive flex flex-col gap-5"
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
                      <Reveal key={item.title} style={nextRevealStyle()}>
                        <div
                          className="uiux-interactive rounded-2xl border p-4"
                          style={{
                            borderColor: "var(--uiux-neutral600)",
                            backgroundColor: "var(--uiux-neutral100)",
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold">
                              {item.title}
                            </h4>
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
                      </Reveal>
                    ))}
                  </div>
                  <Reveal className="inline-flex" style={nextRevealStyle()}>
                    <Button variant="primary" className="uiux-interactive">
                      {t("showcase.primaryAction")}
                    </Button>
                  </Reveal>
                </Card>
              </Reveal>

              <Reveal style={nextRevealStyle()}>
                <Card
                  className="uiux-interactive flex flex-col gap-4"
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
                    <label
                      className="text-sm font-semibold"
                      htmlFor="library-search"
                    >
                      {t("form.searchLabel")}
                    </label>
                    <Input
                      id="library-search"
                      placeholder={t("form.searchPlaceholder")}
                      previewState={forcedInputState}
                    />
                  </div>
                  <div className="grid gap-3">
                    <label
                      className="text-sm font-semibold"
                      htmlFor="library-email"
                    >
                      {t("form.emailLabel")}
                    </label>
                    <Input
                      id="library-email"
                      type="email"
                      placeholder={t("form.emailPlaceholder")}
                      previewState={forcedInputState}
                    />
                  </div>
                <div className="grid gap-3">
                  <label
                    className="text-sm font-semibold"
                    htmlFor="library-role"
                  >
                    {t("form.roleLabel")}
                  </label>
                  <Select
                    id="library-role"
                    defaultValue=""
                    previewState={forcedInputState}
                  >
                    <option value="" disabled>
                      {t("form.rolePlaceholder")}
                    </option>
                    <option value="ui">{t("form.roleOptions.ui")}</option>
                    <option value="product">
                      {t("form.roleOptions.product")}
                    </option>
                    <option value="dev">{t("form.roleOptions.dev")}</option>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <p className="text-sm font-semibold">
                    {t("form.preferencesLabel")}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox previewState={forcedInputState} />
                      <span>{t("form.preferencesOptions.updates")}</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox previewState={forcedInputState} />
                      <span>{t("form.preferencesOptions.invites")}</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox previewState={forcedInputState} />
                      <span>{t("form.preferencesOptions.newsletter")}</span>
                    </label>
                  </div>
                  <p
                    className="text-xs"
                    style={{ color: "var(--uiux-neutral600)" }}
                  >
                    {t("form.preferencesHint")}
                  </p>
                </div>
                <div className="grid gap-3">
                  <p className="text-sm font-semibold">
                    {t("form.projectLabel")}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <label className="flex items-center gap-2 text-sm">
                      <Radio
                        name="library-project"
                        value="new"
                        previewState={forcedInputState}
                      />
                      <span>{t("form.projectOptions.new")}</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Radio
                        name="library-project"
                        value="redesign"
                        previewState={forcedInputState}
                      />
                      <span>{t("form.projectOptions.redesign")}</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <Radio
                        name="library-project"
                        value="prototype"
                        previewState={forcedInputState}
                      />
                      <span>{t("form.projectOptions.prototype")}</span>
                    </label>
                  </div>
                  <p
                    className="text-xs"
                    style={{ color: "var(--uiux-neutral600)" }}
                  >
                    {t("form.projectHint")}
                  </p>
                </div>
                <div className="grid gap-3">
                  <label className="text-sm font-semibold" htmlFor="library-message">
                    {t("form.messageLabel")}
                  </label>
                  <Textarea
                    id="library-message"
                    rows={3}
                    placeholder={t("form.messagePlaceholder")}
                    previewState={forcedInputState}
                  />
                  <p
                    className="text-xs"
                    style={{ color: "var(--uiux-neutral600)" }}
                  >
                    {t("form.messageHint")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Reveal className="inline-flex" style={nextRevealStyle()}>
                    <Button variant="primary" className="uiux-interactive">
                      {t("form.primary")}
                    </Button>
                    </Reveal>
                    <Reveal className="inline-flex" style={nextRevealStyle()}>
                      <Button variant="secondary" className="uiux-interactive">
                        {t("form.secondary")}
                      </Button>
                    </Reveal>
                  </div>
                </Card>
              </Reveal>
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
                  <Reveal key={plan.name} style={nextRevealStyle()}>
                    <Card
                      className="uiux-interactive flex h-full flex-col gap-4"
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
                      <Reveal className="inline-flex" style={nextRevealStyle()}>
                        <Button
                          variant={plan.featured ? "primary" : "secondary"}
                          className="uiux-interactive"
                        >
                          {plan.cta}
                        </Button>
                      </Reveal>
                    </Card>
                  </Reveal>
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
                  <Reveal className="inline-flex" style={nextRevealStyle()}>
                    <Button variant="primary" className="uiux-interactive">
                      {t("cta.primary")}
                    </Button>
                  </Reveal>
                  <Reveal className="inline-flex" style={nextRevealStyle()}>
                    <Button variant="secondary" className="uiux-interactive">
                      {t("cta.secondary")}
                    </Button>
                  </Reveal>
                </div>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
