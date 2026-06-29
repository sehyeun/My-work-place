import { Link } from "react-router-dom";
import { Users, Clock, ExternalLink } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatDate, formatDuration, type Meeting } from "../mocks/meetings";

export default function MeetingCard({ meeting }: { meeting: Meeting }) {
  return (
    <Link
      to={`/meetings/${meeting.id}`}
      className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-brand-500 hover:shadow-sm transition"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-slate-900 truncate">{meeting.title}</h3>
        <StatusBadge status={meeting.status} />
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mb-3">
        <span>{formatDate(meeting.date)}</span>
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {formatDuration(meeting.durationSec)}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} />
          {meeting.attendees.join(", ")}
        </span>
      </div>

      {meeting.prUrl && (
        <div className="flex items-center gap-1.5 text-xs text-brand-600 font-medium">
          <ExternalLink size={12} />
          <span>PR #{meeting.prNumber} 생성됨</span>
        </div>
      )}

      {meeting.status === "failed" && meeting.error && (
        <div className="text-xs text-red-600 mt-1">{meeting.error}</div>
      )}
    </Link>
  );
}
