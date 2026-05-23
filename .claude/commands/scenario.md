---
description: 사용자 시나리오(회원가입~업무 완료) 단독 작성. Stage 1.
---

# /scenario

`scenario-writer` 스킬을 호출하여 사용자 시나리오를 단독 작성합니다.

## 동작

- `/scenario` 뒤의 텍스트가 있으면 잠정 슬러그/주제로 사용
- `scenario-writer` SKILL.md의 워크플로우를 그대로 따름
- 산출: `docs/planning/<YYYY-MM-DD>-<slug>/01-scenarios.md`

전체 파이프라인을 한 번에 돌리려면 `/plan-product` 사용.
