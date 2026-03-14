/** 블로그 포스트의 frontmatter 메타데이터 타입 */
export type PostFrontmatter = {
  title: string;
  date: string;
  category: string;
  tags: string[];
  thumbnail?: string;
  description: string;
  draft?: boolean;
};

/** MDX 파일에서 파싱된 포스트 데이터 */
export type Post = {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  readingTime: string;
};

/** 카테고리 정보 */
export type Category = {
  name: string;
  slug: string;
  count: number;
};
