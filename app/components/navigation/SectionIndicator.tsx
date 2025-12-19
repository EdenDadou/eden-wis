interface SectionIndicatorProps {
  currentSection: number;
  totalSections?: number;
}

export function SectionIndicator({ currentSection, totalSections = 15 }: SectionIndicatorProps) {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-50">
      {Array.from({ length: totalSections }, (_, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full transition-all duration-300 ${
            currentSection === i
              ? "h-5 bg-cyan-400"
              : currentSection > i
                ? "h-1.5 bg-cyan-400/50"
                : "h-1.5 bg-white/20"
          }`}
        />
      ))}
    </div>
  );
}
