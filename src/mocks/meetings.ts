export type MeetingStatus =
  | "uploading"
  | "transcribing"
  | "summarizing"
  | "creating_pr"
  | "done"
  | "failed";

export type ProcessingStep = {
  key: "upload" | "transcribe" | "summarize" | "pr";
  label: string;
  state: "done" | "in_progress" | "pending" | "failed";
};

export type Meeting = {
  id: string;
  title: string;
  date: string;
  durationSec: number;
  status: MeetingStatus;
  attendees: string[];
  prUrl?: string;
  prNumber?: number;
  error?: string;
  transcript?: string;
  markdown?: string;
  steps: ProcessingStep[];
};

const sampleMarkdown = `# 주간 스탠드업 — 2026-05-20

> 일시: 2026-05-20 10:00 ~ 10:32 (32분)
> 참석자: 김전현, 박지수, 이도현, 최서아
> 작성: 회의록 자동화 봇

## 1. 요약 (TL;DR)

- 결제 모듈 리팩토링이 약 70% 완료되었으며, 이번 주 내 PR 머지 예정.
- B2B 온보딩 흐름의 깜빡임(flicker) 이슈가 다시 보고됨 — 우선순위 P1로 격상.
- 다음 주 화요일 사내 데모 일정 확정.

## 2. 안건별 논의

### 2.1 결제 모듈 리팩토링
- **현황**: \`PaymentService\`를 \`PaymentGateway\` 인터페이스 기반으로 분리 완료.
- **남은 작업**: 토스/카카오페이 어댑터 통합 테스트, 결제 실패 시 멱등성 보장.
- **담당**: 박지수
- **데드라인**: 2026-05-23 (금)

### 2.2 B2B 온보딩 flicker
- 라우터 가드에서 비동기 권한 체크 시 잠깐 빈 화면이 보이는 문제.
- 임시 스피너 추가로 완화 가능하나, 근본 원인은 SSR 미스매치로 추정.
- **담당**: 이도현 (조사) → 다음 스탠드업에서 공유

### 2.3 사내 데모
- 일시: 2026-05-26 (화) 15:00
- 발표자: 김전현
- 준비물: 슬라이드, 라이브 데모 시나리오 2건

## 3. 결정 사항

| # | 결정 | 담당 |
|---|------|------|
| 1 | 결제 모듈은 이번 스프린트 내 머지 | 박지수 |
| 2 | flicker 이슈 우선순위를 P2 → P1로 상향 | 김전현 |
| 3 | 데모 일정 5/26 확정 | 전원 |

## 4. 액션 아이템

- [ ] **박지수** — 토스/카카오페이 어댑터 통합 테스트 작성 (5/22까지)
- [ ] **이도현** — SSR 미스매치 원인 조사 + 재현 케이스 정리 (5/22까지)
- [ ] **최서아** — 데모 시나리오 초안 작성 (5/23까지)
- [ ] **김전현** — 데모용 슬라이드 outline (5/24까지)

## 5. 다음 회의

- 2026-05-22 (금) 10:00 — 주간 스탠드업
`;

const sampleTranscript = `[00:00:03] 김전현: 자, 다들 모이셨죠? 오늘 주간 스탠드업 시작하겠습니다.
[00:00:09] 박지수: 네, 결제 모듈 진행 상황부터 공유드릴게요. 지난주에 말씀드린 PaymentGateway 인터페이스 분리는 거의 다 끝났습니다.
[00:00:22] 김전현: 진행률로는 어느 정도예요?
[00:00:24] 박지수: 한 70% 정도요. 이번 주 안에 PR 머지까지는 갈 수 있을 것 같습니다.
[00:00:31] 이도현: 어댑터 쪽은 어떻게 되고 있어요?
[00:00:34] 박지수: 토스랑 카카오페이 어댑터 통합 테스트가 남았어요. 결제 실패 시 멱등성 보장 부분도 좀 더 봐야 하고요.
...
[전체 transcript는 STT 결과 기반으로 생성됩니다. 데모용으로 일부만 표시.]
`;

export const initialMeetings: Meeting[] = [
  {
    id: "1",
    title: "주간 스탠드업",
    date: "2026-05-20T10:00:00",
    durationSec: 32 * 60 + 15,
    status: "done",
    attendees: ["김전현", "박지수", "이도현", "최서아"],
    prUrl: "https://github.com/team/meeting-notes/pull/42",
    prNumber: 42,
    transcript: sampleTranscript,
    markdown: sampleMarkdown,
    steps: [
      { key: "upload", label: "오디오 업로드", state: "done" },
      { key: "transcribe", label: "음성 → 텍스트 변환 (Whisper)", state: "done" },
      { key: "summarize", label: "AI 요약 생성 (Claude)", state: "done" },
      { key: "pr", label: "GitHub PR 생성", state: "done" },
    ],
  },
  {
    id: "2",
    title: "Q2 기획 회의",
    date: "2026-05-19T14:00:00",
    durationSec: 1 * 3600 + 12 * 60 + 8,
    status: "summarizing",
    attendees: ["김전현", "박지수", "PM 윤서연"],
    steps: [
      { key: "upload", label: "오디오 업로드", state: "done" },
      { key: "transcribe", label: "음성 → 텍스트 변환 (Whisper)", state: "done" },
      { key: "summarize", label: "AI 요약 생성 (Claude)", state: "in_progress" },
      { key: "pr", label: "GitHub PR 생성", state: "pending" },
    ],
  },
  {
    id: "3",
    title: "고객 인터뷰 — A사 CTO",
    date: "2026-05-18T16:30:00",
    durationSec: 45 * 60 + 22,
    status: "done",
    attendees: ["김전현", "최서아"],
    prUrl: "https://github.com/team/meeting-notes/pull/41",
    prNumber: 41,
    markdown: `# 고객 인터뷰 — A사 CTO\n\n## 핵심 인사이트\n- 현재 워크플로우에서 가장 큰 페인포인트는 **회의 후 액션 아이템 추적**\n- 슬랙 알림 통합이 결정적 구매 요인이 될 수 있음\n\n## 액션 아이템\n- [ ] 슬랙 통합 PoC 일정 잡기\n`,
    steps: [
      { key: "upload", label: "오디오 업로드", state: "done" },
      { key: "transcribe", label: "음성 → 텍스트 변환 (Whisper)", state: "done" },
      { key: "summarize", label: "AI 요약 생성 (Claude)", state: "done" },
      { key: "pr", label: "GitHub PR 생성", state: "done" },
    ],
  },
  {
    id: "4",
    title: "긴급 장애 대응 회의",
    date: "2026-05-17T22:00:00",
    durationSec: 18 * 60 + 45,
    status: "failed",
    attendees: ["전원"],
    error: "Whisper API 요청 한도 초과 (rate limit). 잠시 후 자동 재시도됩니다.",
    steps: [
      { key: "upload", label: "오디오 업로드", state: "done" },
      { key: "transcribe", label: "음성 → 텍스트 변환 (Whisper)", state: "failed" },
      { key: "summarize", label: "AI 요약 생성 (Claude)", state: "pending" },
      { key: "pr", label: "GitHub PR 생성", state: "pending" },
    ],
  },
];

export function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
}
