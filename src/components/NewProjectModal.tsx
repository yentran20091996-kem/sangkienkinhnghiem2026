import React, { useState } from 'react';
import { PlusCircle, X, Sparkles, BookOpen } from 'lucide-react';
import { SKKNProject } from '../types';
import { OFFICIAL_RAG_DOCUMENTS } from '../data/officialRubric';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: SKKNProject) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [authorTitle, setAuthorTitle] = useState('Giáo viên Hạng II - GV Giỏi Cấp Huyện');
  const [subject, setSubject] = useState('Toán học');
  const [gradeLevel, setGradeLevel] = useState('Khối 10 (THPT)');
  const [school, setSchool] = useState('');
  const [district, setDistrict] = useState('Quận Ba Đình');
  const [province, setProvince] = useState('TP. Hà Nội');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !school.trim()) return;

    const newProject: SKKNProject = {
      id: `proj-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      authorTitle: authorTitle.trim(),
      subject,
      gradeLevel,
      school: school.trim(),
      district: district.trim(),
      province: province.trim(),
      academicYear: '2025 - 2026',
      status: 'draft',
      noveltyRating: 85,
      sections: {
        overview: {
          id: 'overview',
          title: '1. Tổng quan & Hồ sơ đề tài',
          subtitle: 'Thông tin tác giả, đơn vị, mã số chuyên đề và tóm tắt đề tài',
          isCompleted: false,
          wordCount: 0,
          guidelines: ['Tên đề tài ngắn gọn, phản ánh rõ bản chất giải pháp.'],
          content: `### THÔNG TIN ĐỀ TÀI SÁNG KIẾN KINH NGHIỆM\n\n- **Tên sáng kiến:** ${title}\n- **Tác giả:** ${author} (${authorTitle})\n- **Đơn vị:** ${school} - ${district}, ${province}\n- **Môn học:** ${subject} | **Khối lớp:** ${gradeLevel}\n\n### TÓM TẮT ĐỀ TÀI\n*Nhập bản tóm tắt nội dung nghiên cứu và mục tiêu đột phá tại đây...*`,
        },
        problem: {
          id: 'problem',
          title: '2. Đặt vấn đề & Lý do chọn đề tài',
          subtitle: 'Tính cấp thiết, cơ sở pháp lý, cơ sở lý luận & thực tiễn GDPT 2018',
          isCompleted: false,
          wordCount: 0,
          guidelines: ['Trích dẫn Thông tư 32/2018/TT-BGDĐT và cơ sở lý luận.'],
          content: `### 1. TÍNH CẤP THIẾT CỦA ĐỀ TÀI\n\nTrong bối cảnh triển khai Chương trình GDPT 2018 môn ${subject}, việc đổi mới phương pháp dạy học là yêu cầu tất yếu...`,
        },
        current_situation: {
          id: 'current_situation',
          title: '3. Thực trạng & Khảo sát ban đầu',
          subtitle: 'Bối cảnh trường học, thuận lợi, khó khăn và số liệu điều tra gốc',
          isCompleted: false,
          wordCount: 0,
          guidelines: ['Thuận lợi, khó khăn và bảng khảo sát đầu vào.'],
          content: `### 1. THUẬN LỢI VÀ KHÓ KHĂN TẠI ${school.toUpperCase()}\n\n- **Thuận lợi:** Ban Giám hiệu quan tâm, giáo viên nhiệt huyết...\n- **Khó khăn:** Một số học sinh còn thụ động trong giờ học...`,
        },
        solutions: {
          id: 'solutions',
          title: '4. Hệ thống Giải pháp & Biện pháp đột phá',
          subtitle: 'Quy trình các bước, kế hoạch bài dạy 5512, kỹ thuật dạy học mới',
          isCompleted: false,
          wordCount: 0,
          guidelines: ['Đưa ra từ 3-4 giải pháp có tính sáng tạo và khả thi.'],
          content: `### HỆ THỐNG CÁC BIỆN PHÁP THỰC HIỆN\n\n- **Biện pháp 1:** Xây dựng tình huống học tập gắn liền với thực tiễn...\n- **Biện pháp 2:** Ứng dụng công cụ số hỗ trợ học sinh tương tác nhóm...\n- **Biện pháp 3:** Thiết kế phiếu đánh giá quá trình và sản phẩm học tập...`,
        },
        experiment: {
          id: 'experiment',
          title: '5. Thực nghiệm sư phạm & Phân tích số liệu',
          subtitle: 'Kiểm chứng định lượng, đối chứng 2 lớp, kiểm định T-test',
          isCompleted: false,
          wordCount: 0,
          guidelines: ['Số liệu trước và sau tác động giữa 2 nhóm tương đương.'],
          content: `### KẾT QUẢ THỰC NGHIỆM SƯ PHẠM\n\nTiến hành thực nghiệm trên 2 lớp tương đồng về trình độ đầu vào...`,
        },
        conclusion: {
          id: 'conclusion',
          title: '6. Kết luận & Khuyến nghị nhân rộng',
          subtitle: 'Bài học kinh nghiệm, điều kiện áp dụng, kiến nghị với BGH và Sở GD&ĐT',
          isCompleted: false,
          wordCount: 0,
          guidelines: ['Bài học kinh nghiệm và kiến nghị cụ thể.'],
          content: `### KẾT LUẬN VÀ BÀI HỌC KINH NGHIỆM\n\nSáng kiến đã góp phần nâng cao rõ rệt năng lực tự học của học sinh...`,
        },
        defense: {
          id: 'defense',
          title: '7. Thẩm định Hội đồng & Phản biện',
          subtitle: 'Kiểm định 100 điểm, phản biện trực tiếp với 3 giám khảo mô phỏng',
          isCompleted: false,
          wordCount: 0,
          guidelines: ['Chuẩn bị luận điểm giải trình các câu hỏi hóc búa.'],
          content: `### DỰ BÁO CÂU HỎI HỘI ĐỒNG CHẤM\n\nSẵn sàng đối thoại với Hội đồng chấm sáng kiến cấp Huyện/Tỉnh...`,
        },
      },
      surveyData: {
        controlClass: 'Lớp Đối chứng (40 HS)',
        experimentClass: 'Lớp Thực nghiệm (40 HS)',
        duration: 'Học kỳ I (12 tuần)',
        surveyTopic: `Năng lực & Kết quả học tập môn ${subject}`,
        preTestAvgScore: { control: 7.0, exp: 7.05 },
        postTestAvgScore: { control: 7.25, exp: 8.2 },
        pValue: 0.012,
        distribution: [
          { category: 'Giỏi (≥8.0)', preControl: 20.0, postControl: 25.0, preExp: 22.5, postExp: 50.0 },
          { category: 'Khá (6.5-7.9)', preControl: 45.0, postControl: 47.5, preExp: 45.0, postExp: 42.5 },
          { category: 'Trung bình (5.0-6.4)', preControl: 30.0, postControl: 25.0, preExp: 27.5, postExp: 7.5 },
          { category: 'Yếu (<5.0)', preControl: 5.0, postControl: 2.5, preExp: 5.0, postExp: 0.0 },
        ],
        softSkillsProgress: [
          { skill: 'Tính tích cực & chủ động', before: 30, after: 85 },
          { skill: 'Năng lực vận dụng thực tiễn', before: 25, after: 80 },
          { skill: 'Kỹ năng làm việc nhóm', before: 40, after: 88 },
        ],
      },
      councilChatHistory: [],
      ragDocuments: OFFICIAL_RAG_DOCUMENTS,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onCreateProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-orange-50 via-white to-purple-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6B00] to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Khởi Tạo Đề Tài SKKN 2026 Mới</h3>
              <p className="text-xs text-slate-500">
                Chuẩn hóa cấu trúc 7 bước theo Chương trình GDPT 2018
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên đề tài Sáng kiến kinh nghiệm: *
            </label>
            <textarea
              rows={2}
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Một số biện pháp ứng dụng sơ đồ tư duy số hóa phát triển tư duy hình học cho học sinh lớp 8..."
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tác giả (Thầy/Cô): *
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chức danh / Học vị:
              </label>
              <input
                type="text"
                value={authorTitle}
                onChange={(e) => setAuthorTitle(e.target.value)}
                placeholder="Giáo viên THPT Hạng II"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Môn học / Lĩnh vực:</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
              >
                <option value="Ngữ văn">Ngữ văn</option>
                <option value="Toán học">Toán học</option>
                <option value="Tiếng Anh">Tiếng Anh</option>
                <option value="Khoa học tự nhiên">Khoa học tự nhiên (Lý - Hóa - Sinh)</option>
                <option value="Lịch sử & Địa lý">Lịch sử & Địa lý</option>
                <option value="Tin học & Chuyển đổi số">Tin học & Chuyển đổi số</option>
                <option value="Giáo dục STEM/STEAM">Giáo dục STEM/STEAM</option>
                <option value="Giáo dục Tiểu học">Giáo dục Tiểu học</option>
                <option value="Giáo dục Mầm non">Giáo dục Mầm non</option>
                <option value="Công tác Quản lý & Chủ nhiệm">Công tác Quản lý & Chủ nhiệm</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cấp học / Khối lớp:</label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
              >
                <option value="Mầm non">Mầm non (3-5 tuổi)</option>
                <option value="Tiểu học (Lớp 1-5)">Tiểu học (Lớp 1 - 5)</option>
                <option value="THCS (Lớp 6-9)">THCS (Lớp 6 - 9)</option>
                <option value="THPT (Lớp 10-12)">THPT (Lớp 10 - 12)</option>
                <option value="Toàn trường">Toàn trường (Quản lý)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Đơn vị công tác (Trường học): *</label>
            <input
              type="text"
              required
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="Ví dụ: Trường THCS Nguyễn Du"
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Quận / Huyện:</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tỉnh / Thành phố:</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-orange-600 text-white font-bold text-xs hover:opacity-95 transition shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Khởi tạo & Bắt đầu viết</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
