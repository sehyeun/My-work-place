import { Link } from "react-router-dom";
import { Mic, Plus } from "lucide-react";
import { useMeetings } from "../mocks/MeetingsContext";
import MeetingCard from "../components/MeetingCard";

export default function DashboardPage() {
  const { meetings } = useMeetings();

  const inProgress = meetings.filter(
    (m) => m.status !== "done" && m.status !== "failed"
  );
  const completed = meetings.filter((m) => m.status === "done");
  const failed = meetings.filter((m) => m.status === "failed");

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">대시보드</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            전체 회의 {meetings.length}건
          </p>
        </div>
        <Link
          to="/record"
          className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">새 회의 녹음</span>
          <span className="sm:hidden">녹음</span>
        </Link>
      </div>

      {meetings.length === 0 && (
        <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center">
          <Mic size={32} className="mx-auto text-slate-400 mb-3" />
          <p className="text-slate-500 mb-4">아직 녹음된 회의가 없습니다.</p>
          <Link
            to="/record"
            className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            첫 회의 녹음하기
          </Link>
        </div>
      )}

      {inProgress.length > 0 && (
        <Section title="처리 중" count={inProgress.length}>
          {inProgress.map((m) => (
            <MeetingCard key={m.id} meeting={m} />
          ))}
        </Section>
      )}

      {completed.length > 0 && (
        <Section title="완료" count={completed.length}>
          {completed.map((m) => (
            <MeetingCard key={m.id} meeting={m} />
          ))}
        </Section>
      )}

      {failed.length > 0 && (
        <Section title="실패 / 재시도 필요" count={failed.length}>
          {failed.map((m) => (
            <MeetingCard key={m.id} meeting={m} />
          ))}
        </Section>
      )}
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">
        {title}{" "}
        <span className="text-slate-400 font-normal normal-case">({count})</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
    </section>
  );
}
