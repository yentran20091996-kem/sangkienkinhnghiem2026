import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  X,
  Copy,
  Check,
  CornerDownLeft,
  Bot,
  User,
  RefreshCw,
  PlusSquare,
  Wand2,
} from 'lucide-react';
import { SKKNProject, SectionKey, AIChatMessage } from '../types';
import { copilotChatAI } from '../utils/geminiService';

interface RightAiPanelProps {
  isOpen: boolean;
  onClose: () => void;
  project: SKKNProject;
  activeSectionKey: SectionKey;
  onInsertTextToEditor: (text: string) => void;
}

export const RightAiPanel: React.FC<RightAiPanelProps> = ({
  isOpen,
  onClose,
  project,
  activeSectionKey,
  onInsertTextToEditor,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Xin chào Thầy/Cô! Tôi là Trợ lý AI SKKN 2026. Tôi đang theo dõi mục **"${project.sections[activeSectionKey]?.title}"**. Thầy/Cô cần tôi hỗ trợ viết tiếp, tạo bảng số liệu hay rà soát văn phong sư phạm?`,
      timestamp: 'Ngay bây giờ',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: '✍️ Viết tiếp theo chuẩn GDPT 2018', prompt: 'Hãy viết tiếp đoạn văn này bằng văn phong sư phạm trang trọng, logic và giàu tính thuyết phục theo định hướng phát triển năng lực của GDPT 2018.' },
    { label: '📊 Tạo bảng khảo sát đối chứng', prompt: 'Hãy tạo cho tôi một bảng khảo sát số liệu mẫu so sánh giữa Lớp Đối chứng và Lớp Thực nghiệm kèm tỷ lệ % và nhận xét sư phạm.' },
    { label: '🎯 Đề xuất 3 giải pháp đột phá', prompt: 'Hãy gợi ý cho tôi 3 giải pháp mới lạ, có tính chuyển đổi số hoặc STEM phù hợp với môn học này để đạt giải cao.' },
    { label: '🔍 Nâng cao văn phong học thuật', prompt: 'Hãy viết lại đoạn văn tôi đang viết theo phong cách nghiên cứu khoa học sư phạm ứng dụng chuẩn mực, loại bỏ các từ ngữ sáo rỗng.' },
    { label: '📑 Soạn Kế hoạch bài dạy 5512', prompt: 'Hãy soạn một tiến trình 4 hoạt động bài học (Khởi động, Khám phá, Luyện tập, Vận dụng) minh họa cho giải pháp theo Công văn 5512/BGDĐT.' },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    const userMsg: AIChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const activeDocs = project.ragDocuments.filter((d) => d.isActive);
      const ragKnowledge = activeDocs
        .map((d) => `[${d.title}] (Nguồn: ${d.source}): ` + d.rules.slice(0, 3).join('; '))
        .join('\n');

      const replyText = await copilotChatAI({
        message: text,
        projectContext: {
          title: project.title,
          subject: project.subject,
          gradeLevel: project.gradeLevel,
        },
        activeSection: project.sections[activeSectionKey]?.title,
        ragKnowledge: ragKnowledge || 'Chuẩn GDPT 2018.',
      });

      const aiReply: AIChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: replyText || 'Xin lỗi, không thể nhận phản hồi từ Gemini.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: AIChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Đã dừng do lỗi từ API:**\n\`\`\`\n${err.message || 'Lỗi kết nối Gemini API'}\n\`\`\`\n*Vui lòng bấm nút đỏ "Lấy API key để sử dụng app" trên Header để kiểm tra lại khóa.*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <aside className="w-[360px] lg:w-[400px] shrink-0 h-[calc(100vh-4rem)] bg-white border-l border-slate-200 flex flex-col shadow-xl z-20 select-none">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-orange-50 via-white to-purple-50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#7C3AED] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-slate-900">AI Sư Phạm Copilot</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#FF6B00] text-white">
                Gemini 3.8
              </span>
            </div>
            <p className="text-[10px] text-slate-500 truncate max-w-[190px]">
              Đang hỗ trợ: {project.sections[activeSectionKey]?.title}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Action Prompt Chips */}
      <div className="p-3 border-b border-slate-200 bg-slate-50/70 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
        {quickPrompts.map((q, idx) => (
          <button
            key={idx}
            disabled={isLoading}
            onClick={() => handleSendMessage(q.prompt)}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 hover:text-[#FF6B00] transition shrink-0 shadow-2xs"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/40">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                  isUser
                    ? 'bg-[#FF6B00] text-white'
                    : 'bg-gradient-to-br from-[#7C3AED] to-purple-600 text-white'
                }`}
              >
                {isUser ? 'TÔI' : <Wand2 className="w-3 h-3" />}
              </div>

              <div className={`max-w-[85%] space-y-1 ${isUser ? 'text-right' : ''}`}>
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed text-left ${
                    isUser
                      ? 'bg-[#FF6B00] text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{m.content}</div>
                </div>

                {!isUser && (
                  <div className="flex items-center gap-2 pt-0.5 text-[10px]">
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      className="text-slate-400 hover:text-slate-700 flex items-center gap-1"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500 font-bold">Đã sao chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>

                    <span>•</span>

                    <button
                      onClick={() => onInsertTextToEditor(m.content)}
                      className="text-[#FF6B00] hover:text-orange-700 font-bold flex items-center gap-1"
                    >
                      <PlusSquare className="w-3 h-3" />
                      <span>Chèn vào bài viết</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
              <RefreshCw className="w-3 h-3 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-ping" />
              <span>AI đang phân tích và soạn thảo...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-1.5 bg-slate-100 rounded-2xl p-1.5 border border-slate-200 focus-within:border-[#FF6B00]/60 focus-within:bg-white transition">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Hỏi AI về dàn ý, số liệu hoặc giải pháp..."
            className="flex-1 bg-transparent px-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            disabled={!inputValue.trim() || isLoading}
            onClick={() => handleSendMessage()}
            className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#FF6B00] to-orange-600 text-white flex items-center justify-center hover:opacity-90 disabled:opacity-30 transition shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
