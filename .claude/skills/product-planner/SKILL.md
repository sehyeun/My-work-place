---
name: product-planner
description: Use when the user wants to do full end-to-end product planning before development — 제품 기획, 처음부터 다 짜자, 전체 기획, full product planning. Orchestrates 5 stages — scenario → wireframe → data model → interactions → PRD — invoking each sub-skill in order and feeding each stage's output to the next. Examples — "제품 기획하자", "/plan-product", "회원가입부터 업무까지 전체 기획", "처음부터 다 짜줘". Use the individual sub-skills (scenario-writer, wireframe-designer, data-modeler, interaction-designer, prd-writer) when you only need one stage.
---

# Product Planner (Pipeline Orchestrator)

5단계 제품 기획 파이프라인을 처음부터 끝까지 진행하는 마스터 스킬.

```
Stage 1: Scenario        → 01-scenarios.md
Stage 2: Wireframe       → 02-wireframes.md
Stage 3: Data Model      → 03-data-model.md
Stage 4: Interactions    → 04-interactions.md
Stage 5: PRD             → 05-prd.md (+ docs/prd/<date>-<slug>.md 사본)
```

## When to invoke

**Trigger on:**
- "제품 기획하자 / 전체 기획 / 처음부터 다 짜자"
- "회원가입부터 ~까지 기획부터 끝까지"
- `/plan-product`
- "사용자 시나리오부터 PRD까지 한꺼번에"

**Do NOT trigger on:**
- 특정 단계 하나만 요청 — 그 단계의 개별 스킬 사용 (`scenario-writer` 등)
- 이미 만들어진 산출물의 단순 수정

## 핵심 원칙

1. **사용자 확인을 자주** — 각 스테이지 진행 전·후 사용자 OK 확인
2. **이전 산출물을 반드시 입력으로** — 다음 스테이지로 넘어갈 때 이전 파일을 `Read`하여 컨텍스트에 명시적으로 적재
3. **마킹 일관성** — 모든 스테이지에서 `🔸 [추정]`, `🟡 [확인 필요]` 통일
4. **중간 이탈 가능** — 사용자가 "여기서 멈춰" 또는 "다시 돌아가자"고 하면 따름
5. **재진입 가능** — 일부 파일이 이미 있으면 거기서부터 이어감

## Workflow

### Step 0: 작업 슬러그 + 폴더 결정

AskUserQuestion으로 짧은 슬러그를 받음 (예: `meeting-notes-flow`). 폴더 생성:

```
docs/planning/<YYYY-MM-DD>-<slug>/
```

이미 폴더가 있으면 사용자에게:
> "이미 `docs/planning/<...>/` 폴더가 있습니다. (1) 이어서 진행 (2) 새로 시작 (3) 다른 슬러그 — 어떻게 할까요?"

### Step 0.5: 기획 범위 합의 (1분 인터뷰)

다음 3가지만 짧게 확인 후 본격 진행:

1. 제품 한 줄 묘사 (사용자의 원문 그대로 보존)
2. 주 사용자(페르소나) 1~2 단어
3. 종료 조건 (이 시나리오가 끝났을 때 무엇을 달성?)

이 3가지를 모든 후속 스테이지에 컨텍스트로 전달.

### Step 1: Scenario (sub-skill: scenario-writer)

`scenario-writer` SKILL의 워크플로우를 따름. 산출:
```
docs/planning/<slug>/01-scenarios.md
```

완료 후 사용자에게:
> "Scenario 단계 완료. Wireframe 단계로 진행할까요? [Y/n]"
> "잠깐 멈출 거면 여기서 끊고, 나중에 `/plan-product` 다시 호출하면 이 지점부터 이어집니다."

### Step 2: Wireframe (sub-skill: wireframe-designer)

`01-scenarios.md`를 반드시 `Read`해서 컨텍스트에 적재한 뒤, `wireframe-designer` SKILL 워크플로우 따름. 산출:
```
docs/planning/<slug>/02-wireframes.md
```

완료 후 사용자 확인 → Step 3.

### Step 3: Data Model (sub-skill: data-modeler)

`01-scenarios.md`, `02-wireframes.md`를 `Read`. `data-modeler` SKILL 워크플로우 따름. 산출:
```
docs/planning/<slug>/03-data-model.md
```

완료 후 사용자 확인 → Step 4.

### Step 4: Interactions (sub-skill: interaction-designer)

`01`, `02`, `03` 모두 `Read`. `interaction-designer` SKILL 워크플로우 따름. 산출:
```
docs/planning/<slug>/04-interactions.md
```

완료 후 사용자 확인 → Step 5.

### Step 5: PRD 종합 (sub-skill: prd-writer in 합성 모드)

이전 4개 산출물을 모두 `Read`. `prd-writer` SKILL을 **합성 모드**로 호출:
- 인터뷰 단계는 건너뜀 (이미 입력이 다 있음)
- 단, `🟡 [확인 필요]`로 남은 항목들은 PRD 작성 전에 사용자에게 한 번에 묶어서 확인
- 모든 스테이지의 산출물을 종합해 풀 PRD 작성

산출:
```
docs/planning/<slug>/05-prd.md
docs/prd/<YYYY-MM-DD>-<slug>.md   ← 사본 (CLAUDE.md 규칙대로 docs/prd/에도)
```

### Step 6: 종합 리뷰

사용자에게:
- 전체 산출물 목차 보여주기
- 미해결 `🟡 [확인 필요]` 항목 리스트
- 모든 `🔸 [추정]` 항목 리스트 — 최종 컨펌
- 다음 단계 제안 (커밋? 디자이너에게 공유? 개발 착수?)

## 산출 파일 트리

```
docs/planning/<YYYY-MM-DD>-<slug>/
├── 00-context.md           # 슬러그, 범위, 페르소나 (Step 0.5 결과)
├── 01-scenarios.md
├── 02-wireframes.md
├── 03-data-model.md
├── 04-interactions.md
└── 05-prd.md
docs/prd/
└── <YYYY-MM-DD>-<slug>.md  # 05-prd.md 사본
```

## 안 좋은 패턴

- ❌ 이전 산출물을 `Read` 안 하고 다음 스테이지 시작 — 일관성 무너짐
- ❌ 5단계를 한 번에 다 토해내기 — 단계마다 사용자 확인 필수
- ❌ Step 0.5 인터뷰 건너뛰기 — 페르소나·범위 합의가 모든 스테이지의 닻
- ❌ 미해결 `🟡` 항목을 PRD에 그대로 두고 종료 — Step 6에서 한 번 더 사용자에게 묶어서 확인
- ❌ 사용자가 멈춰달라고 했는데 다음 스테이지로 진입
