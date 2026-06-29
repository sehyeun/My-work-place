import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ArrowLeft } from "lucide-react";
import RecordButton from "../components/RecordButton";
import Waveform from "../components/Waveform";
import { useMeetings } from "../mocks/MeetingsContext";
import { formatDuration } from "../mocks/meetings";

export default function RecordPage() {
  const navigate = useNavigate();
  const { addMeeting } = useMeetings();
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [title, setTitle] = useState("");
  const [attendees, setAttendees] = useState("");

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  const stopAndUpload = () => {
    const id = String(Date.now());
    addMeeting({
      id,
      title: title.trim() || "제목 없는 회의",
      date: new Date().toISOString(),
      durationSec: seconds,
      status: "transcribing",
      attendees: attendees
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      steps: [
        { key: "upload", label: "오디오 업로드", state: "done" },
        { key: "transcribe", label: "음성 → 텍스트 변환 (Whisper)", state: "in_progress" },
        { key: "summarize", label: "AI 요약 생성 (Claude)", state: "pending" },
        { key: "pr", label: "GitHub PR 생성", state: "pending" },
      ],
    });
    navigate(`/meetings/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-4"
      >
        <ArrowLeft size={14} /> 뒤로
      </button>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">새 회의 녹음</h1>
      <p className="text-sm text-slate-500 mb-6">
        녹음을 종료하면 자동으로 변환·요약·PR 생성이 진행됩니다.
      </p>

      <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              회의 제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 주간 스탠드업"
              disabled={recording}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              참석자 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              placeholder="김전현, 박지수, 이도현"
              disabled={recording}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:bg-slate-50"
            />
          </div>
        </div>

        <div className="flex flex-col items-center py-4">
          <Waveform active={recording} />
          <div className="text-3xl font-mono font-semibold text-slate-900 my-4 tabular-nums">
            {formatDuration(seconds)}
          </div>
          <RecordButton
            recording={recording}
            onClick={() => {
              if (recording) {
                stopAndUpload();
              } else {
                setSeconds(0);
                setRecording(true);
              }
            }}
          />
          <p className="text-xs text-slate-500 mt-4">
            {recording
              ? "녹음 중… 종료 버튼을 누르면 업로드됩니다."
              : "버튼을 눌러 녹음을 시작하세요."}
          </p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
        <Upload size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-900">
          <div className="font-semibold mb-0.5">파일 업로드로 시작하기</div>
          <div className="text-blue-800 mb-2">
            이미 녹음한 오디오 파일(.mp3, .m4a, .wav)이 있다면 업로드할 수 있습니다.
          </div>
          <button
            disabled
            className="text-xs bg-white border border-blue-300 text-blue-700 px-3 py-1 rounded opacity-60 cursor-not-allowed"
          >
            파일 선택 (목업 — 미구현)
          </button>
        </div>
      </div>
    </div>
  );
}
