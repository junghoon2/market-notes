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

/** 에디토리얼 스타일 헤더 — 중앙 대형 로고 + 우측 세로 네비 */
export default function Header({ posts = [] }: { posts?: Post[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="relative px-8 pb-0 pt-8">
      {/* 우측 상단 세로 네비게이션 (데스크탑) */}
      <div className="absolute right-8 top-8 hidden flex-col items-end gap-1.5 md:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 transition-colors hover:text-zinc-900"
          >
            {link.label}
          </Link>
        ))}
        <div className="mt-3">
          <SearchDialog posts={posts} />
        </div>
      </div>

      {/* 중앙 대형 로고 */}
      <div className="text-center">
        <Link href="/" className="inline-block">
          <span className="block text-5xl font-black leading-none tracking-tight text-zinc-900 sm:text-7xl md:text-8xl lg:text-9xl">
            나의 투자 일지
          </span>
        </Link>
      </div>

      {/* 모바일 네비게이션 */}
      <div className="mt-4 flex items-center justify-between md:hidden">
        <SearchDialog posts={posts} />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[11px] font-medium uppercase tracking-widest text-zinc-600"
          aria-label="메뉴 열기"
        >
          {isOpen ? "닫기" : "메뉴"}
        </button>
      </div>
      {isOpen && (
        <nav className="mt-2 flex flex-col gap-3 border-t border-zinc-200 pt-3 md:hidden">
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
