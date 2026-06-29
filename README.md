# 회의록 자동화 (Meeting Notes Automation)

마이크로 회의를 녹음하면 자동으로 STT → AI 요약 → 마크다운 회의록 → GitHub PR 생성까지 처리해주는 팀용 웹 서비스.

초기 기획은 [`PLAN.md`](./PLAN.md), **확정 결정**은 [`docs/planning/2026-05-24-meeting-notes/`](./docs/planning/2026-05-24-meeting-notes/) 참고.

## 현재 상태

**Phase 0 — UI 목업 (현재)**

기능 없는 정적 UI만 구현되어 있습니다. 모든 데이터는 하드코딩된 mock이며, 실제 녹음/STT/PR 생성은 동작하지 않습니다. UX/디자인 검증이 목적입니다.

> ⚠️ 이 목업은 **초기 가정**으로 구현되었습니다. 이후 Stage 1 기획에서 인증(이메일/패스워드 + 관리자 초대), 리포(시스템 단일), 알림(인앱 + 이메일 + Slack), 회의록 인라인 편집이 확정되어 목업과 차이가 있습니다. 차이 전체와 Stage 2 반영 계획은 [UI 불일치 분석](./docs/planning/2026-05-24-meeting-notes/ui-mockup-gap-analysis.md) 참고. 코드 정합은 Stage 2(와이어프레임) 이후 진행합니다.

## 로컬 실행

```bash
npm install
npm run dev
```

기본적으로 `http://localhost:5173`에서 열립니다.

## 화면 구성

| 경로 | 설명 |
|------|------|
| `/login` | 로그인 — 이메일/패스워드. ⚠️ 목업은 아직 구글 버튼(클릭 시 대시보드 이동), Stage 2에서 교체 |
| `(가입)` | 관리자 초대 링크 → 가입 폼(이메일·PW·이름·부서) → 자동 로그인. 🔜 목업 미구현, Stage 2 신설 |
| `/` | 대시보드 — 회의 목록 (처리중 / 완료 / 실패) |
| `/record` | 새 회의 녹음 (가짜 파형 + 타이머) |
| `/meetings/:id` | 회의 상세 — 처리 진행 단계, 마크다운 미리보기, transcript, PR 링크 |
| `/settings` | 알림(인앱·이메일·Slack), 데이터 보관 정책. ⚠️ 목업의 리포 선택·브랜치/경로는 시스템 단일 리포 정책으로 제거 예정 |

## 기술 스택 (목업 한정)

- Vite + React 18 + TypeScript
- Tailwind CSS
- react-router-dom
- react-markdown
- lucide-react

## 이후 단계

- **Phase 1** — FastAPI 백엔드, Whisper/Claude/GitHub 동기 파이프라인 연결
- **Phase 2** — 실제 MediaRecorder 기반 웹 녹음 + PWA
- **Phase 3** — 이메일/패스워드 + 관리자 초대 가입 + GitHub App(시스템 단일 리포) + PostgreSQL + Redis/Celery 비동기 + 멀티유저
- **Phase 4** — 청크 분할, Slack 알림, 자동 삭제, Docker Compose 안정화
