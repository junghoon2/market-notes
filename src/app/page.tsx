import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import PostList from "@/components/blog/PostList";

/** 홈페이지 — 에디토리얼 스타일 최신 글 목록 */
export default function HomePage() {
  const posts = getAllPosts();
  const recentPosts = posts.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* 섹션 레이블 */}
      <div className="flex items-baseline justify-between border-b border-zinc-900 pb-3">
        <span className="text-[11px] font-medium uppercase tracking-widest text-zinc-900">
          / 최신 글
        </span>
        <Link
          href="/blog"
          className="text-[11px] uppercase tracking-widest text-zinc-400 transition-colors hover:text-zinc-900"
        >
          (전체 글 보기)
        </Link>
      </div>

      <PostList posts={recentPosts} />
    </div>
  );
}
