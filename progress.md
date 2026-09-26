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

- 2026-09-26: 39W 주간 투자 기록 초안과 썸네일 작성.
  - `docs/preview/September-week4-record.md`, `public/images/posts/september-week4.svg` 추가. 발행본 이동 없이 검토용 초안으로 저장.
  - 기존 읽기 전용 스크립트로 9/26·9/19 주간현황, 세부종목, 매매일지, 입출금내역 조회. 실제 헤더와 행별 열 위치를 확인해 추출.
  - 계좌 +3.66%, 삼성전자·메타 상승, 팔란티어 추가 매수, 현대모비스·SK텔레콤 일부 매도를 중심으로 작성. Meta 공식 발표를 확인해 Muse 출시(9/8)와 이번 주 Connect 발표를 구분하고 시장 해석은 개인 관점으로 표현.
  - 전주 평가금이 발행 당시보다 9,281원 수정돼 현재 시트 기준을 사용하고 본문에 명시. 매매일지 실현손실 합계와 주간현황은 3,341원 차이가 있어 확인 필요로 표시. 미국 국채 평가금·원금·수익금 불일치로 수익율 표기 보류.
  - 시트 주요 숫자 및 종목별 평가금·수익율·비중·변동 대조, 평가금 총합, 국장 평가금/주가 정수 및 매매 없는 종목의 주간 변동 검산, 매매 합계 검증 통과.
  - frontmatter·썸네일 경로 및 MDX 렌더링(표 3개, 미변환 강조 없음), `git diff --check` 통과. `pnpm build` 통과(45개 페이지), 로컬 홈 HTTP 200 확인.
  - `./init.sh`에서 기존 lint 오류 4개·경고 2개 재현. 샌드박스 네트워크·포트 제한은 권한 허용 후 조회·서버 실행 성공. 긴 heredoc 실행 exit 137은 임시 파일 패치 후 실행 방식으로 해결.
  - 기능 변경이 없어 `feature-list.json` 유지. 사용자 AGENTS.md의 commit/push 지시를 스킬의 발행 전 커밋 제한보다 우선 적용.

- 2026-09-19: 사용자 발행 승인 후 9월 3주차 최종본 정리.
  - 환율 문장 연결, 과거 금리 해석의 개인 관점 표현, 팔란티어 매수 이유 중복을 수정. 사용자가 줄인 성과·회고·관전 포인트 유지.
  - `pnpm build` 통과(45개 페이지). 생성된 실제 글 HTML에서 수정 3곳과 강조 렌더링 검증 통과. 기존 lint 오류는 앞선 검증 기록과 동일한 코드 상태.
  - 사용자의 “3군데 수정하고 발행하자”로 공개 발행·푸시 승인 확인. 앞선 승인 대기 해소.
  - 발행 커밋 `2096b96` push 및 Vercel 배포 성공 확인. 실제 `/blog/September-week3-record` HTTP 200.
  - Chrome에서 최종 글 제목·본문·수정 3곳·표 3개 확인. 스크린샷으로 본문과 강조 표시 확인, 미변환 강조 없음, 수집된 브라우저 콘솔 오류 없음.

- 2026-09-19: 사용자가 지정한 `content/posts/2026/September-week3-record.md`에 시장 관점 반영.
  - 사용자가 준비한 파일의 표 형식·기존 편집을 유지하고 요약에 2문단, 관전 포인트에 1항목 추가.
  - 10년물 금리 5% 구간의 상승장, AI에 따른 미국 성장과 속도 조절론 극복을 사용자 제공 관점으로 서술. 새로운 패러다임은 개인 해석으로 표현.
  - 해당 파일 MDX 렌더링·강조 처리 및 `git diff --check` 검증 통과. 앞선 공개 푸시 승인 대기 상태 유지.

- 2026-09-19: 38W 주간 투자 기록 초안과 썸네일 작성.
  - `docs/preview/September-week3-record.md`, `public/images/posts/september-week3.svg` 추가. 검토용 초안으로 저장.
  - 기존 읽기 전용 스크립트로 9/19·9/12 시트, 매매일지, 입출금내역을 조회하고 실제 헤더 확인.
  - 계좌 +1.93%, 미장 상승, 팔란티어 편입, 센트러스 3일 보유 후 매도 중심으로 작성.
  - 사용자 후속 설명 반영: 센트러스는 투자 시기가 아직 이르다는 판단으로 매도. 팔란티어는 자체 소프트웨어를 통한 AI 수익화를 가장 잘하는 회사 같다는 개인 판단으로 편입. 매매 해설과 회고·관전 포인트 갱신, MDX·숫자 검증 재통과.
  - 초안 커밋 `7427519`의 푸시는 자동 승인 심사에서 개인 투자 정보의 공개 전송으로 거절됨. 원격은 공개 저장소 `junghoon2/market-notes`이며, 사용자에게 공개 푸시 승인을 요청한 상태. 후속 매매 이유 설명은 푸시 승인으로 해석하지 않음.
  - 종목 평가금·수익율 원본 대조, 평가금 총합, 국장 평가금/주가 정수 및 주간 변동 기준 일치, 계좌 증감·매매 합계 검산 통과.
  - frontmatter·썸네일 경로 및 초안 MDX 렌더링 검증 통과. 퍼센트 뒤 조사로 강조가 깨지는 1곳 수정 후 미변환 `**` 없음 확인.
  - `pnpm build` 통과. 로컬 개발 서버 홈 HTTP 200 확인. `./init.sh` lint는 기존 오류 4개·경고 2개 재현.
  - 샌드박스 네트워크·포트 제한은 권한 허용으로 해결. 긴 heredoc 명령 exit 137은 파일 패치 후 실행 방식으로 전환하여 완료.
  - 기능 변경이 없어 `feature-list.json` 유지.

- 2026-09-12: 9월 2주차 발행본과 초안의 퍼센트 강조 9곳 수정.
  - `%**` 뒤 한글이 붙으면 강조로 파싱되지 않는 현상 재현. 조사를 강조 안으로 이동해 해결.
  - 사용자가 준비한 발행본의 나머지 편집 내용 유지.
  - 실제 remark-gfm/MDX 렌더링에서 `<strong>31.42%가</strong>` 생성 및 미변환 `**` 없음 확인. `pnpm build` 통과.
  - `pnpm lint`: 기존 오류 4개·경고 2개 재현.
  - `6281189` Vercel Production 배포 성공. 실제 `/blog/September-week2-record` HTTP 200, 수정한 9곳의 `<strong>` 태그 및 배포 CSS `.prose strong{font-weight:600}` 확인.
  - Browser 런타임에 연결된 브라우저가 없어 시각 검증은 수행하지 못함. 실제 사이트 HTML/CSS로 검증.

- 2026-09-12: 37W 주간 투자 기록 초안과 썸네일 작성.
  - `docs/preview/September-week2-record.md`, `public/images/posts/september-week2.svg` 추가. 발행본 이동은 하지 않음.
  - 기존 구글 시트 읽기 전용 스크립트로 9/12 및 9/5 자료, 매매일지, 입출금내역 조회. 변경된 실제 헤더 기준으로 추출.
  - 종목별 평가금·수익율·비중·주간 변동 원본 대조, 국장 평가금/주가 정수 검산 및 변동 기준 일치, 전체 평가금 합계 검증 통과.
  - 현금성 감소 3,556,748원과 기록된 매수 1,195,912원 차이는 확인 필요. 원인을 추정하지 않고 초안에 명시하고 사용자에게 질문함.
  - PER의 하이닉스 현재가와 주간 스냅샷 가격이 달라 PER 및 최고가 대비 수치는 사용하지 않음. 실제 세부종목 헤더에 주식수 열은 없어 평가금/주가로 검산.
  - frontmatter·썸네일 경로, 초안 MDX 컴파일 통과. `pnpm build` 통과, 로컬 홈 HTTP 200 확인.
  - `./init.sh` lint는 기존 오류 4개·경고 2개 재현. 포트 권한 제한 후 권한 허용으로 개발 서버 시작. 추가 start는 기존 서버의 3000 포트 점유로 종료되어 기존 서버로 스모크 테스트 수행.
  - 긴 heredoc 셸 실행이 파일 생성 전에 exit 137로 종료되어 apply_patch로 작성 완료. 기존 사용자 파일 변경 없음.
  - 기능 변경이 없어 feature-list.json은 그대로 유지.

- 2026-06-16: `docs/preview/손실은짧게이익은길게.md` 리뷰 및 문장 수정 완료.
  - frontmatter 추가, 로컬 절대경로 이미지를 Markdown 이미지 경로로 변경.
  - 손절 기준과 종목 판단 기준을 분리해 글 흐름을 정리.
- 2026-06-16: `pnpm lint` 실패.
  - 기존 추적 항목과 동일한 오류: `TOC.tsx`, `StockChart.tsx`, `SearchDialog.tsx`, `ThemeToggle.tsx`.
  - 기존 경고: `PostCard.tsx`, `GiscusComments.tsx`.
- 2026-06-16: `pnpm build` 1차 실패.
  - sandbox 네트워크 제한으로 Google Fonts fetch 실패.
- 2026-06-16: 네트워크 허용 후 `pnpm build` 통과.
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
