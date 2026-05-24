# Progress

## 현재 상태

- 프로젝트는 Next.js 16.1.6, React 19.2.3, TypeScript, Tailwind CSS 4 기반의 투자 일지 블로그다.
- 콘텐츠 초안은 `docs/preview/`, 발행본은 `content/posts/YYYY/`에 둔다.
- 세션 운영 파일로 `AGENTS.md`, `feature-list.json`, `progress.md`, `init.sh`를 사용한다.

## 최근 확인 결과

- 2026-05-24: `package.json` 기준 Next.js 버전은 `16.1.6`이다.
- 2026-05-24: `README.md`에는 초안은 `docs/preview/`, 발행본은 `content/posts/YYYY/`로 이동한다는 워크플로우가 이미 정리되어 있다.
- 2026-05-24: `.gitignore`에는 `credentials.json` 규칙이 이미 있어 추가 변경하지 않았다.

## 검증 결과

- 2026-05-24: `pnpm lint` 실패.
  - 오류: `src/components/blog/TOC.tsx`의 `react-hooks/set-state-in-effect`.
  - 오류: `src/components/chart/StockChart.tsx`의 `react-hooks/set-state-in-effect`.
  - 오류: `src/components/ui/SearchDialog.tsx`의 `react-hooks/set-state-in-effect`.
  - 오류: `src/components/ui/ThemeToggle.tsx`의 `react-hooks/immutability`.
  - 경고: `src/components/blog/PostCard.tsx`의 `@next/next/no-img-element`.
  - 경고: `src/components/comment/GiscusComments.tsx`의 `react-hooks/exhaustive-deps`.
- 2026-05-24: `bash -n init.sh` 통과.
- 2026-05-24: `pnpm build`는 sandbox 네트워크 제한 상태에서 Google Fonts fetch 실패로 중단.
- 2026-05-24: 네트워크 허용 후 `pnpm build` 통과.

## 다음 작업 후보

- `feature-list.json`의 `lint-react-hooks-set-state` 항목부터 처리한다.
- `PostCard`의 이미지 처리 방식을 `next/image` 기준으로 정리할지 결정한다.
- `GiscusComments` cleanup ref 경고를 제거한다.
- 운영 파일이 실제 세션 시작 프로토콜에 맞게 계속 유지되는지 확인한다.
