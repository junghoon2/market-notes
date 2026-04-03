# 투자 일지 블로그

구글 스프레드시트의 주간 투자 데이터를 기반으로 블로그 포스트를 작성하고 발행하는 개인 투자 기록 사이트.

**스택**: Next.js 16 · TypeScript · Tailwind CSS · MDX · Vercel

---

## 워크플로우

```
구글 시트 조회 → 소재 조사/초안 작성 → content/posts/ 에 .md 추가 → git push → Vercel 자동 배포
```

### 1. 구글 시트 데이터 조회

```bash
node scripts/fetch-google-sheet.mjs <spreadsheetId> <credentials.json 경로>
```

- Service Account 키(`credentials.json`)로 JWT 인증 — API 키 불필요
- 모든 워크시트를 JSON으로 stdout 출력
- `credentials.json`은 `.gitignore`에 포함됨 (커밋 금지)

**시트 구성**

| 워크시트 | 용도 |
|----------|------|
| 주간현황 | 총 평가금, 누적/주간 수익률, 지수 대비 성과 |
| 세부종목 | 종목별 평가금·수익률·비중 스냅샷 |
| PER | 보유/관심 종목 밸류에이션 (현재·Forward PER) |
| 포트폴리오 | 목표 비중 계획표 |
| 매매일지 | 매매 이유와 판단 기록 |
| 입출금내역 | 원금 증감 — 수익률 왜곡 보정용 |

### 2. 포스트 작성

`content/posts/YYYY/파일명.md` 파일 생성. 슬러그 = 파일명(확장자 제외).

```yaml
---
title: "3월 4주차 투자 기록"
date: "2026-03-29"
category: "주간리포트"
tags: ["23W", "반도체조정"]
description: "한 줄 요약"
---
```

MDX 컴포넌트를 본문에서 사용할 수 있음:

```mdx
<StockChart symbol="005930.KS" period="3m" />
<StockInfo symbol="000660.KS" />
```

### 3. 로컬 확인 후 배포

```bash
pnpm dev    # localhost:3000
git push    # Vercel 자동 빌드·배포
```

---

## 환경 설정

`.env.local` 생성:

```env
NEXT_PUBLIC_GISCUS_REPO=
NEXT_PUBLIC_GISCUS_REPO_ID=
NEXT_PUBLIC_GISCUS_CATEGORY_ID=
NEXT_PUBLIC_SITE_URL=
```

Giscus 설정값은 [giscus.app](https://giscus.app)에서 발급.

---

## 주요 명령어

```bash
pnpm dev      # 개발 서버
pnpm build    # 프로덕션 빌드
pnpm lint     # ESLint
```
