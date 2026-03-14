# Stock Blog 배포 가이드

## 1. GitHub 저장소 생성

```bash
# GitHub CLI로 저장소 생성
gh repo create stock-blog --public --source=. --remote=origin

# 또는 수동으로
git remote add origin https://github.com/YOUR_USERNAME/stock-blog.git

# 첫 푸시
git push -u origin main
```

## 2. Vercel 배포

### 방법 A: Vercel CLI (권장)

```bash
# Vercel CLI 설치
pnpm add -g vercel

# 프로젝트 연결 및 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 방법 B: Vercel 웹 대시보드

1. [vercel.com](https://vercel.com) 접속 → GitHub로 로그인
2. "New Project" → stock-blog 저장소 선택
3. Framework: Next.js (자동 감지)
4. 환경 변수 설정 (아래 참조)
5. "Deploy" 클릭

### Vercel 환경 변수 설정

| 변수 | 값 | 필수 |
|------|-----|------|
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` | ✅ |
| `NEXT_PUBLIC_GISCUS_REPO` | `username/stock-blog` | 댓글 사용 시 |
| `NEXT_PUBLIC_GISCUS_REPO_ID` | Giscus에서 확인 | 댓글 사용 시 |
| `NEXT_PUBLIC_GISCUS_CATEGORY_ID` | Giscus에서 확인 | 댓글 사용 시 |

### 자동 배포

GitHub에 push하면 Vercel이 자동으로 빌드 & 배포합니다:
- `main` 브랜치 → 프로덕션 배포
- 다른 브랜치 → Preview 배포 (PR별 미리보기 URL)

---

## 3. 커스텀 도메인 연결

### Vercel에서 도메인 추가

1. Vercel 대시보드 → 프로젝트 → Settings → Domains
2. 커스텀 도메인 입력 (예: `blog.example.com`)
3. Vercel이 안내하는 DNS 레코드 확인

---

## 4. Cloudflare 설정

### 4.1 DNS 설정

Cloudflare 대시보드에서 DNS 레코드를 추가합니다:

| 타입 | 이름 | 값 | 프록시 |
|------|------|-----|--------|
| CNAME | `blog` | `cname.vercel-dns.com` | ✅ 프록시됨 |

> 루트 도메인(`example.com`) 사용 시: A 레코드로 `76.76.21.21` 추가

### 4.2 SSL/TLS 설정

1. Cloudflare → SSL/TLS → Overview
2. 암호화 모드: **Full (Strict)** 선택
3. Edge Certificates → Always Use HTTPS: 활성화

### 4.3 캐시 설정

1. Cloudflare → Caching → Configuration
2. 캐싱 수준: **Standard**
3. Browser Cache TTL: **Respect Existing Headers**

### 4.4 페이지 규칙 (선택)

| URL 패턴 | 설정 |
|----------|------|
| `*blog.example.com/api/*` | Cache Level: Bypass |
| `*blog.example.com/_next/static/*` | Cache Level: Cache Everything, Edge TTL: 1 month |

### 4.5 보안 설정

1. **WAF** → Managed Rules 활성화
2. **Bot Fight Mode** → 활성화
3. **DNSSEC** → 활성화 (권장)

### 4.6 성능 최적화

1. **Speed → Optimization**
   - Auto Minify: JavaScript, CSS, HTML ✅
   - Brotli: 활성화 ✅
2. **Speed → Image Resizing** (Pro 이상)
   - Polish: Lossy 모드

---

## 5. Giscus 댓글 설정

1. [giscus.app](https://giscus.app) 접속
2. 저장소 입력: `username/stock-blog`
3. Discussion 카테고리: "Comments" (없으면 생성)
4. 생성된 설정값을 Vercel 환경 변수에 입력

---

## 6. 배포 후 확인 사항

```bash
# 사이트 접속 확인
curl -I https://your-domain.com

# sitemap 확인
curl https://your-domain.com/sitemap.xml

# RSS 피드 확인
curl https://your-domain.com/feed.xml

# robots.txt 확인
curl https://your-domain.com/robots.txt
```

### Lighthouse 성능 체크

1. Chrome DevTools → Lighthouse 탭
2. Performance, Accessibility, SEO 점수 확인
3. 목표: 모든 항목 90+ 점

---

## 7. 글 작성 및 배포 워크플로우

```bash
# 1. 새 글 작성
# content/posts/2026/new-post.mdx 파일 생성

# 2. 로컬 확인
pnpm dev

# 3. 커밋 & 푸시 → 자동 배포
git add content/posts/2026/new-post.mdx
git commit -m "새 글 추가: 포스트 제목"
git push
```

Vercel이 자동으로 빌드하고 배포합니다.
