# デコ文字メーカー (deco-moji)

SNSプロフィール・推し活で映えるデコ文字をワンタップでコピーできるツールサイト。

## 技術スタック

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS v4 (CSS-first config)
- Google Fonts (Klee One / RocknRoll One / Caveat / DotGothic16)
- 完全静的生成（高速・SEO強い）

## 開発

```bash
# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
# → http://localhost:3000

# 本番ビルド確認
npm run build
npm run start
```

## ファイル構成

```
deco-moji/
├── app/
│   ├── layout.tsx              # ルートレイアウト（フォント・GA・AdSense読み込み）
│   ├── page.tsx                # ホームページ
│   ├── instagram/page.tsx      # Instagram用ランディング
│   ├── tiktok/page.tsx         # TikTok用ランディング
│   ├── x/page.tsx              # X用ランディング
│   ├── howto/page.tsx          # 使い方ガイド
│   ├── privacy/page.tsx        # プライバシーポリシー
│   ├── sitemap.ts              # サイトマップ自動生成
│   ├── robots.ts               # robots.txt自動生成
│   ├── not-found.tsx           # 404ページ
│   └── globals.css             # Tailwind + テーマトークン
├── components/
│   ├── Generator.tsx           # 入力＋変換結果（クライアント）
│   ├── Frames.tsx              # 装飾フレーム集（クライアント）
│   ├── SiteHeader.tsx          # 共通ヘッダー
│   ├── SiteFooter.tsx          # 共通フッター
│   ├── SnsPageTemplate.tsx     # SNS別ページ用テンプレート
│   ├── AdSlot.tsx              # 広告枠（環境変数なしならプレースホルダー）
│   ├── SectionTitle.tsx        # セクション見出し
│   └── TipsBox.tsx             # SNSコツ表示ボックス
├── lib/
│   ├── styles.ts               # フォント変換ロジック・データ
│   └── site-config.ts          # サイト全体の設定
├── .env.example                # 環境変数サンプル
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

## デプロイ手順（Vercel）

1. GitHubに新規リポジトリを作って `git push`
2. [Vercel](https://vercel.com)でリポジトリをImport（GitHub連携）
3. デフォルト設定のままDeploy
4. デプロイ完了したらドメイン設定
   - お名前.com等で取得したドメインをVercelに接続
   - Vercelのプロジェクト設定 → Domains から追加
5. 環境変数を設定（Vercelのプロジェクト設定 → Environment Variables）
   - `NEXT_PUBLIC_SITE_URL`: 本番URL（例: `https://decomoji-maker.com`）
   - `NEXT_PUBLIC_GA_ID`: GA4のMeasurement ID（後で）
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID`: AdSenseのクライアントID（審査通過後）

## 公開後にやること

### 1. Google Search Console登録
- [Search Console](https://search.google.com/search-console)でサイト追加
- サイトマップを送信: `https://yourdomain.com/sitemap.xml`

### 2. Google Analytics 4 設定
- GA4プロパティ作成
- Measurement IDを環境変数 `NEXT_PUBLIC_GA_ID` に設定
- Vercelで再デプロイ

### 3. Google AdSense審査
- 審査前の準備:
  - 独自ドメイン取得済み
  - プライバシーポリシー設置済み（このプロジェクトでは `/privacy`）
  - 使い方等のオリジナルコンテンツがある（`/howto`）
- 審査申請（[AdSense](https://www.google.com/adsense/)）
- 通過後、クライアントIDを `NEXT_PUBLIC_ADSENSE_CLIENT_ID` に設定
- AdSlot コンポーネントの slot 引数に各広告ユニットIDを設定

### 4. ドメイン候補
- `decomoji.com` / `deco-moji.jp` / `mojikira.com` 等を検討
- お名前.com・Cloudflare Registrar・Vercel Domainsなど

## カスタマイズ

### 新しいフォントスタイルを追加
`lib/styles.ts` の `fontStyles` 配列に追記。
Mathematical Alphanumeric Symbolsなどから対応するUnicodeを選んで貼り付け。

### 新しいSNSランディングを追加
1. `lib/site-config.ts` の `landingPages` に追加
2. `app/<slug>/page.tsx` を作成（既存のinstagram/tiktokをコピーして調整）
3. `app/sitemap.ts` にURLを追加

### 配色を変える
`app/globals.css` の `@theme` ブロック内の `--color-*` を編集。

## ライセンス

このコードは個人プロジェクト用です。フォントはGoogle Fonts（OFL）。
