import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import PostList from "@/components/blog/PostList";

export const metadata: Metadata = {
  title: "블로그",
  description: "모든 주식 투자 분석 글 목록",
};

/** 블로그 목록 페이지 - 모든 글을 날짜순으로 표시 */
export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">블로그</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          총 {posts.length}개의 글
        </p>
      </div>
      <PostList posts={posts} />
    </div>
  );
}
