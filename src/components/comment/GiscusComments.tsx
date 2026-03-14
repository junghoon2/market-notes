"use client";

import { useEffect, useRef } from "react";

/**
 * Giscus 댓글 컴포넌트
 * GitHub Discussions 기반 댓글 시스템
 * 환경 변수 설정 후 활성화됨
 */
export default function GiscusComments() {
  const ref = useRef<HTMLDivElement>(null);

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO ?? "";
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? "";
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? "";

  useEffect(() => {
    // 환경 변수가 없으면 스크립트 로드 생략
    if (!repo || !repoId || !categoryId || !ref.current) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", "Comments");
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "preferred_color_scheme");
    script.setAttribute("data-lang", "ko");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    ref.current.appendChild(script);

    return () => {
      // 클린업: 기존 giscus 프레임 제거
      const iframe = ref.current?.querySelector("iframe.giscus-frame");
      iframe?.remove();
      script.remove();
    };
  }, [repo, repoId, categoryId]);

  // 환경 변수가 설정되지 않은 경우 안내 메시지 표시
  if (!repo || !repoId || !categoryId) {
    return (
      <div className="mt-12 rounded-lg border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        댓글 기능은 Giscus 설정 후 활성화됩니다.
      </div>
    );
  }

  return <div ref={ref} className="mt-12" />;
}
