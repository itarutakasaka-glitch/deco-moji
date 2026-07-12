import type { Metadata } from "next";
import Link from "next/link";
import SubsidyFinder from "@/components/SubsidyFinder";
import "./subsidy.css";

export const metadata: Metadata = {
  title: "補助金・助成金 診断🔎 いま募集中だけ｜地域×目的で探す（法人・個人事業）",
  description:
    "都道府県と「やりたいこと（設備投資・販路開拓・雇用・IT/DX・創業など）」を選ぶだけで、いま公募中の補助金・助成金を締切が近い順に一覧。国・都道府県の制度（出典：デジタル庁jGrants）から受付中のみを表示。市区町村の制度も順次追加。",
  alternates: { canonical: "/subsidy" },
  openGraph: {
    title: "補助金・助成金 診断🔎 いま募集中だけ｜地域×目的で探す",
    description:
      "地域と目的を選ぶだけ。公募中の補助金・助成金を締切が近い順に。国・都道府県の制度（jGrants）から受付中のみ表示。",
    url: "/subsidy",
  },
  twitter: {
    card: "summary_large_image",
    title: "補助金・助成金 診断🔎 いま募集中だけ",
    description: "地域と目的を選ぶだけで、公募中の補助金・助成金を締切が近い順に。",
  },
};

export default function SubsidyPage() {
  return (
    <>
      <SubsidyFinder />
      <div className="sf-root" style={{ minHeight: "auto" }}>
        <section className="sf-about">
          <h2>補助金・助成金を「いま募集中のものだけ」から探す</h2>
          <p>
            補助金・助成金は数が多く、国・都道府県・市区町村にバラバラに公募されていて、
            しかも<b>公募期間（締切）が短い</b>のが探しにくさの原因です。このページは、
            お住まい・所在の都道府県と「やりたいこと」を選ぶだけで、
            <b>いま受付中</b>の制度を締切が近い順にまとめて表示します。設備投資・販路開拓・
            展示会出展・雇用・人材育成・IT/DX化・創業・研究開発・事業再構築・省エネなど、
            目的から絞り込めます。
          </p>
          <h2>データの出どころと使い方</h2>
          <p>
            国・都道府県の制度は、デジタル庁の
            <a href="https://www.jgrants-portal.go.jp/" target="_blank" rel="noopener noreferrer">
              jGrants（Jグランツ）
            </a>
            の公開データを基に、<b>受付中のもの</b>だけを表示しています（出典明記のうえ利用）。
            気になる制度は各カードから公式ページへ進み、要件・補助率・申請様式・締切をご確認ください。
            市区町村が独自に出している補助金は順次追加していきます。
          </p>
          <h2>申請の相談は専門家へ</h2>
          <p>
            補助金・助成金は、要件の確認・事業計画書の作成・スケジュール管理が採択のカギになります。
            本サイトは<b>情報提供のみ</b>で申請の代行は行いません。実際の申請にあたっては、
            税理士・行政書士・社会保険労務士・中小企業診断士などの専門家へのご相談をおすすめします。
            なお、雇用関係の助成金の申請代行は社会保険労務士、補助金の申請書類作成の代行は行政書士など、
            資格が必要な業務があります。
          </p>
          <p style={{ marginTop: 18 }}>
            <Link href="/trash-day">🗑️ 東京23区 ごみ収集日カレンダー</Link>
            {" ・ "}
            <Link href="/">⊹ デコ文字メーカー</Link>
          </p>
        </section>
      </div>
    </>
  );
}
