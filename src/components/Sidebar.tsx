import React from 'react';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  Circle,
  Database,
  Award,
  BookOpen,
  PlusCircle,
  ChevronDown,
  Layers,
  FolderOpen,
} from 'lucide-react';
import { SKKNProject, SectionKey } from '../types';

interface SidebarProps {
  currentProject: SKKNProject;
  projects: SKKNProject[];
  onSelectProject: (proj: SKKNProject) => void;
  onNewProject: () => void;
  activeSectionKey: SectionKey;
  onSelectSection: (key: SectionKey) => void;
  onOpenRAG: () => void;
  currentView: 'editor' | 'dataviz' | 'audit' | 'council' | 'preview';
  onChangeView: (view: 'editor' | 'dataviz' | 'audit' | 'council' | 'preview') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentProject,
  projects,
  onSelectProject,
  onNewProject,
  activeSectionKey,
  onSelectSection,
  onOpenRAG,
  currentView,
  onChangeView,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  // Calculate completion percentage
  const sectionKeys: SectionKey[] = [
    'overview',
    'problem',
    'current_situation',
    'solutions',
    'experiment',
    'conclusion',
    'defense',
  ];

  const completedCount = sectionKeys.filter(
    (k) => currentProject.sections[k]?.isCompleted
  ).length;
  const progressPercent = Math.round((completedCount / sectionKeys.length) * 100);

  const steps: { key: SectionKey; label: string; number: string; icon: string }[] = [
    { key: 'overview', number: '01', label: 'Tổng quan & Hồ sơ', icon: '📋' },
    { key: 'problem', number: '02', label: 'Đặt vấn đề & Lý do', icon: '🎯' },
    { key: 'current_situation', number: '03', label: 'Thực trạng & Khảo sát', icon: '📊' },
    { key: 'solutions', number: '04', label: 'Giải pháp & Biện pháp', icon: '💡' },
    { key: 'experiment', number: '05', label: 'Thực nghiệm & Số liệu', icon: '🧪' },
    { key: 'conclusion', number: '06', label: 'Kết luận & Nhân rộng', icon: '🏁' },
    { key: 'defense', number: '07', label: 'Thẩm định & Phản biện', icon: '⚖️' },
  ];

  return (
    <aside className="w-[280px] shrink-0 h-screen bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shadow-xl select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B00] via-orange-500 to-[#7C3AED] flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight text-white">SKKN 2026</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#FF6B00] text-white tracking-wide">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Trợ Lý Sư Phạm AI Cao Cấp</p>
          </div>
        </div>
      </div>

      {/* Project Switcher */}
      <div className="p-3 border-b border-slate-800">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full text-left p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/60 transition flex items-center justify-between group"
          >
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                <span className="text-[11px] text-slate-400 font-medium truncate">Đề tài đang mở</span>
              </div>
              <p className="text-xs font-semibold text-slate-200 truncate mt-0.5 group-hover:text-white">
                {currentProject.title}
              </p>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 p-1.5 space-y-1">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1">
                Danh sách đề tài SKKN
              </div>
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProject(p);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs transition flex items-center justify-between ${
                    p.id === currentProject.id
                      ? 'bg-[#FF6B00]/20 text-[#FF6B00] font-semibold'
                      : 'text-slate-300 hover:bg-slate-700/70'
                  }`}
                >
                  <span className="truncate pr-2">{p.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 shrink-0">
                    {p.subject}
                  </span>
                </button>
              ))}
              <div className="pt-1 border-t border-slate-700/70">
                <button
                  onClick={() => {
                    onNewProject();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-semibold text-[#FF6B00] hover:bg-[#FF6B00]/10 transition flex items-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Tạo đề tài mới 2026</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mt-3 px-1">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-slate-400 font-medium">Tiến độ hồ sơ</span>
            <span className="font-bold text-[#FF6B00]">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#FF6B00] to-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Award className="w-3 h-3 text-amber-400" />
              {currentProject.auditResult?.estimatedPrize?.split('(')[0] || 'Dự kiến: Đạt loại A'}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/50">
              Năm 2026
            </span>
          </div>
        </div>
      </div>

      {/* Stepper Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1 flex items-center justify-between">
          <span>Quy trình 7 bước</span>
          <span className="text-[10px] lowercase text-slate-400 font-normal">
            {completedCount}/7 mục
          </span>
        </div>

        {steps.map((step) => {
          const isCurrent = activeSectionKey === step.key && currentView === 'editor';
          const isDone = currentProject.sections[step.key]?.isCompleted;
          const wordCount = currentProject.sections[step.key]?.wordCount || 0;

          return (
            <button
              key={step.key}
              onClick={() => {
                onSelectSection(step.key);
                if (step.key === 'defense') {
                  onChangeView('council');
                } else if (step.key === 'experiment' && currentView !== 'editor') {
                  onChangeView('dataviz');
                } else {
                  onChangeView('editor');
                }
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl transition flex items-center justify-between group relative ${
                isCurrent
                  ? 'bg-gradient-to-r from-[#FF6B00] to-orange-600 text-white font-semibold shadow-md shadow-orange-600/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base">{step.icon}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold ${
                        isCurrent ? 'text-orange-200' : 'text-slate-400'
                      }`}
                    >
                      {step.number}
                    </span>
                    <span className="text-xs truncate font-medium">{step.label}</span>
                  </div>
                  <div
                    className={`text-[10px] truncate ${
                      isCurrent ? 'text-orange-100' : 'text-slate-400'
                    }`}
                  >
                    {wordCount > 0 ? `${wordCount} từ` : 'Chưa nhập'}
                  </div>
                </div>
              </div>

              {isDone ? (
                <CheckCircle2
                  className={`w-4 h-4 shrink-0 ${isCurrent ? 'text-white' : 'text-emerald-400'}`}
                />
              ) : (
                <Circle
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isCurrent ? 'text-orange-200' : 'text-slate-600'
                  }`}
                />
              )}
            </button>
          );
        })}

        {/* Separator */}
        <div className="pt-3 pb-1">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-2 py-1">
            Không gian làm việc
          </div>
        </div>

        {/* View Switchers */}
        <button
          onClick={() => onChangeView('dataviz')}
          className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center gap-2.5 text-xs font-medium ${
            currentView === 'dataviz'
              ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-600/20'
              : 'text-slate-300 hover:bg-slate-800/80'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400" />
          <span>Biểu đồ & Kiểm định T-test</span>
        </button>

        <button
          onClick={() => onChangeView('audit')}
          className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center gap-2.5 text-xs font-medium ${
            currentView === 'audit'
              ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-600/20'
              : 'text-slate-300 hover:bg-slate-800/80'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Thẩm định Điểm 100 & Tính mới</span>
        </button>

        <button
          onClick={() => onChangeView('council')}
          className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center gap-2.5 text-xs font-medium ${
            currentView === 'council'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
              : 'text-slate-300 hover:bg-slate-800/80'
          }`}
        >
          <BookOpen className="w-4 h-4 text-rose-400" />
          <span>Hội đồng Phản biện ảo (3 Giám khảo)</span>
        </button>
      </div>

      {/* Footer: RAG Knowledge Base trigger */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90 space-y-2">
        <button
          onClick={onOpenRAG}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-slate-800 to-slate-800 hover:from-purple-900/40 hover:to-slate-800 border border-purple-500/30 text-purple-200 text-xs font-medium transition flex items-center justify-between group shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
            <div className="text-left">
              <div className="font-semibold text-white">Tủ Công văn & RAG</div>
              <div className="text-[10px] text-purple-300/80">
                {(currentProject.ragDocuments || []).filter((d) => d.isActive).length} văn bản đang áp dụng
              </div>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        <div className="flex items-center justify-between px-1 text-[10px] text-slate-400">
          <span>Chuẩn GDPT 2018</span>
          <span className="text-slate-400">v2.6 Pro</span>
        </div>
      </div>
    </aside>
  );
};
