import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import PostList from "@/components/blog/PostList";

export const metadata: Metadata = {
  title: "블로그",
  description: "모든 주식 투자 분석 글 목록",
};

/** 블로그 목록 페이지 — 전체 글을 에디토리얼 그리드로 표시 */
export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="space-y-6">
      {/* 섹션 레이블 */}
      <div className="flex items-baseline justify-between border-b border-zinc-900 pb-3">
        <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-900">
          / 전체 글
        </span>
        <span className="text-[11px] uppercase tracking-widest text-zinc-400">
          {posts.length}개의 글
        </span>
      </div>

      <PostList posts={posts} />
    </div>
  );
}
