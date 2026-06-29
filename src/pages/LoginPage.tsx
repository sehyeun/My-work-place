import { useNavigate } from "react-router-dom";
import { Mic, FileText, GitPullRequest } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center mb-4">
            <Mic size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">회의록 자동화</h1>
          <p className="text-sm text-slate-500">
            녹음하면 끝. 회의록과 PR까지 자동으로.
          </p>
        </div>

        <div className="space-y-3 mb-8">
          <Feature
            icon={<Mic size={16} />}
            text="노트북/휴대폰으로 바로 녹음"
          />
          <Feature
            icon={<FileText size={16} />}
            text="AI가 회의록 마크다운으로 정리"
          />
          <Feature
            icon={<GitPullRequest size={16} />}
            text="GitHub 리포에 PR로 자동 업로드"
          />
        </div>

        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-medium py-3 rounded-lg transition"
        >
          <GoogleIcon />
          Google 계정으로 시작하기
        </button>

        <p className="text-[11px] text-slate-400 text-center mt-4">
          로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-700">
      <div className="w-7 h-7 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <span>{text}</span>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}
