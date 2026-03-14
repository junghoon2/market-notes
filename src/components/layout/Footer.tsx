/** 사이트 하단 푸터 컴포넌트 */
export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-8 text-sm text-zinc-500 dark:text-zinc-400 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} Stock Blog. All rights reserved.</p>
        <div className="flex gap-6">
          <a
            href="/rss.xml"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            RSS
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
