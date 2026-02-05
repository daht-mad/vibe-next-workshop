# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

2026년 2월 6일 진행되는 **클로드코드 바이브코딩 실무 워크샵** 운영 자료 모음.
대상: PM, 디자이너, 리서처 (9~10명) / 목표: 본인 업무 자동화 스킬 제작 및 GitHub 배포

## 폴더 구조

```
260206-next-workshop/
├── curriculum.md              # 워크샵 커리큘럼 (4시간 일정)
├── participants.md            # 참석자 명단 및 직무 정보
├── skill-ideas-by-participant.md  # 참석자별 스킬 아이디어 브레인스토밍
├── 가이드/                    # 설치 및 설정 가이드
│   ├── 클로드코드-설치가이드.md
│   ├── lark-mcp-설정가이드.md
│   └── google-sheets-설정가이드.md
├── 참여자-사전설문/            # 사전질문 및 개별 응답
├── daily-feedback/            # 샘플 스킬 설계서 (강사용 데모)
│   ├── daily-feedback-설계서.md
│   └── 연동가이드/            # Airtable, Gmail, Slack 연동 가이드
└── references/                # 참고 자료 (PDF, 사례 모음)
```

## 연관 스킬

| 스킬 | 용도 |
|------|------|
| `workshop-prep` | 참석자 사전 인터뷰 → 스킬 설계서 생성 |
| `daily-feedback` | 강사 데모용 샘플 스킬 (에어테이블→Gmail→Slack) |
| `skill-creator` | 워크샵 중 참석자 스킬 제작 지원 |

## 작업 시 참고사항

- 문서 기반 프로젝트로 빌드/테스트 명령어 없음
- 참석자 정보 수정 시 `participants.md`와 `skill-ideas-by-participant.md` 동기화 필요
- 스킬 설계서 작성은 `daily-feedback/daily-feedback-설계서.md` 양식 참조
