// ゴミ出し占い 結果カード（表示専用・サーバ/クライアント共用）
import {
  type Fortune,
  type GomiKey,
  TYPES,
  fmtShort,
  RARITY_LABEL,
} from "@/lib/gomi/core";

function Badges({ list }: { list: GomiKey[] }) {
  if (!list.length) {
    return (
      <div className="gf-noCollect">
        この日は収集がありません。
        <br />
        “出さない日”もまた、占いの一部。
      </div>
    );
  }
  return (
    <div className="gf-gomiBadges">
      {list.map((k) => {
        const t = TYPES[k];
        return (
          <span className={`gf-gBadge ${t.cls}`} key={k}>
            <span className="gf-em">{t.em}</span>
            {t.label}
          </span>
        );
      })}
    </div>
  );
}

function NextList({ fortune }: { fortune: Fortune }) {
  return (
    <div className="gf-nextList">
      {fortune.next.map(({ key, date, days }) => {
        const t = TYPES[key];
        const soon = days !== null && days <= 1;
        return (
          <div className="gf-nextRow" key={key}>
            <span className="gf-nm">
              <span className="gf-em">{t.em}</span>
              {t.label}
            </span>
            <span className={`gf-dt${soon ? " soon" : ""}`}>
              {date ? fmtShort(date) : "—"}
              {days === 0 ? " ・今日" : days === 1 ? " ・明日" : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function FortuneCard({ fortune }: { fortune: Fortune }) {
  const f = fortune;
  return (
    <div className="gf-cardWrap">
      <div className={`gf-card r-${f.rarity}`}>
        <div className="gf-cardInner">
          <div className="gf-sheen" />
          <div className="gf-cHead">
            <span className="gf-cBrand">🗑️ GOMI FORTUNE</span>
            <span className={`gf-rBadge ${f.rarity.toLowerCase()}`}>
              {RARITY_LABEL[f.rarity]}
            </span>
          </div>
          <div className="gf-cDate">{f.dateLong}</div>
          <div className="gf-cArea">目黒区 ・ {f.area}</div>

          <div className="gf-rankBox">
            <div className={`gf-rankT gf-rank-${f.rank.cls}`}>{f.rank.t}</div>
            <span className="gf-rankS">― {f.rank.s} ―</span>
          </div>

          <div className="gf-todayWrap">
            <div className="gf-secLabel">この日 出せるゴミ</div>
            <Badges list={f.today} />
            {f.yearEnd && (
              <div className="gf-yearEndMini">
                ⚠ 年末年始は特別日程です。実際の収集日は
                <a
                  href="https://www.city.meguro.tokyo.jp/seisou/kurashi/gomi/youbiichiran.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  区公式
                </a>
                でご確認ください。
              </div>
            )}
          </div>

          <div className="gf-action">
            <div className="gf-secLabel">⚡ 今日の開運作法</div>
            <div className="gf-actionTxt">{f.command}</div>
          </div>

          <div className="gf-fsGrid">
            <div className="gf-fsCell">
              <div className="gf-fsCap">ラッキー方位</div>
              <div className="gf-fsIcon">{f.dir.i}</div>
              <div className="gf-fsVal">{f.dir.n}</div>
            </div>
            <div className="gf-fsCell">
              <div className="gf-fsCap">ラッキーカラー</div>
              <div
                className="gf-swatch"
                style={{ background: f.color.c, color: f.color.c }}
              />
              <div className="gf-fsVal">{f.color.n}</div>
            </div>
            <div className="gf-fsCell">
              <div className="gf-fsCap">開運アイテム</div>
              <div className="gf-fsIcon">{f.item.i}</div>
              <div className="gf-fsVal">{f.item.n}</div>
            </div>
          </div>

          <div className="gf-ng">
            <span className="gf-ico">🚫</span>
            <div className="gf-ngTxt">
              <b>今日のNG作法：</b>
              {f.ng}
            </div>
          </div>

          <div className="gf-luck">
            <div className="gf-li">
              <div className="gf-lcap">開運ナンバー</div>
              <div className="gf-lval">{f.luckyNum}</div>
            </div>
            <div className="gf-li">
              <div className="gf-lcap">ゴミ出し吉時</div>
              <div className="gf-lval">{String(f.luckyHour).padStart(2, "0")}:00</div>
            </div>
            <div className="gf-li">
              <div className="gf-lcap">属性</div>
              <div className="gf-lval">{f.element}</div>
            </div>
          </div>

          <div className="gf-neta">{f.neta}</div>

          <div className="gf-nextWrap">
            <div className="gf-secLabel">📅 次の収集予定</div>
            <NextList fortune={f} />
          </div>

          <div className="gf-cFoot">
            出典：目黒区「資源とごみの収集日」公式データ準拠
            <br />
            #ゴミ出し占い #decomoji
          </div>
        </div>
      </div>
    </div>
  );
}
