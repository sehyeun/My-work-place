---
description: 5단계 제품 기획 파이프라인(시나리오→와이어프레임→데이터→인터랙션→PRD)을 실행. 사용법 — /plan-product [슬러그/주제]
---

# /plan-product

`product-planner` 스킬을 호출하여 5단계 제품 기획 파이프라인을 시작합니다.

## 동작

1. 사용자가 입력한 텍스트(`/plan-product` 뒤의 문자열)가 있으면 잠정 슬러그/주제로 사용
2. 없으면 첫 질문으로 슬러그 결정부터 진행
3. `product-planner` SKILL.md의 Step 0 ~ Step 6 워크플로우를 그대로 따름
4. 사용자가 중간에 "여기서 멈춰"라고 하면 즉시 멈추고 다음 세션에서 재진입 가능하도록 상태 안내

## 출력 위치

```
docs/planning/<YYYY-MM-DD>-<slug>/
├── 00-context.md
├── 01-scenarios.md
├── 02-wireframes.md
├── 03-data-model.md
├── 04-interactions.md
└── 05-prd.md
docs/prd/<YYYY-MM-DD>-<slug>.md  (사본)
```

## 부분 실행

특정 단계만 원하면:
- `/scenario` — Stage 1만
- `/wireframe` — Stage 2만
- `/data-model` — Stage 3만
- `/interactions` — Stage 4만
- `/prd` — Stage 5만 (인터뷰 모드 또는 합성 모드)
