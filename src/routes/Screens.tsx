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
import Input from "../components/Input";
import Section from "../components/Section";
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

type Highlight = {
  value: string;
  label: string;
};

type Feature = {
  title: string;
  body: string;
};

type GridItem = {
  title: string;
  body: string;
  tag: string;
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

const typeStyle = (token: string): CSSProperties => ({
  fontSize: `var(--uiux-${token}-size)`,
  lineHeight: `var(--uiux-${token}-line)`,
  fontWeight: `var(--uiux-${token}-weight)`,
});

export default function Screens() {
  const { t } = useTranslation("screens");

  const highlightsValue = t("landing.highlights", { returnObjects: true });
  const highlights = Array.isArray(highlightsValue)
    ? (highlightsValue as Highlight[])
    : [];
  const landingSectionsValue = t("landing.sections", { returnObjects: true });
  const landingSections = Array.isArray(landingSectionsValue)
    ? (landingSectionsValue as Feature[])
    : [];
  const gridItemsValue = t("grid.items", { returnObjects: true });
  const gridItems = Array.isArray(gridItemsValue)
    ? (gridItemsValue as GridItem[])
    : [];

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
  const forcedFieldState = interactionSettings.forceError
    ? "error"
    : interactionSettings.forceFocus
      ? "focus"
      : "default";
  const emailPreviewState = interactionSettings.forceError
    ? "error"
    : interactionSettings.forceFocus
      ? "focus"
      : "default";
  let revealIndex = 0;
  const nextRevealStyle = () =>
    getRevealStyle(interactionSettings, revealIndex++);
  const h1Style = typeStyle("h1");
  const h2Style = typeStyle("h2");
  const h3Style = typeStyle("h3");
  const h4Style = typeStyle("h4");
  const bodyStyle = typeStyle("body");
  const captionStyle = typeStyle("caption");
  const mutedTextStyle: CSSProperties = { color: "var(--uiux-neutral600)" };

  return (
    <div
      className="flex flex-col gap-12"
      style={interactionVars}
      data-force-hover={interactionSettings.forceHover ? "true" : "false"}
    >
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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <section className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.3em] text-amber-200">
            {t("tagline")}
          </p>
          <h1 className="text-3xl font-semibold">
            {t("title")}
          </h1>
          <p className="text-slate-300">
            {t("subtitle")}
          </p>
        </section>
        <ThemeToggle value={previewTone} onChange={setPreviewTone} />
      </div>

      <div className="flex flex-col gap-12">
        <Card
          paddingToken="3xl"
          radiusToken="xl"
          className="border uiux-reveal"
          style={{
            ...uiKitStyle,
            ...nextRevealStyle(),
            backgroundColor: "var(--uiux-neutral100)",
            color: "var(--uiux-neutral900)",
            borderColor: "var(--uiux-neutral600)",
          }}
        >
          <div
            className="flex flex-col"
            style={{ gap: "var(--uiux-space-3xl)" }}
          >
            <Section
              size="xl"
              paddingY="xs"
              paddingX="xs"
              className="flex flex-col"
              style={{ gap: "var(--uiux-space-2xl)" }}
            >
              <div
                className="grid items-start lg:grid-cols-[1.2fr_0.8fr]"
                style={{ gap: "var(--uiux-space-2xl)" }}
              >
                <div
                  className="flex flex-col"
                  style={{ gap: "var(--uiux-space-lg)" }}
                >
                  <p
                    className="text-xs uppercase tracking-[0.3em]"
                    style={{ color: "var(--uiux-accent)", ...captionStyle }}
                  >
                    {t("landing.kicker")}
                  </p>
                  <h2 className="font-semibold" style={h1Style}>
                    {t("landing.title")}
                  </h2>
                  <p style={{ ...bodyStyle, ...mutedTextStyle }}>
                    {t("landing.subtitle")}
                  </p>
                  <div
                    className="flex flex-wrap"
                    style={{ gap: "var(--uiux-space-sm)" }}
                  >
                    <Reveal className="inline-flex" style={nextRevealStyle()}>
                      <Button variant="primary" className="uiux-interactive">
                        {t("landing.primary")}
                      </Button>
                    </Reveal>
                    <Reveal className="inline-flex" style={nextRevealStyle()}>
                      <Button variant="secondary" className="uiux-interactive">
                        {t("landing.secondary")}
                      </Button>
                    </Reveal>
                  </div>
                </div>

                <div
                  className="grid sm:grid-cols-2"
                  style={{ gap: "var(--uiux-space-md)" }}
                >
                  {highlights.map((item) => (
                    <Reveal key={item.label} style={nextRevealStyle()}>
                      <Card
                        paddingToken="md"
                        radiusToken="lg"
                        className="border uiux-interactive"
                        style={{
                          borderColor: "var(--uiux-neutral600)",
                          backgroundColor: "var(--uiux-neutral100)",
                        }}
                      >
                        <p className="text-2xl font-semibold" style={h3Style}>
                          {item.value}
                        </p>
                        <p
                          className="text-xs uppercase tracking-[0.2em]"
                          style={{ ...captionStyle, ...mutedTextStyle }}
                        >
                          {item.label}
                        </p>
                      </Card>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Section>

            <Section
              size="xl"
              paddingY="xs"
              paddingX="xs"
              className="flex flex-col"
              style={{ gap: "var(--uiux-space-lg)" }}
            >
              <h3 className="font-semibold" style={h3Style}>
                {t("landing.sectionsTitle")}
              </h3>
              <div
                className="grid md:grid-cols-3"
                style={{ gap: "var(--uiux-space-lg)" }}
              >
                {landingSections.map((item) => (
                  <Reveal key={item.title} style={nextRevealStyle()}>
                    <Card
                      paddingToken="lg"
                      radiusToken="xl"
                      className="border uiux-interactive"
                      style={{
                        borderColor: "var(--uiux-neutral600)",
                        backgroundColor: "var(--uiux-neutral100)",
                      }}
                    >
                      <h4 className="font-semibold" style={h4Style}>
                        {item.title}
                      </h4>
                      <p style={{ ...bodyStyle, ...mutedTextStyle }}>
                        {item.body}
                      </p>
                    </Card>
                  </Reveal>
                ))}
              </div>
            </Section>
          </div>
        </Card>

        <Card
          paddingToken="3xl"
          radiusToken="xl"
          className="border uiux-reveal"
          style={{
            ...uiKitStyle,
            ...nextRevealStyle(),
            backgroundColor: "var(--uiux-neutral100)",
            color: "var(--uiux-neutral900)",
            borderColor: "var(--uiux-neutral600)",
          }}
        >
          <Section
            size="xl"
            paddingY="xs"
            paddingX="xs"
            className="flex flex-col"
            style={{ gap: "var(--uiux-space-2xl)" }}
          >
            <div className="flex flex-col" style={{ gap: "var(--uiux-space-sm)" }}>
              <p
                className="text-xs uppercase tracking-[0.3em]"
                style={{ color: "var(--uiux-accent)", ...captionStyle }}
              >
                {t("grid.kicker")}
              </p>
              <h2 className="font-semibold" style={h2Style}>
                {t("grid.title")}
              </h2>
              <p style={{ ...bodyStyle, ...mutedTextStyle }}>{t("grid.subtitle")}</p>
            </div>

            <div
              className="grid md:grid-cols-3"
              style={{ gap: "var(--uiux-space-lg)" }}
            >
              {gridItems.map((item) => (
                <Reveal key={item.title} style={nextRevealStyle()}>
                  <Card
                    paddingToken="lg"
                    radiusToken="lg"
                    className="border uiux-interactive"
                    style={{
                      borderColor: "var(--uiux-neutral600)",
                      backgroundColor: "var(--uiux-neutral100)",
                    }}
                  >
                    <p
                      className="text-xs uppercase tracking-[0.2em]"
                      style={{ ...captionStyle, ...mutedTextStyle }}
                    >
                      {item.tag}
                    </p>
                    <h3 className="font-semibold" style={h3Style}>
                      {item.title}
                    </h3>
                    <p style={{ ...bodyStyle, ...mutedTextStyle }}>
                      {item.body}
                    </p>
                  </Card>
                </Reveal>
              ))}
            </div>
          </Section>
        </Card>

        <Card
          paddingToken="3xl"
          radiusToken="xl"
          className="border uiux-reveal"
          style={{
            ...uiKitStyle,
            ...nextRevealStyle(),
            backgroundColor: "var(--uiux-neutral100)",
            color: "var(--uiux-neutral900)",
            borderColor: "var(--uiux-neutral600)",
          }}
        >
          <Section
            size="xl"
            paddingY="xs"
            paddingX="xs"
            className="flex flex-col"
            style={{ gap: "var(--uiux-space-2xl)" }}
          >
            <div className="flex flex-col" style={{ gap: "var(--uiux-space-sm)" }}>
              <p
                className="text-xs uppercase tracking-[0.3em]"
                style={{ color: "var(--uiux-accent)", ...captionStyle }}
              >
                {t("form.kicker")}
              </p>
              <h2 className="font-semibold" style={h2Style}>
                {t("form.title")}
              </h2>
              <p style={{ ...bodyStyle, ...mutedTextStyle }}>{t("form.subtitle")}</p>
            </div>

            <div
              className="grid md:grid-cols-2"
              style={{ gap: "var(--uiux-space-lg)" }}
            >
              <div className="flex flex-col" style={{ gap: "var(--uiux-space-sm)" }}>
                <p className="font-semibold" style={h4Style}>
                  {t("form.fields.name.label")}
                </p>
                <Input
                  size="md"
                  radiusToken="lg"
                  previewState={forcedFieldState}
                  placeholder={t("form.fields.name.placeholder")}
                />
                <p style={{ ...captionStyle, ...mutedTextStyle }}>
                  {t("form.fields.name.helper")}
                </p>
              </div>
              <div className="flex flex-col" style={{ gap: "var(--uiux-space-sm)" }}>
                <p className="font-semibold" style={h4Style}>
                  {t("form.fields.email.label")}
                </p>
                <Input
                  size="md"
                  radiusToken="lg"
                  previewState={emailPreviewState}
                  placeholder={t("form.fields.email.placeholder")}
                />
                {interactionSettings.forceError ? (
                  <p
                    className="text-sm"
                    style={{ ...captionStyle, color: "var(--uiux-error)" }}
                  >
                    {t("form.fields.email.error")}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-col" style={{ gap: "var(--uiux-space-sm)" }}>
                <p className="font-semibold" style={h4Style}>
                  {t("form.fields.company.label")}
                </p>
                <Input
                  size="md"
                  radiusToken="lg"
                  previewState={forcedFieldState}
                  placeholder={t("form.fields.company.placeholder")}
                />
                <p style={{ ...captionStyle, ...mutedTextStyle }}>
                  {t("form.fields.company.helper")}
                </p>
              </div>
            </div>

            <div
              className="flex flex-wrap items-center"
              style={{ gap: "var(--uiux-space-sm)" }}
            >
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
              <p style={{ ...captionStyle, ...mutedTextStyle }}>
                {t("form.footer")}
              </p>
            </div>
          </Section>
        </Card>
      </div>
    </div>
  );
}
