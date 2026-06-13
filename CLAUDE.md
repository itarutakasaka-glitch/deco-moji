# CLAUDE.md — decomoji.xyz（デコ文字メーカー）

Itaru（itarutakasaka-glitch / itaru.takasaka@gmail.com）の個人サイト。会話は日本語。

## このリポは何か
- **decomoji.xyz** = デコ文字メーカー。特殊文字（デコ文字）の変換ツール＋関連コンテンツ。
- Stack: Next.js（App Router）/ Vercel 自動デプロイ（main push → 本番）/ メールは Resend 予定。
- GitHub: `itarutakasaka-glitch/deco-moji`（PRIVATE）。本番ホストは **www.decomoji.xyz**（apex はリダイレクト）。
- 計測: GA4 = `G-GDX0LHQ0BG`（GAアカウント mall-japan 配下）。AdSense pub = `pub-7490892593665830`。

## 最重要の現状（2026-06-13 時点）
- **AdSense は「有用性の低いコンテンツ」で不承認**。再審査に向けてコンテンツを大増設中（下記）。広告タグは配信中だが実広告は出ていない。
- 再審査コースの進捗:
  - ✅ ドアウェイ3ページ（/instagram /tiktok /x）を独自ガイドに転生（不承認の直接原因を除去）
  - ✅ /shindan（SNSパワー診断・動的OGP）/ /kabegami（推しメンカラ壁紙・13グループ）
  - ✅ /copy（コピペ集10カテゴリ）/ /mojibake（文字化け早見表）
  - ✅ サイトURL修正（canonical等が decomoji.example.com プレースホルダを指していた重大バグを修正）
  - ⏳ 残: 占い×ゴミ通知（下記）、ブログ増強 → **AdSense「審査をリクエスト」**（数日インデックスを待ってから）

## 進行中の新機能：ゴミ出し占い × ごみ収集日メール通知
- コンセプト: 「占いが"今日の正しいゴミの出し方（開運作法）"を授ける」。義務を娯楽化。
- 占いエンジン = **軸の掛け算**（/shindan のシード乱数を流用）。今日のごみ種別が"テーマ"を切替→大量×文脈一致。
- 配信 = **メール**（LINE Notify は2025-03終了のため）。Resend + Vercel Cron（毎朝6時JST）。インフォグラフィック型カード（スクショでバズる縦長）。デコ文字装飾＋アフィリ＋サイト誘導。
- 法律: 特定電子メール法（opt-in＋解除リンク＋送信者情報）、ステマ規制（PR明記）。AdSenseはメール内不可→収益はアフィリ＋サイト誘導でAdSense。
- データ: `lib/gomi/meguro-schedule.json`（目黒区公式・全44エリア=88丁目・上目黒四丁目スクショ検証済）。`source/` に出典PDF。
- ルール形式は汎用（weekly / nthWeekday）= **目黒区→全国**はデータ追加だけ。
- 次の一手: Phase1「ゴミ出し占いページ（上目黒四丁目MVP・バックエンド無し）」を単体HTMLで作って見せる → decomoji統合。占い基調=断捨離×風水＋ネタのミックス。

## 開発スタンス（Itaru）
- 非エンジニア。MVP-First（単体HTMLで世界観→確認→Next.js統合）。選択肢A/B/Cで決断を求める。短く結論先出し。
- ミスは隠さず率直に。間違ったまま完了主張しない。
- **ファン向けデータ（メンカラ/曜日等）は必ずWebで裏取り**（記憶のメンカラは複数回間違えた実績あり）。アーティスト写真・ロゴは権利上不可、名前×事実情報のみ。
- 各変更後にスクショ/プレビューで視覚確認するイテレーティブな進め方。

## 運用ルール（恒久・グローバルCLAUDE.md準拠）
- **作業の区切りで commit → push 必須**（Git管理＋GitHubバックアップ）。push は許可済み（`~/.claude/settings.json` の permissions で `Bash(git push:*)` 自動許可。force系のみ確認）。
- ディレクトリ/URL/ファイル/API名は英語（日本語ローマ字禁止）。コメント/UI文言は日本語OK。
- dev サーバ稼働中に本番ビルドすると `.next` が壊れる→ビルド時はdev停止。Webhook取りこぼしでデプロイされない時はVercelで手動Redeploy。

## 兄弟プロジェクト
- **bluetanuki.xyz**（`../hatch-site`）: 5ジャンル銀河の便利ツール集。GA4=`G-Y7T0SJLPYG`稼働中・AdSense未申請。引き継ぎは repo 内 HANDOVER.md。
- 個人系は全て `C:\Users\kyari\projects\other\` 配下（deco-moji / hatch-site / deco-moji-mvp）。MVPの単体HTMLは `../deco-moji-mvp`。
- ※Toggle/ヘヤクレスの仕事は `C:\Users\kyari\projects\` 直下の別プロジェクト。混ぜない。
