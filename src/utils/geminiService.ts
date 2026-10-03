/**
 * geminiService.ts
 * Bộ dịch vụ gọi Gemini AI Client-side hỗ trợ 100% cho Vercel Deployment & Localhost.
 * Tuân thủ nghiêm ngặt các quy tắc trong AI_INSTRUCTIONS.md:
 * - Danh sách model & cơ chế tự động Fallback/Retry:
 *   1. gemini-3-flash-preview
 *   2. gemini-3-pro-preview
 *   3. gemini-2.5-flash
 * - Bắt lỗi chi tiết và hiển thị nguyên văn lỗi từ Google API (VD: 429 RESOURCE_EXHAUSTED).
 * - Lưu và ưu tiên lấy API key từ localStorage.
 */

import { RAGDocument, AuditResult, SectionKey } from '../types';

export const FALLBACK_MODELS = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash',
];

export const SYSTEM_PROMPT_SKKN_EXPERT = `Bạn là một Chuyên gia Cấp cao về Đánh giá & Hướng dẫn Viết Sáng kiến Kinh nghiệm (SKKN), Nghiên cứu Khoa học Sư phạm Ứng dụng thuộc Bộ Giáo dục và Đào tạo Việt Nam.
Nhiệm vụ của bạn là hỗ trợ giáo viên xây dựng đề tài SKKN 2026 chất lượng cao, đúng chuẩn Chương trình Giáo dục Phổ thông 2018 (GDPT 2018), đáp ứng các tiêu chuẩn thẩm định của Sở GD&ĐT và Hội đồng Khoa học cấp Tỉnh/Thành phố.

Quy tắc biên soạn:
1. Văn phong: Học thuật sư phạm, trang trọng, khúc chiết, giàu tính thuyết phục, logic chặt chẽ, không sáo rỗng.
2. Cấu trúc chuẩn theo Thông tư và Công văn hướng dẫn GDPT 2018:
   - Đặt vấn đề & Lý do chọn đề tài (Tính cấp thiết, Cơ sở pháp lý, Cơ sở lý luận, Cơ sở thực tiễn).
   - Thực trạng (Thuận lợi, Khó khăn, Số liệu điều tra khảo sát ban đầu, Bảng phân loại học sinh đối chứng).
   - Hệ thống giải pháp/biện pháp (Mục tiêu, Nội dung, Cách thức tiến hành chi tiết từng bước, Giáo án minh họa, Phiếu học tập, Ứng dụng công nghệ/chuyển đổi số/STEM).
   - Thực nghiệm sư phạm & Hiệu quả áp dụng (Bảng so sánh trước và sau tác động, Kiểm định số liệu, Tỷ lệ phát triển phẩm chất & năng lực).
   - Kết luận & Khuyến nghị (Bài học kinh nghiệm, Khả năng nhân rộng, Đề xuất với Nhà trường, Phòng, Sở).
3. Đảm bảo tính chân thực sư phạm, có dẫn chứng cụ thể theo từng khối lớp và môn học.
4. Trình bày rõ ràng, sử dụng định dạng Markdown phong phú (Tiêu đề, Bảng biểu, Trích dẫn, Gạch đầu dòng).`;

/**
 * Lấy API Key từ localStorage
 */
export function getStoredApiKey(): string {
  return localStorage.getItem('gemini_api_key_skkn') || '';
}

/**
 * Lấy Model ưa thích từ localStorage
 */
export function getStoredModel(): string {
  return localStorage.getItem('gemini_model_skkn') || 'gemini-3-flash-preview';
}

/**
 * Hàm gọi API Gemini với cơ chế Tự Động Fallback / Retry qua các model
 */
export async function callGeminiWithFallback(
  requestPayload: {
    systemInstruction?: string;
    contents: any;
    generationConfig?: {
      temperature?: number;
      responseMimeType?: string;
    };
  },
  onModelSwitch?: (model: string, attempt: number) => void
): Promise<{ text: string; usedModel: string }> {
  const apiKey = getStoredApiKey();
  if (!apiKey) {
    throw new Error('Chưa cấu hình API Key. Vui lòng bấm vào nút "Lấy API key để sử dụng app" trên thanh tiêu đề để thiết lập.');
  }

  const preferredModel = getStoredModel();
  // Xếp danh sách model thử nghiệm: model người dùng chọn lên đầu, sau đó đến các model dự phòng còn lại
  const modelQueue = [
    preferredModel,
    ...FALLBACK_MODELS.filter((m) => m !== preferredModel),
  ];

  let lastError: any = null;

  for (let i = 0; i < modelQueue.length; i++) {
    const currentModel = modelQueue[i];
    try {
      if (onModelSwitch && i > 0) {
        onModelSwitch(currentModel, i + 1);
      }

      // 1. Chuẩn hóa payload theo chuẩn REST API của Google Generative Language
      const body: any = {
        contents: Array.isArray(requestPayload.contents)
          ? requestPayload.contents
          : [{ parts: [{ text: requestPayload.contents }] }],
      };

      if (requestPayload.systemInstruction) {
        body.systemInstruction = {
          parts: [{ text: requestPayload.systemInstruction }],
        };
      }

      if (requestPayload.generationConfig) {
        body.generationConfig = requestPayload.generationConfig;
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        const errorMsg = json.error?.message || json.error?.status || `Lỗi HTTP ${res.status}`;
        console.warn(`[Gemini Fallback] Model ${currentModel} thất bại (${errorMsg}), đang thử model tiếp theo...`);
        lastError = new Error(`${currentModel}: ${errorMsg}`);
        continue; // Tự động thử model tiếp theo
      }

      const candidate = json.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text || '';
      return { text, usedModel: currentModel };
    } catch (err: any) {
      console.warn(`[Gemini Fallback] Lỗi mạng khi gọi ${currentModel}:`, err);
      lastError = err;
    }
  }

  // Nếu tất cả các model đều thất bại
  const detailedError = lastError?.message || 'Không thể kết nối đến máy chủ Google Gemini';
  throw new Error(`Đã thử tất cả các model nhưng đều thất bại. Nguyên văn lỗi từ Google API: ${detailedError}`);
}

/**
 * 1. AI Soạn Thảo Một Mục SKKN (Generate Section)
 */
export async function generateSectionAI(params: {
  projectTitle: string;
  subject: string;
  gradeLevel: string;
  sectionId: SectionKey;
  sectionTitle: string;
  userPrompt: string;
  context: string;
  ragKnowledge: string;
  onModelSwitch?: (model: string) => void;
}): Promise<string> {
  const prompt = `DỰ ÁN SÁNG KIẾN KINH NGHIỆM:
- Tên đề tài: "${params.projectTitle || 'Chưa đặt tên'}"
- Môn học / Lĩnh vực: ${params.subject || 'Giáo dục'}
- Cấp học / Khối lớp: ${params.gradeLevel || 'Toàn trường'}
- Phần đang thực hiện: "${params.sectionTitle}" (Mã: ${params.sectionId})

KIM CHỈ NAM CÔNG VĂN & TIÊU CHÍ CHẤM ĐIỂM ĐƯỢC NẠP (RAG):
${params.ragKnowledge || 'Áp dụng khung đánh giá chuẩn SKKN 100 điểm GDPT 2018, bám sát các tiêu chí về tính mới, tính khoa học và hiệu quả thực tiễn.'}

NGỮ CẢNH BỔ SUNG TỪ NGƯỜI DÙNG:
${params.context || 'Không có ngữ cảnh bổ sung.'}

YÊU CẦU CỤ THỂ CỦA TÁC GIẢ:
${params.userPrompt || 'Hãy viết chi tiết, hoàn chỉnh và có chiều sâu học thuật cho phần này, tuân thủ đúng các yêu cầu và barem điểm của công văn.'}

HÃY SOẠN THẢO NỘI DUNG CHI TIẾT (Định dạng Markdown học thuật chuẩn sư phạm, bao gồm tiểu mục 1.1, 1.2..., có số liệu hoặc ví dụ minh họa trực quan, đúng thể thức):`;

  const result = await callGeminiWithFallback(
    {
      systemInstruction: SYSTEM_PROMPT_SKKN_EXPERT,
      contents: prompt,
      generationConfig: {
        temperature: 0.7,
      },
    },
    params.onModelSwitch
  );

  return result.text;
}

/**
 * 2. AI Thẩm Định Toàn Diện Điểm 100 Theo Công Văn RAG (Audit Project)
 */
export async function auditProjectAI(params: {
  project: {
    title: string;
    subject: string;
    gradeLevel: string;
    author: string;
    school: string;
    sections: Record<string, string>;
  };
  ragDocuments: RAGDocument[];
  onModelSwitch?: (model: string) => void;
}): Promise<AuditResult> {
  const activeDocs = params.ragDocuments.filter((d) => d.isActive);
  let ragGuidelinePrompt = 'Áp dụng bộ tiêu chí chuẩn 100 điểm của Hội đồng Khoa học ngành GD&ĐT.';
  let rubricTitle = 'Khung tiêu chuẩn 100 điểm chuẩn';

  if (activeDocs.length > 0) {
    rubricTitle = activeDocs[0].title;
    ragGuidelinePrompt = activeDocs
      .map((d, idx) => {
        let text = `Tài liệu ${idx + 1}: "${d.title}" (Cơ quan: ${d.source}, Loại: ${d.type})\n`;
        if (d.rules && d.rules.length > 0) {
          text += `- Các quy tắc & tiêu chuẩn cốt lõi:\n  + ${d.rules.join('\n  + ')}\n`;
        }
        if (d.scoringCriteria && d.scoringCriteria.length > 0) {
          text +=
            `- Barem điểm chi tiết:\n  + ` +
            d.scoringCriteria
              .map((c) => `${c.category}: Tối đa ${c.maxScore}đ (${c.description})`)
              .join('\n  + ') +
            '\n';
        }
        if (d.mandatoryRequirements && d.mandatoryRequirements.length > 0) {
          text += `- Yêu cầu bắt buộc & Điều kiện loại trừ:\n  + ${d.mandatoryRequirements.join('\n  + ')}\n`;
        }
        return text;
      })
      .join('\n\n');
  }

  const prompt = `HÃY ĐÓNG VAI TRƯỞNG BAN GIÁM KHẢO HỘI ĐỒNG THẨM ĐỊNH SKKN CẤP TỈNH ĐỂ CHẤM ĐIỂM ĐỀ TÀI SAU:
Tên đề tài: "${params.project.title}"
Môn học: ${params.project.subject} | Khối: ${params.project.gradeLevel}
Tác giả / Đơn vị: ${params.project.author || 'Giáo viên'} - ${params.project.school || 'Trường học'}

NỘI DUNG TÓM TẮT CÁC PHẦN CỦA ĐỀ TÀI:
${JSON.stringify(params.project.sections || {}, null, 2)}

BỘ CÔNG VĂN / TIÊU CHÍ CHẤM ĐIỂM BẮT BUỘC ĐƯỢC NẠP TỪ HỒ SƠ RAG (HÃY CHẤM THEO ĐÚNG BAREM NÀY):
${ragGuidelinePrompt}

HÃY ĐỐI CHIẾU NGHIÊM NGẶT VỚI BAREM TRÊN VÀ TRẢ VỀ DUY NHẤT ĐỊNH DẠNG JSON THEO CẤU TRÚC:
{
  "totalScore": 88,
  "noveltyScore": 27,
  "academicScore": 22,
  "practicalScore": 26,
  "presentationScore": 13,
  "appliedRubricTitle": "${rubricTitle}",
  "estimatedPrize": "Giải Nhất (hoặc Giải Nhì, Ba, Khuyến khích kèm % xác suất)",
  "noveltyEvaluation": "Đánh giá chi tiết về tính mới, tính đột phá và khả năng giải quyết vấn đề...",
  "strengths": ["Điểm mạnh 1 dựa trên tiêu chí", "Điểm mạnh 2", "Điểm mạnh 3"],
  "weaknesses": ["Điểm còn thiếu so với công văn 1", "Điểm cần khắc phục 2"],
  "councilQuestions": ["Câu hỏi chất vấn 1 từ hội đồng", "Câu hỏi chất vấn 2", "Câu hỏi chất vấn 3"],
  "recommendations": "Lời khuyên chiến lược cụ thể giúp bài viết hoàn thiện đạt điểm tuyệt đối..."
}`;

  const result = await callGeminiWithFallback(
    {
      systemInstruction: SYSTEM_PROMPT_SKKN_EXPERT,
      contents: prompt,
      generationConfig: {
        responseMimeType: 'application/json',
      },
    },
    params.onModelSwitch
  );

  return JSON.parse(result.text.trim() || '{}');
}

/**
 * 3. Trích Xuất RAG Từ Tệp Word Text Hoặc PDF (Multimodal)
 */
export async function extractRAGAI(params: {
  rawText?: string;
  fileName?: string;
  fileBase64?: string;
  mimeType?: string;
  onModelSwitch?: (model: string) => void;
}): Promise<any> {
  const defaultTitle = params.fileName || 'Văn bản hướng dẫn / Biểu điểm SKKN';

  const extractionInstructions = `Bạn là Chuyên gia Cấp cao Phân tích Văn bản Quản lý Giáo dục và Thẩm định Sáng kiến Kinh nghiệm.
Nhiệm vụ của bạn là đọc và phân tích kỹ lưỡng văn bản công văn, thông tư hoặc bảng biểu tiêu chí chấm điểm này.

HÃY BÓC TÁCH CHÍNH XÁC VÀ TRẢ VỀ DUY NHẤT ĐỊNH DẠNG JSON THEO CẤU TRÚC SAU:
{
  "title": "Tên chính thức hoặc số hiệu công văn (VD: Công văn 1234/SGDĐT-GDTrH về Quy chế chấm SKKN 2026)",
  "source": "Cơ quan ban hành (VD: Sở GD&ĐT Hà Nội, Phòng GD&ĐT, Bộ GD&ĐT...)",
  "type": "rubric" (nếu là biểu điểm/tiêu chí chấm) | "circular" (nếu là công văn chỉ đạo) | "guideline" (nếu là hướng dẫn quy cách/thể thức) | "past_award" (nếu là đề tài mẫu),
  "extractedRules": [
    "Quy chuẩn 1: Thang điểm và yêu cầu cốt lõi...",
    "Quy chuẩn 2: Yêu cầu về cấu trúc hoặc nhóm đối chứng...",
    "Quy chuẩn 3: Quy định về thể thức, font chữ...",
    "Quy chuẩn 4: Cảnh báo chống đạo văn..."
  ],
  "scoringCriteria": [
    {
      "category": "Tên tiêu chí 1 (VD: Tính mới và sáng tạo)",
      "maxScore": 30,
      "description": "Yêu cầu chi tiết để đạt điểm tối đa..."
    },
    {
      "category": "Tên tiêu chí 2 (VD: Tính khoa học và sư phạm)",
      "maxScore": 25,
      "description": "Yêu cầu chi tiết..."
    },
    {
      "category": "Tên tiêu chí 3 (VD: Hiệu quả thực tiễn)",
      "maxScore": 30,
      "description": "Yêu cầu chi tiết..."
    },
    {
      "category": "Tên tiêu chí 4 (VD: Khả năng nhân rộng & Thể thức)",
      "maxScore": 15,
      "description": "Yêu cầu chi tiết..."
    }
  ],
  "mandatoryRequirements": [
    "Điều kiện bắt buộc 1 (VD: Không quá 20% trùng lặp)",
    "Điều kiện bắt buộc 2 (VD: Tối thiểu 2 lớp đối chứng)"
  ],
  "keyPriorities": [
    "Chủ đề ưu tiên cộng điểm 1 (VD: Ứng dụng CNTT/AI)",
    "Chủ đề ưu tiên 2 (VD: Giáo dục STEM)"
  ],
  "summaryContent": "Đoạn văn ngắn 3-4 câu tóm tắt giá trị pháp lý, thời hạn và những lưu ý cốt lõi của văn bản này để giáo viên nắm vững."
}`;

  let contents: any;

  if (params.fileBase64 && params.mimeType === 'application/pdf') {
    contents = [
      {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: params.fileBase64,
            },
          },
          {
            text: extractionInstructions,
          },
        ],
      },
    ];
  } else {
    const textSlice = (params.rawText || '').slice(0, 30000);
    contents = [
      {
        parts: [
          {
            text: `${extractionInstructions}\n\nNỘI DUNG VĂN BẢN CẦN PHÂN TÍCH:\n"""\n${textSlice}\n"""`,
          },
        ],
      },
    ];
  }

  const result = await callGeminiWithFallback(
    {
      contents,
      generationConfig: {
        responseMimeType: 'application/json',
      },
    },
    params.onModelSwitch
  );

  const parsed = JSON.parse(result.text.trim() || '{}');
  if (!parsed.title) parsed.title = defaultTitle;
  if (!parsed.source) parsed.source = 'Sở Giáo dục và Đào tạo';
  if (!parsed.type) parsed.type = 'rubric';

  return parsed;
}

/**
 * 4. Trợ Lý Copilot Chat
 */
export async function copilotChatAI(params: {
  message: string;
  projectContext: {
    title: string;
    subject: string;
    gradeLevel: string;
  };
  activeSection: string;
  ragKnowledge: string;
  onModelSwitch?: (model: string) => void;
}): Promise<string> {
  const prompt = `BỐI CẢNH ĐỀ TÀI CỦA GIÁO VIÊN:
Tên đề tài: ${params.projectContext?.title || 'Chưa đặt'}
Môn học: ${params.projectContext?.subject || 'GDPT'} | Cấp lớp: ${params.projectContext?.gradeLevel || 'THPT/THCS/Tiểu học'}
Mục hiện tại giáo viên đang viết: ${params.activeSection || 'Tổng quan'}

KIM CHỈ NAM CÔNG VĂN & QUY ĐỊNH ĐÃ NẠP:
${params.ragKnowledge || 'Áp dụng các chuẩn mực GDPT 2018.'}

YÊU CẦU TỪ GIÁO VIÊN:
${params.message}

HÃY TRẢ LỜI CỤ THỂ, ĐÚNG TRỌNG TÂM SƯ PHẠM, ĐƯA RA VÍ DỤ HOẶC ĐOẠN VĂN MẪU CÓ THỂ COPY TRỰC TIẾP VÀO BÀI SKKN:`;

  const result = await callGeminiWithFallback(
    {
      systemInstruction: SYSTEM_PROMPT_SKKN_EXPERT,
      contents: prompt,
      generationConfig: {
        temperature: 0.7,
      },
    },
    params.onModelSwitch
  );

  return result.text;
}

/**
 * 5. Hội Đồng Phản Biện Ảo (Simulated Defense)
 */
export async function simulatedDefenseAI(params: {
  judgeName: string;
  judgeRole: string;
  projectTitle: string;
  history: any[];
  userReply: string;
  onModelSwitch?: (model: string) => void;
}): Promise<string> {
  const prompt = `Bạn đang đóng vai Giám khảo Hội đồng Chấm Sáng kiến Kinh nghiệm:
- Họ tên Giám khảo: ${params.judgeName}
- Vai trò & Phong cách: ${params.judgeRole}
- Đề tài đang thẩm vấn: "${params.projectTitle}"

LỊCH SỬ TRAO ĐỔI TRƯỚC ĐÓ:
${JSON.stringify(params.history || [])}

CÂU TRẢ LỜI / PHẢN HỒI MỚI NHẤT CỦA GIÁO VIÊN:
"${params.userReply}"

HÃY ĐƯA RA LỜI NHẬN XÉT, PHẢN BIỆN TIẾP THEO HOẶC ĐẶT THÊM CÂU HỎI THỬ THÁCH (Giữ phong thái chuẩn mực, chuyên nghiệp, thực tế sư phạm và đưa ra gợi ý cách hoàn thiện bài viết):`;

  const result = await callGeminiWithFallback(
    {
      systemInstruction: 'Bạn là giám khảo phản biện chuyên nghiệp, sắc sảo, công tâm của Hội đồng Khoa học ngành Giáo dục.',
      contents: prompt,
      generationConfig: {
        temperature: 0.7,
      },
    },
    params.onModelSwitch
  );

  return result.text;
}
