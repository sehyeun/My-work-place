# 회의 녹음 자동 회의록 솔루션 기획서

> 웹 기반 회의 녹음 → STT → AI 요약 → GitHub PR 자동 생성 시스템

## 1. 개요

### 1.1 목적
회의 중 노트북/휴대폰 마이크로 녹음한 음성을 자동으로 회의록(마크다운)으로 변환하여 GitHub 저장소에 PR로 등록하는 SaaS형 도구를 구축한다.

### 1.2 핵심 가치
- **무설치**: 브라우저만 있으면 사용 가능 (PWA 지원으로 모바일에서도 동작)
- **자동화**: 녹음 종료 → 회의록 PR 생성까지 사람 개입 0
- **추적성**: PR로 들어가므로 회의록도 코드 리뷰처럼 협업/수정 가능

### 1.3 주요 사용자 스토리
1. PM이 휴대폰 브라우저로 회의를 녹음한다 → 종료 누르면 자동 업로드 → 5분 후 Slack/이메일로 PR 링크 수신
2. 개발팀이 노트북으로 스탠드업 회의를 녹음한다 → 회의록 PR이 자동 생성 → 참석자들이 코멘트로 수정 → 머지
3. 외부 미팅 후 매니저가 녹음 파일만 업로드 → 동일 파이프라인으로 회의록 생성

---

## 2. 시스템 아키텍처

### 2.1 전체 구성도

```
┌──────────────────┐
│  Web Client      │  ← 마이크 녹음, 파일 업로드 (PWA)
│  (React + Vite)  │
└────────┬─────────┘
         │ HTTPS / multipart upload
         ▼
┌──────────────────────────────────────────┐
│  Backend API (FastAPI / Node.js)         │
│                                          │
│  POST /api/meetings        업로드 시작   │
│  GET  /api/meetings/:id    상태 조회     │
│  GET  /api/meetings        목록          │
└────────┬─────────────────────────────────┘
         │ enqueue
         ▼
┌──────────────────┐    ┌──────────────────┐
│ Object Storage   │    │ Job Queue        │
│ (S3/R2)          │    │ (Redis/BullMQ)   │
│ 원본 오디오 보관 │    │ 비동기 처리      │
└──────────────────┘    └────────┬─────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │ Worker (백그라운드 처리)       │
                │                                │
                │ 1. Whisper API → transcript    │
                │ 2. Claude API → 회의록(MD)     │
                │ 3. GitHub API → 브랜치 + PR    │
                │ 4. 알림 발송 (Slack/email)     │
                └────────────────────────────────┘
                                 │
                                 ▼
                ┌────────────────────────────────┐
                │ GitHub Repository              │
                │ meeting-notes/2026-05-20-…md  │
                └────────────────────────────────┘
```

### 2.2 데이터 흐름

| 단계 | 입력 | 처리 | 출력 | 예상 소요시간 |
|------|------|------|------|---------------|
| 1. 녹음 | 마이크 | MediaRecorder API (webm/opus) | 오디오 Blob | 회의 시간 |
| 2. 업로드 | Blob | Presigned URL → S3 직접 업로드 | S3 객체 키 | 30초~2분 |
| 3. STT | 오디오 파일 | Whisper API (verbose_json) | 타임스탬프 포함 transcript | 1~3분 |
| 4. 요약 | transcript + 메타데이터 | Claude Sonnet 4.6 | 마크다운 회의록 | 30초~1분 |
| 5. PR 생성 | 마크다운 | GitHub REST API | PR URL | 5초 |
| 6. 알림 | PR URL | Slack Webhook / Email | 알림 | 즉시 |

---

## 3. 기술 스택

### 3.1 프론트엔드
- **프레임워크**: React 18 + Vite + TypeScript
- **상태관리**: Zustand (간단함)
- **녹음**: `MediaRecorder API` + `getUserMedia`
- **PWA**: vite-plugin-pwa (모바일 홈 화면 추가)
- **UI**: Tailwind CSS + shadcn/ui
- **인증**: Auth0 또는 Clerk (구글 로그인 권장)

### 3.2 백엔드
- **API 서버**: FastAPI (Python) — Whisper/Claude SDK 친화적
- **워커**: Celery + Redis (Python 통일) 또는 BullMQ (Node.js)
- **DB**: PostgreSQL (회의 메타데이터, 상태 관리)
- **스토리지**: AWS S3 또는 Cloudflare R2 (저렴함)
- **배포**: Docker + Fly.io / Railway / AWS ECS

### 3.3 외부 API
- **STT**: OpenAI Whisper API (`whisper-1`)
  - 가격: $0.006/분
  - 한국어 지원 우수
  - 파일 제한: 25MB → 큰 파일은 청크 분할 필요
- **LLM**: Anthropic Claude API (`claude-sonnet-4-6`)
  - 긴 transcript에 강함 (200K context)
  - 프롬프트 캐싱으로 비용 절감
- **GitHub**: GitHub REST API + GitHub App
  - GitHub App으로 설치 → 리포 단위 권한 부여
  - 토큰보다 안전하고 권한 관리 용이

---

## 4. 주요 기능 명세

### 4.1 웹 클라이언트

#### 녹음 화면
- [ ] 마이크 권한 요청
- [ ] 녹음 시작/일시정지/종료 버튼
- [ ] 실시간 녹음 시간 표시 + 파형 시각화
- [ ] 회의 제목/참석자 메모 입력 (선택)
- [ ] 종료 후 자동 업로드 (진행률 표시)
- [ ] 백그라운드 업로드 (탭 닫아도 진행 — Service Worker)

#### 파일 업로드 화면
- [ ] 드래그앤드롭 또는 파일 선택 (mp3/wav/m4a/webm)
- [ ] 사전 검증: 형식/크기/길이

#### 목록/상세 화면
- [ ] 내 회의 목록 (상태: 처리중/완료/실패)
- [ ] 상세: transcript, 회의록 미리보기, PR 링크
- [ ] 실패 시 재시도 버튼

### 4.2 백엔드 API

```
POST   /api/meetings                  녹음 업로드 시작 (presigned URL 반환)
POST   /api/meetings/:id/complete     업로드 완료 알림 → 작업 큐 enqueue
GET    /api/meetings                  내 회의 목록
GET    /api/meetings/:id              회의 상세
POST   /api/meetings/:id/retry        실패 시 재시도
DELETE /api/meetings/:id              회의 삭제

POST   /api/auth/github/install       GitHub App 설치 콜백
GET    /api/repos                     연결된 리포 목록
PATCH  /api/users/me/settings         기본 리포/브랜치 설정
```

### 4.3 워커 파이프라인

```python
def process_meeting(meeting_id: str):
    meeting = db.get(meeting_id)
    try:
        # 1. STT
        update_status(meeting_id, "transcribing")
        audio_path = s3.download(meeting.audio_key)
        if file_size > 25_000_000:
            chunks = split_audio(audio_path, max_mb=24)
            transcript = "\n".join(whisper.transcribe(c) for c in chunks)
        else:
            transcript = whisper.transcribe(audio_path)

        # 2. 요약
        update_status(meeting_id, "summarizing")
        notes_md = claude.generate_notes(
            transcript=transcript,
            title=meeting.title,
            attendees=meeting.attendees,
            date=meeting.created_at,
        )

        # 3. PR 생성
        update_status(meeting_id, "creating_pr")
        pr_url = github.create_meeting_pr(
            repo=meeting.repo,
            file_path=f"meeting-notes/{date}-{slug}.md",
            content=notes_md,
            title=f"회의록: {meeting.title}",
        )

        # 4. 완료
        db.update(meeting_id, pr_url=pr_url, status="done")
        notify_user(meeting.user, pr_url)
    except Exception as e:
        db.update(meeting_id, status="failed", error=str(e))
        log.exception("meeting processing failed")
```

---

## 5. 회의록 마크다운 템플릿

```markdown
# {{회의 제목}}

- **일시**: {{YYYY-MM-DD HH:mm}}
- **참석자**: {{참석자 목록}}
- **녹음 시간**: {{HH:MM:SS}}

## 요약 (TL;DR)
{{3-5줄 핵심 요약}}

## 주요 논의 사항
1. {{주제 1}}
   - 배경: ...
   - 논의: ...
2. {{주제 2}}
   ...

## 결정 사항
- [x] {{결정 1}}
- [x] {{결정 2}}

## 액션 아이템
| 담당자 | 할 일 | 마감일 |
|--------|-------|--------|
| @홍길동 | API 스펙 작성 | 2026-05-25 |

## 다음 회의
- 일시: {{다음 일정}}
- 안건: {{예상 안건}}

---
<details>
<summary>전체 Transcript</summary>

{{타임스탬프 포함 transcript}}

</details>
```

---

## 6. 보안 / 프라이버시

| 항목 | 대책 |
|------|------|
| 음성 데이터 유출 | S3 SSE-KMS 암호화, presigned URL 짧은 만료(15분) |
| 처리 후 원본 보관 | 기본 30일 후 자동 삭제 (사용자 설정 가능) |
| GitHub 토큰 노출 | GitHub App + 설치 토큰 (PAT 사용 금지) |
| API 키 관리 | Vault/AWS Secrets Manager |
| 인증 | OAuth 2.0 (구글) + 세션 쿠키(HttpOnly, SameSite=Lax) |
| Rate Limit | 사용자당 분당 5회 업로드 |
| 민감정보 마스킹 | LLM 프롬프트에 "전화번호/주민번호 등은 [REDACTED]로 치환" 지시 |

---

## 7. 비용 추정 (월 100시간 회의 기준)

| 항목 | 단가 | 월 비용 |
|------|------|---------|
| Whisper API | $0.006/분 × 6000분 | $36 |
| Claude Sonnet 4.6 | 입력 $3/M, 출력 $15/M (회의당 ~30K 입력 / 2K 출력) | $20 |
| S3 스토리지 | 100GB | $2 |
| 서버 (Fly.io 등) | 2vCPU 컨테이너 | $20 |
| **합계** | | **~$80/월** |

---

## 8. 단계별 구현 로드맵

### Phase 1 — MVP (1~2주)
- [ ] FastAPI 서버 스켈레톤
- [ ] 파일 업로드 엔드포인트 (S3 직접 업로드)
- [ ] Whisper → Claude → GitHub PR 파이프라인 (동기 처리, 단일 사용자)
- [ ] 간단한 React 업로드 페이지
- [ ] **목표**: 내가 업로드 → 회의록 PR 생성 동작 확인

### Phase 2 — 웹 녹음 (1주)
- [ ] MediaRecorder 기반 녹음 UI
- [ ] PWA 설정 (모바일 설치 가능)
- [ ] 진행률 / 실패 처리

### Phase 3 — 멀티유저 (2주)
- [ ] 구글 OAuth 인증
- [ ] PostgreSQL + 회의 메타데이터
- [ ] Redis + Celery 비동기 워커
- [ ] GitHub App 설치 플로우

### Phase 4 — 운영 품질 (1주)
- [ ] 25MB 초과 파일 청크 분할
- [ ] Slack/이메일 알림
- [ ] 회의 목록/검색
- [ ] 자동 삭제 정책

### Phase 5 — 고도화 (선택)
- [ ] 화자 분리 (pyannote)
- [ ] 실시간 스트리밍 STT
- [ ] 회의록 템플릿 커스터마이징
- [ ] 다국어 지원

---

## 9. 리스크 / 결정 필요 사항

| 항목 | 옵션 | 권장 |
|------|------|------|
| 백엔드 언어 | Python(FastAPI) vs Node(Express) | **Python** — LLM/STT 생태계 |
| 저장소 권한 | PAT vs GitHub App | **GitHub App** |
| 호스팅 | Fly.io / Railway / AWS | **Fly.io** (간단, 저렴) |
| 큰 회의 파일(>25MB) | 청크 분할 vs 사전 압축 | **청크 분할** (정확도 우선) |
| 모바일 백그라운드 녹음 | iOS Safari 제약 → 가능한 한 짧게 권장 | 회의 1시간 이내 가이드 |

---

## 10. 다음 액션

이 기획서를 기반으로 다음을 결정해주세요:

1. **MVP 범위** — 위 Phase 1만 먼저 만들까요, 아니면 Phase 1+2까지?
2. **호스팅** — 어디에 배포할지 (Fly.io / Railway / 자체 서버)
3. **타겟 GitHub 리포** — 회의록을 저장할 리포(또는 이 리포에 `meeting-notes/` 하위 디렉토리?)
4. **인증** — 본인만 쓸지(단순 토큰), 팀 단위(OAuth)인지

결정해주시면 Phase 1 구현부터 시작하겠습니다.
