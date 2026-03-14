import PostCard from "./PostCard";
import type { Post } from "@/types";

/** 포스트 카드 목록을 렌더링하는 컴포넌트 */
export default function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="py-20 text-center text-zinc-500 dark:text-zinc-400">
        <p className="text-lg">아직 작성된 글이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
