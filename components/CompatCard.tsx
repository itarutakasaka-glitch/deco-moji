// デコ文字相性診断 結果カード（表示専用・サーバ/クライアント共用）
import { type CompatResult, TIER_META } from "@/lib/compatibility-core";

export default function CompatCard({ result }: { result: CompatResult }) {
  const d = result;
  const cls = TIER_META[d.tier].cls;
  return (
    <div className="cp-cardwrap">
      <div className={`cp-card cp-${cls}`}>
        <div className="cp-inner">
          <div className="cp-sheen" />
          <div className="cp-head">
            <span className="cp-brand">💞 デコ文字相性診断</span>
          </div>
          <div className="cp-names">
            {d.nameA}
            <span className="cp-x">×</span>
            {d.nameB}
          </div>

          <div className="cp-scorewrap">
            <div className="cp-score">
              {d.score}
              <span className="cp-pct">%</span>
            </div>
            <div className="cp-bar">
              <div className="cp-barfill" style={{ width: `${d.score}%` }} />
            </div>
          </div>

          <div className="cp-tier">
            <span className="cp-tieremoji">{d.tierEmoji}</span>
            {d.tierLabel}
          </div>

          <div className="cp-comment">{d.comment}</div>

          <div className="cp-deco">{d.decoWord}</div>

          <div className="cp-meta">
            <div className="cp-metarow">
              <span className="cp-metacap">今日のひとこと</span>
              {d.advice}
            </div>
            <div className="cp-metarow">
              <span className="cp-metacap">ラッキーデート</span>
              {d.luckyDate}
            </div>
          </div>

          <div className="cp-foot">decomoji.xyz ・ #デコ文字相性診断</div>
        </div>
      </div>
    </div>
  );
}
