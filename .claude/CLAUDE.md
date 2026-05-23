# Project conventions

이 문서는 이 리포에서 Claude가 따라야 할 프로젝트 단위 규칙입니다. 일반적인 코딩 지침은 시스템 프롬프트의 기본값을 따르되, 아래 규칙은 그보다 우선합니다.

## 언어

- 사용자와의 대화는 **한국어 기본**. 사용자가 영어로 시작하면 영어로.
- 코드 주석, 식별자, 커밋 메시지는 영어 우선 (한국어 주석 허용).
- PRD/회의록/기획 문서는 **한국어**로 작성.

## 문서 산출물

| 종류 | 위치 | 비고 |
|------|------|------|
| 제품 기획 산출물 (전체) | `docs/planning/YYYY-MM-DD-<slug>/` | `/plan-product` 또는 단계별 스킬 |
| ├─ 시나리오 | `01-scenarios.md` | `scenario-writer` |
| ├─ 와이어프레임 | `02-wireframes.md` | `wireframe-designer` |
| ├─ 데이터 모델 | `03-data-model.md` | `data-modeler` |
| ├─ 인터랙션 | `04-interactions.md` | `interaction-designer` |
| └─ PRD | `05-prd.md` (+`docs/prd/` 사본) | `prd-writer` (합성 모드) |
| 제품/기능 PRD (단독) | `docs/prd/YYYY-MM-DD-<slug>.md` | `/prd` (인터뷰 모드) |
| 회의록 | `docs/meetings/YYYY-MM-DD-<slug>.md` | 회의록 자동화 봇이 PR로 생성 |
| 기획/계획 | `PLAN.md`, `docs/plans/*.md` | 큰 그림 |

신규 산출물은 위 위치를 따르세요. 임시 파일/메모를 루트에 만들지 마세요.

## 제품 기획 파이프라인

개발 착수 전 전체 기획은 다음 5단계로 진행합니다. 자세한 워크플로우는 각 스킬의 SKILL.md 참고.

```
1. Scenario   — 회원가입~업무 완료 사용자 여정    (scenario-writer)
2. Wireframe  — 시나리오별 화면 와이어프레임      (wireframe-designer)
3. DataModel  — 화면이 다루는 데이터 구조         (data-modeler)
4. Interaction— UI 이벤트별 시스템 흐름           (interaction-designer)
5. PRD        — 1~4 종합한 최종 요구사항 문서     (prd-writer 합성 모드)
```

- 전체 파이프라인: `/plan-product` 또는 "제품 기획하자" → `product-planner` 스킬
- 단계 단독: `/scenario`, `/wireframe`, `/data-model`, `/interactions`, `/prd`
- 모든 스테이지는 이전 산출물을 `Read`해서 입력으로 사용. 일관성 유지가 핵심.

## PRD 작성 규칙

PRD를 쓸 때는 반드시 다음을 지키세요. 자세한 워크플로우는 `.claude/skills/prd-writer/SKILL.md` 참고.

1. **인터뷰 먼저, 글은 그 다음** — 사용자의 의도를 묻기 전에 PRD를 쓰지 마세요. 사용자가 안 알려준 정보는 채워넣지 마세요.
2. **추정과 진술을 구분** — 사용자가 명시한 내용과 AI가 추론한 내용을 다음과 같이 마킹합니다:
   - 사용자 진술: 그대로 인용 부호로 표시 가능
   - AI 추정: `🔸 [추정: ...]`
   - 미정/확인 필요: `🟡 [확인 필요: ...]`
3. **지표·날짜·숫자 환각 금지** — 사용자가 주지 않은 KPI 목표치, 출시일, 비용 추정은 절대 만들지 말고 `🟡 [확인 필요]`로 남기세요.
4. **Non-goal을 반드시 포함** — 무엇을 안 할지 명시.
5. **Open Questions 섹션 필수** — 인터뷰에서 못 메운 빈 칸을 그대로 남깁니다.
6. **섹션별 진행** — 전체를 한 번에 쓰지 말고 한 섹션 쓰고 사용자 컨펌 → 다음 섹션. 토큰을 아끼지 말고 정확도를 우선.

## 회의록 자동화 프로젝트

이 리포 자체가 만들고 있는 제품에 대한 메모:

- Phase 0 (UI 목업) 완료. 자세한 건 `PLAN.md`, `README.md`, GitHub PR #1.
- 기술 스택: Vite + React 18 + TS + Tailwind (프론트), 추후 FastAPI + Python (백엔드 예정).
- 작업 브랜치 명명: `claude/<topic>-<random>`.
- main에 직접 푸시 금지.

## 커밋 메시지

- 한국어 OK, 영어 OK. 일관성만 유지.
- 첫 줄 50자 이내 요약 + 빈 줄 + 본문 (왜 변경하는지).
- 모델 식별자(`claude-opus-4-7` 등)는 커밋·PR·코드에 절대 포함하지 마세요.
