import StreamableHero from "../components/StreamableHero";

export default function StreamableCanvas() {
  return (
    <div className="w-screen">
      <StreamableHero
        title="Streamable"
        tone="light"
        className="min-h-screen w-full rounded-none border-0 bg-transparent px-0 pb-0 pt-0"
      />
    </div>
  );
}
