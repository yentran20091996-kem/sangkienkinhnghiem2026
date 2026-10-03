import React, { useState } from 'react';
import {
  Users,
  Send,
  Sparkles,
  ShieldAlert,
  Award,
  RefreshCw,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { SKKNProject, CouncilMember, CouncilChatMessage } from '../types';
import { OFFICIAL_COUNCIL_MEMBERS } from '../data/officialRubric';
import { simulatedDefenseAI } from '../utils/geminiService';

interface CouncilViewProps {
  project: SKKNProject;
  onUpdateCouncilChat: (messages: CouncilChatMessage[]) => void;
}

export const CouncilView: React.FC<CouncilViewProps> = ({
  project,
  onUpdateCouncilChat,
}) => {
  const [selectedJudge, setSelectedJudge] = useState<CouncilMember>(OFFICIAL_COUNCIL_MEMBERS[0]);
  const [chatHistory, setChatHistory] = useState<CouncilChatMessage[]>(
    project.councilChatHistory.length > 0
      ? project.councilChatHistory
      : [
          {
            id: 'init-1',
            sender: 'judge',
            judgeId: OFFICIAL_COUNCIL_MEMBERS[0].id,
            judgeName: OFFICIAL_COUNCIL_MEMBERS[0].name,
            text: OFFICIAL_COUNCIL_MEMBERS[0].initialQuestion,
            timestamp: '09:00',
          },
        ]
  );
  const [userReply, setUserReply] = useState('');
  const [isLoadingReply, setIsLoadingReply] = useState(false);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectJudge = (judge: CouncilMember) => {
    setSelectedJudge(judge);
    // Add initial question from this judge if not present
    const exists = chatHistory.some((m) => m.judgeId === judge.id);
    if (!exists) {
      const newMsg: CouncilChatMessage = {
        id: `init-${Date.now()}`,
        sender: 'judge',
        judgeId: judge.id,
        judgeName: judge.name,
        text: judge.initialQuestion,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const updated = [...chatHistory, newMsg];
      setChatHistory(updated);
      onUpdateCouncilChat(updated);
    }
  };

  const handleSendReply = async () => {
    if (!userReply.trim() || isLoadingReply) return;

    const userMsg: CouncilChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userReply.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...chatHistory, userMsg];
    setChatHistory(newHistory);
    setUserReply('');
    setIsLoadingReply(true);
    setFallbackNotice(null);
    setErrorMessage(null);

    try {
      const replyText = await simulatedDefenseAI({
        judgeName: selectedJudge.name,
        judgeRole: `${selectedJudge.title} (${selectedJudge.style})`,
        projectTitle: project.title,
        history: newHistory.slice(-4),
        userReply: userMsg.text,
        onModelSwitch: (switchedModel) => {
          setFallbackNotice(`Tự động chuyển sang mô hình [${switchedModel}] do mô hình trước gặp sự cố API.`);
        },
      });

      if (replyText) {
        const judgeMsg: CouncilChatMessage = {
          id: `judge-${Date.now()}`,
          sender: 'judge',
          judgeId: selectedJudge.id,
          judgeName: selectedJudge.name,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        const finalHistory = [...newHistory, judgeMsg];
        setChatHistory(finalHistory);
        onUpdateCouncilChat(finalHistory);
      }
    } catch (err: any) {
      console.error('Defense response error:', err);
      setErrorMessage(`Đã dừng do lỗi: ${err?.message || 'Lỗi không xác định khi gọi AI'}`);
    } finally {
      setIsLoadingReply(false);
    }
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-4 lg:p-6 bg-slate-100/70 h-[calc(100vh-4rem)]">
      <div className="flex-1 flex flex-col md:flex-row gap-6 max-w-6xl mx-auto w-full h-full overflow-hidden">
        {/* Left Column: 3 Judges Profiles */}
        <div className="w-full md:w-80 shrink-0 flex flex-col gap-3">
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                Hội Đồng Thẩm Định 2026
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">Phòng Bảo Vệ Đề Tài</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Chọn giám khảo để đối thoại trực tiếp và giải trình các điểm hóc búa của đề tài.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {OFFICIAL_COUNCIL_MEMBERS.map((judge) => {
              const isSelected = selectedJudge.id === judge.id;
              return (
                <button
                  key={judge.id}
                  onClick={() => handleSelectJudge(judge)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-white border-rose-500 shadow-md ring-2 ring-rose-500/20'
                      : 'bg-white/80 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl p-1 bg-slate-100 rounded-xl">{judge.avatar}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{judge.name}</h4>
                        {isSelected && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700">
                            Đang chất vấn
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                        {judge.title}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 italic line-clamp-2">
                        "{judge.style}"
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Council Rubric Tip */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-[11px] text-amber-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Mẹo vượt qua phản biện: </span>
              <span>
                Luôn trích dẫn số liệu cụ thể của lớp thực nghiệm và tên các văn bản pháp quy GDPT 2018.
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Defense Chat Session */}
        <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Chamber Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedJudge.avatar}</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{selectedJudge.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                    {selectedJudge.institution}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{selectedJudge.style}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Phiên giải trình trực tuyến</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {chatHistory.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isUser
                        ? 'bg-[#FF6B00] text-white shadow-xs'
                        : 'bg-rose-600 text-white shadow-xs'
                    }`}
                  >
                    {isUser ? 'GV' : 'GK'}
                  </div>

                  <div className={`max-w-xl space-y-1 ${isUser ? 'text-right' : ''}`}>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-600">
                        {isUser ? `${project.author} (Tác giả)` : msg.judgeName || selectedJudge.name}
                      </span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed text-justify ${
                        isUser
                          ? 'bg-[#FF6B00] text-white rounded-tr-none shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoadingReply && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  GK
                </div>
                <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-rose-500" />
                  <span>Giám khảo đang lắng nghe và đánh giá luận điểm...</span>
                </div>
              </div>
            )}

            {fallbackNotice && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-800 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-600 animate-spin" />
                <span>{fallbackNotice}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 bg-red-50 border-2 border-red-500 rounded-2xl text-xs text-red-700 flex items-start gap-2.5 shadow-sm">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold text-red-800">Đã dừng do lỗi</div>
                  <div className="font-mono text-[11px] mt-1 bg-red-100 p-2 rounded border border-red-200 break-all select-all">
                    {errorMessage}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Box for Defense */}
          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex items-end gap-2">
              <textarea
                value={userReply}
                onChange={(e) => setUserReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendReply();
                  }
                }}
                rows={2}
                placeholder="Nhập câu trả lời giải trình của Thầy/Cô trước Giám khảo (Bấm Enter để gửi)..."
                className="flex-1 p-3 rounded-2xl border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/30 resize-none"
              />
              <button
                disabled={!userReply.trim() || isLoadingReply}
                onClick={handleSendReply}
                className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs transition flex items-center gap-1.5 shrink-0 shadow-md shadow-rose-600/20"
              >
                <span>Giải trình</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Đề tài: {project.title}</span>
              <span>Nhấn Shift + Enter để xuống dòng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
