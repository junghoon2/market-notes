import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

/** 카테고리별 그라디언트 색상 매핑 */
const CATEGORY_GRADIENTS: Record<string, string> = {
  주간리포트: "from-blue-400 to-blue-700",
  매매일지: "from-emerald-400 to-emerald-700",
  포트폴리오: "from-violet-400 to-violet-700",
  기업분석: "from-orange-400 to-orange-700",
  시장분석: "from-rose-400 to-rose-700",
  투자철학: "from-amber-400 to-amber-700",
};

function getCategoryGradient(category: string): string {
  return CATEGORY_GRADIENTS[category] ?? "from-zinc-400 to-zinc-700";
}

/** 에디토리얼 포스트 카드 — 이미지/그라디언트 우선, 하단 제목만 */
export default function PostCard({
  post,
  large = false,
}: {
  post: Post;
  large?: boolean;
}) {
  const gradient = getCategoryGradient(post.frontmatter.category);

  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        {/* 이미지 / 그라디언트 영역 */}
        <div
          className={`w-full overflow-hidden bg-gradient-to-br ${gradient} ${large ? "aspect-[3/4]" : "aspect-[4/3]"}`}
        >
          {post.frontmatter.thumbnail ? (
            <img
              src={post.frontmatter.thumbnail}
              alt={post.frontmatter.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            /* thumbnail 없을 때 카테고리 레이블만 표시 */
            <div className="flex h-full w-full items-end p-4">
              <span className="text-[10px] font-medium uppercase tracking-widest text-white/60">
                {post.frontmatter.category}
              </span>
            </div>
          )}
        </div>

        {/* 텍스트 영역 */}
        <div className="mt-3 space-y-1">
          <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
            {formatDate(post.frontmatter.date)}&nbsp;&nbsp;·&nbsp;&nbsp;{post.readingTime}
          </p>
          <h2 className="text-sm font-semibold uppercase leading-snug tracking-wide text-zinc-900 transition-colors group-hover:text-zinc-500">
            {post.frontmatter.title}
          </h2>
        </div>
      </Link>
    </article>
  );
}
