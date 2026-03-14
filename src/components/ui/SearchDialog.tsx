"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { Post } from "@/types";

type SearchDialogProps = {
  /** 검색 대상 포스트 목록 */
  posts: Post[];
};

/** 글 검색 다이얼로그 컴포넌트 (Cmd+K로 열기) */
export default function SearchDialog({ posts }: SearchDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Cmd+K (Mac) / Ctrl+K (Windows) 단축키
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 다이얼로그 열릴 때 입력 필드에 포커스
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // 검색어로 포스트 필터링 (제목, 설명, 태그, 카테고리)
  const filtered = query.trim()
    ? posts.filter((post) => {
        const q = query.toLowerCase();
        return (
          post.frontmatter.title.toLowerCase().includes(q) ||
          post.frontmatter.description.toLowerCase().includes(q) ||
          post.frontmatter.category.toLowerCase().includes(q) ||
          post.frontmatter.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
    : [];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-9 items-center gap-2 rounded-md border border-zinc-200 px-3 text-sm text-zinc-500 transition-colors hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500"
        aria-label="검색"
      >
        <span>🔍</span>
        <span className="hidden sm:inline">검색</span>
        <kbd className="ml-2 hidden rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-500 sm:inline dark:bg-zinc-800">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100]">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* 검색 다이얼로그 */}
      <div className="absolute left-1/2 top-[20%] w-full max-w-lg -translate-x-1/2 px-4">
        <div className="rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
          {/* 검색 입력 */}
          <div className="flex items-center border-b border-zinc-200 px-4 dark:border-zinc-700">
            <span className="text-zinc-400">🔍</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="글 제목, 태그, 카테고리 검색..."
              className="flex-1 bg-transparent px-3 py-4 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-50"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="rounded px-2 py-1 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              ESC
            </button>
          </div>

          {/* 검색 결과 */}
          <div className="max-h-80 overflow-y-auto p-2">
            {query.trim() && filtered.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-zinc-500">
                검색 결과가 없습니다.
              </p>
            )}
            {filtered.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-4 py-3 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {post.frontmatter.title}
                </p>
                <p className="mt-1 line-clamp-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {post.frontmatter.description}
                </p>
              </Link>
            ))}
            {!query.trim() && (
              <p className="px-4 py-8 text-center text-sm text-zinc-400">
                검색어를 입력하세요
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
