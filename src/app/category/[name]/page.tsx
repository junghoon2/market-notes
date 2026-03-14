import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCategories, getPostsByCategory } from "@/lib/mdx";
import PostList from "@/components/blog/PostList";

type Props = {
  params: Promise<{ name: string }>;
};

/** 정적 경로 생성 - 모든 카테고리 페이지를 미리 생성 */
export async function generateStaticParams() {
  return getAllCategories().map((cat) => ({ name: cat.slug }));
}

/** 카테고리별 동적 메타데이터 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const categoryName = decodeURIComponent(name);
  return {
    title: `${categoryName} - 카테고리`,
    description: `${categoryName} 카테고리의 글 모음`,
  };
}

/** 카테고리별 글 목록 페이지 */
export default async function CategoryPage({ params }: Props) {
  const { name } = await params;
  const categoryName = decodeURIComponent(name);
  const posts = getPostsByCategory(categoryName);

  // 해당 카테고리에 글이 없으면 404
  if (posts.length === 0) notFound();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">카테고리</p>
        <h1 className="text-3xl font-bold tracking-tight">{categoryName}</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          {posts.length}개의 글
        </p>
      </div>
      <PostList posts={posts} />
    </div>
  );
}
