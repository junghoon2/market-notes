# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 명령어

```bash
pnpm dev        # 개발 서버 실행 (localhost:3000)
pnpm build      # 프로덕션 빌드
pnpm lint       # ESLint 실행
```

## 아키텍처 개요

Next.js App Router 기반의 정적 블로그. 콘텐츠는 `content/posts/` 의 Markdown/MDX 파일로 관리한다.

### 콘텐츠 파이프라인

`content/posts/**/*.md(x)` → `src/lib/mdx.ts` → App Router Pages

- `src/lib/mdx.ts`가 콘텐츠 레이어 역할 — 파일 시스템을 직접 읽어 `Post` 객체로 변환
- `gray-matter`로 frontmatter 파싱, `reading-time`으로 읽기 시간 계산
- 빌드 시 `generateStaticParams()`가 모든 슬러그를 수집해 정적 페이지 생성
- 슬러그 = 파일명 (확장자 제외). 디렉토리 구조는 무시됨 (`2026/March-week4-record.md` → slug: `March-week4-record`)

### MDX 컴포넌트 주입

`src/app/blog/[slug]/page.tsx`의 `MDXRemote`에서 커스텀 컴포넌트를 주입:
- `<StockChart>` → `StockChartWrapper` (클라이언트 차트, TradingView Lightweight Charts)
- `<StockInfo>` → `StockInfoCard` (주식 요약 정보 카드)

MDX에서 새 컴포넌트를 사용하려면 이 파일의 `components` 맵에 추가해야 한다.

### 주식 데이터

`src/lib/stock-api.ts`가 Yahoo Finance API를 직접 호출 (API 키 불필요).
- API 실패 시 `getSampleData()`로 폴백 — 빌드가 절대 실패하지 않도록 설계됨
- `StockChartWrapper`는 서버 컴포넌트에서 데이터를 fetch해 클라이언트 `StockChart`에 전달 (Lightweight Charts는 SSR 불가)

### 포스트 frontmatter 스키마

```yaml
---
title: "제목"
date: "2026-03-29"        # ISO 날짜 (정렬 기준)
category: "주간리포트"     # 카테고리 (자유 문자열, 자동 집계됨)
tags: ["태그1", "태그2"]
description: "설명"
draft: true               # 선택사항 — true면 목록에서 숨김
---
```

### 환경 변수 (`.env.local`)

```
NEXT_PUBLIC_GISCUS_REPO=
NEXT_PUBLIC_GISCUS_REPO_ID=
NEXT_PUBLIC_GISCUS_CATEGORY_ID=
NEXT_PUBLIC_SITE_URL=
```
