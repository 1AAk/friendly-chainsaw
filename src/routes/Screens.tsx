import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Section from "../components/Section";
import { buildUiKitVars } from "../utils/uiKitTokens";

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

  const [uiKitVars, setUiKitVars] = useState<Record<string, string>>(() =>
    buildUiKitVars(),
  );

  useEffect(() => {
    setUiKitVars(buildUiKitVars());
  }, []);

  const uiKitStyle = useMemo(() => uiKitVars as CSSProperties, [uiKitVars]);
  const h1Style = typeStyle("h1");
  const h2Style = typeStyle("h2");
  const h3Style = typeStyle("h3");
  const h4Style = typeStyle("h4");
  const bodyStyle = typeStyle("body");
  const captionStyle = typeStyle("caption");
  const mutedTextStyle: CSSProperties = { color: "var(--uiux-neutral600)" };

  return (
    <div className="flex flex-col gap-12">
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

      <div className="flex flex-col gap-12">
        <Card
          paddingToken="3xl"
          radiusToken="xl"
          className="border"
          style={{
            ...uiKitStyle,
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
                    <Button variant="primary">{t("landing.primary")}</Button>
                    <Button variant="secondary">{t("landing.secondary")}</Button>
                  </div>
                </div>

                <div
                  className="grid sm:grid-cols-2"
                  style={{ gap: "var(--uiux-space-md)" }}
                >
                  {highlights.map((item) => (
                    <Card
                      key={item.label}
                      paddingToken="md"
                      radiusToken="lg"
                      className="border"
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
                  <Card
                    key={item.title}
                    paddingToken="lg"
                    radiusToken="xl"
                    className="border"
                    style={{
                      borderColor: "var(--uiux-neutral600)",
                      backgroundColor: "var(--uiux-neutral100)",
                    }}
                  >
                    <h4 className="font-semibold" style={h4Style}>
                      {item.title}
                    </h4>
                    <p style={{ ...bodyStyle, ...mutedTextStyle }}>{item.body}</p>
                  </Card>
                ))}
              </div>
            </Section>
          </div>
        </Card>

        <Card
          paddingToken="3xl"
          radiusToken="xl"
          className="border"
          style={{
            ...uiKitStyle,
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
                <Card
                  key={item.title}
                  paddingToken="lg"
                  radiusToken="lg"
                  className="border"
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
                  <p style={{ ...bodyStyle, ...mutedTextStyle }}>{item.body}</p>
                </Card>
              ))}
            </div>
          </Section>
        </Card>

        <Card
          paddingToken="3xl"
          radiusToken="xl"
          className="border"
          style={{
            ...uiKitStyle,
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
                  previewState="error"
                  placeholder={t("form.fields.email.placeholder")}
                />
                <p
                  className="text-sm"
                  style={{ ...captionStyle, color: "var(--uiux-error)" }}
                >
                  {t("form.fields.email.error")}
                </p>
              </div>
              <div className="flex flex-col" style={{ gap: "var(--uiux-space-sm)" }}>
                <p className="font-semibold" style={h4Style}>
                  {t("form.fields.company.label")}
                </p>
                <Input
                  size="md"
                  radiusToken="lg"
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
              <Button variant="primary">{t("form.primary")}</Button>
              <Button variant="secondary">{t("form.secondary")}</Button>
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
