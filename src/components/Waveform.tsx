export default function Waveform({ active }: { active: boolean }) {
  const bars = Array.from({ length: 32 });
  return (
    <div className="flex items-center justify-center gap-1 h-20">
      {bars.map((_, i) => {
        const height = 12 + ((i * 13) % 60);
        return (
          <span
            key={i}
            className={`waveform-bar block w-1.5 rounded-full ${
              active ? "bg-red-500" : "bg-slate-300"
            }`}
            style={{
              height: `${height}px`,
              animationDelay: `${(i % 8) * 0.08}s`,
              animationPlayState: active ? "running" : "paused",
            }}
          />
        );
      })}
    </div>
  );
}
