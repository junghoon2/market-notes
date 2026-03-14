# Stock Blog - 프로젝트 계획서

> 주식/투자 분석 블로그 | Next.js + TypeScript | Vercel + Cloudflare

---

## 1. 프로젝트 개요

### 목표
GitHub에 소스 코드를 관리하고, Vercel로 호스팅하며, Cloudflare로 보안과 CDN 성능을 강화한 주식/투자 분석 블로그를 구축한다.

### 핵심 기능
- **마크다운(MDX) 기반 글 작성** — Git으로 콘텐츠 관리
- **주식 차트/데이터 연동** — 실시간 또는 정적 차트 시각화
- **댓글 시스템** — Giscus(GitHub Discussions 기반)
- **SEO 최적화** — 검색 엔진 노출 극대화
- **반응형 디자인** — 모바일/데스크톱 대응

---

## 2. 기술 스택

| 영역 | 기술 | 선정 이유 |
|------|------|----------|
| 프레임워크 | **Next.js 15 (App Router)** | SSG/SSR, Vercel 최적 궁합 |
| 언어 | **TypeScript** | 타입 안전성, 개발 생산성 |
| 스타일링 | **Tailwind CSS 4** | 빠른 UI 개발, 반응형 지원 |
| 콘텐츠 | **MDX (Contentlayer2 또는 next-mdx-remote)** | 마크다운 + React 컴포넌트 혼용 |
| 차트 | **Lightweight Charts (TradingView)** | 주식 차트 전문, 가볍고 빠름 |
| 데이터 | **Yahoo Finance API / KRX API** | 한국/미국 주식 데이터 |
| 댓글 | **Giscus** | GitHub 기반, 무료, 다크모드 지원 |
| 호스팅 | **Vercel** | Next.js 공식 지원, 자동 배포 |
| CDN/보안 | **Cloudflare** | DDoS 방어, 글로벌 CDN, 무료 SSL |
| 패키지 매니저 | **pnpm** | 빠르고 디스크 효율적 |

---

## 3. 프로젝트 구조

```
stock-blog/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   ├── page.tsx            # 홈페이지 (최신 글 목록)
│   │   ├── blog/
│   │   │   ├── page.tsx        # 블로그 목록
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # 글 상세 페이지
│   │   ├── category/
│   │   │   └── [name]/
│   │   │       └── page.tsx    # 카테고리별 글 목록
│   │   └── about/
│   │       └── page.tsx        # 소개 페이지
│   ├── components/
│   │   ├── layout/             # Header, Footer, Sidebar
│   │   ├── blog/               # PostCard, PostList, TOC
│   │   ├── chart/              # StockChart, MiniChart
│   │   ├── comment/            # Giscus 댓글
│   │   └── ui/                 # 공통 UI 컴포넌트
│   ├── lib/
│   │   ├── mdx.ts              # MDX 파싱/처리
│   │   ├── stock-api.ts        # 주식 데이터 API
│   │   └── utils.ts            # 유틸리티 함수
│   └── styles/
│       └── globals.css         # 글로벌 스타일, Tailwind
├── content/
│   └── posts/                  # MDX 글 파일
│       ├── 2026/
│       │   └── samsung-analysis.mdx
│       └── ...
├── public/
│   ├── images/                 # 정적 이미지
│   └── og/                     # OG 이미지
├── .claude/                    # Claude Code 설정
├── CLAUDE.md
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. 핵심 기능 상세

### 4.1 마크다운(MDX) 글 작성

```mdx
---
title: "26년 3월 2주 투자 분석"
date: "2026-03-15"
category: "Weekly 투자 분석"
thumbnail: "/images/samsung-q1-2026.png"
description: "3월 2주 수익율, 매매 일지 공유"
---

## 실적 요약

<StockChart symbol="005930.KS" period="3m" />

본문 내용...
```

- `content/posts/` 에 MDX 파일로 글 작성
- frontmatter로 메타데이터 관리
- MDX 안에서 React 컴포넌트(차트 등) 직접 사용

### 4.2 주식 차트/데이터 연동

| 기능 | 구현 방식 |
|------|----------|
| 종목 차트 | TradingView Lightweight Charts로 캔들/라인 차트 |
| 데이터 소스 | Yahoo Finance API (무료) 또는 한국투자증권 Open API |
| 렌더링 | 빌드 시 정적 데이터 fetch + 클라이언트 실시간 옵션 |
| 미니 차트 | 글 목록에서 종목 미니 차트 표시 |

### 4.3 댓글 시스템 (Giscus)

- GitHub Discussions 기반 — 별도 DB 불필요
- 다크모드 자동 연동
- 마크다운 지원
- 스팸 방지 (GitHub 로그인 필요)

### 4.4 SEO 최적화

- `generateMetadata` 로 페이지별 메타 태그
- `sitemap.xml`, `robots.txt` 자동 생성
- OG 이미지 자동 생성 (`next/og`)
- JSON-LD 구조화 데이터 (Article 스키마)

---

## 5. 인프라 아키텍처

```
[사용자] → [Cloudflare CDN/WAF] → [Vercel Edge] → [Next.js App]
                                                        ↓
                                                   [GitHub Repo]
                                                   (콘텐츠 소스)
```

### 5.1 배포 파이프라인

```
GitHub Push → Vercel 자동 빌드 → Preview/Production 배포
                                      ↓
                              Cloudflare CDN 캐시 갱신
```

### 5.2 Vercel 설정

- **프레임워크**: Next.js (자동 감지)
- **빌드 명령어**: `pnpm build`
- **출력 디렉토리**: `.next`
- **환경 변수**: 주식 API 키 등
- **도메인**: 커스텀 도메인 연결

### 5.3 Cloudflare 설정

| 항목 | 설정 |
|------|------|
| DNS | Vercel 도메인을 CNAME으로 프록시 |
| SSL | Full (Strict) 모드 |
| 캐시 | 정적 자산 캐시 (이미지, CSS, JS) |
| WAF | 기본 보안 규칙 활성화 |
| 페이지 규칙 | `/api/*` 캐시 우회 |
| Bot 관리 | 기본 봇 차단 |

---

## 6. 카테고리 구조

| 카테고리 | 설명 |
|----------|------|
| 종목분석 | 개별 종목 심층 분석 |
| 시장동향 | 시장 전체 흐름, 매크로 분석 |
| 투자전략 | 투자 방법론, 포트폴리오 전략 |
| 산업분석 | 반도체, AI, 바이오 등 섹터 분석 |
| 경제지표 | 금리, 환율, GDP 등 경제 데이터 |

---

## 7. 구현 단계

### Phase 1: 기본 블로그 (1주차)
- [ ] Next.js + TypeScript 프로젝트 초기화
- [ ] Tailwind CSS 설정
- [ ] MDX 콘텐츠 시스템 구축
- [ ] 레이아웃 (Header, Footer, Sidebar)
- [ ] 홈페이지 (최신 글 목록)
- [ ] 글 상세 페이지
- [ ] 카테고리 페이지
- [ ] 반응형 디자인

### Phase 2: 주식 기능 (2주차)
- [ ] TradingView Lightweight Charts 연동
- [ ] 주식 데이터 API 연동
- [ ] `<StockChart>` MDX 컴포넌트
- [ ] 종목 미니 차트
- [ ] 데이터 캐싱 전략

### Phase 3: 부가 기능 (3주차)
- [ ] Giscus 댓글 시스템
- [ ] SEO 최적화 (메타태그, sitemap, OG)
- [ ] 다크모드
- [ ] 검색 기능 (글 내 검색)
- [ ] RSS 피드
- [ ] 목차(TOC) 자동 생성

### Phase 4: 배포/인프라 (4주차)
- [ ] GitHub 저장소 설정
- [ ] Vercel 연동 및 자동 배포
- [ ] Cloudflare DNS/CDN 설정
- [ ] 커스텀 도메인 연결
- [ ] 성능 최적화 (Core Web Vitals)
- [ ] 모니터링 설정

---

## 8. 환경 변수

```env
# 주식 데이터 API
STOCK_API_KEY=           # Yahoo Finance 또는 한국투자증권 API 키

# Giscus 댓글
NEXT_PUBLIC_GISCUS_REPO=         # GitHub 저장소
NEXT_PUBLIC_GISCUS_REPO_ID=      # 저장소 ID
NEXT_PUBLIC_GISCUS_CATEGORY_ID=  # 카테고리 ID

# 사이트 정보
NEXT_PUBLIC_SITE_URL=            # 배포 URL
```

---

## 9. 성능 목표

| 지표 | 목표 |
|------|------|
| Lighthouse Performance | 90+ |
| LCP (Largest Contentful Paint) | < 2.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| 빌드 시간 | < 60s (100개 글 기준) |

---

## 10. 참고 사항

- **콘텐츠 관리**: Git 기반 — MDX 파일을 커밋하면 자동 배포
- **이미지 최적화**: `next/image`로 자동 최적화 + Cloudflare 캐시
- **비용**: Vercel Hobby (무료) + Cloudflare Free 플랜으로 시작 가능
- **확장성**: 트래픽 증가 시 Vercel Pro + Cloudflare Pro로 업그레이드

---

*이 문서는 2026-03-15에 작성되었습니다.*
