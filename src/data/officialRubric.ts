import { CouncilMember, RAGDocument } from '../types';

export const OFFICIAL_COUNCIL_MEMBERS: CouncilMember[] = [
  {
    id: 'judge-thang',
    name: 'TS. Nguyễn Đức Thắng',
    title: 'Phó Trưởng phòng GD Trung học - Sở GD&ĐT',
    avatar: '👨‍🏫',
    institution: 'Hội đồng Khoa học Ngành GD&ĐT',
    style: 'Khó tính, kiểm tra gắt gao tính khoa học, cơ sở lý luận, tính pháp lý và tính khả thi trong bối cảnh thực tế.',
    initialQuestion:
      'Thưa Thầy/Cô, trong các giải pháp đưa ra, giải pháp nào là "đột phá mới" chưa từng có tiền lệ tại đơn vị? Thầy/Cô đã kiểm chứng tính tương thích của giải pháp này với chuẩn đầu ra môn học theo Thông tư 32/2018/TT-BGDĐT như thế nào?',
  },
  {
    id: 'judge-lan',
    name: 'ThS. Phạm Mai Lan',
    title: 'Chuyên viên Phương pháp Dạy học GDPT 2018',
    avatar: '👩‍🏫',
    institution: 'Viện Khoa học Giáo dục',
    style: 'Sâu sát về phương pháp sư phạm, coi trọng tính chủ động tích cực của học sinh, chống hình thức và quá tải.',
    initialQuestion:
      'Đề tài đề cập nhiều đến ứng dụng công nghệ và chuyển đổi số. Thầy/Cô làm thế nào để đảm bảo 100% học sinh, kể cả những em có hoàn cảnh gia đình khó khăn, không có thiết bị cá nhân, vẫn tham gia bình đẳng và đạt mục tiêu học tập?',
  },
  {
    id: 'judge-hai',
    name: 'PGS.TS Hoàng Văn Hải',
    title: 'Chuyên gia Đo lường & Đánh giá Sư phạm',
    avatar: '👨‍🔬',
    institution: 'Trường Đại học Sư phạm',
    style: 'Bắt bẻ chặt chẽ về số liệu, độ tin cậy của mẫu thực nghiệm, kiểm định thống kê T-test và tính bền vững của kết quả.',
    initialQuestion:
      'Tôi quan sát bảng số liệu thực nghiệm của Thầy/Cô: Nhóm đối chứng và Nhóm thực nghiệm có sự chênh lệch điểm số sau tác động. Thầy/Cô đã loại trừ các biến ngoại lai (như việc học thêm, điều kiện gia đình) như thế nào để khẳng định sự tiến bộ này 100% là do biện pháp của mình mang lại?',
  },
];

export const OFFICIAL_RAG_DOCUMENTS: RAGDocument[] = [
  {
    id: 'rag-01',
    title: 'Quy chế Thẩm định & Chấm điểm Sáng kiến cấp Tỉnh/Thành phố (Thang 100 điểm)',
    source: 'Hội đồng Sáng kiến Ngành GD&ĐT 2026',
    type: 'rubric',
    rules: [
      'Tiêu chí 1: Tính mới và tính sáng tạo (30 điểm) - Ý tưởng không trùng lặp, có giải pháp mới đột phá.',
      'Tiêu chí 2: Tính khoa học và sư phạm (25 điểm) - Chuẩn GDPT 2018, cơ sở lý luận rõ ràng, văn phong khúc chiết.',
      'Tiêu chí 3: Hiệu quả thực tiễn (30 điểm) - Tác động tích cực đến học sinh, có số liệu đối chứng trước/sau tác động có ý nghĩa thống kê.',
      'Tiêu chí 4: Khả năng nhân rộng & Hình thức (15 điểm) - Thể thức văn bản chuẩn Times New Roman 14, dễ chuyển giao cho đồng nghiệp.',
      'Quy định xếp loại: Giải Nhất: từ 90-100đ; Giải Nhì: từ 80-89đ; Giải Ba: từ 70-79đ; Khuyến khích: từ 60-69đ.',
    ],
    content: `Căn cứ Nghị định số 13/2012/NĐ-CP và Thông tư số 18/2013/TT-BKHCN về quy chuẩn sáng kiến. Bài viết SKKN phải chỉ rõ: Tên sáng kiến phải ngắn gọn, phản ánh rõ bản chất giải pháp. Không sao chép các đề tài đã công bố. Minh chứng sư phạm phải được chụp hoặc số hóa có xác nhận của Ban giám hiệu.`,
    isActive: true,
  },
  {
    id: 'rag-02',
    title: 'Công văn 5512/BGDĐT-GDTrH về Xây dựng Kế hoạch bài dạy & Đổi mới PPDH',
    source: 'Bộ Giáo dục và Đào tạo',
    type: 'circular',
    rules: [
      'Chuẩn 4 bước hoạt động học: Khởi động - Khám phá hình thành kiến thức - Luyện tập - Vận dụng.',
      'Mỗi hoạt động phải chỉ rõ: Mục tiêu, Nội dung, Sản phẩm học tập và Cách thức tổ chức thực hiện.',
      'Tập trung phát triển phẩm chất chủ yếu (Yêu nước, Nhân ái, Chăm chỉ, Trung thực, Trách nhiệm) và năng lực chung/chuyên môn.',
    ],
    content: `Công văn hướng dẫn giáo viên thiết kế tiến trình dạy học lấy học sinh làm trung tâm, giáo viên đóng vai trò tổ chức, hướng dẫn, gợi mở và đánh giá. Không áp đặt giải pháp một chiều.`,
    isActive: true,
  },
  {
    id: 'rag-03',
    title: 'Khung Năng lực Số và Định hướng Chuyển đổi số trong Giáo dục đến năm 2026',
    source: 'Đề án 131/QĐ-TTg của Thủ tướng Chính phủ',
    type: 'guideline',
    rules: [
      'Khuyến khích ứng dụng Trí tuệ nhân tạo (AI) có trách nhiệm trong dạy học và tự học.',
      'Tích hợp công cụ số hóa kiểm tra đánh giá thường xuyên (Formative Assessment).',
      'Xây dựng học liệu số mở và phát triển kỹ năng an toàn thông tin số cho học sinh.',
    ],
    content: `Định hướng ưu tiên điểm cộng từ 2-5 điểm cho các đề tài SKKN có tính năng tiên phong ứng dụng công cụ số, AI hỗ trợ học sinh tự học và cá nhân hóa lộ trình học tập.`,
    isActive: true,
  },
];
