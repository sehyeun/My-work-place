import { useState } from "react";
import { Github, Slack, Mail, Trash2, Check } from "lucide-react";

const MOCK_REPOS = [
  "team/meeting-notes",
  "team/engineering",
  "team/product",
  "team/customer-research",
];

export default function SettingsPage() {
  const [repo, setRepo] = useState("team/meeting-notes");
  const [branchPrefix, setBranchPrefix] = useState("meeting-notes/");
  const [folderPath, setFolderPath] = useState("docs/meetings");
  const [slackEnabled, setSlackEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [retention, setRetention] = useState("30");
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">설정</h1>
      <p className="text-sm text-slate-500 mb-6">
        회의록이 생성될 GitHub 리포와 알림 채널을 관리하세요.
      </p>

      {/* GitHub */}
      <Card title="GitHub 리포" icon={<Github size={16} />}>
        <Row label="회의록을 생성할 리포">
          <select
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {MOCK_REPOS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1.5">
            GitHub App이 설치된 리포만 표시됩니다.{" "}
            <a href="#" className="text-brand-600 hover:underline">
              다른 리포 연결하기
            </a>
          </p>
        </Row>

        <Row label="브랜치 prefix">
          <input
            type="text"
            value={branchPrefix}
            onChange={(e) => setBranchPrefix(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <p className="text-xs text-slate-500 mt-1.5">
            예: <code className="bg-slate-100 px-1 py-0.5 rounded">{branchPrefix}2026-05-20-standup</code>
          </p>
        </Row>

        <Row label="회의록 파일 경로">
          <input
            type="text"
            value={folderPath}
            onChange={(e) => setFolderPath(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <p className="text-xs text-slate-500 mt-1.5">
            예: <code className="bg-slate-100 px-1 py-0.5 rounded">{folderPath}/2026-05-20-standup.md</code>
          </p>
        </Row>
      </Card>

      {/* Notifications */}
      <Card title="알림" icon={<Slack size={16} />}>
        <Toggle
          icon={<Slack size={14} className="text-purple-600" />}
          label="Slack"
          desc="회의록 생성 완료 시 채널로 PR 링크를 보냅니다."
          enabled={slackEnabled}
          onToggle={() => setSlackEnabled(!slackEnabled)}
        />
        {slackEnabled && (
          <div className="ml-8 mt-2">
            <input
              type="text"
              placeholder="https://hooks.slack.com/services/..."
              defaultValue="https://hooks.slack.com/services/T0XXX/B0XXX/abcd1234"
              className="w-full px-3 py-1.5 border border-slate-300 rounded text-xs font-mono"
            />
          </div>
        )}
        <div className="border-t border-slate-100 my-3" />
        <Toggle
          icon={<Mail size={14} className="text-blue-600" />}
          label="이메일"
          desc="요약 완료 시 본인 이메일로 발송합니다."
          enabled={emailEnabled}
          onToggle={() => setEmailEnabled(!emailEnabled)}
        />
      </Card>

      {/* Data retention */}
      <Card title="데이터 보관" icon={<Trash2 size={16} />}>
        <Row label="원본 오디오 자동 삭제">
          <select
            value={retention}
            onChange={(e) => setRetention(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="7">7일 후 삭제</option>
            <option value="30">30일 후 삭제</option>
            <option value="90">90일 후 삭제</option>
            <option value="never">자동 삭제 안 함</option>
          </select>
          <p className="text-xs text-slate-500 mt-1.5">
            회의록(마크다운)은 GitHub에 영구 보관됩니다. 이 설정은 원본 음성 파일에만 적용됩니다.
          </p>
        </Row>
      </Card>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          className="bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition"
        >
          저장
        </button>
        {saved && (
          <span className="text-sm text-emerald-600 inline-flex items-center gap-1">
            <Check size={14} /> 저장되었습니다
          </span>
        )}
      </div>
    </div>
  );
}

function Card({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 mb-5">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <span className="text-slate-500">{icon}</span>
        <h2 className="font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({
  icon,
  label,
  desc,
  enabled,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <div className="text-sm font-medium text-slate-900">{label}</div>
          <div className="text-xs text-slate-500">{desc}</div>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-10 h-6 rounded-full transition shrink-0 ${
          enabled ? "bg-brand-600" : "bg-slate-300"
        }`}
        aria-label={`${label} ${enabled ? "off" : "on"}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition ${
            enabled ? "left-[18px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
