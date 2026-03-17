"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

/** 다크모드 토글 버튼 컴포넌트 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  // 초기 테마 로드
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) {
      setTheme(saved);
      applyTheme(saved);
    }
  }, []);

  // 테마 변경 시 적용
  function applyTheme(newTheme: Theme) {
    const root = document.documentElement;

    if (newTheme === "dark") {
      root.classList.add("dark");
    } else if (newTheme === "light") {
      root.classList.remove("dark");
    } else {
      // system: 시스템 설정 따르기
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    }
  }

  function toggleTheme() {
    // light → dark → system 순환
    const next: Theme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    applyTheme(next);
  }

  // 서버 렌더링 시 빈 버튼 표시 (hydration mismatch 방지)
  if (!mounted) {
    return (
      <button className="flex h-9 w-9 items-center justify-center rounded-md" aria-label="테마 변경" />
    );
  }

  const icon = theme === "light" ? "☀️" : theme === "dark" ? "🌙" : "💻";
  const label = theme === "light" ? "밝게" : theme === "dark" ? "어둡게" : "자동";

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
      aria-label="테마 변경"
      title={`현재: ${label} — 클릭하면 변경`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
