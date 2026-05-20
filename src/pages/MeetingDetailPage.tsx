import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Circle,
  XCircle,
  ExternalLink,
  FileText,
  Copy,
  Users,
  Clock,
  RotateCw,
} from "lucide-react";
import { useMeetings } from "../mocks/MeetingsContext";
import {
  formatDate,
  formatDuration,
  type ProcessingStep,
} from "../mocks/meetings";
import StatusBadge from "../components/StatusBadge";

export default function MeetingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { meetings } = useMeetings();
  const meeting = meetings.find((m) => m.id === id);
  const [tab, setTab] = useState<"markdown" | "transcript">("markdown");

  if (!meeting) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Link to="/" className="text-sm text-slate-500 hover:text-slate-700 inline-flex items-center gap-1">
          <ArrowLeft size={14} /> 대시보드로
        </Link>
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center mt-6">
          <p className="text-slate-500">회의를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const isProcessing =
    meeting.status !== "done" && meeting.status !== "failed";

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <Link
        to="/"
        className="text-sm text-slate-500 hover:text-slate-700 inline-flex items-center gap-1 mb-4"
      >
        <ArrowLeft size={14} /> 대시보드로
      </Link>

      <div className="flex items-start justify-between gap-3 mb-2">
        <h1 className="text-2xl font-bold text-slate-900">{meeting.title}</h1>
        <StatusBadge status={meeting.status} />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-6">
        <span>{formatDate(meeting.date)}</span>
        <span className="inline-flex items-center gap-1">
          <Clock size={14} /> {formatDuration(meeting.durationSec)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Users size={14} /> {meeting.attendees.join(", ")}
        </span>
      </div>

      {/* Processing pipeline */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-4">처리 단계</h2>
        <ol className="space-y-3">
          {meeting.steps.map((step, idx) => (
            <StepRow key={step.key} step={step} idx={idx} />
          ))}
        </ol>

        {meeting.status === "failed" && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 flex items-start justify-between gap-3">
            <div>
              <div className="font-medium mb-0.5">처리 실패</div>
              <div className="text-xs">{meeting.error}</div>
            </div>
            <button className="inline-flex items-center gap-1 text-xs bg-white border border-red-300 text-red-700 px-3 py-1.5 rounded hover:bg-red-50">
              <RotateCw size={12} /> 재시도
            </button>
          </div>
        )}

        {meeting.prUrl && (
          <a
            href={meeting.prUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg"
            onClick={(e) => {
              // 목업이므로 실제 이동 차단
              e.preventDefault();
              alert(`목업: ${meeting.prUrl} 로 이동`);
            }}
          >
            <ExternalLink size={14} />
            GitHub PR #{meeting.prNumber} 열기
          </a>
        )}
      </section>

      {/* Content tabs */}
      {!isProcessing && (meeting.markdown || meeting.transcript) && (
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex border-b border-slate-200 bg-slate-50">
            <TabButton active={tab === "markdown"} onClick={() => setTab("markdown")} icon={<FileText size={14} />}>
              회의록
            </TabButton>
            <TabButton
              active={tab === "transcript"}
              onClick={() => setTab("transcript")}
              icon={<FileText size={14} />}
              disabled={!meeting.transcript}
            >
              Transcript
            </TabButton>
            <div className="ml-auto px-3 flex items-center">
              <button
                onClick={() => {
                  const text = tab === "markdown" ? meeting.markdown : meeting.transcript;
                  if (text) {
                    navigator.clipboard?.writeText(text);
                  }
                }}
                className="text-xs text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-white"
              >
                <Copy size={12} /> 복사
              </button>
            </div>
          </div>

          <div className="p-5 md:p-8">
            {tab === "markdown" && meeting.markdown && (
              <div className="prose-meeting">
                <ReactMarkdown>{meeting.markdown}</ReactMarkdown>
              </div>
            )}
            {tab === "transcript" && (
              <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                {meeting.transcript || "Transcript가 아직 준비되지 않았습니다."}
              </pre>
            )}
          </div>
        </section>
      )}

      {isProcessing && (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center">
          <Loader2 size={28} className="mx-auto text-brand-600 animate-spin mb-3" />
          <p className="text-sm text-slate-600">
            회의록을 생성하는 중입니다. 완료되면 알림으로 알려드릴게요.
          </p>
        </div>
      )}
    </div>
  );
}

function StepRow({ step, idx }: { step: ProcessingStep; idx: number }) {
  const stateConfig = {
    done: { icon: <CheckCircle2 size={18} className="text-emerald-500" />, text: "text-slate-700" },
    in_progress: { icon: <Loader2 size={18} className="text-brand-600 animate-spin" />, text: "text-slate-900 font-medium" },
    pending: { icon: <Circle size={18} className="text-slate-300" />, text: "text-slate-400" },
    failed: { icon: <XCircle size={18} className="text-red-500" />, text: "text-red-700 font-medium" },
  }[step.state];

  return (
    <li className="flex items-center gap-3">
      <span className="text-xs text-slate-400 w-4">{idx + 1}</span>
      {stateConfig.icon}
      <span className={`text-sm ${stateConfig.text}`}>{step.label}</span>
    </li>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition ${
        active
          ? "border-brand-600 text-brand-700 bg-white"
          : "border-transparent text-slate-500 hover:text-slate-700"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {icon}
      {children}
    </button>
  );
}
