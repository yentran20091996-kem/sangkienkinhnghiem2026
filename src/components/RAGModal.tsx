import React, { useState, useRef } from 'react';
import {
  Database,
  X,
  UploadCloud,
  FileText,
  CheckCircle,
  Plus,
  Trash2,
  Sparkles,
  RefreshCw,
  Check,
  FileCheck,
  FileType,
  AlertCircle,
  Layers,
  Award,
  BookOpen,
  Info,
  Eye,
  FileCode,
} from 'lucide-react';
import { RAGDocument, ScoringCriterion } from '../types';
import { processUploadedFile, ParsedDocumentResult, formatFileSize } from '../utils/docParser';
import { extractRAGAI } from '../utils/geminiService';

interface RAGModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: RAGDocument[];
  onAddDocument: (doc: RAGDocument) => void;
  onToggleDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
}

export const RAGModal: React.FC<RAGModalProps> = ({
  isOpen,
  onClose,
  documents,
  onAddDocument,
  onToggleDocument,
  onDeleteDocument,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'upload_file' | 'paste_text'>('list');

  // State cho tệp tải lên
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [fileProgressStep, setFileProgressStep] = useState<string>('');
  const [fileTitle, setFileTitle] = useState('');
  const [fileSource, setFileSource] = useState('Sở Giáo dục và Đào tạo');
  const [fileDocType, setFileDocType] = useState<'rubric' | 'circular' | 'guideline' | 'past_award'>('rubric');
  const [extractedPreview, setExtractedPreview] = useState<{
    rules: string[];
    scoringCriteria?: ScoringCriterion[];
    mandatoryRequirements?: string[];
    keyPriorities?: string[];
    summaryContent?: string;
    rawContent: string;
    fileType: 'docx' | 'pdf' | 'text';
    fileName: string;
    fileSize: string;
  } | null>(null);

  // State cho dán text
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteSource, setPasteSource] = useState('Sở Giáo dục và Đào tạo');
  const [pasteText, setPasteText] = useState('');
  const [isExtractingPaste, setIsExtractingPaste] = useState(false);

  // State xem chi tiết tài liệu đã lưu
  const [viewingDoc, setViewingDoc] = useState<RAGDocument | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Xử lý chọn tệp từ máy tính
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileSelected(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileSelected = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['docx', 'doc', 'pdf', 'txt'].includes(ext || '')) {
      alert('Vui lòng chọn tệp định dạng Word (.docx, .doc) hoặc PDF (.pdf)');
      return;
    }
    setSelectedFile(file);
    setFileTitle(file.name.replace(/\.[^/.]+$/, ''));
    setExtractedPreview(null);
  };

  const [fileError, setFileError] = useState<string | null>(null);

  // AI Phân tích tệp đã chọn
  const handleAnalyzeFile = async () => {
    if (!selectedFile) return;

    setIsProcessingFile(true);
    setFileError(null);
    setFileProgressStep('Đang đọc cấu trúc tệp...');

    try {
      // 1. Phân tích nội dung tệp
      const parsed: ParsedDocumentResult = await processUploadedFile(selectedFile);

      setFileProgressStep('Gemini AI đang bóc tách tiêu chí chấm điểm và quy định...');

      // 2. Gọi hàm extractRAGAI với cơ chế Fallback
      const data = await extractRAGAI({
        rawText: parsed.text,
        fileName: fileTitle.trim() || parsed.suggestedTitle,
        fileBase64: parsed.base64,
        mimeType: parsed.fileType === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        onModelSwitch: (model) => {
          setFileProgressStep(`Đang thử lại với mô hình dự phòng: ${model}...`);
        },
      });

      // Cập nhật preview
      setFileTitle(data.title || fileTitle || parsed.suggestedTitle);
      setFileSource(data.source || fileSource || parsed.suggestedSource);
      if (data.type) setFileDocType(data.type);

      setExtractedPreview({
        rules: data.extractedRules || [
          'Thang điểm 100 theo tiêu chuẩn Sở GD&ĐT',
          'Tập trung phát triển phẩm chất và năng lực học sinh theo GDPT 2018',
        ],
        scoringCriteria: data.scoringCriteria || [],
        mandatoryRequirements: data.mandatoryRequirements || [],
        keyPriorities: data.keyPriorities || [],
        summaryContent: data.summaryContent || '',
        rawContent: parsed.text,
        fileType: parsed.fileType,
        fileName: parsed.fileName,
        fileSize: parsed.fileSize,
      });

      setFileProgressStep('Hoàn tất trích xuất!');
    } catch (err: any) {
      console.error('Lỗi khi phân tích tệp:', err);
      setFileError(err.message || 'Lỗi khi phân tích tệp');
    } finally {
      setIsProcessingFile(false);
    }
  };

  // Lưu tài liệu từ File vào RAG
  const handleSaveExtractedFileToRAG = () => {
    if (!extractedPreview) return;

    const newDoc: RAGDocument = {
      id: `rag-file-${Date.now()}`,
      title: fileTitle.trim() || extractedPreview.fileName,
      source: fileSource.trim() || 'Sở Giáo dục và Đào tạo',
      type: fileDocType,
      rules: extractedPreview.rules,
      scoringCriteria: extractedPreview.scoringCriteria,
      mandatoryRequirements: extractedPreview.mandatoryRequirements,
      keyPriorities: extractedPreview.keyPriorities,
      content: extractedPreview.rawContent,
      fileType: extractedPreview.fileType,
      fileName: extractedPreview.fileName,
      fileSize: extractedPreview.fileSize,
      uploadedAt: new Date().toLocaleDateString('vi-VN'),
      isActive: true,
    };

    onAddDocument(newDoc);
    setSelectedFile(null);
    setExtractedPreview(null);
    setFileTitle('');
    setActiveTab('list');
  };

  // Xử lý dán text thủ công
  const handleExtractAndSavePaste = async () => {
    if (!pasteText.trim() || !pasteTitle.trim()) return;

    setIsExtractingPaste(true);
    setFileError(null);
    try {
      const data = await extractRAGAI({
        rawText: pasteText,
        fileName: pasteTitle,
      });

      const newDoc: RAGDocument = {
        id: `rag-paste-${Date.now()}`,
        title: pasteTitle,
        source: pasteSource,
        type: (data.type as any) || 'circular',
        rules: data.extractedRules || [
          'Thang điểm 100 theo tiêu chuẩn Sở GD&ĐT',
          'Tập trung phát triển năng lực học sinh theo GDPT 2018',
        ],
        scoringCriteria: data.scoringCriteria || [],
        mandatoryRequirements: data.mandatoryRequirements || [],
        keyPriorities: data.keyPriorities || [],
        content: pasteText,
        fileType: 'text',
        uploadedAt: new Date().toLocaleDateString('vi-VN'),
        isActive: true,
      };

      onAddDocument(newDoc);
      setPasteTitle('');
      setPasteText('');
      setActiveTab('list');
    } catch (err: any) {
      console.error('Failed to extract pasted text:', err);
      setFileError(err.message || 'Lỗi khi trích xuất văn bản');
    } finally {
      setIsExtractingPaste(false);
    }
  };

  const getDocTypeBadge = (type: string) => {
    switch (type) {
      case 'rubric':
        return { label: 'Biểu điểm 100đ', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'circular':
        return { label: 'Công văn quy chế', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'guideline':
        return { label: 'Hướng dẫn thể thức', color: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'past_award':
        return { label: 'SKKN mẫu giải cao', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      default:
        return { label: 'Tài liệu hướng dẫn', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  const getFileTypeIcon = (fileType?: string) => {
    if (fileType === 'docx') {
      return (
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
          DOCX
        </div>
      );
    }
    if (fileType === 'pdf') {
      return (
        <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
          PDF
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
        TXT
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-purple-50 via-white to-orange-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#7C3AED] flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Tủ Hồ Sơ RAG: Công Văn & Tiêu Chí Chấm Điểm SKKN
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700">
                  Kim Chỉ Nam AI
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tải lên công văn của Sở/Phòng hoặc biểu điểm chấm. AI sẽ bóc tách và tuân thủ tuyệt đối khi viết bài & thẩm định.
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

        {/* Tab switch */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-slate-50 flex gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('list')}
            className={`pb-2.5 transition border-b-2 ${
              activeTab === 'list'
                ? 'border-[#7C3AED] text-[#7C3AED]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Tài liệu & Công văn đã nạp ({documents.length})
          </button>

          <button
            onClick={() => setActiveTab('upload_file')}
            className={`pb-2.5 transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'upload_file'
                ? 'border-[#FF6B00] text-[#FF6B00]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Tải tệp Word (.docx) / PDF (.pdf)</span>
            <span className="px-1.5 py-0.2 rounded bg-orange-100 text-[#FF6B00] text-[9px] font-extrabold">MỚI</span>
          </button>

          <button
            onClick={() => setActiveTab('paste_text')}
            className={`pb-2.5 transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'paste_text'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Dán nội dung thủ công</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: DANH SÁCH TÀI LIỆU */}
          {activeTab === 'list' && (
            <div className="space-y-3">
              {documents.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-500 mx-auto flex items-center justify-center">
                    <Database className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Chưa có công văn hoặc biểu điểm nào được nạp</p>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Hãy bấm tab "Tải tệp Word / PDF" để nạp công văn của Sở GD&ĐT tỉnh mình, AI sẽ tự động nắm bắt thang điểm để hỗ trợ viết bài!
                  </p>
                  <button
                    onClick={() => setActiveTab('upload_file')}
                    className="px-4 py-2 rounded-xl bg-[#FF6B00] text-white text-xs font-bold shadow-md hover:bg-orange-600 transition"
                  >
                    + Tải tệp Word / PDF ngay
                  </button>
                </div>
              ) : (
                documents.map((doc) => {
                  const badge = getDocTypeBadge(doc.type);
                  return (
                    <div
                      key={doc.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        doc.isActive
                          ? 'bg-white border-purple-200 shadow-xs'
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {getFileTypeIcon(doc.fileType)}

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-bold text-xs text-slate-900">{doc.title}</h4>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${badge.color}`}>
                                {badge.label}
                              </span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                                {doc.source}
                              </span>
                              {doc.fileSize && (
                                <span className="text-[10px] text-slate-400">({doc.fileSize})</span>
                              )}
                            </div>

                            {/* Scoring criteria summary if available */}
                            {doc.scoringCriteria && doc.scoringCriteria.length > 0 ? (
                              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                                {doc.scoringCriteria.map((crit, idx) => (
                                  <div key={idx} className="p-2 rounded-xl bg-purple-50/70 border border-purple-100 text-[11px] text-purple-950 flex items-center justify-between">
                                    <span className="font-medium truncate pr-2">{crit.category}</span>
                                    <span className="font-bold text-purple-700 shrink-0">{crit.maxScore}đ</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="mt-2 space-y-1">
                                {doc.rules.slice(0, 3).map((r, i) => (
                                  <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                                    <span>{r}</span>
                                  </div>
                                ))}
                                {doc.rules.length > 3 && (
                                  <span className="text-[10px] text-slate-400 italic">
                                    +{doc.rules.length - 3} quy chuẩn khác...
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setViewingDoc(doc)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition"
                            title="Xem chi tiết toàn văn tài liệu"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onToggleDocument(doc.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition ${
                              doc.isActive
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {doc.isActive ? 'Đang kích hoạt' : 'Tạm tắt'}
                          </button>

                          {documents.length > 1 && (
                            <button
                              onClick={() => onDeleteDocument(doc.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                              title="Xóa tài liệu"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 2: TẢI TỆP WORD HOẶC PDF (TRỌNG TÂM YÊU CẦU) */}
          {activeTab === 'upload_file' && (
            <div className="space-y-5">
              {/* Dropzone */}
              {!selectedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-[#FF6B00] bg-orange-50/70 scale-[0.99]'
                      : 'border-slate-300 hover:border-[#FF6B00]/70 hover:bg-orange-50/20'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".docx,.doc,.pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-100 to-purple-100 text-[#FF6B00] mx-auto flex items-center justify-center mb-3 shadow-inner">
                    <UploadCloud className="w-8 h-8" />
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-800">
                    Kéo & thả tệp Word (.docx) hoặc PDF (.pdf) vào đây
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    hoặc <span className="text-[#FF6B00] font-bold underline">bấm để chọn tệp từ máy tính</span>
                  </p>

                  <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500" /> File Word (.docx, .doc)
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500" /> File PDF (.pdf)
                    </span>
                    <span>Tối đa 20MB</span>
                  </div>
                </div>
              ) : (
                /* Selected File Card */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getFileTypeIcon(selectedFile.name.endsWith('.pdf') ? 'pdf' : 'docx')}
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{selectedFile.name}</h4>
                        <p className="text-[11px] text-slate-500">
                          Kích thước: {formatFileSize(selectedFile.size)} • Định dạng: {selectedFile.name.split('.').pop()?.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setExtractedPreview(null);
                      }}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Chọn tệp khác
                    </button>
                  </div>

                  {/* Metadata fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tên trích yếu văn bản / Công văn:
                      </label>
                      <input
                        type="text"
                        value={fileTitle}
                        onChange={(e) => setFileTitle(e.target.value)}
                        placeholder="VD: Công văn 1234/SGDĐT về Quy chế chấm Sáng kiến năm học 2025-2026"
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Cơ quan ban hành:
                      </label>
                      <input
                        type="text"
                        value={fileSource}
                        onChange={(e) => setFileSource(e.target.value)}
                        placeholder="VD: Sở GD&ĐT Hà Nội"
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phân loại tài liệu:
                      </label>
                      <select
                        value={fileDocType}
                        onChange={(e: any) => setFileDocType(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
                      >
                        <option value="rubric">🎯 Biểu điểm & Tiêu chí chấm (Rubric)</option>
                        <option value="circular">📜 Công văn / Thông tư chỉ đạo</option>
                        <option value="guideline">📐 Hướng dẫn thể thức & Quy cách</option>
                        <option value="past_award">🏆 Báo cáo SKKN mẫu đạt giải</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 flex items-end">
                      {!extractedPreview ? (
                        <button
                          disabled={isProcessingFile}
                          onClick={handleAnalyzeFile}
                          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF6B00] to-orange-500 hover:opacity-90 disabled:opacity-40 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-orange-500/20"
                        >
                          {isProcessingFile ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4 text-amber-200" />
                          )}
                          <span>{isProcessingFile ? fileProgressStep : 'AI Đọc tệp & Bóc tách tiêu chí chấm điểm'}</span>
                        </button>
                      ) : (
                        <div className="w-full p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>AI đã bóc tách thành công các tiêu chí! Kiểm tra kết quả bên dưới.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Thông báo lỗi màu đỏ nguyên văn từ API */}
                  {fileError && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <div className="space-y-1 min-w-0">
                          <div className="font-bold text-rose-950 flex items-center gap-1.5">
                            <span>Quá trình trích xuất đã dừng do lỗi</span>
                            <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-800 text-[10px] font-mono">
                              API Error
                            </span>
                          </div>
                          <p className="font-mono text-xs text-rose-800 break-all">{fileError}</p>
                          <p className="text-[11px] text-rose-600">
                            Vui lòng kiểm tra lại API Key hoặc đổi sang key khác bằng nút "Lấy API key để sử dụng app" trên Header.
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFileError(null)}
                        className="text-xs font-semibold text-rose-500 hover:text-rose-800 px-2 py-1 rounded"
                      >
                        Đóng
                      </button>
                    </div>
                  )}

                  {/* PREVIEW KẾT QUẢ BÓC TÁCH TỪ TỆP */}
                  {extractedPreview && (
                    <div className="p-4 rounded-2xl bg-white border border-purple-200 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between border-b border-purple-100 pb-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-600" />
                          <h4 className="font-extrabold text-xs text-purple-950 uppercase tracking-wide">
                            Kết Quả Bóc Tách Tiêu Chí Chấm Điểm
                          </h4>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                          Đã tối ưu cho RAG Kim Chỉ Nam
                        </span>
                      </div>

                      {/* Barem chấm điểm scoringCriteria */}
                      {extractedPreview.scoringCriteria && extractedPreview.scoringCriteria.length > 0 && (
                        <div className="space-y-1.5">
                          <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-amber-500" />
                            <span>Barem Thang Điểm Thẩm Định:</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {extractedPreview.scoringCriteria.map((c, idx) => (
                              <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-0.5">
                                <div className="flex items-center justify-between font-bold text-slate-900">
                                  <span>{c.category}</span>
                                  <span className="text-[#FF6B00]">{c.maxScore} điểm</span>
                                </div>
                                <p className="text-[11px] text-slate-500">{c.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quy chuẩn rules */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Quy Định & Yêu Cầu Cốt Lõi Khi Viết Bài:</span>
                        </div>
                        <div className="space-y-1">
                          {extractedPreview.rules.map((rule, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                              <span>{rule}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Yêu cầu bắt buộc */}
                      {extractedPreview.mandatoryRequirements && extractedPreview.mandatoryRequirements.length > 0 && (
                        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-1">
                          <div className="font-bold flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Điều kiện loại trừ / Yêu cầu bắt buộc:</span>
                          </div>
                          <ul className="list-disc pl-5 text-[11px] space-y-0.5">
                            {extractedPreview.mandatoryRequirements.map((req, i) => (
                              <li key={i}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Nút lưu */}
                      <button
                        onClick={handleSaveExtractedFileToRAG}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#7C3AED] via-purple-600 to-[#FF6B00] hover:opacity-90 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                      >
                        <Check className="w-4 h-4" />
                        <span>Nạp Vào Tủ Hồ Sơ RAG & Kích Hoạt Làm Kim Chỉ Nam</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DÁN NỘI DUNG THỦ CÔNG */}
          {activeTab === 'paste_text' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tên văn bản / Thông tư / Hướng dẫn:
                </label>
                <input
                  type="text"
                  value={pasteTitle}
                  onChange={(e) => setPasteTitle(e.target.value)}
                  placeholder="Ví dụ: Công văn số 425/SGDĐT-GDTrH về Quy chế chấm Sáng kiến năm học 2025-2026..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cơ quan ban hành:
                </label>
                <input
                  type="text"
                  value={pasteSource}
                  onChange={(e) => setPasteSource(e.target.value)}
                  placeholder="Ví dụ: Sở GD&ĐT Hà Nội / Hội đồng Sáng kiến Cấp Huyện..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dán nội dung công văn hoặc tiêu chí chấm điểm (Text):
                </label>
                <textarea
                  rows={6}
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder="Dán toàn bộ nội dung công văn, biểu điểm chi tiết hoặc yêu cầu cụ thể tại đơn vị của Thầy/Cô..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/40 font-mono"
                />
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200/70 text-[11px] text-purple-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span>
                  Hệ thống AI Gemini sẽ tự động phân tích và trích xuất các tiêu chí, thang điểm và quy định định dạng để nạp vào bộ nhớ RAG của dự án.
                </span>
              </div>

              <button
                disabled={!pasteTitle.trim() || !pasteText.trim() || isExtractingPaste}
                onClick={handleExtractAndSavePaste}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-purple-600 hover:opacity-90 disabled:opacity-40 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-purple-500/20"
              >
                {isExtractingPaste ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <UploadCloud className="w-4 h-4" />
                )}
                <span>{isExtractingPaste ? 'AI Đang trích xuất quy chuẩn...' : 'Trích xuất & Nạp vào RAG'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>
              <strong>{documents.filter((d) => d.isActive).length}</strong> văn bản đang làm kim chỉ nam trực tiếp
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
          >
            Hoàn tất & Đóng
          </button>
        </div>
      </div>

      {/* MODAL PHỤ: XEM CHI TIẾT TOÀN VĂN VĂN BẢN */}
      {viewingDoc && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="min-w-0 pr-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                    {viewingDoc.source}
                  </span>
                  {viewingDoc.fileType && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700 uppercase">
                      {viewingDoc.fileType}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-sm text-slate-900 truncate mt-1">{viewingDoc.title}</h4>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
              {viewingDoc.scoringCriteria && viewingDoc.scoringCriteria.length > 0 && (
                <div className="space-y-2 p-3 bg-amber-50/70 rounded-2xl border border-amber-200">
                  <div className="font-bold text-amber-950 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>Barem Chấm Điểm Thẩm Định ({viewingDoc.scoringCriteria.reduce((a, b) => a + b.maxScore, 0)} điểm):</span>
                  </div>
                  <div className="space-y-1.5">
                    {viewingDoc.scoringCriteria.map((c, i) => (
                      <div key={i} className="flex justify-between items-start p-2 bg-white rounded-xl border border-amber-100">
                        <div>
                          <div className="font-bold text-slate-800">{c.category}</div>
                          <div className="text-[11px] text-slate-500">{c.description}</div>
                        </div>
                        <span className="font-black text-[#FF6B00] shrink-0 pl-2">{c.maxScore}đ</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="font-bold text-slate-900">Các quy chuẩn cốt lõi:</div>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  {viewingDoc.rules.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {viewingDoc.content && (
                <div className="space-y-1 pt-2 border-t border-slate-200">
                  <div className="font-bold text-slate-900">Toàn văn tài liệu trích xuất:</div>
                  <pre className="p-3 bg-slate-50 rounded-xl text-[11px] font-mono whitespace-pre-wrap max-h-60 overflow-y-auto border border-slate-200 text-slate-600">
                    {viewingDoc.content}
                  </pre>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
