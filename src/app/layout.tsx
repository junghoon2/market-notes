import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getAllPosts } from "@/lib/mdx";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** 사이트 전역 메타데이터 */
export const metadata: Metadata = {
  title: {
    default: "나의 투자일지",
    template: "%s | 나의 투자일지",
  },
  description: "개인 투자 기록과 매매 복기, 포트폴리오 변화를 공유하는 투자 일지",
};

/** 루트 레이아웃 - 모든 페이지에 공통 적용 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 검색에 사용할 포스트 데이터 (content 제외하여 경량화)
  const posts = getAllPosts().map(({ slug, frontmatter, readingTime }) => ({
    slug,
    frontmatter,
    readingTime,
    content: "",
  }));

  return (
    <html lang="ko" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50`}
      >
        <Header posts={posts} />
        <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
