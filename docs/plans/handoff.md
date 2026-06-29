# 이어가기 노트 (Handoff)

> 다른 PC/세션에서 작업을 이어가기 위한 **단일 진입점**.
> 새 환경에서 시작할 땐 이 파일부터 읽으세요. 세션 종료 시마다 갱신합니다.

## 스냅샷 (2026-06-29 기준)

| 항목 | 값 |
|------|------|
| 브랜치 | `claude/meeting-notes-automation-OT4Pz` |
| 최신 커밋 | `de0f3c1` — "문서: UI 목업 불일치 분석 + README 정합" |
| 동기화 | ✅ origin에 push 완료, 워킹트리 clean |
| PR | **#1** (OPEN + Draft) — https://github.com/sehyeun/My-work-place/pull/1 |

## 지금 어디까지 왔나

제품 = "회의 녹음 → STT → AI 요약 → GitHub PR 자동 생성" 웹 SaaS. 두 트랙 병행:

| 트랙 | 현재 위치 | 상태 |
|------|-----------|------|
| A. 제품 구현 | Phase 0 (UI 목업) | ✅ 완료, Phase 1 미착수 |
| B. 제품 기획 (5단계) | Stage 1 (시나리오) | ✅ Confirmed, **Stage 2 대기** |

## 이번 세션에 한 일

1. PR #1 상태 점검
2. UI 목업 ↔ 확정 기획 불일치 전수 조사 → `docs/planning/2026-05-24-meeting-notes/ui-mockup-gap-analysis.md` 신설
3. `README.md` 정합 (로그인/가입/단일 리포/알림 3종 + 불일치 문서 링크)
4. 커밋 `de0f3c1` + push (PR #1 반영, 파일 43→44)

> 결정: 목업 **코드 자체는 수정하지 않음** — Stage 2 와이어프레임에서 일괄 반영. `PLAN.md`는 초기 기획서로 **동결**.

## 다음 할 일 (우선순위 순)

1. **Stage 2 — 와이어프레임** (`/wireframe` 또는 `wireframe-designer`)
   - 입력: `00-context.md`(v2), `01-scenarios.md`(Confirmed), **`ui-mockup-gap-analysis.md`의 "Stage 2 반영 체크리스트"**
   - 산출: `docs/planning/2026-05-24-meeting-notes/02-wireframes.md`
2. 이후 Stage 3 데이터모델 → Stage 4 인터랙션 → Stage 5 PRD
3. (별건) UI 목업 코드 정합(A·B그룹)은 Stage 2 확정 후

## 미해결 / 이월 이슈

- **PR #1 제목 범위 초과** — 제목은 "Phase 0 UI 목업"인데 기획 커밋이 누적됨. 머지 전에 제목 정리 또는 기획 커밋 분리 검토.
- 🟡 Slack 연동 방식 (워크스페이스 설치 vs 채널 봇) — Stage 4에서 결정
- 🟡 인앱 편집 중 외부 PR 커밋 충돌 처리 — Stage 4에서 결정
- 🟡 동시 사용자 규모 / 비동기 워커 수 — Stage 5 비기능 요구
- 🟡 V1 페르소나 단일(PM) 유지 vs 2차(개발팀/외부미팅) 포함 — Stage 5

## 다른 PC에서 시작하는 법

```bash
# 1. 리포 가져오기 + 브랜치 체크아웃
git fetch origin
git checkout claude/meeting-notes-automation-OT4Pz
git pull

# 2. 목업 실행 (선택, UI 확인용)
npm install
npm run dev          # http://localhost:5173
```

**컨텍스트 복원 읽기 순서:**
1. 이 파일 (`docs/plans/handoff.md`)
2. `docs/planning/2026-05-24-meeting-notes/` → `00-context.md` → `01-scenarios.md` → `ui-mockup-gap-analysis.md`
3. `README.md` (현재 상태), `PLAN.md` (초기 기획 — 일부 구버전 주의)
4. 이어서 한마디: **"Stage 2 와이어프레임 진행"** 또는 `/wireframe`

## 핵심 확정 결정 (빠른 참조)

`00-context.md` v2 기준. UI/데이터에 직접 영향:

- 인증: **이메일/패스워드 + 관리자 초대** (구글 OAuth ❌)
- 가입 직후 **자동 로그인** → 대시보드
- GitHub 리포: **시스템 전체 단일 리포** (관리자 1회 등록, GitHub App)
- 회의 입력: **기본 필드만** (제목/일시/참석자)
- 알림: **인앱(항상 ON) + 이메일 + Slack**
- 회의록: **앱 내 인라인 편집 + GitHub PR 동기화**
- 회의 길이 1~2시간 → **Whisper 청크 분할 필수**
- 저장 경로: `docs/meetings/YYYY-MM-DD-<slug>.md`
