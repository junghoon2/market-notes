import Link from "next/link";
import { getAllPosts, getAllCategories } from "@/lib/mdx";
import PostList from "@/components/blog/PostList";

/** 홈페이지 - 최신 글 목록과 카테고리 사이드바 */
export default function HomePage() {
  const posts = getAllPosts();
  const categories = getAllCategories();

  // 최신 5개 글만 홈에 표시
  const recentPosts = posts.slice(0, 5);

  return (
    <div className="space-y-12">
      {/* 히어로 섹션 */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          나의 투자 일지
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          매매 기록, 투자 복기, 포트폴리오 변화를 솔직하게 기록합니다.
        </p>
      </section>

      <div className="grid gap-12 lg:grid-cols-[1fr_240px]">
        {/* 최신 글 목록 */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">최신 글</h2>
            <Link
              href="/blog"
              className="text-sm text-blue-600 hover:underline dark:text-blue-400"
            >
              모든 글 보기 →
            </Link>
          </div>
          <PostList posts={recentPosts} />
        </section>

        {/* 카테고리 사이드바 */}
        <aside className="hidden lg:block">
          <h3 className="mb-4 text-lg font-semibold">카테고리</h3>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                    {cat.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
