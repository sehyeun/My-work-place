import type { MeetingStatus } from "../mocks/meetings";
import { CheckCircle2, Loader2, AlertCircle, Upload, FileText, Sparkles, GitPullRequest } from "lucide-react";

const STATUS_MAP: Record<
  MeetingStatus,
  { label: string; cls: string; icon: React.ReactNode; spinning?: boolean }
> = {
  uploading:    { label: "업로드 중",  cls: "bg-blue-100 text-blue-700",      icon: <Upload size={12} />,         spinning: true },
  transcribing: { label: "변환 중",    cls: "bg-amber-100 text-amber-700",    icon: <FileText size={12} />,       spinning: true },
  summarizing:  { label: "요약 중",    cls: "bg-purple-100 text-purple-700",  icon: <Sparkles size={12} />,       spinning: true },
  creating_pr:  { label: "PR 생성 중", cls: "bg-indigo-100 text-indigo-700",  icon: <GitPullRequest size={12} />, spinning: true },
  done:         { label: "완료",       cls: "bg-emerald-100 text-emerald-700", icon: <CheckCircle2 size={12} /> },
  failed:       { label: "실패",       cls: "bg-red-100 text-red-700",        icon: <AlertCircle size={12} /> },
};

export default function StatusBadge({ status }: { status: MeetingStatus }) {
  const cfg = STATUS_MAP[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.cls}`}
    >
      {cfg.spinning ? <Loader2 size={12} className="animate-spin" /> : cfg.icon}
      {cfg.label}
    </span>
  );
}
