import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

/** 블로그 글 카드 컴포넌트 - 목록에서 개별 포스트를 표시 */
export default function PostCard({ post }: { post: Post }) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="rounded-lg border border-zinc-200 p-6 transition-all hover:border-zinc-400 hover:shadow-sm dark:border-zinc-800 dark:hover:border-zinc-600">
          {/* 카테고리 뱃지 */}
          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {post.frontmatter.category}
          </span>

          {/* 제목 */}
          <h2 className="mt-3 text-xl font-semibold text-zinc-900 group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
            {post.frontmatter.title}
          </h2>

          {/* 설명 */}
          <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
            {post.frontmatter.description}
          </p>

          {/* 메타 정보 */}
          <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500">
            <time dateTime={post.frontmatter.date}>
              {formatDate(post.frontmatter.date)}
            </time>
            <span>·</span>
            <span>{post.readingTime}</span>
          </div>

          {/* 태그 목록 */}
          {post.frontmatter.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
