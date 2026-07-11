// ゴミの日カレンダー — 自作SVGビジュアル（区の画像素材は不使用のオリジナル）
import type { GomiKey } from "@/lib/gomi/core";

const PATHS: Record<GomiKey, React.ReactNode> = {
  // 燃やすごみ：炎
  burnable: (
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2 2.5Z" />
  ),
  // びん・缶・ペットボトル：ボトル
  recyclable: (
    <>
      <path d="M9.5 3h5v2.3c0 .8.4 1.2.9 1.6.7.6 1.1 1.4 1.1 2.4V20a1 1 0 0 1-1 1H8.5a1 1 0 0 1-1-1V9.3c0-1 .4-1.8 1.1-2.4.5-.4.9-.8.9-1.6Z" />
      <line x1="7.5" y1="13" x2="16.5" y2="13" />
    </>
  ),
  // 古紙：新聞・紙束
  paper: (
    <>
      <path d="M4 4h13a1 1 0 0 1 1 1v14a2 2 0 0 0 2 2H5a2 2 0 0 1-2-2V5a1 1 0 0 1 1-1Z" />
      <path d="M18 8h1.5a1 1 0 0 1 1 1v10a2 2 0 0 1-2 2" />
      <line x1="7" y1="8" x2="14" y2="8" />
      <line x1="7" y1="12" x2="14" y2="12" />
      <line x1="7" y1="16" x2="11" y2="16" />
    </>
  ),
  // 燃やさないごみ：レンチ（金属・小物）
  nonBurnable: (
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.6-3.6a6 6 0 0 1-7.9 7.7l-6.5 6.5a2.1 2.1 0 0 1-3-3l6.5-6.5a6 6 0 0 1 7.7-7.9L14.7 6.3Z" />
  ),
  // 水銀を含む製品：電池
  mercury: (
    <>
      <rect x="3" y="8" width="15" height="9" rx="1.5" />
      <line x1="20.5" y1="11" x2="20.5" y2="14" />
      <line x1="9" y1="5" x2="12" y2="5" />
      <line x1="10.5" y1="5" x2="10.5" y2="8" />
    </>
  ),
};

export function GomiIcon({ k, size = 22 }: { k: GomiKey; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {PATHS[k]}
    </svg>
  );
}

// ヒーローの手描き風イラスト（放射線つきのゴミ袋・オリジナル）
export function HeroArt({ color = "#7f4098" }: { color?: string }) {
  const rays = [
    [12, 3.5, 12, 0.5],
    [15.4, 4.4, 17.3, 1.9],
    [8.6, 4.4, 6.7, 1.9],
    [17.8, 6.8, 20.4, 5.2],
    [6.2, 6.8, 3.6, 5.2],
    [18.9, 10, 22, 9.4],
    [5.1, 10, 2, 9.4],
  ];
  return (
    <svg
      width="120"
      height="108"
      viewBox="0 0 24 22"
      fill="none"
      stroke={color}
      strokeWidth="0.85"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {rays.map((r, i) => (
        <line key={i} x1={r[0]} y1={r[1]} x2={r[2]} y2={r[3]} opacity="0.85" />
      ))}
      {/* 袋の口の結び目 */}
      <path d="M9.6 8.2C9 6.6 8 6 7.3 6.4 M14.4 8.2C15 6.6 16 6 16.7 6.4" />
      <path d="M12 8.4c-.5-1-.4-1.9.1-2.6M12 8.4c.5-1 .4-1.9-.1-2.6" />
      {/* 袋の本体 */}
      <path d="M9.4 8.4h5.2c1.4.9 2 3.2 2.2 6.2.2 2.7-.2 5.1-.9 5.9-.7.9-2.4 1.1-5 1.1s-4.3-.2-5-1.1c-.7-.8-1.1-3.2-.9-5.9.2-3 .8-5.3 2.2-6.2Z" />
      {/* 質感のシワ */}
      <path d="M9.8 13.6c.9.5 1.7.7 2.4.7M15.6 15c-.7.5-1.5.8-2.3.8" opacity="0.5" />
    </svg>
  );
}
