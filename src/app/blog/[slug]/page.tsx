import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getAllSlugs, getPostBySlug } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import GiscusComments from "@/components/comment/GiscusComments";
import StockChartWrapper from "@/components/chart/StockChartWrapper";
import StockInfoCard from "@/components/chart/StockInfo";
import TOC from "@/components/blog/TOC";

type Props = {
  params: Promise<{ slug: string }>;
};

/** 정적 경로 생성 - 빌드 시 모든 글 페이지를 미리 생성 */
export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

/** 페이지별 동적 메타데이터 생성 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
    },
  };
}

/** 블로그 글 상세 페이지 */
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  // 존재하지 않는 글이면 404
  if (!post) notFound();

  return (
    <div className="relative">
      {/* 우측 목차 (xl 이상에서 표시) */}
      <aside className="absolute -right-56 top-0 hidden w-48 xl:block">
        <TOC />
      </aside>

    <article className="mx-auto max-w-3xl">
      {/* 글 헤더 */}
      <header className="mb-10 space-y-4">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
          {post.frontmatter.category}
        </span>
        <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {post.frontmatter.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <time dateTime={post.frontmatter.date}>
            {formatDate(post.frontmatter.date)}
          </time>
          <span>·</span>
          <span>{post.readingTime}</span>
        </div>
        {post.frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
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
      </header>

      {/* MDX 본문 렌더링 */}
      <div className="prose max-w-none">
        <MDXRemote
          source={post.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
            },
          }}
          components={{
            StockChart: StockChartWrapper,
            StockInfo: StockInfoCard,
          }}
        />
      </div>

      {/* 댓글 */}
      <GiscusComments />
    </article>
    </div>
  );
}
