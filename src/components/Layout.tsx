import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Mic, Settings, LogOut, Github } from "lucide-react";

export default function Layout() {
  const navigate = useNavigate();

  const navItem = (to: string, icon: React.ReactNode, label: string) => (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
          isActive
            ? "bg-brand-600 text-white"
            : "text-slate-700 hover:bg-slate-100"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:flex-col w-60 border-r border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2 px-2 py-3 mb-4">
          <div className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">
            M
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900">회의록 자동화</div>
            <div className="text-xs text-slate-500">Meeting Notes Bot</div>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {navItem("/", <LayoutDashboard size={18} />, "대시보드")}
          {navItem("/record", <Mic size={18} />, "새 회의 녹음")}
          {navItem("/settings", <Settings size={18} />, "설정")}
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center text-xs font-semibold text-slate-700">
              김
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-900 truncate">김전현</div>
              <div className="text-xs text-slate-500 truncate">jh.kim@team.com</div>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="p-1.5 rounded hover:bg-slate-100 text-slate-500"
              title="로그아웃"
            >
              <LogOut size={16} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-slate-500">
            <Github size={12} />
            <span className="truncate">team/meeting-notes</span>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold text-sm">
            M
          </div>
          <span className="font-bold text-slate-900">회의록 자동화</span>
        </div>
        <button
          onClick={() => navigate("/settings")}
          className="p-2 rounded hover:bg-slate-100 text-slate-600"
        >
          <Settings size={18} />
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 flex z-10">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-2.5 text-xs ${
              isActive ? "text-brand-600" : "text-slate-500"
            }`
          }
        >
          <LayoutDashboard size={20} />
          <span className="mt-0.5">목록</span>
        </NavLink>
        <NavLink
          to="/record"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-2.5 text-xs ${
              isActive ? "text-brand-600" : "text-slate-500"
            }`
          }
        >
          <Mic size={20} />
          <span className="mt-0.5">녹음</span>
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-2.5 text-xs ${
              isActive ? "text-brand-600" : "text-slate-500"
            }`
          }
        >
          <Settings size={20} />
          <span className="mt-0.5">설정</span>
        </NavLink>
      </nav>
    </div>
  );
}
