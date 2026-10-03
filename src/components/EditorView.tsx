import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle,
  Table,
  FileCode,
  BookMarked,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  Quote,
  RefreshCw,
  Lightbulb,
  Maximize2,
  Eye,
  Edit2,
  ShieldCheck,
} from 'lucide-react';
import { SKKNProject, SectionKey } from '../types';
import { Database, AlertTriangle, AlertCircle } from 'lucide-react';
import { generateSectionAI } from '../utils/geminiService';

interface EditorViewProps {
  project: SKKNProject;
  activeSectionKey: SectionKey;
  onUpdateSectionContent: (key: SectionKey, content: string, isCompleted: boolean) => void;
  onTriggerAiCopilot: (prompt: string) => void;
  onOpenRAG?: () => void;
  isGenerating?: boolean;
}

export const EditorView: React.FC<EditorViewProps> = ({
  project,
  activeSectionKey,
  onUpdateSectionContent,
  onTriggerAiCopilot,
  onOpenRAG,
}) => {
  const section = project.sections[activeSectionKey];
  const [content, setContent] = useState(section?.content || '');
  const [isCompleted, setIsCompleted] = useState(section?.isCompleted || false);
  const [viewTab, setViewTab] = useState<'write' | 'preview'>('write');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);

  // Sync state if active section changes
  React.useEffect(() => {
    setContent(section?.content || '');
    setIsCompleted(section?.isCompleted || false);
  }, [activeSectionKey, section]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    onUpdateSectionContent(activeSectionKey, val, isCompleted);
  };

  const handleToggleComplete = () => {
    const nextVal = !isCompleted;
    setIsCompleted(nextVal);
    onUpdateSectionContent(activeSectionKey, content, nextVal);
  };

  // Quick insertion helpers
  const insertText = (template: string) => {
    const updated = content + '\n\n' + template;
    setContent(updated);
    onUpdateSectionContent(activeSectionKey, updated, isCompleted);
  };

  // AI Direct Generation for this section
  const handleAiGenerate = async (customInstruction?: string) => {
    setIsAiLoading(true);
    setAiError(null);
    setFallbackNotice(null);

    try {
      const activeDocs = project.ragDocuments.filter((d) => d.isActive);
      const ragKnowledge = activeDocs
        .map((d) => {
          let str = `[${d.title}] (Nguồn: ${d.source}):\n` + d.rules.join('\n');
          if (d.scoringCriteria && d.scoringCriteria.length > 0) {
            str += '\nBarem điểm: ' + d.scoringCriteria.map((c) => `${c.category} (${c.maxScore}đ)`).join(', ');
          }
          return str;
        })
        .join('\n\n');

      const generatedText = await generateSectionAI({
        projectTitle: project.title,
        subject: project.subject,
        gradeLevel: project.gradeLevel,
        sectionId: activeSectionKey,
        sectionTitle: section.title,
        userPrompt: customInstruction || aiCustomPrompt || 'Viết chi tiết, chuẩn học thuật GDPT 2018',
        context: content.slice(0, 1500),
        ragKnowledge: ragKnowledge || 'Áp dụng khung đánh giá chuẩn SKKN 100 điểm GDPT 2018.',
        onModelSwitch: (model) => {
          setFallbackNotice(`Đang tự động chuyển sang mô hình dự phòng: ${model}...`);
        },
      });

      if (generatedText) {
        const newText = content.trim() ? content + '\n\n' + generatedText : generatedText;
        setContent(newText);
        onUpdateSectionContent(activeSectionKey, newText, isCompleted);
        setShowPromptInput(false);
        setAiCustomPrompt('');
        setFallbackNotice(null);
      }
    } catch (err: any) {
      console.error('Error generating section:', err);
      // Hiển thị nguyên văn lỗi từ Google API (VD: 429 RESOURCE_EXHAUSTED) theo AI_INSTRUCTIONS.md
      setAiError(err.message || 'Lỗi không xác định từ máy chủ AI');
      setFallbackNotice(null);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Format statistics
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;
  const readTimeMinutes = Math.max(1, Math.round(wordCount / 180));

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-slate-100/70 p-4 lg:p-6">
      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Section Top Header & Guidelines */}
        <div className="px-6 py-4 border-b border-slate-200/90 bg-gradient-to-r from-slate-50 via-white to-orange-50/20">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FF6B00]/10 text-[#FF6B00]">
                  Bước {section.id === 'overview' ? '1' : section.id === 'problem' ? '2' : section.id === 'current_situation' ? '3' : section.id === 'solutions' ? '4' : section.id === 'experiment' ? '5' : section.id === 'conclusion' ? '6' : '7'} / 7
                </span>
                <span className="text-xs text-slate-500 font-medium">Tiêu chuẩn SKKN 2026</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{section.title}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{section.subtitle}</p>
            </div>

            {/* Completion Status & View Switch */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleComplete}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CheckCircle className={`w-4 h-4 ${isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{isCompleted ? 'Đã hoàn thành' : 'Đánh dấu xong'}</span>
              </button>

              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  onClick={() => setViewTab('write')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition ${
                    viewTab === 'write' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Soạn thảo</span>
                </button>
                <button
                  onClick={() => setViewTab('preview')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-medium transition ${
                    viewTab === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem định dạng</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Guidelines Carousel */}
          {section.guidelines && section.guidelines.length > 0 && (
            <div className="mt-3 bg-amber-50/60 border border-amber-200/60 rounded-xl p-2.5 flex items-start gap-2 text-xs text-amber-900">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold text-amber-950">Lưu ý chuyên môn: </span>
                <span>{section.guidelines.join(' • ')}</span>
              </div>
            </div>
          )}

          {/* RAG Knowledge Base Indicator Banner */}
          {(() => {
            const activeDocs = project.ragDocuments.filter((d) => d.isActive);
            return (
              <div className="mt-2 bg-gradient-to-r from-purple-50/90 to-indigo-50/70 border border-purple-200/80 rounded-xl p-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Database className="w-4 h-4 text-purple-600 shrink-0" />
                  <div className="min-w-0 truncate">
                    <span className="font-bold text-purple-950">Kim chỉ nam AI: </span>
                    <span className="text-purple-900 font-medium">
                      Đang bám sát {activeDocs.length} công văn & tiêu chí chấm điểm
                    </span>
                    {activeDocs.length > 0 && (
                      <span className="text-purple-600 ml-1 truncate">
                        (Ưu tiên: "{activeDocs[0].title}")
                      </span>
                    )}
                  </div>
                </div>

                {onOpenRAG && (
                  <button
                    onClick={onOpenRAG}
                    className="shrink-0 px-2.5 py-1 rounded-lg bg-white border border-purple-200 text-purple-700 hover:bg-purple-100 font-bold text-[11px] transition shadow-2xs"
                  >
                    + Nạp thêm tệp Word/PDF
                  </button>
                )}
              </div>
            );
          })()}
        </div>

        {/* Toolbar & AI Action Bar */}
        <div className="px-6 py-2.5 border-b border-slate-200/80 bg-slate-50/70 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Thông báo Fallback Model */}
          {fallbackNotice && (
            <div className="w-full mb-1.5 p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
              <span>{fallbackNotice}</span>
            </div>
          )}

          {/* Thông báo Lỗi Đỏ Nguyên Văn Từ API theo AI_INSTRUCTIONS */}
          {aiError && (
            <div className="w-full mb-2 p-3 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 min-w-0">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 min-w-0">
                  <div className="font-bold text-rose-950 flex items-center gap-1.5">
                    <span>Đã dừng do lỗi</span>
                    <span className="px-1.5 py-0.2 rounded bg-rose-200 text-rose-800 text-[10px] font-mono">Lỗi API</span>
                  </div>
                  <p className="font-mono text-[11px] text-rose-800 break-all">{aiError}</p>
                </div>
              </div>
              <button
                onClick={() => setAiError(null)}
                className="text-xs font-semibold text-rose-500 hover:text-rose-800 px-2 py-1 rounded"
              >
                Đóng
              </button>
            </div>
          )}
          {/* Markdown Format Shortcuts */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => insertText('**In đậm văn bản**')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 font-bold"
              title="In đậm"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertText('*In nghiêng chú thích*')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600"
              title="In nghiêng"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertText('### 1.1. Tiểu mục nội dung')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 font-semibold"
              title="Tiêu đề mục (Heading 2)"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertText('#### a. Chi tiết biện pháp')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600"
              title="Tiểu mục con (Heading 3)"
            >
              <Heading3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertText('- Điểm 1\n- Điểm 2\n- Điểm 3')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600"
              title="Danh sách gạch đầu dòng"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertText('> "Trích dẫn nguyên văn văn bản chỉ đạo của Bộ/Sở GD&ĐT..."')}
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600"
              title="Trích dẫn"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <div className="h-4 w-px bg-slate-300 mx-1" />

            {/* Quick Templates: Tables, Lesson plans, etc. */}
            <button
              onClick={() =>
                insertText(
                  `| Tiêu chí so sánh | Nhóm Đối chứng | Nhóm Thực nghiệm |\n|---|---|---|\n| Tỷ lệ chuyên cần (%) | 85.0% | 98.2% |\n| Năng lực tự học đạt Giỏi | 22.5% | 55.0% |\n| Điểm trung bình môn | 7.10 | 8.35 |`
                )
              }
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
            >
              <Table className="w-3.5 h-3.5 text-blue-500" />
              <span>Chèn bảng số liệu</span>
            </button>

            <button
              onClick={() =>
                insertText(
                  `### KẾ HOẠCH BÀI DẠY MINH HỌA (THEO CÔNG VĂN 5512/BGDĐT-GDTrH)\n**Tên bài học:** ...................................\n**1. Mục tiêu bài học:** Năng lực ngôn ngữ, năng lực giải quyết vấn đề và phẩm chất chăm chỉ.\n**2. Thiết bị dạy học và học liệu số:** Màn hình tương tác, Padlet, Phiếu học tập số.\n**3. Tiến trình dạy học 4 hoạt động:**\n- *Hoạt động 1 (Khởi động - 7 phút):* Khơi gợi hứng thú bằng thử thách câu lệnh AI.\n- *Hoạt động 2 (Hình thành kiến thức - 18 phút):* Khám phá văn bản theo nhóm chuyên gia.\n- *Hoạt động 3 (Luyện tập - 12 phút):* Thực hành phản biện so sánh.\n- *Hoạt động 4 (Vận dụng - 8 phút):* Sáng tạo sản phẩm học tập đa phương tiện.`
                )
              }
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-medium"
            >
              <BookMarked className="w-3.5 h-3.5 text-emerald-500" />
              <span>Mẫu Giáo án 5512</span>
            </button>
          </div>

          {/* AI Trigger Direct Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPromptInput(!showPromptInput)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#7C3AED] hover:opacity-95 text-white font-semibold transition shadow-xs"
            >
              {isAiLoading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span>{isAiLoading ? 'AI Đang soạn...' : 'AI Viết chuyên sâu'}</span>
            </button>
          </div>
        </div>

        {/* AI Prompt Input Bar (Expandable) */}
        {showPromptInput && (
          <div className="p-3 bg-gradient-to-r from-orange-50 via-purple-50 to-white border-b border-orange-200/80 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF6B00] shrink-0" />
            <input
              type="text"
              value={aiCustomPrompt}
              onChange={(e) => setAiCustomPrompt(e.target.value)}
              placeholder="Yêu cầu AI viết cụ thể (VD: Viết biện pháp ứng dụng Canva thiết kế Infographic văn học có bảng tiến trình 4 bước)..."
              className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAiGenerate();
              }}
            />
            <button
              disabled={isAiLoading}
              onClick={() => handleAiGenerate()}
              className="px-3 py-1.5 rounded-xl bg-[#FF6B00] text-white text-xs font-bold hover:bg-orange-600 transition shrink-0"
            >
              {isAiLoading ? 'Đang tạo...' : 'Tạo ngay'}
            </button>
            <button
              onClick={() => setShowPromptInput(false)}
              className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700"
            >
              Đóng
            </button>
          </div>
        )}

        {/* Content Area: Write or Preview */}
        <div className="flex-1 overflow-hidden flex flex-col p-4 sm:p-6 bg-slate-50/30">
          {viewTab === 'write' ? (
            <textarea
              value={content}
              onChange={handleChange}
              placeholder={`Nhập nội dung cho mục "${section.title}" tại đây...\n\nSử dụng cú pháp Markdown để định dạng (# Tiêu đề, **In đậm**, | Bảng biểu |). Bạn có thể bấm nút "AI Viết chuyên sâu" ở trên để Gemini tự động sinh nội dung học thuật chuẩn GDPT 2018.`}
              className="w-full flex-1 p-5 rounded-2xl bg-white border border-slate-200/90 text-slate-800 text-[14px] leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/30 font-serif shadow-inner scrollbar-thin scrollbar-thumb-slate-200"
            />
          ) : (
            <div className="w-full flex-1 p-6 rounded-2xl bg-white border border-slate-200/90 overflow-y-auto text-slate-800 text-[14pt] leading-relaxed font-serif shadow-inner prose max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: content
                    .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-slate-900 mt-4 mb-2">$1</h3>')
                    .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-slate-950 uppercase border-b pb-1 mt-6 mb-3">$1</h2>')
                    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
                    .replace(/\n\n/gim, '</p><p class="mb-3 indent-6 text-justify">')
                    .replace(/\n- (.*$)/gim, '<li class="ml-6 list-disc">$1</li>'),
                }}
              />
            </div>
          )}
        </div>

        {/* Bottom Status Bar */}
        <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <strong>{wordCount}</strong> từ
            </span>
            <span>•</span>
            <span>
              <strong>{charCount}</strong> ký tự
            </span>
            <span>•</span>
            <span>~{readTimeMinutes} phút đọc</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">
              Cỡ chữ Times New Roman 14pt (Chuẩn Nghị định 30)
            </span>
            <div className="flex items-center gap-1 text-emerald-600 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Tự động lưu vào phiên</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
