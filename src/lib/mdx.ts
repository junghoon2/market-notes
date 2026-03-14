import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostFrontmatter, Category } from "@/types";

/** 콘텐츠 디렉토리 경로 */
const POSTS_DIR = path.join(process.cwd(), "content/posts");

/** 모든 MDX 파일 경로를 재귀적으로 수집 */
function getMdxFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMdxFiles(fullPath));
    } else if (entry.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }

  return files;
}

/** 단일 MDX 파일을 파싱하여 Post 객체로 변환 */
function parsePost(filePath: string): Post {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as PostFrontmatter;

  // 파일명에서 슬러그 추출 (확장자 제거)
  const slug = path.basename(filePath, ".mdx");

  // 읽기 시간 계산
  const stats = readingTime(content);

  return {
    slug,
    frontmatter,
    content,
    readingTime: stats.text.replace("read", "읽기"),
  };
}

/** 모든 포스트를 날짜 내림차순으로 반환 */
export function getAllPosts(): Post[] {
  const files = getMdxFiles(POSTS_DIR);

  return files
    .map(parsePost)
    .filter((post) => !post.frontmatter.draft)
    .sort(
      (a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
    );
}

/** 슬러그로 특정 포스트 조회 */
export function getPostBySlug(slug: string): Post | undefined {
  const files = getMdxFiles(POSTS_DIR);

  for (const file of files) {
    if (path.basename(file, ".mdx") === slug) {
      return parsePost(file);
    }
  }

  return undefined;
}

/** 모든 카테고리와 각 카테고리의 포스트 수 반환 */
export function getAllCategories(): Category[] {
  const posts = getAllPosts();
  const categoryMap = new Map<string, number>();

  for (const post of posts) {
    const cat = post.frontmatter.category;
    categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1);
  }

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({
      name,
      slug: encodeURIComponent(name),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/** 특정 카테고리의 포스트만 필터링 */
export function getPostsByCategory(categoryName: string): Post[] {
  return getAllPosts().filter(
    (post) => post.frontmatter.category === categoryName
  );
}

/** 모든 포스트 슬러그 목록 (정적 경로 생성용) */
export function getAllSlugs(): string[] {
  return getMdxFiles(POSTS_DIR).map((file) => path.basename(file, ".mdx"));
}
