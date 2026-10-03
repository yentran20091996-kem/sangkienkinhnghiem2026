import React, { useState, useEffect } from 'react';
import {
  Key,
  X,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: (key: string, model: string) => void;
}

const AVAILABLE_MODELS = [
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash (Preview)',
    badge: 'Mặc định • Tốc độ cao',
    desc: 'Phù hợp soạn thảo nhanh, xử lý công văn, tạo dàn ý và chat trợ lý.',
    recommended: true,
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro (Preview)',
    badge: 'Học thuật chuyên sâu',
    desc: 'Tư duy sư phạm sắc bén, thẩm định điểm 100 và phản biện gắt gao.',
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    badge: 'Dự phòng ổn định',
    desc: 'Mô hình dự phòng tin cậy khi hạn mức các model mới bị giới hạn.',
  },
];

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');
  const [showKey, setShowKey] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key_skkn') || '';
    const savedModel = localStorage.getItem('gemini_model_skkn') || 'gemini-3-flash-preview';
    setApiKey(savedKey);
    setSelectedModel(savedModel);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleVerifyAndSave = async () => {
    const trimmedKey = apiKey.trim();
    if (!trimmedKey) {
      setStatusMessage({ type: 'error', text: 'Vui lòng nhập API Key trước khi lưu.' });
      return;
    }

    setIsVerifying(true);
    setStatusMessage(null);

    try {
      // 1. Thử xác thực trực tiếp qua Google Generative Language API (hoạt động 100% trên Vercel)
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${trimmedKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Ping: trả về đúng từ "PONG"' }] }],
          }),
        }
      );

      const json = await res.json();

      if (res.ok) {
        localStorage.setItem('gemini_api_key_skkn', trimmedKey);
        localStorage.setItem('gemini_model_skkn', selectedModel);
        setStatusMessage({ type: 'success', text: `API Key hợp lệ! Đã lưu mô hình ${selectedModel} vào trình duyệt.` });
        if (onKeySaved) onKeySaved(trimmedKey, selectedModel);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        const errorDetail = json.error?.message || json.error?.status || 'API Key không hợp lệ hoặc đã hết quota.';
        setStatusMessage({
          type: 'error',
          text: `Lỗi từ Google API: ${errorDetail}`,
        });
      }
    } catch (err: any) {
      // Fallback lưu key vào localStorage nếu có lỗi mạng
      localStorage.setItem('gemini_api_key_skkn', trimmedKey);
      localStorage.setItem('gemini_model_skkn', selectedModel);
      setStatusMessage({ type: 'success', text: 'Đã lưu API Key vào trình duyệt!' });
      if (onKeySaved) onKeySaved(trimmedKey, selectedModel);
      setTimeout(() => {
        onClose();
      }, 1000);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClearKey = () => {
    localStorage.removeItem('gemini_api_key_skkn');
    setApiKey('');
    setStatusMessage({ type: 'success', text: 'Đã xóa API Key khỏi bộ nhớ trình duyệt.' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-orange-50 via-white to-purple-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6B00] to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">Thiết Lập Gemini AI Key</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Riêng tư & Bảo mật
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Key được lưu trực tiếp trên trình duyệt của Thầy/Cô (Local Storage).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Guide banner */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs text-amber-900">
                <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                <span>Chưa có API Key? Miễn phí 100% từ Google</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Thầy/Cô truy cập Google AI Studio để lấy API Key miễn phí sử dụng cho toàn bộ tính năng của trợ lý SKKN 2026.
              </p>
            </div>
            <a
              href="https://aistudio.google.com/api-keys"
              target="_blank"
              rel="noreferrer"
              className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-xs shadow-sm shadow-orange-500/20 transition"
            >
              <span>Lấy Key ngay</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Key Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Khóa API Gemini (API Key):
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Dán mã khóa API tại đây: AIzaSy..."
                className="w-full pl-3 pr-20 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-500 hover:text-slate-800 px-1.5 py-0.5 rounded"
              >
                {showKey ? 'Ẩn' : 'Hiện'}
              </button>
            </div>
          </div>

          {/* Model Selection Cards */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Chọn Mô hình AI (Gemini Model):</span>
              <span className="text-[10px] text-slate-400 font-normal">Tự động chuyển đổi nếu quá tải</span>
            </label>
            <div className="space-y-2">
              {AVAILABLE_MODELS.map((model) => (
                <div
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    selectedModel === model.id
                      ? 'border-[#FF6B00] bg-orange-50/40 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{model.name}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          selectedModel === model.id
                            ? 'bg-[#FF6B00] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {model.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{model.desc}</p>
                  </div>

                  <div className="shrink-0 mt-0.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedModel === model.id
                          ? 'border-[#FF6B00] bg-[#FF6B00]'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {selectedModel === model.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          {apiKey ? (
            <button
              onClick={handleClearKey}
              className="text-slate-400 hover:text-rose-600 font-medium transition"
            >
              Xóa Key đã lưu
            </button>
          ) : (
            <span className="text-slate-400">Chưa gắn Key</span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200/60 font-semibold transition"
            >
              Hủy
            </button>
            <button
              disabled={isVerifying || !apiKey.trim()}
              onClick={handleVerifyAndSave}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-orange-500 hover:opacity-90 disabled:opacity-40 text-white font-bold shadow-md shadow-orange-500/20 transition"
            >
              {isVerifying && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{isVerifying ? 'Đang kiểm tra...' : 'Lưu & Sử Dụng'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
