# 補助金データ鮮度 MCP サーバ

decomoji.xyz の `/subsidy`（東京23区の補助金データ）を**定期的に自動で新鮮に保つ**ための仕組みの一部。
このMCPサーバは、Claude（予約エージェント等）が「どの制度が期限切れ／締切間近か」「どの区を再確認すべきか」を
把握し、再スクレイプの要否を判断するためのツール面を提供します。依存パッケージ不要（`node` だけで動く）。

## 3層の鮮度アーキテクチャ

1. **実行時オートフレッシュ（無メンテ）** … `app/api/subsidy/route.ts`
   締切テキストから実日付を復元し、**期限切れの制度は「募集中」から自動で除外**。締切カウントダウンも表示。
   → 何もしなくても、期限が過ぎた補助金がユーザーに出ることはない（誤情報ゼロ）。
2. **定期自動監査（週次cron）** … `.github/workflows/freshness-audit.yml` + `scripts/audit-freshness.mjs`
   毎週、締切・URL到達性を機械チェックし、**期限切れ／リンク切れがあればGitHub Issueで通知**（mainには書き込まない）。
3. **再スクレイプ（このMCP＋予約エージェント）** … 本サーバ
   Issue（or 本サーバのツール）で対象を特定 → Claudeが該当区の公式サイトを再取得して `tokyo-wards.json` を更新するPRを作る。

## ツール

| tool | 引数 | 返り値 |
|---|---|---|
| `audit_subsidies` | `{ http?: boolean }` | 全体監査（期限切れ/締切間近/期限なし/(http時)リンク切れ）＋区別ランキング |
| `list_expiring` | `{ days?: number }` (既定30) | 指定日数以内に締切が来る（or過ぎた）制度一覧 |
| `wards_needing_refresh` | `{}` | 期限切れ・締切間近が多い区を多い順に |

## 登録（Claude Code）

リポジトリ直下の `.mcp.json` に登録済み。Claude Code をこのリポで開けば自動で使えます。手動登録する場合:

```json
{
  "mcpServers": {
    "subsidy-freshness": {
      "command": "node",
      "args": ["tools/freshness-mcp/server.mjs"]
    }
  }
}
```

## 定期自動化（予約エージェント）

週次で「再スクレイプまで含めて自動」にするには、Claude Code の `/schedule`（cloudルーティン）で
「毎週このMCPで `wards_needing_refresh` を確認し、期限切れがある区を公式サイトから再取得して `tokyo-wards.json` を更新するPRを作る」
というエージェントを登録する。純粋な監査だけなら GitHub Actions（層2）だけで回る。

## 手動実行

```bash
node scripts/audit-freshness.mjs         # 締切だけ監査 → lib/subsidy/freshness.json
node scripts/audit-freshness.mjs --http  # URL到達性も確認（遅い）
```
