export default function TipsBox({
  title,
  tips,
}: {
  title: string;
  tips: string[];
}) {
  return (
    <div
      className="rounded-2xl px-6 py-5 my-8 shadow-cute-lav"
      style={{
        background:
          "linear-gradient(135deg, var(--color-lav) 0%, var(--color-pink-1) 100%)",
        border: "3px solid var(--color-ink)",
      }}
    >
      <h3
        className="mb-3"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.2rem",
          color: "var(--color-pink-4)",
        }}
      >
        ♡ {title}
      </h3>
      <ul className="list-none p-0 m-0">
        {tips.map((tip, idx) => (
          <li
            key={idx}
            className="py-1.5 text-[0.95rem] last:border-b-0"
            style={{
              borderBottom: "1px dashed rgba(58, 36, 56, 0.2)",
            }}
          >
            <span style={{ color: "var(--color-pink-3)", fontWeight: "bold" }}>
              ◆{" "}
            </span>
            {tip}
          </li>
        ))}
      </ul>
    </div>
  );
}
