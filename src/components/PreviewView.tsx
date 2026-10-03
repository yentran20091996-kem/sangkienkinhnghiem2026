import React from 'react';
import { Printer, FileDown, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { SKKNProject } from '../types';
import { exportToWordDocument } from '../utils/exportDocx';

interface PreviewViewProps {
  project: SKKNProject;
  onBackToEditor: () => void;
}

export const PreviewView: React.FC<PreviewViewProps> = ({
  project,
  onBackToEditor,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportDoc = () => {
    exportToWordDocument(project);
  };

  const sectionsList = Object.values(project.sections);

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-200/80">
      {/* Action Bar (Hidden on print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={onBackToEditor}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Soạn thảo</span>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportDoc}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 text-blue-600 hover:bg-slate-50 font-bold text-xs transition shadow-xs"
          >
            <FileDown className="w-4 h-4" />
            <span>Tải file Word (.doc)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-xs transition shadow-md shadow-orange-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>In tài liệu (A4)</span>
          </button>
        </div>
      </div>

      {/* Simulated A4 Document Container */}
      <div className="max-w-4xl mx-auto space-y-8 print:space-y-0">
        {/* TRANG BÌA CHÍNH (COVER PAGE) */}
        <div className="bg-white p-12 lg:p-16 rounded-2xl shadow-xl border border-slate-300 min-h-[1100px] flex flex-col justify-between text-slate-900 font-serif print:shadow-none print:border-none print:p-0 print:rounded-none">
          {/* Border Frame */}
          <div className="border-4 border-double border-slate-900 p-8 h-full flex flex-col justify-between">
            {/* Header Authority */}
            <div className="text-center space-y-1">
              <div className="text-sm font-bold uppercase tracking-wider">
                {project.province || 'SỞ GIÁO DỤC VÀ ĐÀO TẠO ĐÀ NẴNG'}
              </div>
              <div className="text-base font-extrabold uppercase">
                {project.school || 'TRƯỜNG THPT CHUYÊN LÊ QUÝ ĐÔN'}
              </div>
            </div>

            {/* Title Section */}
            <div className="my-12 text-center space-y-6">
              <div className="text-sm font-bold uppercase tracking-widest text-slate-600">
                BÁO CÁO KẾT QUẢ NGHIÊN CỨU, ỨNG DỤNG
              </div>
              <div className="text-3xl font-black uppercase text-slate-950 tracking-tight leading-tight">
                SÁNG KIẾN KINH NGHIỆM
              </div>

              <div className="border-t-2 border-b-2 border-slate-900 py-6 px-4">
                <h1 className="text-xl font-bold uppercase leading-relaxed text-slate-900">
                  {project.title}
                </h1>
              </div>
            </div>

            {/* Author details */}
            <div className="space-y-2 text-sm max-w-md mx-auto pl-8">
              <p><strong>Lĩnh vực áp dụng:</strong> {project.subject}</p>
              <p><strong>Cấp học / Khối lớp:</strong> {project.gradeLevel}</p>
              <p><strong>Tác giả sáng kiến:</strong> {project.author}</p>
              <p><strong>Chức vụ / Học hàm:</strong> {project.authorTitle}</p>
              <p><strong>Đơn vị công tác:</strong> {project.school}</p>
            </div>

            {/* Footer Year */}
            <div className="text-center font-bold text-sm tracking-widest mt-12">
              NĂM HỌC {project.academicYear || '2025 - 2026'}
            </div>
          </div>
        </div>

        {/* NỘI DUNG VĂN BẢN (BODY PAGES) */}
        <div className="bg-white p-12 lg:p-16 rounded-2xl shadow-xl border border-slate-300 text-slate-900 font-serif leading-relaxed text-justify print:shadow-none print:border-none print:p-0 print:rounded-none">
          {/* National Header */}
          <div className="text-center mb-8 pb-4">
            <div className="font-bold text-sm uppercase">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div className="font-bold text-sm">
              <span className="border-b border-slate-900 pb-0.5">Độc lập - Tự do - Hạnh phúc</span>
            </div>
          </div>

          <h2 className="text-center text-lg font-black uppercase mb-8">
            BẢN THUYẾT MINH MÔ TẢ SÁNG KIẾN KINH NGHIỆM
          </h2>

          {/* Sections Render */}
          <div className="space-y-8">
            {sectionsList.map((sec, idx) => (
              <div key={sec.id} className="space-y-3">
                <h3 className="text-base font-bold uppercase text-slate-950 border-b border-slate-400 pb-1 pt-4">
                  {sec.title}
                </h3>
                <div
                  className="text-sm leading-relaxed whitespace-pre-line text-slate-800"
                  dangerouslySetInnerHTML={{
                    __html: sec.content
                      .replace(/^### (.*$)/gim, '<h4 class="font-bold text-slate-900 mt-3 mb-1 text-sm">$1</h4>')
                      .replace(/^## (.*$)/gim, '<h3 class="font-bold uppercase text-slate-950 mt-4 mb-2 text-sm">$1</h3>')
                      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/gim, '<em>$1</em>'),
                  }}
                />
              </div>
            ))}
          </div>

          {/* Signature Block */}
          <div className="mt-16 pt-8 border-t border-slate-300">
            <div className="grid grid-cols-2 text-center text-sm">
              <div className="space-y-1">
                <strong>XÁC NHẬN CỦA BAN GIÁM HIỆU</strong>
                <p className="text-xs italic">(Ký, đóng dấu)</p>
                <div className="h-28" />
                <p className="font-bold">....................................................</p>
              </div>

              <div className="space-y-1">
                <p className="italic text-xs">
                  {project.province || 'Đà Nẵng'}, ngày ...... tháng ...... năm 2026
                </p>
                <strong>TÁC GIẢ SÁNG KIẾN</strong>
                <p className="text-xs italic">(Ký và ghi rõ họ tên)</p>
                <div className="h-28" />
                <p className="font-bold">{project.author}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
