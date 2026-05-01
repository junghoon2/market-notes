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

#### 2-1. Claude로 초안 작성 (현재 방식)

매주 토요일 기준으로 시트의 최신 주차 데이터를 Claude Code에 넘겨 초안을 자동 생성한다. `weekly-stock-blog` 스킬이 이 흐름을 자동화한다.

**트리거 문구**

> "이번주 블로그 글 작성해줘" / "주간 리포트 작성" / "주간 투자 기록 작성"

**스킬이 수행하는 단계**

1. `scripts/fetch-google-sheet.mjs` 실행 → 주간현황·세부종목·매매일지·PER 등 워크시트 JSON 수집
2. 최신 주차(직전 토요일 기준) 데이터를 추출해 변동·수익률·매매 이유를 정리
3. 같은 카테고리(`주간리포트`)의 기존 포스트를 참고해 톤·구조 일치
4. **`docs/preview/` 에 초안 `.md` 저장** (검토 전 본 디렉토리 직접 수정 금지)
5. 종목 차트가 필요한 구간은 `<StockChart symbol="..." period="..." />` 자동 삽입
6. (선택) 썸네일 SVG 생성 단계 수행

**검토 후 발행**

```bash
# 1) docs/preview/ 의 초안을 확인·수정
# 2) 확정되면 content/posts/YYYY/ 로 이동
mv docs/preview/<파일>.md content/posts/2026/<파일>.md
# 3) pnpm dev 로 미리보기 → git commit & push
```

> 초안은 항상 `docs/preview/` 에 먼저 저장하고, 사람이 확인한 뒤 `content/posts/` 로 옮기는 규칙을 지킨다. Claude가 직접 `content/posts/` 에 쓰지 않는다.

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
