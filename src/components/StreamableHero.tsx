import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

type StreamableHeroProps = {
  title: string;
  className?: string;
  tone?: "light" | "dark";
};

export default function StreamableHero({
  title,
  className,
  tone = "light",
}: StreamableHeroProps) {
  const viewBoxWidth = 1400;
  const viewBoxHeight = 1000;
  const bottomCutTop = 360;
  const bottomCutHeight = viewBoxHeight - bottomCutTop;
  const bottomCutRadius = 160;
  const bottomCutPath = [
    `M0 ${bottomCutTop + bottomCutRadius}`,
    `Q0 ${bottomCutTop} ${bottomCutRadius} ${bottomCutTop}`,
    `H${viewBoxWidth - bottomCutRadius}`,
    `Q${viewBoxWidth} ${bottomCutTop} ${viewBoxWidth} ${
      bottomCutTop + bottomCutRadius
    }`,
    `V${viewBoxHeight}`,
    "H0Z",
  ].join(" ");

  const shaderTone =
    tone === "dark"
      ? {
          brightness: 0.9,
          color1: "#14172b",
          color2: "#3d2a7a",
          color3: "#1d2148",
        }
      : {
          brightness: 1.2,
          color1: "#2a2554",
          color2: "#8d5adb",
          color3: "#4646a7",
        };

  const overlayFill = tone === "dark" ? "#0b0f1b" : "#ffffff";

  const sectionClassName = [
    "relative isolate overflow-hidden rounded-[2.75rem] border border-slate-800/70 bg-slate-950/80 px-6 pb-14 pt-20 motion-safe:animate-fade-in sm:px-10 lg:px-16 lg:pb-16",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      className={sectionClassName}
      style={
        {
          "--hero-cutout-height": "clamp(170px, 22vw, 280px)",
        } as React.CSSProperties
      }
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <ShaderGradientCanvas
          className="shader-canvas shader-canvas--zoom"
          fov={40}
          pixelDensity={1.7}
          pointerEvents="none"
        >
            <ShaderGradient
              control="props"
              animate="on"
              brightness={shaderTone.brightness}
              cAzimuthAngle={180}
              cDistance={4.8}
              cPolarAngle={90}
              cameraZoom={15.2}
              color1={shaderTone.color1}
              color2={shaderTone.color2}
              color3={shaderTone.color3}
              envPreset="city"
              grain="on"
              grainBlending={0.12}
              lightType="3d"
            positionX={0.3}
            positionY={0.4}
            positionZ={-1.6}
            range="disabled"
            rangeEnd={40}
            rangeStart={0}
            reflection={0.1}
            rotationX={0}
            rotationY={30}
            rotationZ={50}
            shader="defaults"
            toggleAxis={false}
            type="sphere"
            uAmplitude={0.4}
            uDensity={4.5}
            uFrequency={5.5}
            uSpeed={0.1}
            uStrength={1.2}
            uTime={0}
            wireframe={false}
            zoomOut={false}
          />
        </ShaderGradientCanvas>
        <div className="hero-scrim" />
      </div>

      <h1 className="sr-only">{title}</h1>
      <div className="pointer-events-none absolute inset-0 z-20">
        <svg
          className="streamable-cutout h-full w-full"
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          preserveAspectRatio="none"
          role="presentation"
        >
          <defs>
            <mask
              id="streamable-cutout-mask"
              maskUnits="userSpaceOnUse"
              maskContentUnits="userSpaceOnUse"
            >
              <rect width={viewBoxWidth} height={viewBoxHeight} fill="white" />
              <path d={bottomCutPath} fill="black" />
              <text
                x="50%"
                y="32%"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="black"
                className="streamable-cutout-text"
              >
                {title}
              </text>
            </mask>
          </defs>
          <rect
            width={viewBoxWidth}
            height={viewBoxHeight}
            fill={overlayFill}
            mask="url(#streamable-cutout-mask)"
          />
        </svg>
      </div>

    </section>
  );
}
