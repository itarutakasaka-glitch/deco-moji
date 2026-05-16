export default function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="flex items-center gap-3 my-9 mb-4"
      style={{
        fontFamily: "var(--font-display)",
        fontSize: "1.4rem",
        color: "var(--color-pink-4)",
      }}
    >
      <span
        aria-hidden="true"
        className="flex-1 h-[3px]"
        style={{
          background:
            "repeating-linear-gradient(90deg, var(--color-pink-3) 0 8px, transparent 8px 14px)",
        }}
      />
      {children}
      <span
        aria-hidden="true"
        className="flex-1 h-[3px]"
        style={{
          background:
            "repeating-linear-gradient(90deg, var(--color-pink-3) 0 8px, transparent 8px 14px)",
        }}
      />
    </h2>
  );
}
