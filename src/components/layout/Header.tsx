"use client";

import Link from "next/link";
import { useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SearchDialog from "@/components/ui/SearchDialog";
import type { Post } from "@/types";

/** 네비게이션 링크 목록 */
const NAV_LINKS = [
  { href: "/", label: "홈" },
  { href: "/blog", label: "블로그" },
  { href: "/about", label: "소개" },
];

/** 사이트 상단 헤더 컴포넌트 */
export default function Header({ posts = [] }: { posts?: Post[] }) {
  // 모바일 메뉴 열림/닫힘 상태
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
        {/* 로고 */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
        >
          📈 Stock Blog
        </Link>

        {/* 데스크톱 네비게이션 */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 우측 도구 영역 */}
        <div className="flex items-center gap-2">
          <SearchDialog posts={posts} />
          <ThemeToggle />

          {/* 모바일 메뉴 버튼 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-zinc-600 hover:bg-zinc-100 md:hidden dark:text-zinc-400 dark:hover:bg-zinc-800"
            aria-label="메뉴 열기"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* 모바일 네비게이션 */}
      {isOpen && (
        <nav className="border-t border-zinc-200 px-6 py-4 md:hidden dark:border-zinc-800">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
