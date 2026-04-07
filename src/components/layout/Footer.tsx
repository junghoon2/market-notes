/** 사이트 하단 푸터 컴포넌트 */
export default function Footer() {
  return (
    <footer className="border-t border-zinc-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-8 text-[11px] uppercase tracking-widest text-zinc-400 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} 나의 투자 일지</p>
        <div className="flex gap-6">
          <a
            href="/rss.xml"
            className="transition-colors hover:text-zinc-900"
          >
            RSS
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-zinc-900"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
