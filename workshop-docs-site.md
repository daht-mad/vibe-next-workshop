# 워크샵 문서 뷰어 사이트 (vibe-next-workshop)

## TL;DR

> **Quick Summary**: 클로드코드 바이브코딩 워크샵용 MD 문서 뷰어 사이트. 비밀번호 보호, Notion 스타일 UI, 참석자 설계서 업로드 기능 포함.
> 
> **Deliverables**:
> - Next.js 기반 MD 문서 뷰어 사이트
> - 비밀번호 보호 로그인 시스템
> - 사이드바 네비게이션 (폴더 계층 구조)
> - 참석자 설계서 업로드 기능 (Vercel Blob)
> - 다크모드, TOC, 코드 복사 버튼
> - PDF 인라인 뷰어
> 
> **Estimated Effort**: Medium (1-2일)
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Task 1 → Task 2 → Task 3 → Task 4 → Task 7

---

## Context

### Original Request
워크샵 MD 문서들을 클릭해서 볼 수 있는 별도 사이트 필요. Vercel 배포 예정.

### Interview Summary
**Key Discussions**:
- 기술 스택: Next.js + MDX (Vercel 배포 최적화)
- 접근 권한: 비밀번호 보호 (환경변수로 관리)
- 프로젝트 구조: 현재 폴더를 Next.js 프로젝트로 변환
- 디자인: Notion 스타일 (친숙한 UI)
- 네비게이션: 사이드바 + 폴더 계층 구조
- 추가 기능: 다크모드, TOC, 코드 복사 버튼
- 업로드: 폼 업로드 + Vercel Blob (참석자 전체 공개)
- 사전설문: 그대로 포함 (개인정보 포함 OK)
- CLAUDE.md: 제외 (Claude Code 전용 지침)
- PDF: 인라인 뷰어로 표시
- 메타데이터: 파일명에 인코딩 (`설계서_홍길동_260206.md`)
- 세션: 7일 유효
- 폴더명: `vibe-next-workshop`으로 변경

**Research Findings**:
- 24개 MD 파일, 1개 PDF 존재
- 폴더 구조: 가이드(4개), 참여자-사전설문(11개), daily-feedback(5개), references(1개), 루트(3개)
- 한글 파일/폴더명 다수 → URL 인코딩 처리 필요

### Metis Review
**Identified Gaps** (addressed):
- CLAUDE.md 처리 → 콘텐츠에서 제외
- PDF 처리 방식 → 인라인 뷰어
- 업로드 메타데이터 → 파일명 인코딩
- 세션 유효기간 → 7일
- 한글 URL 인코딩 → decodeURIComponent 명시적 처리

---

## Work Objectives

### Core Objective
워크샵 참석자들이 MD 문서를 편리하게 열람하고, 본인이 만든 설계서를 업로드하여 공유할 수 있는 웹사이트 구축

### Concrete Deliverables
- `vibe-next-workshop/` Next.js 프로젝트 (현재 폴더 변환)
- 로그인 페이지 (`/login`)
- 문서 뷰어 페이지 (`/docs/[...slug]`)
- 설계서 업로드 페이지 (`/upload`)
- 업로드된 설계서 목록 (`/designs`)
- Vercel 배포 완료 (`vibe-next-workshop.vercel.app`)

### Definition of Done
- [ ] 비밀번호 입력 후 문서 열람 가능
- [ ] 사이드바에서 폴더 구조 탐색 가능
- [ ] MD 문서가 Notion 스타일로 렌더링됨
- [ ] 다크모드 토글 동작
- [ ] 코드 블록에 복사 버튼 표시
- [ ] 문서 내 TOC(목차) 표시
- [ ] 설계서 업로드 및 목록 확인 가능
- [ ] PDF 인라인 뷰어 동작
- [ ] Vercel 배포 완료

### Must Have
- 비밀번호 보호 (미인증 시 /login으로 리다이렉트)
- 한글 URL 정상 동작 (가이드/클로드코드-설치가이드 등)
- 폴더 계층 사이드바
- 다크모드
- 설계서 업로드

### Must NOT Have (Guardrails)
- ❌ 검색 기능 (24개 파일에 불필요, 사이드바로 충분)
- ❌ 댓글/피드백 기능
- ❌ 개인별 로그인 (공용 비밀번호만)
- ❌ 업로드 파일 버전 히스토리
- ❌ 복잡한 상태 관리 라이브러리 (zustand, jotai 등)
- ❌ shadcn/ui 전체 설치 (필요한 컴포넌트만 직접 작성)
- ❌ next-mdx-remote 사용 (@next/mdx 사용)

---

## Verification Strategy (MANDATORY)

> **UNIVERSAL RULE: ZERO HUMAN INTERVENTION**
>
> ALL tasks in this plan MUST be verifiable WITHOUT any human action.

### Test Decision
- **Infrastructure exists**: NO (신규 프로젝트)
- **Automated tests**: None (워크샵용 단기 프로젝트)
- **Framework**: N/A

### Agent-Executed QA Scenarios (MANDATORY — ALL tasks)

모든 Task는 Playwright 또는 curl을 통한 자동 검증 시나리오 포함.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: Next.js 프로젝트 초기화
└── (독립 작업 없음)

Wave 2 (After Wave 1):
├── Task 2: 비밀번호 인증 시스템
├── Task 5: 다크모드 구현
└── Task 6: PDF 뷰어 구현

Wave 3 (After Task 2):
├── Task 3: MD 문서 렌더링 + 사이드바
├── Task 7: 설계서 업로드 기능

Wave 4 (After Task 3):
└── Task 4: TOC + 코드 복사 버튼

Wave 5 (Final):
└── Task 8: Vercel 배포

Critical Path: Task 1 → Task 2 → Task 3 → Task 4 → Task 8
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2, 3, 5, 6, 7 | None |
| 2 | 1 | 3, 7 | 5, 6 |
| 3 | 1, 2 | 4 | 7 |
| 4 | 3 | 8 | None |
| 5 | 1 | 8 | 2, 6 |
| 6 | 1 | 8 | 2, 5 |
| 7 | 1, 2 | 8 | 3 |
| 8 | 4, 5, 6, 7 | None | None (final) |

---

## TODOs

- [ ] 1. Next.js 프로젝트 초기화 + 폴더 구조 설정

  **What to do**:
  - 현재 폴더명을 `vibe-next-workshop`으로 변경
  - Next.js 14+ App Router 프로젝트 초기화 (`bun create next-app . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"`)
  - 기존 MD 파일들을 `content/` 폴더로 이동 (Next.js 소스와 분리)
  - `content/` 하위에 기존 폴더 구조 유지 (가이드/, 참여자-사전설문/, daily-feedback/, references/)
  - CLAUDE.md는 루트에 유지 (content에 포함 안 함)
  - `.gitignore` 업데이트 (node_modules, .next, .env.local 등)
  - 필요한 패키지 설치:
    - `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`
    - `remark-gfm`, `rehype-highlight`, `rehype-slug`
    - `jose` (JWT 세션)
    - `@vercel/blob` (파일 업로드)
    - `react-pdf` (PDF 뷰어)

  **Must NOT do**:
  - next-mdx-remote 설치 ❌
  - shadcn/ui 전체 설치 ❌
  - 복잡한 상태 관리 라이브러리 ❌

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 초기 설정 작업, 명확한 명령어 실행
  - **Skills**: [`git-master`]
    - `git-master`: 폴더명 변경 및 git 이력 관리

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (단독)
  - **Blocks**: Task 2, 3, 5, 6, 7
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - 없음 (신규 프로젝트)

  **Documentation References**:
  - Next.js App Router: https://nextjs.org/docs/app
  - @next/mdx 설정: https://nextjs.org/docs/app/building-your-application/configuring/mdx

  **현재 폴더 구조** (이동 대상):
  ```
  260206-next-workshop/
  ├── curriculum.md → content/curriculum.md
  ├── participants.md → content/participants.md
  ├── skill-ideas-by-participant.md → content/skill-ideas-by-participant.md
  ├── 가이드/ → content/가이드/
  ├── 참여자-사전설문/ → content/참여자-사전설문/
  ├── daily-feedback/ → content/daily-feedback/
  └── references/ → content/references/
  ```

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: Next.js 개발 서버 정상 실행
    Tool: Bash
    Preconditions: 프로젝트 초기화 완료
    Steps:
      1. cd vibe-next-workshop && bun run dev &
      2. sleep 5
      3. curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
      4. pkill -f "next dev"
    Expected Result: HTTP 200 반환
    Evidence: curl 응답 코드 캡처

  Scenario: content 폴더 구조 확인
    Tool: Bash
    Steps:
      1. ls -la vibe-next-workshop/content/
      2. ls -la vibe-next-workshop/content/가이드/
    Expected Result: curriculum.md, participants.md 등 파일 존재, 가이드/ 폴더 존재
    Evidence: ls 출력 캡처

  Scenario: 패키지 설치 확인
    Tool: Bash
    Steps:
      1. cd vibe-next-workshop && bun pm ls | grep -E "@next/mdx|jose|@vercel/blob"
    Expected Result: 모든 필수 패키지가 리스트에 표시됨
    Evidence: bun pm ls 출력 캡처
  ```

  **Commit**: YES
  - Message: `feat: initialize Next.js project with MDX support`
  - Files: `package.json, next.config.mjs, tsconfig.json, app/*, content/*`
  - Pre-commit: `bun run build` (빌드 성공 확인)

---

- [ ] 2. 비밀번호 + 닉네임 인증 시스템 구현

  **What to do**:
  - 로그인 페이지 (`app/login/page.tsx`)
    - 비밀번호 + 닉네임 입력 폼 (Notion 스타일, 간단한 2개 필드)
    - 닉네임: 필수 입력, 설계서 업로드 시 자동 사용됨
    - 에러 메시지 표시 ("비밀번호가 올바르지 않습니다")
  - API 라우트 (`app/api/auth/login/route.ts`)
    - POST: 비밀번호 검증 → JWT 토큰 생성 (닉네임 포함) → httpOnly 쿠키 설정
    - JWT 페이로드: `{ nickname: string, exp: number }`
    - 환경변수: `SITE_PASSWORD` (비밀번호), `JWT_SECRET` (토큰 서명)
  - API 라우트 (`app/api/auth/logout/route.ts`)
    - POST: 쿠키 삭제
  - 유틸리티 (`lib/auth.ts`)
    - `getSession()`: 쿠키에서 JWT 파싱하여 닉네임 반환
  - Middleware (`middleware.ts`)
    - `/docs/*`, `/upload`, `/designs`, `/api/upload` 경로 보호
    - 미인증 시 `/login`으로 리다이렉트
    - `/login`, `/api/auth/*`, `/_next/*`, `/favicon.ico` 제외
  - JWT 토큰: 7일 유효기간, 닉네임 포함
  - `jose` 라이브러리 사용 (경량, Edge Runtime 호환)

  **Must NOT do**:
  - NextAuth.js 사용 ❌
  - 개인별 계정 시스템 ❌
  - 복잡한 auth 라이브러리 ❌

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: 표준적인 인증 구현, 명확한 패턴
  - **Skills**: []
    - 특별한 스킬 불필요

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 5, 6)
  - **Blocks**: Task 3, 7
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - jose JWT 예제: https://github.com/panva/jose#readme

  **Documentation References**:
  - Next.js Middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
  - Next.js Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: 로그인 성공 시 쿠키 설정 (비밀번호 + 닉네임)
    Tool: Bash (curl)
    Preconditions: 개발 서버 실행, SITE_PASSWORD=test123 설정
    Steps:
      1. curl -s -i -X POST http://localhost:3000/api/auth/login \
           -H "Content-Type: application/json" \
           -d '{"password": "test123", "nickname": "홍길동"}'
      2. Assert: HTTP 200
      3. Assert: Set-Cookie 헤더에 "session=" 포함
    Expected Result: 로그인 성공, 세션 쿠키 반환 (닉네임 포함)
    Evidence: curl 응답 헤더 캡처

  Scenario: 잘못된 비밀번호 시 에러 반환
    Tool: Bash (curl)
    Steps:
      1. curl -s -X POST http://localhost:3000/api/auth/login \
           -H "Content-Type: application/json" \
           -d '{"password": "wrongpassword", "nickname": "홍길동"}'
      2. Assert: HTTP 401
      3. Assert: response.error 필드 존재
    Expected Result: 401 Unauthorized 반환
    Evidence: curl 응답 바디 캡처

  Scenario: 닉네임 누락 시 에러 반환
    Tool: Bash (curl)
    Steps:
      1. curl -s -X POST http://localhost:3000/api/auth/login \
           -H "Content-Type: application/json" \
           -d '{"password": "test123"}'
      2. Assert: HTTP 400
      3. Assert: response.error에 "닉네임" 포함
    Expected Result: 닉네임 필수 에러 반환
    Evidence: curl 응답 바디 캡처

  Scenario: 미인증 접근 시 리다이렉트
    Tool: Bash (curl)
    Steps:
      1. curl -s -o /dev/null -w "%{http_code},%{redirect_url}" \
           http://localhost:3000/docs/curriculum
      2. Assert: HTTP 307
      3. Assert: redirect_url에 "/login" 포함
    Expected Result: /login으로 리다이렉트
    Evidence: 상태 코드 및 리다이렉트 URL 캡처

  Scenario: 로그인 페이지 UI 렌더링 (비밀번호 + 닉네임)
    Tool: Playwright
    Steps:
      1. Navigate to: http://localhost:3000/login
      2. Wait for: input[type="password"] visible (timeout: 5s)
      3. Assert: input[name="nickname"] 존재
      4. Assert: button[type="submit"] 존재
      5. Screenshot: .sisyphus/evidence/task-2-login-page.png
    Expected Result: 비밀번호 + 닉네임 입력 폼 표시
    Evidence: .sisyphus/evidence/task-2-login-page.png

  Scenario: 로그인 실패 시 에러 메시지 표시
    Tool: Playwright
    Steps:
      1. Navigate to: http://localhost:3000/login
      2. Fill: input[name="nickname"] → "테스터"
      3. Fill: input[type="password"] → "wrongpassword"
      4. Click: button[type="submit"]
      5. Wait for: .error-message visible (timeout: 5s)
      6. Assert: .error-message text contains "올바르지 않습니다"
      7. Screenshot: .sisyphus/evidence/task-2-login-error.png
    Expected Result: 에러 메시지 표시
    Evidence: .sisyphus/evidence/task-2-login-error.png
  ```

  **Commit**: YES
  - Message: `feat: add password + nickname authentication with JWT session`
  - Files: `app/login/*, app/api/auth/*, middleware.ts, lib/auth.ts`
  - Pre-commit: `curl 테스트 통과 확인`

---

- [ ] 3. MD 문서 렌더링 + 사이드바 네비게이션

  **What to do**:
  - 레이아웃 (`app/docs/layout.tsx`)
    - 사이드바 + 메인 콘텐츠 2단 레이아웃
    - Notion 스타일 (여백, 타이포그래피)
  - 사이드바 컴포넌트 (`components/Sidebar.tsx`)
    - `content/` 폴더 재귀 탐색하여 파일 트리 생성
    - 폴더는 접기/펼치기 가능
    - 현재 문서 하이라이트
    - CLAUDE.md 제외 필터링
  - 문서 페이지 (`app/docs/[...slug]/page.tsx`)
    - Dynamic route로 모든 MD 파일 처리
    - 한글 URL 디코딩 (`decodeURIComponent`)
    - MDX 렌더링 (remark-gfm, rehype-highlight, rehype-slug)
    - Notion 스타일 마크다운 (헤딩, 리스트, 코드블록, 테이블)
  - 유틸리티 (`lib/content.ts`)
    - `getContentTree()`: 폴더 구조 반환
    - `getDocBySlug(slug)`: 특정 문서 읽기
    - 한글 파일명 처리

  **Must NOT do**:
  - 검색 기능 ❌
  - 복잡한 상태 관리 ❌
  - next-mdx-remote 사용 ❌

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Notion 스타일 UI 구현, 레이아웃 작업
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Notion 스타일 디자인 구현

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 7)
  - **Blocks**: Task 4
  - **Blocked By**: Task 1, 2

  **References**:

  **Pattern References**:
  - Notion 스타일 참고: https://www.notion.so 레이아웃
  - 사이드바 트리: VS Code 파일 탐색기 스타일

  **현재 content 구조** (사이드바 반영 필요):
  ```
  content/
  ├── curriculum.md
  ├── participants.md
  ├── skill-ideas-by-participant.md
  ├── 가이드/
  │   ├── 클로드코드-설치가이드.md
  │   ├── lark-mcp-설정가이드.md
  │   ├── google-sheets-설정가이드.md
  │   └── 바이브코딩-기초-part2.md
  ├── 참여자-사전설문/
  │   ├── 사전질문.md
  │   └── 사전설문응답_*.md (10개)
  ├── daily-feedback/
  │   ├── daily-feedback-설계서.md
  │   ├── 사전설문응답.md
  │   └── 연동가이드/
  │       ├── airtable.md
  │       ├── gmail.md
  │       └── slack.md
  └── references/
      └── gpters-automation-cases.md
  ```

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: 루트 MD 문서 렌더링
    Tool: Playwright
    Preconditions: 로그인 완료 (세션 쿠키 존재)
    Steps:
      1. Navigate to: http://localhost:3000/docs/curriculum
      2. Wait for: article visible (timeout: 5s)
      3. Assert: h1 text contains "클로드코드 바이브코딩"
      4. Screenshot: .sisyphus/evidence/task-3-curriculum.png
    Expected Result: curriculum.md 내용이 렌더링됨
    Evidence: .sisyphus/evidence/task-3-curriculum.png

  Scenario: 한글 폴더/파일 URL 렌더링
    Tool: Playwright
    Steps:
      1. Navigate to: http://localhost:3000/docs/가이드/클로드코드-설치가이드
      2. Wait for: article visible (timeout: 5s)
      3. Assert: 페이지에 "설치" 텍스트 포함
      4. Screenshot: .sisyphus/evidence/task-3-korean-url.png
    Expected Result: 한글 URL 정상 렌더링
    Evidence: .sisyphus/evidence/task-3-korean-url.png

  Scenario: 사이드바 폴더 구조 표시
    Tool: Playwright
    Steps:
      1. Navigate to: http://localhost:3000/docs/curriculum
      2. Wait for: nav[data-testid="sidebar"] visible (timeout: 5s)
      3. Assert: sidebar에 "가이드" 폴더 존재
      4. Assert: sidebar에 "참여자-사전설문" 폴더 존재
      5. Assert: sidebar에 "CLAUDE.md" 없음
      6. Screenshot: .sisyphus/evidence/task-3-sidebar.png
    Expected Result: 폴더 트리 사이드바 표시, CLAUDE.md 제외됨
    Evidence: .sisyphus/evidence/task-3-sidebar.png

  Scenario: 사이드바 폴더 펼치기/접기
    Tool: Playwright
    Steps:
      1. Navigate to: http://localhost:3000/docs/curriculum
      2. Click: button[data-folder="가이드"]
      3. Wait for: 가이드 하위 파일 목록 visible
      4. Assert: "클로드코드-설치가이드" 링크 존재
      5. Screenshot: .sisyphus/evidence/task-3-folder-expand.png
    Expected Result: 폴더 펼침 시 하위 파일 표시
    Evidence: .sisyphus/evidence/task-3-folder-expand.png

  Scenario: 2-depth 폴더 렌더링 (daily-feedback/연동가이드/)
    Tool: Playwright
    Steps:
      1. Navigate to: http://localhost:3000/docs/daily-feedback/연동가이드/airtable
      2. Wait for: article visible (timeout: 5s)
      3. Assert: 페이지 내용 렌더링됨
    Expected Result: 중첩 폴더 문서 정상 표시
    Evidence: curl 응답 또는 스크린샷
  ```

  **Commit**: YES
  - Message: `feat: add MD document viewer with sidebar navigation`
  - Files: `app/docs/*, components/Sidebar.tsx, lib/content.ts`
  - Pre-commit: `Playwright 테스트 통과 확인`

---

- [ ] 4. TOC(목차) + 코드 복사 버튼

  **What to do**:
  - TOC 컴포넌트 (`components/TableOfContents.tsx`)
    - 문서 내 h2, h3 헤딩 추출하여 목차 생성
    - 클릭 시 해당 섹션으로 스크롤
    - 현재 섹션 하이라이트 (Intersection Observer)
    - 문서 오른쪽 사이드에 고정 (sticky)
  - 코드 복사 버튼 (`components/CodeBlock.tsx`)
    - 코드 블록 우상단에 복사 버튼
    - 클릭 시 클립보드 복사 + "복사됨" 피드백
    - rehype-highlight과 연동
  - MDX 컴포넌트 매핑 (`mdx-components.tsx`)
    - `pre`, `code` 태그에 CodeBlock 컴포넌트 적용

  **Must NOT do**:
  - 외부 TOC 라이브러리 ❌
  - 복잡한 애니메이션 ❌

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI 컴포넌트 구현
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: 인터랙션 디자인

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (after Task 3)
  - **Blocks**: Task 8
  - **Blocked By**: Task 3

  **References**:

  **Pattern References**:
  - Notion TOC: 문서 우측 고정 목차 스타일
  - GitHub 코드 복사: 코드 블록 호버 시 복사 버튼

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: TOC 표시 및 스크롤 이동
    Tool: Playwright
    Steps:
      1. Navigate to: http://localhost:3000/docs/curriculum
      2. Wait for: aside[data-testid="toc"] visible
      3. Assert: TOC에 "Part 1" 항목 존재
      4. Click: TOC에서 "Part 2" 링크
      5. Assert: 스크롤 위치가 Part 2 섹션으로 이동
      6. Screenshot: .sisyphus/evidence/task-4-toc.png
    Expected Result: TOC 클릭 시 해당 섹션으로 스크롤
    Evidence: .sisyphus/evidence/task-4-toc.png

  Scenario: 코드 블록 복사 버튼 동작
    Tool: Playwright
    Steps:
      1. Navigate to: http://localhost:3000/docs/가이드/클로드코드-설치가이드
      2. Wait for: pre code visible
      3. Hover: pre (코드 블록)
      4. Assert: button[data-testid="copy-button"] visible
      5. Click: button[data-testid="copy-button"]
      6. Assert: 버튼 텍스트가 "복사됨" 또는 체크 아이콘으로 변경
      7. Screenshot: .sisyphus/evidence/task-4-copy-button.png
    Expected Result: 복사 버튼 클릭 시 피드백 표시
    Evidence: .sisyphus/evidence/task-4-copy-button.png
  ```

  **Commit**: YES
  - Message: `feat: add TOC and code copy button`
  - Files: `components/TableOfContents.tsx, components/CodeBlock.tsx, mdx-components.tsx`
  - Pre-commit: `Playwright 테스트 통과 확인`

---

- [ ] 5. 다크모드 구현

  **What to do**:
  - 테마 Provider (`components/ThemeProvider.tsx`)
    - 시스템 설정 감지 (prefers-color-scheme)
    - localStorage로 사용자 선택 저장
    - `use client` 컴포넌트
  - 테마 토글 버튼 (`components/ThemeToggle.tsx`)
    - 헤더 또는 사이드바에 배치
    - 라이트/다크 아이콘 전환
  - Tailwind 다크모드 설정 (`tailwind.config.ts`)
    - `darkMode: 'class'` 설정
  - 전역 스타일 (`app/globals.css`)
    - 다크모드 색상 변수 정의
    - Notion 다크모드 색상 참고 (배경: #191919, 텍스트: #e6e6e6)

  **Must NOT do**:
  - next-themes 라이브러리 ❌ (직접 구현)
  - 복잡한 테마 시스템 ❌

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 표준적인 다크모드 구현 패턴
  - **Skills**: []
    - 특별한 스킬 불필요

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 2, 6)
  - **Blocks**: Task 8
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - Notion 다크모드 색상: 배경 #191919, 텍스트 #e6e6e6, 보조 #37352f

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: 다크모드 토글 동작
    Tool: Playwright
    Steps:
      1. Navigate to: http://localhost:3000/login
      2. Click: button[data-testid="theme-toggle"]
      3. Assert: html 요소에 class="dark" 추가됨
      4. Assert: body 배경색이 어두운 색으로 변경됨
      5. Screenshot: .sisyphus/evidence/task-5-dark-mode.png
    Expected Result: 다크모드 활성화
    Evidence: .sisyphus/evidence/task-5-dark-mode.png

  Scenario: 다크모드 상태 유지 (localStorage)
    Tool: Playwright
    Steps:
      1. Navigate to: http://localhost:3000/login
      2. Click: button[data-testid="theme-toggle"] (다크모드 활성화)
      3. Reload page
      4. Assert: html 요소에 class="dark" 유지됨
    Expected Result: 새로고침 후에도 다크모드 유지
    Evidence: DOM 상태 확인

  Scenario: 시스템 테마 감지
    Tool: Playwright
    Steps:
      1. page.emulateMedia({ colorScheme: 'dark' })
      2. Navigate to: http://localhost:3000/login (새 탭, localStorage 없이)
      3. Assert: html 요소에 class="dark" (시스템 설정 반영)
    Expected Result: 시스템 다크모드 시 자동 적용
    Evidence: DOM 상태 확인
  ```

  **Commit**: YES
  - Message: `feat: add dark mode with system preference detection`
  - Files: `components/ThemeProvider.tsx, components/ThemeToggle.tsx, tailwind.config.ts, app/globals.css`
  - Pre-commit: `Playwright 테스트 통과 확인`

---

- [ ] 6. PDF 인라인 뷰어 구현

  **What to do**:
  - PDF 뷰어 컴포넌트 (`components/PdfViewer.tsx`)
    - `react-pdf` 라이브러리 사용
    - 페이지 네비게이션 (이전/다음)
    - 줌 컨트롤
    - 전체화면 옵션
  - PDF 문서 페이지 (`app/docs/[...slug]/page.tsx` 수정)
    - .pdf 확장자 감지 시 PdfViewer 렌더링
    - .md 파일은 기존 MDX 렌더링
  - PDF 파일 서빙
    - `content/references/Claude_Skills_Guide_KO_Full.pdf`를 public 또는 API route로 서빙

  **Must NOT do**:
  - 외부 PDF 서비스 (Google Docs Viewer 등) ❌
  - 복잡한 PDF 편집 기능 ❌

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: 라이브러리 활용한 표준 구현
  - **Skills**: []
    - 특별한 스킬 불필요

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 2, 5)
  - **Blocks**: Task 8
  - **Blocked By**: Task 1

  **References**:

  **Documentation References**:
  - react-pdf: https://github.com/wojtekmaj/react-pdf

  **PDF 파일 위치**:
  - `content/references/Claude_Skills_Guide_KO_Full.pdf`

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: PDF 인라인 뷰어 렌더링
    Tool: Playwright
    Steps:
      1. Navigate to: http://localhost:3000/docs/references/Claude_Skills_Guide_KO_Full
      2. Wait for: canvas (PDF 렌더링 캔버스) visible (timeout: 10s)
      3. Assert: PDF 페이지가 표시됨
      4. Screenshot: .sisyphus/evidence/task-6-pdf-viewer.png
    Expected Result: PDF가 인라인으로 표시됨
    Evidence: .sisyphus/evidence/task-6-pdf-viewer.png

  Scenario: PDF 페이지 네비게이션
    Tool: Playwright
    Steps:
      1. Navigate to: PDF 뷰어 페이지
      2. Click: button[data-testid="next-page"]
      3. Assert: 페이지 번호가 2로 변경됨
      4. Click: button[data-testid="prev-page"]
      5. Assert: 페이지 번호가 1로 변경됨
    Expected Result: 페이지 이동 동작
    Evidence: 페이지 번호 변경 확인
  ```

  **Commit**: YES
  - Message: `feat: add inline PDF viewer`
  - Files: `components/PdfViewer.tsx, app/docs/[...slug]/page.tsx`
  - Pre-commit: `Playwright 테스트 통과 확인`

---

- [ ] 7. 설계서 업로드 기능 (Vercel Blob)

  **What to do**:
  - 업로드 페이지 (`app/upload/page.tsx`)
    - 파일 선택 (드래그 앤 드롭 + 클릭)
    - 작성자 이름: 세션에서 닉네임 자동 표시 (수정 불가, 읽기 전용)
    - .md 파일만 허용 (클라이언트 + 서버 검증)
    - 업로드 진행 상태 표시
    - 성공 시 목록 페이지로 이동
  - 업로드 API (`app/api/upload/route.ts`)
    - POST: 파일만 받기 (작성자는 세션의 닉네임에서 추출)
    - `getSession()` 호출하여 닉네임 가져오기
    - 파일명 변환: `설계서_{닉네임}_{YYMMDD}.md`
    - Vercel Blob에 업로드
    - 환경변수: `BLOB_READ_WRITE_TOKEN`
  - 설계서 목록 페이지 (`app/designs/page.tsx`)
    - Vercel Blob에서 파일 목록 조회
    - 각 설계서 클릭 시 뷰어로 이동
  - 설계서 뷰어 (`app/designs/[filename]/page.tsx`)
    - Blob URL에서 MD 내용 가져와 렌더링

  **Must NOT do**:
  - 작성자 입력 필드 ❌ (세션 닉네임 자동 사용)
  - 버전 히스토리 ❌
  - 댓글/피드백 ❌
  - 파일 삭제 기능 ❌ (관리자만 Vercel 대시보드에서)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Vercel Blob 연동, 파일 업로드 구현
  - **Skills**: []
    - 특별한 스킬 불필요

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 3)
  - **Blocks**: Task 8
  - **Blocked By**: Task 1, 2

  **References**:

  **Documentation References**:
  - Vercel Blob: https://vercel.com/docs/storage/vercel-blob
  - @vercel/blob API: https://vercel.com/docs/storage/vercel-blob/using-blob-sdk

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: 설계서 업로드 성공 (닉네임은 세션에서 자동 추출)
    Tool: Bash (curl)
    Preconditions: 로그인 세션 (닉네임: 홍길동), BLOB_READ_WRITE_TOKEN 설정
    Steps:
      1. echo "# 테스트 설계서\n\n내용입니다." > /tmp/test-design.md
      2. curl -s -X POST http://localhost:3000/api/upload \
           -H "Cookie: session=<valid_token_with_nickname>" \
           -F "file=@/tmp/test-design.md"
      3. Assert: HTTP 200
      4. Assert: response.url이 "https://blob.vercel-storage.com" 포함
      5. Assert: response.filename이 "설계서_홍길동_" 패턴 포함
    Expected Result: 파일 업로드 성공, 닉네임이 파일명에 자동 포함됨
    Evidence: curl 응답 바디 캡처

  Scenario: 잘못된 파일 형식 거부
    Tool: Bash (curl)
    Steps:
      1. echo "test" > /tmp/test.txt
      2. curl -s -X POST http://localhost:3000/api/upload \
           -H "Cookie: session=<valid_token>" \
           -F "file=@/tmp/test.txt"
      3. Assert: HTTP 400
      4. Assert: response.error에 "md 파일만" 포함
    Expected Result: .md 외 파일 거부
    Evidence: curl 응답 바디 캡처

  Scenario: 업로드 페이지 UI (닉네임 자동 표시)
    Tool: Playwright
    Preconditions: 로그인 완료 (닉네임: 테스터)
    Steps:
      1. Navigate to: http://localhost:3000/upload
      2. Wait for: input[type="file"] visible
      3. Assert: 화면에 "테스터" 닉네임 표시됨 (읽기 전용)
      4. Assert: 작성자 입력 필드 없음 (input[name="author"] 없음)
      5. Assert: button[type="submit"] 존재
      6. Screenshot: .sisyphus/evidence/task-7-upload-page.png
    Expected Result: 업로드 폼 표시, 닉네임 자동 표시
    Evidence: .sisyphus/evidence/task-7-upload-page.png

  Scenario: 설계서 목록 표시
    Tool: Playwright
    Steps:
      1. Navigate to: http://localhost:3000/designs (로그인 상태)
      2. Wait for: 목록 컨테이너 visible
      3. Assert: 업로드된 설계서가 목록에 표시됨
      4. Screenshot: .sisyphus/evidence/task-7-designs-list.png
    Expected Result: 설계서 목록 표시
    Evidence: .sisyphus/evidence/task-7-designs-list.png
  ```

  **Commit**: YES
  - Message: `feat: add design document upload with Vercel Blob`
  - Files: `app/upload/*, app/designs/*, app/api/upload/*`
  - Pre-commit: `curl 테스트 통과 확인`

---

- [ ] 8. Vercel 배포 및 최종 검증

  **What to do**:
  - Vercel 프로젝트 연결
    - `vercel link` 또는 Vercel 대시보드에서 연결
    - 프로젝트 이름: `vibe-next-workshop`
  - 환경변수 설정 (Vercel 대시보드)
    - `SITE_PASSWORD`: 워크샵 비밀번호
    - `JWT_SECRET`: 랜덤 문자열 (32자 이상)
    - `BLOB_READ_WRITE_TOKEN`: Vercel Blob 토큰
  - 배포 실행
    - `vercel --prod` 또는 git push로 자동 배포
  - 도메인 확인
    - `vibe-next-workshop.vercel.app` 접속 가능 확인
  - 최종 검증
    - 모든 기능 동작 확인

  **Must NOT do**:
  - 커스텀 도메인 설정 ❌ (기본 vercel.app 도메인 사용)
  - 복잡한 CI/CD 파이프라인 ❌

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: 표준 Vercel 배포 절차
  - **Skills**: []
    - 특별한 스킬 불필요

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 5 (final)
  - **Blocks**: None
  - **Blocked By**: Task 4, 5, 6, 7

  **References**:

  **Documentation References**:
  - Vercel CLI: https://vercel.com/docs/cli
  - Vercel Environment Variables: https://vercel.com/docs/environment-variables

  **Acceptance Criteria**:

  **Agent-Executed QA Scenarios:**

  ```
  Scenario: 프로덕션 사이트 접속 가능
    Tool: Bash (curl)
    Steps:
      1. curl -s -o /dev/null -w "%{http_code}" \
           https://vibe-next-workshop.vercel.app/login
      2. Assert: HTTP 200
    Expected Result: 로그인 페이지 접근 가능
    Evidence: HTTP 상태 코드 캡처

  Scenario: 프로덕션 로그인 동작
    Tool: Playwright
    Steps:
      1. Navigate to: https://vibe-next-workshop.vercel.app/login
      2. Fill: input[type="password"] → "<실제비밀번호>"
      3. Click: button[type="submit"]
      4. Wait for: navigation 완료 (timeout: 10s)
      5. Assert: URL이 /docs로 시작
      6. Screenshot: .sisyphus/evidence/task-8-production-login.png
    Expected Result: 프로덕션 로그인 성공
    Evidence: .sisyphus/evidence/task-8-production-login.png

  Scenario: 프로덕션 문서 렌더링
    Tool: Playwright
    Steps:
      1. (로그인 후)
      2. Navigate to: https://vibe-next-workshop.vercel.app/docs/curriculum
      3. Wait for: article visible
      4. Assert: h1 텍스트 포함 "클로드코드"
      5. Screenshot: .sisyphus/evidence/task-8-production-docs.png
    Expected Result: 프로덕션에서 문서 정상 표시
    Evidence: .sisyphus/evidence/task-8-production-docs.png

  Scenario: 프로덕션 다크모드 동작
    Tool: Playwright
    Steps:
      1. (로그인 후)
      2. Click: button[data-testid="theme-toggle"]
      3. Assert: html에 class="dark"
    Expected Result: 프로덕션 다크모드 동작
    Evidence: DOM 상태 확인
  ```

  **Commit**: YES
  - Message: `chore: configure Vercel deployment`
  - Files: `vercel.json (if needed), .env.example`
  - Pre-commit: `vercel build 성공 확인`

---

## Commit Strategy

| After Task | Message | Files | Verification |
|------------|---------|-------|--------------|
| 1 | `feat: initialize Next.js project with MDX support` | package.json, next.config.mjs, content/* | bun run build |
| 2 | `feat: add password + nickname authentication with JWT session` | app/login/*, app/api/auth/*, middleware.ts, lib/auth.ts | curl 테스트 |
| 3 | `feat: add MD document viewer with sidebar navigation` | app/docs/*, components/Sidebar.tsx, lib/content.ts | Playwright |
| 4 | `feat: add TOC and code copy button` | components/TableOfContents.tsx, components/CodeBlock.tsx | Playwright |
| 5 | `feat: add dark mode with system preference detection` | components/Theme*.tsx, tailwind.config.ts | Playwright |
| 6 | `feat: add inline PDF viewer` | components/PdfViewer.tsx | Playwright |
| 7 | `feat: add design document upload with Vercel Blob` | app/upload/*, app/designs/*, app/api/upload/* | curl 테스트 |
| 8 | `chore: configure Vercel deployment` | vercel.json, .env.example | vercel build |

---

## Success Criteria

### Verification Commands
```bash
# 로컬 빌드 성공
bun run build  # Expected: Build successful

# 로컬 개발 서버
bun run dev  # Expected: Server running on localhost:3000

# 프로덕션 접속
curl -I https://vibe-next-workshop.vercel.app  # Expected: HTTP 200
```

### Final Checklist
- [ ] 비밀번호 + 닉네임 로그인 동작
- [ ] 미인증 시 /login 리다이렉트
- [ ] 한글 URL 정상 동작
- [ ] 사이드바 폴더 구조 표시
- [ ] 다크모드 토글 동작
- [ ] TOC 스크롤 이동 동작
- [ ] 코드 복사 버튼 동작
- [ ] PDF 인라인 뷰어 동작
- [ ] 설계서 업로드 시 닉네임 자동 적용
- [ ] 설계서 목록 표시
- [ ] Vercel 배포 완료 (vibe-next-workshop.vercel.app)
- [ ] CLAUDE.md가 사이트에서 제외됨
