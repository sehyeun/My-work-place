import { Mic, Square } from "lucide-react";

type Props = {
  recording: boolean;
  onClick: () => void;
};

export default function RecordButton({ recording, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-24 h-24 rounded-full flex items-center justify-center text-white transition ${
        recording
          ? "bg-red-500 animate-pulse-record"
          : "bg-brand-600 hover:bg-brand-700"
      }`}
      aria-label={recording ? "녹음 종료" : "녹음 시작"}
    >
      {recording ? <Square size={36} fill="white" /> : <Mic size={36} />}
    </button>
  );
}
