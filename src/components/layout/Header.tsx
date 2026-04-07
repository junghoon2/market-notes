"use client";

import Link from "next/link";
import { useState } from "react";
import SearchDialog from "@/components/ui/SearchDialog";
import type { Post } from "@/types";

/** 네비게이션 링크 목록 */
const NAV_LINKS = [
  { href: "/", label: "홈" },
  { href: "/blog", label: "블로그" },
  { href: "/about", label: "소개" },
];

/** 에디토리얼 헤더 — 중앙 대형 로고 + 우측 세로 네비 */
export default function Header({ posts = [] }: { posts?: Post[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="px-8 pt-8">
      {/* 메인 헤더 행: [빈공간] [로고] [네비] */}
      <div className="flex items-start">
        {/* 좌측 빈 공간 (데스크탑에서 네비 너비만큼 밸런스 확보) */}
        <div className="hidden w-32 shrink-0 md:block" />

        {/* 중앙 로고 */}
        <div className="flex-1 text-center">
          <Link href="/">
            <span className="block text-5xl font-black leading-none tracking-tight text-zinc-900 sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
              나의 투자 일지
            </span>
          </Link>
        </div>

        {/* 우측 세로 네비 (데스크탑) */}
        <div className="hidden w-32 shrink-0 flex-col items-end gap-2 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 transition-colors hover:text-zinc-900"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2">
            <SearchDialog posts={posts} />
          </div>
        </div>

        {/* 모바일 우측: 메뉴 버튼 */}
        <div className="flex shrink-0 items-center gap-3 md:hidden">
          <SearchDialog posts={posts} />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[11px] font-medium uppercase tracking-widest text-zinc-600"
            aria-label="메뉴 열기"
          >
            {isOpen ? "닫기" : "메뉴"}
          </button>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {isOpen && (
        <nav className="mt-3 flex flex-col gap-3 border-t border-zinc-200 pt-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-[11px] uppercase tracking-widest text-zinc-600 hover:text-zinc-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      {/* 하단 구분선 */}
      <div className="mt-6 border-t border-zinc-900" />
    </header>
  );
}
