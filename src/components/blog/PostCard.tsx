import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";

/** 카테고리별 그라디언트 색상 (인라인 스타일로 적용 — Tailwind 동적 클래스 번들 누락 방지) */
const CATEGORY_COLORS: Record<string, { from: string; to: string }> = {
  주간리포트: { from: "#60a5fa", to: "#1d4ed8" },
  매매일지:   { from: "#34d399", to: "#047857" },
  포트폴리오: { from: "#a78bfa", to: "#6d28d9" },
  기업분석:   { from: "#fb923c", to: "#c2410c" },
  시장분석:   { from: "#fb7185", to: "#be123c" },
  투자철학:   { from: "#fbbf24", to: "#b45309" },
  투자회고:   { from: "#38bdf8", to: "#0369a1" },
};

function getGradientStyle(category: string): React.CSSProperties {
  const colors = CATEGORY_COLORS[category] ?? { from: "#a1a1aa", to: "#52525b" };
  return {
    background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
  };
}

/** 에디토리얼 포스트 카드 — 그라디언트 이미지 우선, 하단 제목만 */
export default function PostCard({
  post,
  large = false,
}: {
  post: Post;
  large?: boolean;
}) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        {/* 이미지 / 그라디언트 영역 */}
        <div
          className={`w-full overflow-hidden ${large ? "aspect-[3/4]" : "aspect-[4/3]"}`}
          style={post.frontmatter.thumbnail ? undefined : getGradientStyle(post.frontmatter.category)}
        >
          {post.frontmatter.thumbnail ? (
            <img
              src={post.frontmatter.thumbnail}
              alt={post.frontmatter.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-end p-4">
              <span
                className="text-[10px] font-medium uppercase tracking-widest"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
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
