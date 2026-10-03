import React from 'react';
import {
  FileDown,
  Printer,
  Sparkles,
  Edit3,
  BarChart3,
  ShieldCheck,
  Users,
  Eye,
  CheckCircle,
} from 'lucide-react';
import { SKKNProject } from '../types';
import { exportToWordDocument } from '../utils/exportDocx';
import { exportToPowerPoint } from '../utils/exportPptx';
import { Key, Presentation } from 'lucide-react';

interface HeaderProps {
  project: SKKNProject;
  currentView: 'editor' | 'dataviz' | 'audit' | 'council' | 'preview';
  onChangeView: (view: 'editor' | 'dataviz' | 'audit' | 'council' | 'preview') => void;
  isAiPanelOpen: boolean;
  onToggleAiPanel: () => void;
  onOpenApiKeyModal: () => void;
  onSaveNotice?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  currentView,
  onChangeView,
  isAiPanelOpen,
  onToggleAiPanel,
  onOpenApiKeyModal,
}) => {
  const [downloadSuccess, setDownloadSuccess] = React.useState(false);
  const [downloadPptSuccess, setDownloadPptSuccess] = React.useState(false);

  const handleExportWord = () => {
    exportToWordDocument(project);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleExportPpt = () => {
    exportToPowerPoint(project);
    setDownloadPptSuccess(true);
    setTimeout(() => setDownloadPptSuccess(false), 3000);
  };

  return (
    <header className="h-16 px-6 bg-white/95 backdrop-blur-md border-b border-slate-200 flex items-center justify-between z-30 shrink-0 shadow-xs">
      {/* Left: Project title & Meta */}
      <div className="flex items-center gap-3 min-w-0 max-w-xl">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#FF6B00]/10 text-[#FF6B00] border border-[#FF6B00]/30 shrink-0">
              {project.subject} • {project.gradeLevel}
            </span>
            <span className="text-xs text-slate-400 font-medium truncate">
              {project.school} ({project.author})
            </span>
          </div>
          <h1 className="text-sm font-bold text-slate-800 truncate mt-0.5" title={project.title}>
            {project.title}
          </h1>
        </div>
      </div>

      {/* Center: Mode Tabs */}
      <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
        <button
          onClick={() => onChangeView('editor')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            currentView === 'editor'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5 text-[#FF6B00]" />
          <span>Soạn thảo</span>
        </button>

        <button
          onClick={() => onChangeView('dataviz')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            currentView === 'dataviz'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
          <span>Biểu đồ & Số liệu</span>
        </button>

        <button
          onClick={() => onChangeView('audit')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            currentView === 'audit'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>Thẩm định 100đ</span>
        </button>

        <button
          onClick={() => onChangeView('council')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            currentView === 'council'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-rose-500" />
          <span>Hội đồng phản biện</span>
        </button>

        <button
          onClick={() => onChangeView('preview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            currentView === 'preview'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-teal-600" />
          <span>Xem bản in A4</span>
        </button>
      </div>

      {/* Right: API Key, Export & Copilot Toggle */}
      <div className="flex items-center gap-2">
        {/* Nút API Key với cảnh báo chữ đỏ theo AI_INSTRUCTIONS.md */}
        <button
          onClick={onOpenApiKeyModal}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 transition shadow-xs group"
          title="Thiết lập Gemini API Key để kích hoạt AI"
        >
          <Key className="w-3.5 h-3.5 text-rose-600" />
          <span className="text-xs font-bold text-rose-600 group-hover:text-rose-700">
            Lấy API key để sử dụng app
          </span>
        </button>

        <div className="h-5 w-px bg-slate-200" />

        {/* Nút Xuất Slide Báo cáo PowerPoint */}
        <button
          onClick={handleExportPpt}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 text-xs font-semibold transition shadow-xs"
          title="Tự động tạo Slide báo cáo thuyết trình bảo vệ SKKN trước Hội đồng"
        >
          {downloadPptSuccess ? (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          ) : (
            <Presentation className="w-4 h-4 text-[#FF6B00]" />
          )}
          <span>{downloadPptSuccess ? 'Đã tải Slide!' : 'Xuất Slide (.pptx)'}</span>
        </button>

        {/* Nút Xuất Word */}
        <button
          onClick={handleExportWord}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition shadow-xs"
          title="Xuất file Word chuẩn thể thức Nghị định 30/2020/NĐ-CP"
        >
          {downloadSuccess ? (
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          ) : (
            <FileDown className="w-4 h-4 text-blue-600" />
          )}
          <span>{downloadSuccess ? 'Đã tải .DOC!' : 'Xuất Word (.doc)'}</span>
        </button>

        <button
          onClick={() => {
            onChangeView('preview');
            setTimeout(() => window.print(), 300);
          }}
          className="p-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition"
          title="In tài liệu hoặc xuất PDF"
        >
          <Printer className="w-4 h-4 text-slate-600" />
        </button>

        <div className="h-5 w-px bg-slate-200" />

        <button
          onClick={onToggleAiPanel}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
            isAiPanelOpen
              ? 'bg-gradient-to-r from-[#FF6B00] to-[#7C3AED] text-white shadow-orange-500/20'
              : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
          <span>Trợ Lý AI</span>
        </button>
      </div>
    </header>
  );
};
