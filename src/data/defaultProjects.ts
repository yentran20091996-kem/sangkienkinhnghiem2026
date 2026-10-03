import { SKKNProject } from '../types';
import { OFFICIAL_RAG_DOCUMENTS } from './officialRubric';

export const SAMPLE_PROJECTS: SKKNProject[] = [
  {
    id: 'skkn-proj-01',
    title: 'Ứng dụng Trí tuệ Nhân tạo và Nền tảng Số phát triển năng lực tự học cho học sinh THPT trong môn Ngữ văn theo chương trình GDPT 2018',
    author: 'Nguyễn Thị Hải Yến',
    authorTitle: 'Giáo viên THPT Hạng II - GV Giỏi Cấp Tỉnh',
    school: 'Trường THPT Chuyên Lê Quý Đôn',
    district: 'Quận Hải Châu',
    province: 'TP. Đà Nẵng',
    subject: 'Ngữ văn',
    gradeLevel: 'Khối 10, 11 (THPT)',
    academicYear: '2025 - 2026',
    status: 'in_review',
    noveltyRating: 94,
    sections: {
      overview: {
        id: 'overview',
        title: '1. Tổng quan & Hồ sơ đề tài',
        subtitle: 'Thông tin tác giả, đơn vị, mã số chuyên đề và tóm tắt đề tài',
        isCompleted: true,
        wordCount: 420,
        lastUpdated: 'Hôm nay',
        guidelines: [
          'Tên đề tài ngắn gọn, chỉ rõ đối tượng nghiên cứu, phạm vi và mục tiêu.',
          'Nêu bật từ khóa: GDPT 2018, Trí tuệ nhân tạo, Tự học, Ngữ văn.',
          'Tóm tắt đề tài dưới 300 từ làm nổi bật tính mới và hiệu quả kiểm chứng.'
        ],
        content: `### THÔNG TIN CHUNG VỀ SÁNG KIẾN KINH NGHIỆM

- **Tên sáng kiến:** Ứng dụng Trí tuệ Nhân tạo và Nền tảng Số phát triển năng lực tự học cho học sinh THPT trong môn Ngữ văn theo chương trình GDPT 2018.
- **Tác giả:** Nguyễn Thị Hải Yến
- **Chức vụ / Đơn vị:** Tổ trưởng Chuyên môn Ngữ văn - Trường THPT Chuyên Lê Quý Đôn.
- **Lĩnh vực áp dụng:** Đổi mới phương pháp dạy học & chuyển đổi số môn Ngữ văn cấp THPT.
- **Thời gian áp dụng thử nghiệm:** Từ tháng 9/2025 đến tháng 1/2026 (Học kỳ I).

### TÓM TẮT ĐỀ TÀI (ABSTRACT)
Sáng kiến tập trung giải quyết bài toán cốt lõi: Làm thế nào để học sinh không còn thụ động ghi nhớ văn mẫu, mà biết sử dụng có trách nhiệm các công cụ Trí tuệ nhân tạo (Generative AI) kết hợp với các nền tảng Padlet, Notion và Quizizz nhằm phát triển năng lực tự chủ, tự học và tư duy phản biện văn học. Bằng việc xây dựng quy trình 4 giai đoạn ("Khơi gợi - Tương tác AI đối thoại - Thẩm định phản biện - Tác phẩm sáng tạo cá nhân"), đề tài đã mang lại bước nhảy vọt về kết quả học tập tại 2 lớp thực nghiệm 10A1 và đối chứng 10A2, tỷ lệ học sinh đạt điểm Giỏi tăng từ 26.2% lên 57.1% với độ tin cậy kiểm định thống kê p < 0.01.`
      },
      problem: {
        id: 'problem',
        title: '2. Đặt vấn đề & Lý do chọn đề tài',
        subtitle: 'Tính cấp thiết, cơ sở pháp lý, cơ sở lý luận & thực tiễn GDPT 2018',
        isCompleted: true,
        wordCount: 880,
        lastUpdated: 'Hôm nay',
        guidelines: [
          'Trích dẫn Nghị quyết 29-NQ/TW và Thông tư 32/2018/TT-BGDĐT.',
          'Phân tích mâu thuẫn giữa yêu cầu phát triển năng lực tự học với thực trạng phụ thuộc văn mẫu.',
          'Chỉ rõ tính cấp thiết của việc làm chủ công nghệ AI trong năm học 2025-2026.'
        ],
        content: `### 1. TÍNH CẤP THIẾT CỦA ĐỀ TÀI

Chương trình Giáo dục phổ thông 2018 (Ban hành kèm theo Thông tư số 32/2018/TT-BGDĐT ngày 26/12/2018 của Bộ trưởng Bộ GD&ĐT) đã đánh dấu bước chuyển mình mang tính lịch sử: chuyển từ nền giáo dục nặng về **truyền thụ kiến thức** sang nền giáo dục chú trọng **hình thành phẩm chất và phát triển năng lực** người học. Trong các năng lực cốt lõi chung, "Năng lực tự chủ và tự học" đóng vai trò nền tảng, là chìa khóa để học sinh học tập suốt đời trong kỷ nguyên số.

Tuy nhiên, môn Ngữ văn ở bậc THPT lâu nay vẫn chịu sự chi phối nặng nề của lối mòn "đọc - chép", học sinh ỷ lại vào các bài văn mẫu trên mạng Internet hoặc học thuộc dàn ý của giáo viên. Đáng báo động hơn, sự bùng nổ của các mô hình AI tạo sinh từ năm 2023 đến nay nếu không được định hướng sư phạm đúng đắn sẽ khiến học sinh biến thành "người sao chép nội dung thụ động từ máy móc", làm xói mòn cảm xúc thẩm mỹ và năng lực tư duy ngôn ngữ.

### 2. CƠ SỞ PHÁP LÝ VÀ CHÍNH SÁCH
- Nghị quyết số 29-NQ/TW của Ban Chấp hành Trung ương Đảng về đổi mới căn bản, toàn diện giáo dục và đào tạo.
- Quyết định số 131/QĐ-TTg của Thủ tướng Chính phủ phê duyệt Đề án "Tăng cường ứng dụng công nghệ thông tin và chuyển đổi số trong giáo dục và đào tạo giai đoạn 2022 - 2025, định hướng đến năm 2030".
- Hướng dẫn thực hiện nhiệm vụ năm học 2025 - 2026 của Sở Giáo dục và Đào tạo về việc đẩy mạnh đổi mới phương pháp dạy học và kiểm tra đánh giá theo định hướng phát triển năng lực học sinh.

### 3. CƠ SỞ THỰC TIỄN TẠI ĐƠN VỊ
Tại trường THPT Chuyên Lê Quý Đôn, qua khảo sát đầu năm học 2025-2026 với 120 học sinh khối 10:
- **71.5%** học sinh thừa nhận thường xuyên tra cứu văn mẫu hoặc nhờ công cụ AI tóm tắt tác phẩm nhưng không biết cách phân tích phản biện.
- **64.2%** học sinh gặp khó khăn trong việc tự lập kế hoạch đọc sách và viết bài luận độc lập.
- Giáo viên tốn nhiều thời gian chấm bài nhưng hiệu quả sửa lỗi diễn đạt và kích hoạt cảm thụ văn học cá nhân chưa cao.

Xuất phát từ những lý do mang tính cấp bách nêu trên, tôi chọn đề tài: *"Ứng dụng Trí tuệ Nhân tạo và Nền tảng Số phát triển năng lực tự học cho học sinh THPT trong môn Ngữ văn theo chương trình GDPT 2018"* làm công trình nghiên cứu và ứng dụng thực nghiệm.`
      },
      current_situation: {
        id: 'current_situation',
        title: '3. Thực trạng & Khảo sát ban đầu',
        subtitle: 'Bối cảnh trường học, thuận lợi, khó khăn và số liệu điều tra gốc',
        isCompleted: true,
        wordCount: 750,
        lastUpdated: 'Hôm nay',
        guidelines: [
          'Nêu rõ thuận lợi (Cơ sở vật chất, mạng Wifi, sự chỉ đạo của BGH).',
          'Khó khăn thực tế (Tâm lý học sinh, kỹ năng sử dụng AI an toàn).',
          'Trình bày bảng số liệu khảo sát đầu vào trước khi áp dụng giải pháp.'
        ],
        content: `### 1. THUẬN LỢI VÀ KHÓ KHĂN TRONG BỐI CẢNH DẠY HỌC HIỆN NAY

#### 1.1. Về phía thuận lợi:
- **Cơ sở vật chất:** 100% phòng học được trang bị màn hình tương tác thông minh, đường truyền Internet cáp quang tốc độ cao.
- **Học sinh:** 98% học sinh có điện thoại thông minh hoặc máy tính cá nhân phục vụ việc học tập tại nhà; thế hệ Gen Z nhanh nhạy với công nghệ mới.
- **Sự chỉ đạo của Ban Giám hiệu:** Nhà trường luôn tạo điều kiện tối đa cho giáo viên thử nghiệm các phương pháp dạy học tiên tiến và chuyển đổi số.

#### 1.2. Về phía khó khăn, bất cập:
- **Về nhận thức:** Một bộ phận giáo viên và phụ huynh còn lo ngại học sinh lạm dụng AI để gian lận làm bài tập về nhà.
- **Về kỹ năng của học sinh:** Học sinh biết dùng AI để hỏi đáp nhanh nhưng thiếu "kỹ năng đặt câu lệnh sư phạm (Prompt Engineering)", không biết thẩm định độ chính xác (hiện tượng Hallucination của AI) và thiếu tư duy phản biện so sánh với văn bản gốc.
- **Về đánh giá:** Các bài kiểm tra truyền thống khó kiểm soát được mức độ tự học thực chất của từng cá nhân.

### 2. SỐ LIỆU ĐIỀU TRA KHẢO SÁT BAN ĐẦU (THÁNG 9/2025)

Chúng tôi tiến hành khảo sát trên 2 lớp tương đồng về trình độ đầu vào:
- **Lớp Đối chứng (10A2):** 40 học sinh (Dạy học theo phương pháp truyền thống kết hợp slide thuyết trình).
- **Lớp Thực nghiệm (10A1):** 42 học sinh (Chuẩn bị áp dụng mô hình giải pháp AI & Nền tảng số).

| Tiêu chí khảo sát | Lớp Đối chứng 10A2 (N=40) | Lớp Thực nghiệm 10A1 (N=42) |
|---|---|---|
| Mức độ tự giác đọc trước văn bản ở nhà (Thường xuyên) | 27.5% (11 HS) | 26.2% (11 HS) |
| Biết tra cứu tài liệu học thuật đáng tin cậy | 17.5% (7 HS) | 19.0% (8 HS) |
| Tự tin viết bài luận sáng tạo không dùng văn mẫu | 22.5% (9 HS) | 21.4% (9 HS) |
| Điểm khảo sát chất lượng đầu năm môn Văn (Giỏi: ≥ 8.0) | 25.0% (10 HS) | 26.2% (11 HS) |
| Điểm Trung bình & Yếu (< 6.5) | 37.5% (15 HS) | 35.7% (15 HS) |

*Nhận xét:* Hai lớp có sự tương đồng cao về năng lực học tập ban đầu và thói quen tự học (p > 0.05), đảm bảo độ tin cậy tuyệt đối cho quá trình nghiên cứu thực nghiệm sư phạm.`
      },
      solutions: {
        id: 'solutions',
        title: '4. Hệ thống Giải pháp & Biện pháp đột phá',
        subtitle: 'Quy trình 4 bước, kỹ thuật Prompting sư phạm, kế hoạch bài dạy 5512',
        isCompleted: true,
        wordCount: 1650,
        lastUpdated: 'Hôm nay',
        guidelines: [
          'Xây dựng từ 3 đến 4 biện pháp mạch lạc, có tính liên hoàn.',
          'Mỗi biện pháp nêu rõ: Mục tiêu - Nội dung - Các bước tiến hành - Sản phẩm học sinh.',
          'Bổ sung ví dụ cụ thể về câu lệnh Prompting học thuật và Kế hoạch bài dạy minh họa.'
        ],
        content: `### HỆ THỐNG CÁC BIỆN PHÁP ĐỘT PHÁ NÂNG CAO NĂNG LỰC TỰ HỌC

---

### BIỆN PHÁP 1: XÂY DỰNG "SỔ TAY LỆNH SƯ PHẠM (PEDAGOGICAL PROMPTING)" HƯỚNG DẪN HỌC SINH ĐỐI THOẠI HỌC THUẬT VỚI AI

**1. Mục tiêu:**
Giúp học sinh chuyển đổi vai trò từ "người hỏi xin đáp án" thành "người phỏng vấn học thuật", biến AI thành một "bạn đọc ảo" để thảo luận, phản biện về tư tưởng, nghệ thuật của tác phẩm văn học.

**2. Quy trình thực hiện:**
Giáo viên ban hành bộ 5 công thức câu lệnh chuyên sâu:
1. *Lệnh nhập vai nhân vật (Roleplay prompt):* Đóng vai nhân vật Thuý Kiều hoặc Lục Vân Tiên để đối thoại về nghịch cảnh và lựa chọn đạo đức.
2. *Lệnh phản biện đa chiều (Counter-argument prompt):* "Tôi đưa ra luận điểm X về bài thơ, bạn hãy chỉ ra 3 điểm chưa thuyết phục và tìm dẫn chứng trong văn bản để tranh biện lại."
3. *Lệnh phân tích phong cách ngôn ngữ (Stylistic prompt):* So sánh cách dùng từ ngữ gợi hình giữa hai tác giả cùng thời kỳ.
4. *Lệnh gợi mở ý tưởng viết sáng tạo (Creative scaffolding prompt).*
5. *Lệnh rà soát liên kết câu và chuẩn chính tả (Revision prompt).*

**3. Minh họa Kịch bản tương tác thực tế:**
Khi học sinh đọc tác phẩm *"Chữ người tử tù"* (Nguyễn Tuân):
- *Lệnh của học sinh:* "Bạn đóng vai Quản ngục thời phong kiến. Hãy giải thích tâm trạng giằng xé của ông khi một bên là phép nước, một bên là lòng biệt nhỡn liên tài trước Huấn Cao. Trích dẫn ít nhất 2 câu miêu tả ánh mắt hoặc cử chỉ từ tác phẩm của Nguyễn Tuân."
- *Kết quả:* Học sinh không nhận được một bài văn mẫu sáo rỗng, mà nhận được câu trả lời sâu sắc khơi gợi cảm xúc thẩm mỹ, sau đó học sinh phải tự tay chấp bút viết vào vở tự học.

---

### BIỆN PHÁP 2: THIẾT KẾ KHÔNG GIAN TỰ HỌC SỐ HÓA "DIGITAL LITERARY LAB" TRÊN NOTION VÀ PADLET

**1. Mục tiêu:**
Tạo lập môi trường lưu trữ hồ sơ học tập (Learning Portfolio), minh bạch hóa quá trình tự học và hỗ trợ đánh giá đồng đẳng (Peer Review).

**2. Cách thức tổ chức:**
- Mỗi học sinh sở hữu một "Trang Nhật ký đọc sách số (Digital Reading Journal)" trên Notion với các trường dữ liệu: Tác phẩm - Trích dẫn tâm đắc - Câu hỏi tự vấn - Luận điểm cá nhân - Phản biện của AI.
- Trên Padlet chung của lớp, giáo viên thiết kế các cột "Góc tranh luận tuần": Học sinh đăng tải bài viết ngắn (Micro-essay) và các bạn cùng lớp tham gia chấm chéo theo Rubric đánh giá năng lực ngôn ngữ.

---

### BIỆN PHÁP 3: ÁP DỤNG QUY TRÌNH 4 BƯỚC "TỰ HỌC TÍCH HỢP AI" VÀO TIẾN TRÌNH BÀI DẠY (THEO CÔNG VĂN 5512/BGDĐT)

Quy trình vận hành khép kín trong mỗi chủ đề bài học:
1. **Bước 1 (Chuẩn bị cá nhân tại nhà):** Học sinh đọc văn bản thô, dùng Sổ tay Prompt để đặt câu hỏi cho AI, ghi chú lại những mâu thuẫn nhận thức vào Notion.
2. **Bước 2 (Tranh luận nhóm trên lớp):** Giáo viên tổ chức hoạt động "Tòa án Văn học" hoặc "Bàn tròn tranh biện", học sinh đối chiếu câu trả lời của AI với quan điểm của nhóm bạn.
3. **Bước 3 (Thẩm định & Khái quát hóa):** Giáo viên chốt kiến thức trọng tâm, chỉ ra những "bẫy kiến thức" hoặc thông tin sai lệch mà AI đã tạo ra, củng cố phương pháp đọc hiểu thể loại.
4. **Bước 4 (Sản phẩm ứng dụng):** Học sinh tạo sản phẩm học tập đa phương tiện (Infographic tóm tắt tác phẩm trên Canva, Podcast đọc diễn cảm, hoặc kịch bản sân khấu hóa ngắn).`
      },
      experiment: {
        id: 'experiment',
        title: '5. Thực nghiệm sư phạm & Phân tích số liệu',
        subtitle: 'Kiểm chứng định lượng, đối chứng 10A1 vs 10A2, kiểm định T-test',
        isCompleted: true,
        wordCount: 920,
        lastUpdated: 'Hôm nay',
        guidelines: [
          'Xác định rõ địa bàn, mẫu khảo sát và công cụ đo lường.',
          'Trình bày bảng thống kê điểm số trước và sau tác động.',
          'Tính toán chênh lệch điểm trung bình (Mean), độ lệch chuẩn (SD) và kiểm định p-value.',
          'Đánh giá sự phát triển các chỉ số năng lực mềm (Tự học, sáng tạo).'
        ],
        content: `### 1. KẾ HOẠCH VÀ PHƯƠNG PHÁP THỰC NGHIỆM SƯ PHẠM

- **Thời gian thực nghiệm:** Từ tuần 4 đến tuần 16 học kỳ I năm học 2025 - 2026.
- **Đối tượng:**
  + Lớp Thực nghiệm: **10A1 (42 học sinh)** - Áp dụng trọn vẹn Hệ thống Giải pháp AI & Nền tảng số.
  + Lớp Đối chứng: **10A2 (40 học sinh)** - Dạy học theo phương pháp truyền thống kết hợp trình chiếu bài giảng điện tử thông thường.
- **Công cụ đo lường:** Bài kiểm tra định kỳ giữa kỳ (90 phút) và Bài kiểm tra cuối kỳ (90 phút) sử dụng chung một Ma trận đề và Bản đặc tả đề thi chuẩn Sở GD&ĐT, kết hợp Bảng kiểm quan sát hành vi tự học và Bảng hỏi Likert 5 mức độ.

### 2. KẾT QUẢ ĐO LƯỜNG VÀ SO SÁNH TRƯỚC VÀ SAU TÁC ĐỘNG

#### Bảng 1: Phân bố kết quả kiểm tra chất lượng Sau tác động (Cuối kỳ I)

| Xếp loại năng lực môn Văn | Lớp Đối chứng 10A2 (N=40) | Lớp Thực nghiệm 10A1 (N=42) | Độ chênh lệch (%) |
|---|---|---|---|
| **Giỏi (Điểm 8.0 - 10.0)** | 27.5% (11 HS) | **57.1% (24 HS)** | **+29.6% (Vượt bậc)** |
| **Khá (Điểm 6.5 - 7.9)** | 42.5% (17 HS) | 35.7% (15 HS) | -6.8% (Chuyển hóa lên Giỏi) |
| **Trung bình (Điểm 5.0 - 6.4)** | 25.0% (10 HS) | **7.1% (3 HS)** | **-17.9% (Giảm mạnh)** |
| **Yếu (< 5.0)** | 5.0% (2 HS) | **0.0% (0 HS)** | **-5.0% (Xóa yếu kém)** |

#### Bảng 2: Phân tích các thông số thống kê sư phạm (T-test)

| Chỉ số thống kê | Lớp Đối chứng (10A2) | Lớp Thực nghiệm (10A1) |
|---|---|---|
| Điểm trung bình Trước tác động ($X_1$) | 7.12 | 7.15 |
| Điểm trung bình Sau tác động ($X_2$) | 7.34 | **8.42** |
| Độ lệch chuẩn Sau tác động ($SD$) | 1.15 | **0.82** (Dữ liệu tập trung cao) |
| Mức chênh lệch giá trị trung bình | +0.22 | **+1.27 điểm** |
| Độ chênh lệch chuẩn hóa (Effect Size - SMD) | - | **0.94** (Mức độ ảnh hưởng rất lớn) |
| Giá trị kiểm định thống kê $p$ | - | **$p = 0.0024 < 0.01$** |

*Kết luận định lượng:* Giá trị $p = 0.0024 < 0.01$ chứng minh sự khác biệt về kết quả học tập giữa lớp Thực nghiệm và lớp Đối chứng là có ý nghĩa thống kê rõ rệt, loại trừ hoàn toàn yếu tố ngẫu nhiên.`
      },
      conclusion: {
        id: 'conclusion',
        title: '6. Kết luận & Khuyến nghị nhân rộng',
        subtitle: 'Bài học kinh nghiệm, điều kiện áp dụng, kiến nghị với BGH và Sở GD&ĐT',
        isCompleted: true,
        wordCount: 680,
        lastUpdated: 'Hôm nay',
        guidelines: [
          'Khái quát ý nghĩa sư phạm và tính bền vững của đề tài.',
          'Nêu rõ điều kiện để các trường khác nhân rộng thành công.',
          'Đề xuất cụ thể với Nhà trường, Phòng GD&ĐT và Sở GD&ĐT.'
        ],
        content: `### 1. KẾT LUẬN VÀ Ý NGHĨA SƯ PHẠM

Đề tài *"Ứng dụng Trí tuệ Nhân tạo và Nền tảng Số phát triển năng lực tự học cho học sinh THPT trong môn Ngữ văn theo chương trình GDPT 2018"* đã chứng minh tính đúng đắn cả về cơ sở lý luận lẫn hiệu quả thực tiễn:
1. **Thay đổi vị thế người học:** Học sinh từ thế bị động tiếp nhận đã trở thành chủ thể kiến tạo tri thức, biết sử dụng công nghệ như một "đòn bẩy tư duy" thay vì công cụ gian lận.
2. **Nâng cao chất lượng dạy học môn Văn:** Giúp môn Văn trở nên sinh động, gần gũi với đời sống số của học sinh, đồng thời giảm tải áp lực cho giáo viên trong việc hướng dẫn cá nhân hóa.
3. **Hình thành đạo đức số:** Học sinh được rèn luyện ý thức tôn trọng quyền tác giả, tính trung thực trong học thuật và thói quen kiểm chứng thông tin đa chiều.

### 2. BÀI HỌC KINH NGHIỆM VÀ ĐIỀU KIỆN NHÂN RỘNG
- **Yếu tố con người là quyết định:** AI chỉ là công cụ hỗ trợ; sự nhạy cảm sư phạm, cái tâm và sự dẫn dắt của người thầy mới là linh hồn của giờ học Văn.
- **Điều kiện nhân rộng:** Đề tài hoàn toàn có thể triển khai tại các trường THCS và THPT trên toàn tỉnh mà không đòi hỏi chi phí đắt đỏ, chỉ cần đường truyền Internet cơ bản và sự hướng dẫn đồng bộ từ tổ chuyên môn.

### 3. CÁC KIẾN NGHỊ VÀ ĐỀ XUẤT
- **Đối với Ban Giám hiệu Nhà trường:** Tiếp tục đầu tư hạ tầng số, tổ chức các buổi hội thảo chuyên đề về "AI và Liêm chính học thuật" cho toàn thể giáo viên và học sinh.
- **Đối với Sở Giáo dục và Đào tạo:** Tổ chức tập huấn diện rộng về phương pháp tích hợp AI trong dạy học các môn Khoa học Xã hội; ban hành khung tiêu chí đánh giá sản phẩm học tập có ứng dụng AI trong các kỳ thi học sinh giỏi và nghiên cứu khoa học kỹ thuật.`
      },
      defense: {
        id: 'defense',
        title: '7. Thẩm định Hội đồng & Phản biện',
        subtitle: 'Kiểm định 100 điểm, phản biện trực tiếp với 3 giám khảo mô phỏng',
        isCompleted: true,
        wordCount: 510,
        lastUpdated: 'Hôm nay',
        guidelines: [
          'Chấm điểm theo 4 tiêu chuẩn quy chế 100 điểm.',
          'Giải quyết các câu hỏi phản biện hóc búa của Hội đồng chuyên môn.',
          'Rà soát lần cuối trước khi in nộp hồ sơ chính thức.'
        ],
        content: `### BIÊN BẢN MÔ PHỎNG THẨM ĐỊNH HỘI ĐỒNG KHOA HỌC SỞ GD&ĐT

- **Điểm tổng kết ước tính:** **94 / 100 Điểm** (Xếp loại: Xuất sắc - Đủ điều kiện đề nghị Giải Nhất Cấp Tỉnh).
- **Phản biện vòng 1 (TS. Nguyễn Đức Thắng):** Đã làm rõ quy trình Prompting độc bản, chứng minh không phụ thuộc văn mẫu.
- **Phản biện vòng 2 (ThS. Phạm Mai Lan):** Đã bổ sung giải pháp cho học sinh nghèo mượn máy tính tại thư viện thông minh của trường.
- **Phản biện vòng 3 (PGS.TS Hoàng Văn Hải):** Đã kiểm định T-test đạt chuẩn p = 0.0024, minh chứng số liệu minh bạch.`
      }
    },
    surveyData: {
      controlClass: '10A2 (40 HS)',
      experimentClass: '10A1 (42 HS)',
      duration: 'Học kỳ I (16 tuần)',
      surveyTopic: 'Năng lực Tự học & Kết quả Đọc hiểu Ngữ văn THPT',
      preTestAvgScore: { control: 7.12, exp: 7.15 },
      postTestAvgScore: { control: 7.34, exp: 8.42 },
      pValue: 0.0024,
      distribution: [
        { category: 'Giỏi (≥8.0)', preControl: 25.0, postControl: 27.5, preExp: 26.2, postExp: 57.1 },
        { category: 'Khá (6.5-7.9)', preControl: 37.5, postControl: 42.5, preExp: 38.1, postExp: 35.7 },
        { category: 'Trung bình (5.0-6.4)', preControl: 32.5, postControl: 25.0, preExp: 31.0, postExp: 7.1 },
        { category: 'Yếu (<5.0)', preControl: 5.0, postControl: 5.0, preExp: 4.8, postExp: 0.0 },
      ],
      softSkillsProgress: [
        { skill: 'Hứng thú tự học & đọc sách', before: 38, after: 88 },
        { skill: 'Kỹ năng phản biện & đặt câu hỏi', before: 32, after: 82 },
        { skill: 'Sử dụng AI có đạo đức & an toàn', before: 20, after: 94 },
        { skill: 'Hợp tác làm việc nhóm trên Padlet', before: 45, after: 89 },
      ]
    },
    auditResult: {
      totalScore: 94,
      noveltyScore: 29,
      academicScore: 24,
      practicalScore: 28,
      presentationScore: 13,
      estimatedPrize: 'Giải Nhất Cấp Tỉnh (Xác suất 95%)',
      noveltyEvaluation: 'Đề tài mang tính đột phá, đi đầu trong việc giải quyết bài toán liêm chính học thuật và ứng dụng AI sư phạm môn Ngữ văn theo chương trình GDPT 2018. Hệ thống prompt được thiết kế bài bản.',
      strengths: [
        'Ý tưởng thời sự, phù hợp tuyệt đối với định hướng Chuyển đổi số giáo dục 2026 của Chính phủ.',
        'Quy trình 4 bước chặt chẽ, dễ áp dụng, có giáo án minh họa theo Công văn 5512 rõ nét.',
        'Số liệu thực nghiệm định lượng xuất sắc với kiểm định T-test p=0.0024 rất thuyết phục.'
      ],
      weaknesses: [
        'Cần nhấn mạnh thêm quy định về an toàn dữ liệu cá nhân khi học sinh nhập thông tin vào công cụ AI.',
        'Nên bổ sung phụ lục các sản phẩm Infographic và Podcast thực tế của học sinh để tăng tính thị giác.'
      ],
      councilQuestions: [
        'Làm thế nào để giáo viên phát hiện học sinh dùng AI viết toàn bộ bài văn thay vì tự viết?',
        'Giải pháp này có làm giảm bớt cảm xúc rung động văn chương chân thật của học sinh hay không?',
        'Trường vùng nông thôn thiếu máy tính thì có thể triển khai giải pháp này theo phương án nào?'
      ],
      recommendations: 'Bổ sung mã QR quét xem các video thuyết trình sản phẩm học tập của học sinh trong phần phụ lục để bài thi đạt điểm tuyệt đối 100 điểm.'
    },
    councilChatHistory: [
      {
        id: 'msg-1',
        sender: 'judge',
        judgeId: 'judge-thang',
        judgeName: 'TS. Nguyễn Đức Thắng',
        text: 'Chào Cô Hải Yến! Đề tài về AI trong môn Ngữ văn rất thời sự. Tuy nhiên tôi muốn hỏi: Cô làm thế nào để đảm bảo học sinh không dùng AI viết hộ toàn bộ bài luận?',
        timestamp: '10:15'
      },
      {
        id: 'msg-2',
        sender: 'user',
        text: 'Dạ kính thưa Thầy Thắng và Hội đồng! Trong sáng kiến, em không cho học sinh dùng AI để lấy bài hoàn chỉnh. Em xây dựng quy trình đối thoại: Học sinh chỉ được dùng AI để phản biện giả định hoặc tìm kiếm tư liệu đa chiều. Bài viết cuối cùng học sinh phải viết tay trực tiếp tại lớp hoặc nộp kèm "Nhật ký câu lệnh và biên bản sửa lỗi", qua đó giáo viên nắm chắc 100% tiến trình tư duy độc lập của học sinh ạ.',
        timestamp: '10:18'
      },
      {
        id: 'msg-3',
        sender: 'judge',
        judgeId: 'judge-thang',
        judgeName: 'TS. Nguyễn Đức Thắng',
        text: 'Rất thuyết phục! Việc kiểm soát tiến trình bằng Nhật ký câu lệnh là một giải pháp sư phạm chuẩn xác và sáng tạo. Hội đồng đánh giá cao điểm này.',
        timestamp: '10:20'
      }
    ],
    ragDocuments: OFFICIAL_RAG_DOCUMENTS,
    createdAt: '2026-09-15',
    updatedAt: '2026-10-01'
  },
  {
    id: 'skkn-proj-02',
    title: 'Một số biện pháp giáo dục STEM tích hợp phát triển tư duy sáng tạo cho học sinh lớp 4 qua các chủ đề Môn Khoa học',
    author: 'Trần Văn Minh',
    authorTitle: 'Giáo viên Tiểu học Hạng II - GV Chủ nhiệm Giỏi Cấp Huyện',
    school: 'Trường Tiểu học Võ Thị Sáu',
    district: 'Huyện Hòa Vang',
    province: 'TP. Đà Nẵng',
    subject: 'Khoa học (STEM Tiểu học)',
    gradeLevel: 'Lớp 4 (Tiểu học)',
    academicYear: '2025 - 2026',
    status: 'draft',
    noveltyRating: 88,
    sections: {
      overview: {
        id: 'overview',
        title: '1. Tổng quan & Hồ sơ đề tài',
        subtitle: 'Thông tin tác giả, đơn vị, mã số chuyên đề và tóm tắt đề tài',
        isCompleted: true,
        wordCount: 380,
        lastUpdated: 'Hôm qua',
        guidelines: ['Gắn với môn Khoa học lớp 4 chương trình GDPT 2018.'],
        content: `### THÔNG TIN ĐỀ TÀI STEM TIỂU HỌC\n\n- **Đề tài:** Một số biện pháp giáo dục STEM tích hợp phát triển tư duy sáng tạo cho học sinh lớp 4 qua các chủ đề Môn Khoa học.\n- **Tác giả:** Trần Văn Minh\n- **Đơn vị:** Trường Tiểu học Võ Thị Sáu.\n\nĐề tài nghiên cứu ứng dụng phương pháp "Thiết kế kỹ thuật 5 bước (EDP)" phù hợp tâm sinh lý học sinh tiểu học, tận dụng vật liệu tái chế tại địa phương để tạo ra các mô hình khoa học như: Máy lọc nước mi-ni, Cột đèn tín hiệu giao thông đơn giản, Rạp chiếu bóng mini tìm hiểu về ánh sáng.`
      },
      problem: {
        id: 'problem',
        title: '2. Đặt vấn đề & Lý do chọn đề tài',
        subtitle: 'Tính cấp thiết, cơ sở pháp lý, cơ sở lý luận & thực tiễn GDPT 2018',
        isCompleted: true,
        wordCount: 650,
        lastUpdated: 'Hôm qua',
        guidelines: ['Nêu thực trạng học sinh tiểu học học khoa học còn nặng về lý thuyết.'],
        content: `### LÝ DO CHỌN ĐỀ TÀI\n\nKhoa học lớp 4 là môn học giàu tiềm năng khám phá thế giới tự nhiên. Tuy nhiên thực tế tại các trường tiểu học ngoại thành, giờ học khoa học vẫn chủ yếu là học sinh nhìn tranh ảnh trong sách giáo khoa và trả lời câu hỏi tái hiện kiến thức. Giáo dục STEM với tính chất "Học qua hành" (Learning by doing) chính là giải pháp hữu hiệu để học sinh tự tay chế tạo sản phẩm, từ đó phát triển tư duy khoa học và năng lực giải quyết vấn đề thực tiễn.`
      },
      current_situation: {
        id: 'current_situation',
        title: '3. Thực trạng & Khảo sát ban đầu',
        subtitle: 'Bối cảnh trường học, thuận lợi, khó khăn và số liệu điều tra gốc',
        isCompleted: true,
        wordCount: 520,
        lastUpdated: 'Hôm qua',
        guidelines: ['Khảo sát kỹ năng làm việc nhóm và hứng thú học tập.'],
        content: `### KHẢO SÁT BAN ĐẦU TẠI KHỐI 4\n\nKhảo sát 75 học sinh lớp 4/1 và 4/2: Chỉ có 28% học sinh biết cách phối hợp làm việc nhóm để tạo ra một sản phẩm; 68% lúng túng khi được yêu cầu giải thích nguyên lý hoạt động của một vật dụng đơn giản.`
      },
      solutions: {
        id: 'solutions',
        title: '4. Hệ thống Giải pháp & Biện pháp đột phá',
        subtitle: 'Quy trình 5 bước thiết kế kỹ thuật, chế tạo từ vật liệu tái chế',
        isCompleted: true,
        wordCount: 1100,
        lastUpdated: 'Hôm qua',
        guidelines: ['Biện pháp 1: Quy trình 5 bước; Biện pháp 2: Xây dựng góc STEM tái chế.'],
        content: `### CÁC BIỆN PHÁP THỰC HIỆN\n\n- **Biện pháp 1:** Đơn giản hóa quy trình Thiết kế kỹ thuật EDP thành 5 câu hỏi dễ nhớ cho học sinh lớp 4: *1. Em muốn làm gì? -> 2. Em tưởng tượng nó thế nào? -> 3. Em vẽ bản thiết kế ra sao? -> 4. Em chế tạo thử nghiệm! -> 5. Em cải tiến cho nó tốt hơn!*\n- **Biện pháp 2:** Tổ chức "Ngày hội sáng tạo tái chế", sử dụng chai nhựa, bìa carton, que kem để học sinh tự làm mô hình lọc nước và nhà chống gió bão.`
      },
      experiment: {
        id: 'experiment',
        title: '5. Thực nghiệm sư phạm & Phân tích số liệu',
        subtitle: 'Đo lường sự khéo léo, tư duy sáng tạo và điểm số khoa học',
        isCompleted: false,
        wordCount: 450,
        lastUpdated: '2 ngày trước',
        guidelines: ['So sánh lớp 4/1 (STEM) và lớp 4/2 (Đối chứng).'],
        content: `### KẾT QUẢ THỰC NGHIỆM BAN ĐẦU\n\nLớp 4/1 sau 8 tuần thực nghiệm các chủ đề STEM có 100% học sinh tự tin thuyết trình sản phẩm của nhóm, điểm bài kiểm tra định kỳ đạt 8.2 điểm so với 7.1 của lớp đối chứng 4/2.`
      },
      conclusion: {
        id: 'conclusion',
        title: '6. Kết luận & Khuyến nghị nhân rộng',
        subtitle: 'Khuyến nghị về phòng thực hành STEM và quỹ vật liệu tái chế',
        isCompleted: false,
        wordCount: 300,
        lastUpdated: '2 ngày trước',
        guidelines: ['Đề xuất cấp bổ sung bộ đồ dùng STEM.'],
        content: `### KHUYẾN NGHỊ\n\nĐề xuất nhà trường hỗ trợ tủ đựng vật liệu tái chế tại mỗi lớp học và phát động phong trào thu gom pin cũ, chai nhựa để phục vụ hoạt động trải nghiệm STEM.`
      },
      defense: {
        id: 'defense',
        title: '7. Thẩm định Hội đồng & Phản biện',
        subtitle: 'Tập dượt trả lời giám khảo chuyên môn tiểu học',
        isCompleted: false,
        wordCount: 200,
        lastUpdated: '2 ngày trước',
        guidelines: ['Chuẩn bị câu hỏi về an toàn khi học sinh dùng kéo và keo.'],
        content: `### DỰ KIẾN CÂU HỎI PHẢN BIỆN\n\nGiám khảo sẽ hỏi về vấn đề an toàn lao động sư phạm khi học sinh 9 tuổi sử dụng kéo, súng bắn keo hoặc vật liệu sắc nhọn.`
      }
    },
    surveyData: {
      controlClass: 'Lớp 4/2 (38 HS)',
      experimentClass: 'Lớp 4/1 (37 HS)',
      duration: 'Học kỳ I (10 tuần)',
      surveyTopic: 'Tư duy Sáng tạo & Kỹ năng STEM môn Khoa học Lớp 4',
      preTestAvgScore: { control: 7.05, exp: 7.10 },
      postTestAvgScore: { control: 7.35, exp: 8.25 },
      pValue: 0.008,
      distribution: [
        { category: 'Giỏi (≥8.0)', preControl: 23.7, postControl: 28.9, preExp: 24.3, postExp: 51.4 },
        { category: 'Khá (6.5-7.9)', preControl: 42.1, postControl: 44.7, preExp: 43.2, postExp: 40.5 },
        { category: 'Trung bình (5.0-6.4)', preControl: 28.9, postControl: 23.7, preExp: 27.0, postExp: 8.1 },
        { category: 'Yếu (<5.0)', preControl: 5.3, postControl: 2.7, preExp: 5.5, postExp: 0.0 },
      ],
      softSkillsProgress: [
        { skill: 'Kỹ năng thiết kế & chế tạo', before: 25, after: 85 },
        { skill: 'Hợp tác nhóm & chia sẻ', before: 35, after: 80 },
        { skill: 'Tư duy giải quyết vấn đề', before: 30, after: 78 },
        { skill: 'Thuyết trình sản phẩm khoa học', before: 20, after: 82 },
      ]
    },
    councilChatHistory: [],
    ragDocuments: OFFICIAL_RAG_DOCUMENTS,
    createdAt: '2026-09-20',
    updatedAt: '2026-09-30'
  }
];
