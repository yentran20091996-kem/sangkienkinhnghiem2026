import React, { useState } from 'react';
import {
  Award,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  HelpCircle,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SKKNProject, AuditResult } from '../types';

import { auditProjectAI } from '../utils/geminiService';

interface AuditViewProps {
  project: SKKNProject;
  onUpdateAuditResult: (result: AuditResult) => void;
  onGoToSection: (sectionKey: any) => void;
  onOpenRAG?: () => void;
}

export const AuditView: React.FC<AuditViewProps> = ({
  project,
  onUpdateAuditResult,
  onGoToSection,
  onOpenRAG,
}) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);
  const audit = project.auditResult;

  const handleRunAudit = async () => {
    setIsAuditing(true);
    setAuditError(null);
    setFallbackNotice(null);

    try {
      const data = await auditProjectAI({
        project: {
          title: project.title,
          subject: project.subject,
          gradeLevel: project.gradeLevel,
          author: project.author,
          school: project.school,
          sections: Object.fromEntries(
            Object.entries(project.sections).map(([k, v]) => [k, v.content.slice(0, 1500)])
          ),
        },
        ragDocuments: project.ragDocuments,
        onModelSwitch: (model) => {
          setFallbackNotice(`Đang thử lại với mô hình dự phòng: ${model}...`);
        },
      });

      onUpdateAuditResult(data);
      setFallbackNotice(null);

      if (data.totalScore >= 88) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      console.error('Audit failed:', err);
      setAuditError(err.message || 'Lỗi không xác định khi chấm điểm bài viết');
      setFallbackNotice(null);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-100/70">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Hero */}
        <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-6 lg:p-8 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF6B00] text-white">
                Bộ Tiêu Chí 100 Điểm
              </span>
              <span className="text-xs text-purple-200">Chuẩn Hội đồng Khoa học Ngành GD&ĐT 2026</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Báo Cáo Thẩm Định & Dự Báo Giải Thưởng
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Hệ thống AI đối chiếu toàn bộ nội dung đề tài với chuẩn GDPT 2018, quy chế xét duyệt sáng kiến và cơ sở dữ liệu các SKKN đã đạt giải cao.
            </p>
          </div>

          <button
            disabled={isAuditing}
            onClick={handleRunAudit}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white font-bold text-sm shadow-xl shadow-orange-500/30 transition shrink-0"
          >
            {isAuditing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-200" />
            )}
            <span>{isAuditing ? 'AI Đang chấm bài...' : 'Khởi chạy thẩm định AI'}</span>
          </button>
        </div>

        {/* Banner Công văn / Biểu điểm RAG đang áp dụng */}
        {(() => {
          const activeDocs = project.ragDocuments.filter((d) => d.isActive);
          const activeRubric = activeDocs.find((d) => d.type === 'rubric') || activeDocs[0];
          return (
            <div className="bg-white rounded-2xl p-4 border border-purple-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      Barem Thẩm Định AI
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {activeRubric ? activeRubric.source : 'Hội đồng Khoa học Ngành GD&ĐT'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                    {activeRubric ? activeRubric.title : 'Quy chế Thẩm định & Chấm điểm Sáng kiến (Thang 100 điểm chuẩn)'}
                  </h4>
                </div>
              </div>

              {onOpenRAG && (
                <button
                  onClick={onOpenRAG}
                  className="shrink-0 px-3 py-1.5 rounded-xl border border-purple-300 text-purple-700 hover:bg-purple-50 font-bold text-xs transition"
                >
                  + Tải công văn / Barem Sở khác
                </button>
              )}
            </div>
          );
        })()}

        {/* Thông báo Fallback Model */}
        {fallbackNotice && (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />
            <span>{fallbackNotice}</span>
          </div>
        )}

        {/* Thông báo Lỗi Đỏ Nguyên Văn Từ API theo AI_INSTRUCTIONS */}
        {auditError && (
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1 min-w-0">
                <div className="font-bold text-sm text-rose-950 flex items-center gap-2">
                  <span>Quy trình thẩm định đã dừng do lỗi</span>
                  <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-800 text-[10px] font-mono">
                    Google API Error
                  </span>
                </div>
                <p className="font-mono text-xs text-rose-800 break-all">{auditError}</p>
                <p className="text-[11px] text-rose-600 mt-1">
                  Vui lòng kiểm tra lại API Key hoặc đổi sang key khác bằng nút "Lấy API key để sử dụng app" trên Header.
                </p>
              </div>
            </div>
            <button
              onClick={() => setAuditError(null)}
              className="text-xs font-semibold text-rose-500 hover:text-rose-800 px-2 py-1 rounded"
            >
              Đóng
            </button>
          </div>
        )}

        {audit ? (
          <>
            {/* Top Score summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Total Score */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500">Tổng điểm quy đổi</span>
                <div className="my-2 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900">{audit.totalScore}</span>
                  <span className="text-sm font-bold text-slate-400">/ 100</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{audit.totalScore >= 90 ? 'Xếp loại: Xuất sắc' : 'Xếp loại: Khá - Tốt'}</span>
                </div>
              </div>

              {/* Prize Probability */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-semibold text-amber-800">Dự báo Giải thưởng</span>
                <div className="my-2">
                  <div className="text-lg font-black text-amber-900 leading-tight">
                    {audit.estimatedPrize}
                  </div>
                </div>
                <span className="text-[11px] text-amber-700 font-medium">
                  Cơ sở: Cấp Tỉnh / TP trực thuộc TW
                </span>
              </div>

              {/* Novelty Score */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500">Tính mới & Sáng tạo</span>
                <div className="my-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#FF6B00]">{audit.noveltyScore}</span>
                  <span className="text-xs font-bold text-slate-400">/ 30 điểm</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-[#FF6B00] h-full rounded-full"
                    style={{ width: `${(audit.noveltyScore / 30) * 100}%` }}
                  />
                </div>
              </div>

              {/* Practicality Score */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
                <span className="text-xs font-semibold text-slate-500">Hiệu quả thực tiễn</span>
                <div className="my-2 flex items-baseline gap-1">
                  <span className="text-3xl font-black text-purple-700">{audit.practicalScore}</span>
                  <span className="text-xs font-bold text-slate-400">/ 30 điểm</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-purple-600 h-full rounded-full"
                    style={{ width: `${(audit.practicalScore / 30) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Rubric Breakdown by 4 criteria */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base">
                Chi Tiết Bảng Điểm 4 Tiêu Chuẩn Thẩm Định
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Novelty */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800">1. Tính mới và sáng tạo (Tối đa 30đ)</span>
                    <span className="text-[#FF6B00] font-black">{audit.noveltyScore}/30 đ</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {audit.noveltyEvaluation}
                  </p>
                </div>

                {/* 2. Scientific */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800">2. Tính khoa học & sư phạm (Tối đa 25đ)</span>
                    <span className="text-purple-700 font-black">{audit.academicScore}/25 đ</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Cơ sở pháp lý chuẩn Thông tư 32/2018, văn phong sư phạm khúc chiết, tính liên hoàn giữa các giải pháp.
                  </p>
                </div>

                {/* 3. Practical */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800">3. Hiệu quả thực tiễn (Tối đa 30đ)</span>
                    <span className="text-emerald-700 font-black">{audit.practicalScore}/30 đ</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Số liệu thực nghiệm rõ ràng, có đối chứng hai nhóm tương đương và kiểm định p-value có ý nghĩa thống kê.
                  </p>
                </div>

                {/* 4. Presentation */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800">4. Nhân rộng & Thể thức (Tối đa 15đ)</span>
                    <span className="text-blue-700 font-black">{audit.presentationScore}/15 đ</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Trình bày theo thể thức văn bản Nghị định 30, dễ phổ biến và chuyển giao cho các trường bạn.
                  </p>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-3xl p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-emerald-950 text-sm">
                    Điểm Mạnh Nổi Bật Của Đề Tài
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-emerald-900">
                  {audit.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-amber-50/50 border border-amber-200 rounded-3xl p-6 shadow-xs">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h4 className="font-bold text-amber-950 text-sm">
                    Điểm Cần Bổ Sung & Khắc Phục
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-amber-900">
                  {audit.weaknesses.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations & Strategy */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-[#FF6B00]" />
                <h4 className="font-bold text-slate-900 text-sm">
                  Chiến Lược Hoàn Thiện Để Đạt Điểm Tối Đa (100đ)
                </h4>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-orange-50/40 p-4 rounded-2xl border border-orange-200/50">
                {audit.recommendations}
              </p>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
            <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-base">Chưa có kết quả thẩm định gần nhất</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Nhấn nút "Khởi chạy thẩm định AI" ở trên để hệ thống quét toàn diện đề tài theo chuẩn 100 điểm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
