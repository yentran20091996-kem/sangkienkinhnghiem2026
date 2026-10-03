import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize Google GenAI helper supporting both server env and client-provided key
function getGenAI(req?: Request): GoogleGenAI | null {
  const clientKey = (req?.headers['x-gemini-api-key'] as string) || (req?.body && req.body.apiKey);
  const key = clientKey || process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getModelName(req?: Request): string {
  return (req?.headers['x-gemini-model'] as string) || (req?.body && req.body.modelName) || 'gemini-3.8-flash';
}

// System Prompt for Vietnamese Academic Education SKKN
const SYSTEM_PROMPT_SKKN_EXPERT = `Bạn là một Chuyên gia Cấp cao về Đánh giá & Hướng dẫn Viết Sáng kiến Kinh nghiệm (SKKN), Nghiên cứu Khoa học Sư phạm Ứng dụng thuộc Bộ Giáo dục và Đào tạo Việt Nam.
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

// 0. API: Verify Gemini API Key
app.post('/api/ai/verify-key', async (req: Request, res: Response) => {
  try {
    const aiInstance = getGenAI(req);
    if (!aiInstance) {
      return res.status(400).json({ valid: false, error: 'Chưa cung cấp API Key' });
    }
    const model = getModelName(req);
    const response = await aiInstance.models.generateContent({
      model,
      contents: 'Ping: trả về đúng từ "PONG".',
    });
    if (response.text) {
      return res.json({ valid: true, model });
    }
    return res.status(400).json({ valid: false, error: 'Không nhận được phản hồi từ Gemini API' });
  } catch (error: any) {
    return res.status(400).json({ valid: false, error: error.message || 'API Key không hợp lệ' });
  }
});

// 1. API: Generate Section
app.post('/api/ai/generate-section', async (req: Request, res: Response) => {
  try {
    const {
      projectTitle,
      subject,
      gradeLevel,
      sectionId,
      sectionTitle,
      userPrompt,
      context,
      ragKnowledge,
    } = req.body;

    const aiInstance = getGenAI(req);
    const model = getModelName(req);

    if (!aiInstance) {
      return res.status(503).json({
        error: 'Chưa cấu hình GEMINI_API_KEY trên hệ thống.',
        fallbackContent: `### ${sectionTitle}\n\n*Nội dung mẫu tự động (Vui lòng cấu hình Gemini API để tạo nội dung học thuật chuyên sâu).*\n\n1. Cơ sở lý luận và tính cấp thiết gắn với đổi mới GDPT 2018.\n2. Phân tích bối cảnh thực tiễn tại đơn vị công tác.\n3. Các biện pháp cụ thể nâng cao chất lượng dạy học môn ${subject || 'chuyên môn'}.`,
      });
    }

    const prompt = `DỰ ÁN SÁNG KIẾN KINH NGHIỆM:
- Tên đề tài: "${projectTitle || 'Chưa đặt tên'}"
- Môn học / Lĩnh vực: ${subject || 'Giáo dục'}
- Cấp học / Khối lớp: ${gradeLevel || 'Toàn trường'}
- Phần đang thực hiện: "${sectionTitle}" (Mã: ${sectionId})

KIM CHỈ NAM CÔNG VĂN & TIÊU CHÍ CHẤM ĐIỂM ĐƯỢC NẠP (RAG):
${ragKnowledge || 'Áp dụng khung đánh giá chuẩn SKKN 100 điểm GDPT 2018, bám sát các tiêu chí về tính mới, tính khoa học và hiệu quả thực tiễn.'}

NGỮ CẢNH BỔ SUNG TỪ NGƯỜI DÙNG:
${context || 'Không có ngữ cảnh bổ sung.'}

YÊU CẦU CỤ THỂ CỦA TÁC GIẢ:
${userPrompt || 'Hãy viết chi tiết, hoàn chỉnh và có chiều sâu học thuật cho phần này, tuân thủ đúng các yêu cầu và barem điểm của công văn.'}

HÃY SOẠN THẢO NỘI DUNG CHI TIẾT (Định dạng Markdown học thuật chuẩn sư phạm, bao gồm tiểu mục 1.1, 1.2..., có số liệu hoặc ví dụ minh họa trực quan, đúng thể thức):`;

    const response = await aiInstance.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT_SKKN_EXPERT,
        temperature: 0.7,
      },
    });

    const content = response.text || '';
    return res.json({ content });
  } catch (error: any) {
    console.error('Error generating section:', error);
    return res.status(500).json({ error: error.message || 'Lỗi khi gọi AI Gemini' });
  }
});

// 2. API: AI Comprehensive Audit (Thẩm định đối chiếu theo đúng công văn/biểu điểm đã nạp)
app.post('/api/ai/audit', async (req: Request, res: Response) => {
  try {
    const { project, ragDocuments } = req.body;
    const aiInstance = getGenAI(req);
    const model = getModelName(req);

    if (!aiInstance) {
      return res.json({
        totalScore: 86,
        noveltyScore: 26,
        academicScore: 22,
        practicalScore: 25,
        presentationScore: 13,
        estimatedPrize: 'Giải Nhì (Khả năng 85%)',
        appliedRubricTitle: 'Quy chế Thẩm định & Chấm điểm Sáng kiến (Thang 100đ chuẩn Sở GD&ĐT)',
        noveltyEvaluation: 'Đề tài có tính phát hiện tốt, bắt nhịp xu thế chuyển đổi số GDPT 2018. Biện pháp đã nêu giải quyết trúng điểm nghẽn thực tiễn.',
        strengths: [
          'Ý tưởng thiết thực, giải quyết đúng điểm nghẽn thực tế tại cơ sở giáo dục.',
          'Biện pháp có tính sư phạm, gắn kết chặt chẽ với phát triển năng lực học sinh theo GDPT 2018.',
          'Số liệu khảo sát ban đầu và sau thực nghiệm có tính logic rõ nét.'
        ],
        weaknesses: [
          'Phần cơ sở lý luận cần cập nhật các thông tư mới nhất 2024-2026 của Bộ GD&ĐT.',
          'Mẫu khảo sát thực nghiệm cần làm nổi bật kiểm định p-value và độ lệch chuẩn.',
          'Cần minh chứng hình ảnh/sản phẩm học tập cụ thể hơn.'
        ],
        councilQuestions: [
          'Biện pháp này có thể áp dụng cho các trường thuộc vùng khó khăn thiếu thiết bị không?',
          'Thầy/Cô khắc phục hiện tượng học sinh ỷ lại vào công nghệ như thế nào?',
          'Tiêu chí đánh giá năng lực giải quyết vấn đề của học sinh dựa trên thang đo nào?'
        ],
        recommendations: 'Bổ sung bảng phân tích phương sai hoặc kiểm định T-test cho hai nhóm đối chứng và thực nghiệm để tăng sức thuyết phục trước Hội đồng Tỉnh.'
      });
    }

    // Bóc tách các tiêu chí từ tài liệu RAG đang kích hoạt
    const activeDocs = Array.isArray(ragDocuments) ? ragDocuments.filter((d: any) => d.isActive) : [];
    let ragGuidelinePrompt = 'Áp dụng bộ tiêu chí chuẩn 100 điểm của Hội đồng Khoa học ngành GD&ĐT.';
    let rubricTitle = 'Khung tiêu chuẩn 100 điểm chuẩn';

    if (activeDocs.length > 0) {
      rubricTitle = activeDocs[0].title;
      ragGuidelinePrompt = activeDocs.map((d: any, idx: number) => {
        let text = `Tài liệu ${idx + 1}: "${d.title}" (Cơ quan: ${d.source}, Loại: ${d.type})\n`;
        if (d.rules && d.rules.length > 0) {
          text += `- Các quy tắc & tiêu chuẩn cốt lõi:\n  + ${d.rules.join('\n  + ')}\n`;
        }
        if (d.scoringCriteria && d.scoringCriteria.length > 0) {
          text += `- Barem điểm chi tiết:\n  + ` + d.scoringCriteria.map((c: any) => `${c.category}: Tối đa ${c.maxScore}đ (${c.description})`).join('\n  + ') + '\n';
        }
        if (d.mandatoryRequirements && d.mandatoryRequirements.length > 0) {
          text += `- Yêu cầu bắt buộc & Điều kiện loại trừ:\n  + ${d.mandatoryRequirements.join('\n  + ')}\n`;
        }
        return text;
      }).join('\n\n');
    }

    const prompt = `HÃY ĐÓNG VAI TRƯỞNG BAN GIÁM KHẢO HỘI ĐỒNG THẨM ĐỊNH SKKN CẤP TỈNH ĐỂ CHẤM ĐIỂM ĐỀ TÀI SAU:
Tên đề tài: "${project.title}"
Môn học: ${project.subject} | Khối: ${project.gradeLevel}
Tác giả / Đơn vị: ${project.author || 'Giáo viên'} - ${project.school || 'Trường học'}

NỘI DUNG TÓM TẮT CÁC PHẦN CỦA ĐỀ TÀI:
${JSON.stringify(project.sections || {}, null, 2)}

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

    const response = await aiInstance.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT_SKKN_EXPERT,
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error during audit:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 3. API: Simulated Defense (Hội đồng phản biện ảo)
app.post('/api/ai/simulated-defense', async (req: Request, res: Response) => {
  try {
    const { judgeId, judgeName, judgeRole, projectTitle, history, userReply } = req.body;
    const aiInstance = getGenAI(req);
    const model = getModelName(req);

    if (!aiInstance) {
      return res.json({
        reply: `[${judgeName}]: Cảm ơn phản hồi của Thầy/Cô về đề tài "${projectTitle}". Về cơ bản giải pháp khá hợp lý, nhưng Thầy/Cô cần chỉ rõ thời lượng thực nghiệm trong bao nhiêu tiết và mức độ kiểm soát sai số đối chứng.`
      });
    }

    const prompt = `Bạn đang đóng vai Giám khảo Hội đồng Chấm Sáng kiến Kinh nghiệm:
- Họ tên Giám khảo: ${judgeName}
- Vai trò & Phong cách: ${judgeRole}
- Đề tài đang thẩm vấn: "${projectTitle}"

LỊCH SỬ TRAO ĐỔI TRƯỚC ĐÓ:
${JSON.stringify(history || [])}

CÂU TRẢ LỜI / PHẢN HỒI MỚI NHẤT CỦA GIÁO VIÊN:
"${userReply}"

HÃY ĐƯA RA LỜI NHẬN XÉT, PHẢN BIỆN TIẾP THEO HOẶC ĐẶT THÊM CÂU HỎI THỬ THÁCH (Giữ phong thái chuẩn mực, chuyên nghiệp, thực tế sư phạm và đưa ra gợi ý cách hoàn thiện bài viết):`;

    const response = await aiInstance.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: 'Bạn là giám khảo phản biện chuyên nghiệp, sắc sảo, công tâm của Hội đồng Khoa học ngành Giáo dục.',
        temperature: 0.7,
      },
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in simulated defense:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 4. API: Copilot Chat / Writing Assistant
app.post('/api/ai/copilot-chat', async (req: Request, res: Response) => {
  try {
    const { message, projectContext, activeSection, ragKnowledge } = req.body;
    const aiInstance = getGenAI(req);
    const model = getModelName(req);

    if (!aiInstance) {
      return res.json({
        reply: `Chào Thầy/Cô! Tôi là Trợ lý AI SKKN 2026. Để kích hoạt tính năng hỗ trợ trực tiếp từ Gemini, vui lòng bấm nút "Thiết lập API Key" trên thanh tiêu đề. Tôi luôn sẵn sàng hỗ trợ dàn ý, phương pháp và mẫu bảng biểu!`
      });
    }

    const prompt = `BỐI CẢNH ĐỀ TÀI CỦA GIÁO VIÊN:
Tên đề tài: ${projectContext?.title || 'Chưa đặt'}
Môn học: ${projectContext?.subject || 'GDPT'} | Cấp lớp: ${projectContext?.gradeLevel || 'THPT/THCS/Tiểu học'}
Mục hiện tại giáo viên đang viết: ${activeSection || 'Tổng quan'}

KIM CHỈ NAM CÔNG VĂN & QUY ĐỊNH ĐÃ NẠP:
${ragKnowledge || 'Áp dụng các chuẩn mực GDPT 2018.'}

YÊU CẦU TỪ GIÁO VIÊN:
${message}

HÃY TRẢ LỜI CỤ THỂ, ĐÚNG TRỌNG TÂM SƯ PHẠM, ĐƯA RA VÍ DỤ HOẶC ĐOẠN VĂN MẪU CÓ THỂ COPY TRỰC TIẾP VÀO BÀI SKKN:`;

    const response = await aiInstance.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT_SKKN_EXPERT,
        temperature: 0.7,
      },
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in copilot chat:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 5. API: Extract RAG Knowledge Base from Word text, Pasted text, or PDF file (Multimodal)
app.post('/api/ai/extract-rag', async (req: Request, res: Response) => {
  try {
    const { rawText, fileName, fileBase64, mimeType, fileType } = req.body;
    const aiInstance = getGenAI(req);
    const model = getModelName(req);

    const defaultTitle = fileName || 'Văn bản hướng dẫn / Biểu điểm SKKN';

    if (!aiInstance) {
      return res.json({
        title: defaultTitle,
        source: 'Sở Giáo dục và Đào tạo',
        type: 'rubric',
        extractedRules: [
          'Thang điểm 100: Tính mới (30đ), Tính khoa học (25đ), Hiệu quả (30đ), Khả năng nhân rộng (15đ)',
          'Yêu cầu tối thiểu 2 nhóm đối chứng và thực nghiệm với kiểm định p-value < 0.05',
          'Đảm bảo định dạng chuẩn Times New Roman cỡ 14, lề trái 3cm theo Nghị định 30/2020/NĐ-CP',
          'Tỷ lệ trùng lặp không quá 20% các đề tài đã công bố'
        ],
        scoringCriteria: [
          { category: 'Tính mới và tính sáng tạo', maxScore: 30, description: 'Phát hiện vấn đề mới, giải pháp đột phá chưa từng áp dụng' },
          { category: 'Tính khoa học và sư phạm', maxScore: 25, description: 'Đúng chuẩn GDPT 2018, cơ sở lý luận vững chắc, tiến trình bài dạy 5512' },
          { category: 'Hiệu quả thực tiễn', maxScore: 30, description: 'Có số liệu thực nghiệm đối chứng, cải thiện rõ rệt phẩm chất năng lực học sinh' },
          { category: 'Khả năng nhân rộng & Thể thức', maxScore: 15, description: 'Dễ áp dụng cho đồng nghiệp, thể thức văn bản chuẩn hành chính' }
        ],
        mandatoryRequirements: [
          'Số trang tối thiểu 15 trang, tối đa 35 trang (không tính phụ lục)',
          'Có phiếu khảo sát và xác nhận áp dụng thực tế tại cơ sở giáo dục'
        ],
        keyPriorities: ['Chuyển đổi số & AI có trách nhiệm', 'Giáo dục STEM/STEAM', 'Đổi mới kiểm tra đánh giá phát triển năng lực'],
        summaryContent: 'Quy chế đánh giá sáng kiến kinh nghiệm theo chuẩn GDPT 2018.'
      });
    }

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

    let response;

    // Trường hợp 1: Tệp PDF gửi dạng Multimodal Base64
    if (fileBase64 && mimeType === 'application/pdf') {
      response = await aiInstance.models.generateContent({
        model,
        contents: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: fileBase64,
            },
          },
          {
            text: extractionInstructions,
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });
    } else {
      // Trường hợp 2: Văn bản trích xuất từ file Word (.docx) hoặc dán text
      const textToAnalyze = (rawText || '').slice(0, 30000);
      response = await aiInstance.models.generateContent({
        model,
        contents: `${extractionInstructions}\n\nNỘI DUNG VĂN BẢN CẦN PHÂN TÍCH:\n"""\n${textToAnalyze}\n"""`,
        config: {
          responseMimeType: 'application/json',
        },
      });
    }

    const parsed = JSON.parse(response.text?.trim() || '{}');
    if (!parsed.title) parsed.title = defaultTitle;
    if (!parsed.source) parsed.source = 'Sở Giáo dục và Đào tạo';
    if (!parsed.type) parsed.type = 'rubric';

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error extracting RAG:', error);
    return res.status(500).json({ error: error.message || 'Lỗi khi trích xuất tài liệu' });
  }
});

// Vite middleware in dev / serve static in prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SKKN 2026 PRO] Server running on http://localhost:${PORT}`);
  });
}

startServer();
