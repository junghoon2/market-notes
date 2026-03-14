/** 날짜를 한국어 형식으로 포맷팅 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** 카테고리 이름을 URL-safe 슬러그로 변환 */
export function slugify(text: string): string {
  return encodeURIComponent(text.toLowerCase().replace(/\s+/g, "-"));
}

/** URL 슬러그를 원래 카테고리 이름으로 복원 */
export function deslugify(slug: string): string {
  return decodeURIComponent(slug).replace(/-/g, " ");
}
