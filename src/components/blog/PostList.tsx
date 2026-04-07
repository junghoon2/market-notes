import PostCard from "./PostCard";
import type { Post } from "@/types";

/** 에디토리얼 3열 그리드 — 첫 번째 포스트는 세로로 크게 */
export default function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="py-20 text-center text-zinc-500">
        <p className="text-sm uppercase tracking-widest">아직 작성된 글이 없습니다.</p>
      </div>
    );
  }

  // 첫 3개: 에디토리얼 특집 행 (좌측 normal, 중앙 large, 우측 normal)
  const featured = posts.slice(0, 3);
  // 나머지: 3열 일반 그리드
  const rest = posts.slice(3);

  return (
    <div className="space-y-10">
      {/* 에디토리얼 특집 행 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:items-start">
        {featured[0] && <PostCard post={featured[0]} />}
        {featured[1] && <PostCard post={featured[1]} large />}
        {featured[2] && <PostCard post={featured[2]} />}
      </div>

      {/* 구분선 + 나머지 포스트 */}
      {rest.length > 0 && (
        <>
          <div className="border-t border-zinc-200" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
