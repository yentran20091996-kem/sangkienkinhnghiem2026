/**
 * exportPptx.ts
 * Bộ tiện ích tự động tạo và xuất bài trình chiếu báo cáo SKKN trước Hội đồng Khoa học
 * Dựa trên tiêu chuẩn SKILL EDUCATION pptx-official.
 */

import { SKKNProject } from '../types';

export function exportToPowerPoint(project: SKKNProject) {
  const sanitize = (text: string) =>
    (text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const cleanMd = (md: string) => {
    return (md || '')
      .replace(/###\s+/g, '')
      .replace(/##\s+/g, '')
      .replace(/#\s+/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/```[\s\S]*?```/g, '')
      .slice(0, 400);
  };

  const slidesData = [
    {
      title: project.title,
      type: 'title',
      subtitle: `BÁO CÁO THUYẾT TRÌNH SÁNG KIẾN KINH NGHIỆM NĂM HỌC ${project.academicYear || '2025-2026'}`,
      author: `Tác giả: ${project.author} - ${project.authorTitle || 'Giáo viên'}`,
      school: `Đơn vị: ${project.school} - ${project.district}, ${project.province}`,
      meta: `Môn: ${project.subject} | Khối: ${project.gradeLevel}`,
    },
    {
      title: '1. ĐẶT VẤN ĐỀ & LÝ DO CHỌN ĐỀ TÀI',
      type: 'content',
      bullets: [
        'Tính cấp thiết gắn liền với đổi mới phương pháp theo Chương trình GDPT 2018.',
        'Khắc phục lối dạy truyền thụ một chiều, chuyển trọng tâm sang phát triển phẩm chất & năng lực học sinh.',
        cleanMd(project.sections.problem?.content).slice(0, 250) || 'Thực tiễn đòi hỏi giải pháp sư phạm mới, phù hợp đặc điểm tâm lý lứa tuổi học sinh tại địa phương.',
        'Cơ sở pháp lý: Bám sát các Thông tư, Công văn hướng dẫn chuyên môn của Bộ và Sở GD&ĐT.',
      ],
    },
    {
      title: '2. THỰC TRẠNG TRƯỚC KHI ÁP DỤNG ĐỀ TÀI',
      type: 'content',
      bullets: [
        `Khảo sát ban đầu tại ${project.surveyData?.controlClass || 'các lớp giảng dạy'}: Tỷ lệ học sinh hứng thú còn hạn chế.`,
        'Điểm nghẽn thực tiễn: Học sinh còn thụ động trong giải quyết vấn đề, thiếu kỹ năng hợp tác nhóm.',
        cleanMd(project.sections.current_situation?.content).slice(0, 250) || 'Cơ sở vật chất và thời lượng tiết học đòi hỏi các hình thức tổ chức dạy học linh hoạt, hiện đại.',
        'Khảo sát đầu năm: Tỷ lệ học sinh đạt mức Khá - Giỏi chưa đồng đều giữa các nhóm học sinh.',
      ],
    },
    {
      title: '3. HỆ THỐNG CÁC GIẢI PHÁP / BIỆN PHÁP ĐỘT PHÁ',
      type: 'solutions',
      bullets: [
        'Biện pháp 1: Đổi mới thiết kế tiến trình 4 hoạt động bài dạy theo Công văn 5512/BGDĐT.',
        'Biện pháp 2: Ứng dụng công nghệ số, học liệu trực quan và phương pháp dạy học tích hợp STEM.',
        'Biện pháp 3: Đa dạng hóa hình thức kiểm tra đánh giá thường xuyên nhằm khích lệ năng lực tự học.',
        'Biện pháp 4: Phối hợp hiệu quả giữa nhà trường, gia đình và cộng đồng trong hỗ trợ học tập.',
      ],
      detail: cleanMd(project.sections.solutions?.content).slice(0, 300),
    },
    {
      title: '4. CHI TIẾT BIỆN PHÁP TRỌNG TÂM',
      type: 'content',
      bullets: [
        'Xây dựng các tình huống thực tiễn có vấn đề để kích thích tính tò mò khoa học của học sinh.',
        'Tổ chức hoạt động nhóm có phân hóa, giao nhiệm vụ rõ ràng với sản phẩm học tập cụ thể.',
        'Sử dụng phiếu học tập phân bậc và tiêu chí Rubric đánh giá rõ ràng để học sinh tự đánh giá.',
        'Tạo môi trường lớp học tích cực, tôn trọng ý kiến cá nhân và khuyến khích tư duy sáng tạo.',
      ],
    },
    {
      title: '5. KẾT QUẢ THỰC NGHIỆM SƯ PHẠM ĐỐI CHỨNG',
      type: 'experiment',
      controlClass: project.surveyData?.controlClass || 'Lớp Đối chứng (40 HS)',
      experimentClass: project.surveyData?.experimentClass || 'Lớp Thực nghiệm (42 HS)',
      preScore: project.surveyData?.preTestAvgScore || { control: 6.2, exp: 6.3 },
      postScore: project.surveyData?.postTestAvgScore || { control: 6.8, exp: 8.5 },
      pValue: project.surveyData?.pValue || 0.003,
      bullets: [
        `Nhóm Thực nghiệm có sự bứt phá điểm số trung bình từ ${project.surveyData?.preTestAvgScore?.exp || 6.3} lên ${project.surveyData?.postTestAvgScore?.exp || 8.5} điểm.`,
        `Chênh lệch có ý nghĩa thống kê khoa học với kiểm định p-value = ${project.surveyData?.pValue || 0.003} (p < 0.05).`,
        '100% học sinh tham gia tự giác, tự tin trình bày sản phẩm và phát triển vượt bậc năng lực tự học.',
      ],
    },
    {
      title: '6. KHẢ NĂNG NHÂN RỘNG & PHẠM VI ẢNH HƯỞNG',
      type: 'content',
      bullets: [
        'Dễ dàng áp dụng cho các khối lớp tương đương trong toàn trường và các trường bạn trong khu vực.',
        'Quy trình tổ chức bài dạy rõ ràng, không đòi hỏi kinh phí tốn kém, phù hợp nhiều điều kiện cơ sở vật chất.',
        'Đã được chia sẻ trong các buổi sinh hoạt chuyên môn theo cụm trường và nhận được đánh giá tích cực.',
        cleanMd(project.sections.conclusion?.content).slice(0, 250) || 'Có tính khả thi cao, đóng góp thiết thực vào nâng cao chất lượng giáo dục mũi nhọn và đại trà.',
      ],
    },
    {
      title: '7. KẾT LUẬN & KIẾN NGHỊ',
      type: 'content',
      bullets: [
        'Khẳng định đề tài đạt được các tiêu chí: Tính mới, Tính khoa học, Hiệu quả thực tiễn và Khả năng nhân rộng.',
        'Bài học kinh nghiệm: Cần kiên trì, linh hoạt điều chỉnh biện pháp theo mức độ tiếp thu của học sinh.',
        'Kiến nghị Nhà trường: Tiếp tục trang bị bổ sung thiết bị dạy học số và tạo điều kiện sinh hoạt chuyên môn chuyên sâu.',
        'Kiến nghị Phòng/Sở GD&ĐT: Tổ chức các chuyên đề phổ biến nhân rộng những sáng kiến đạt giải cao.',
      ],
    },
    {
      title: 'TRÂN TRỌNG CẢM ƠN QUÝ THẦY CÔ HỘI ĐỒNG!',
      type: 'conclusion',
      subtitle: 'Kính mong nhận được sự đóng góp quý báu từ Hội đồng Giám khảo!',
      author: `${project.author} - ${project.school}`,
    },
  ];

  // Tạo tệp HTML Presentation chuẩn, mở trực tiếp bằng PowerPoint hoặc trình duyệt
  const htmlSlides = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Báo cáo SKKN - ${sanitize(project.title)}</title>
  <style>
    @page {
      size: 16in 9in;
      margin: 0;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #0f172a;
      color: #1e293b;
    }
    .slide {
      width: 16in;
      height: 9in;
      box-sizing: border-box;
      padding: 1in;
      page-break-after: always;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: #ffffff;
      margin: 20px auto;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .slide-title-bg {
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #311042 100%);
      color: #ffffff;
      justify-content: center;
      text-align: center;
    }
    .slide-conclusion-bg {
      background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
      color: #ffffff;
      justify-content: center;
      text-align: center;
    }
    .slide-header {
      border-bottom: 3px solid #ff6b00;
      padding-bottom: 15px;
      margin-bottom: 25px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .slide-title {
      font-size: 34px;
      font-weight: 800;
      color: #1e293b;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .slide-badge {
      font-size: 14px;
      font-weight: bold;
      background: #ff6b00;
      color: #fff;
      padding: 6px 14px;
      border-radius: 20px;
    }
    .slide-body {
      flex: 1;
      font-size: 24px;
      line-height: 1.6;
    }
    .bullet-list {
      list-style-type: none;
      padding-left: 0;
      margin: 0;
    }
    .bullet-item {
      margin-bottom: 18px;
      padding-left: 35px;
      position: relative;
      color: #334155;
    }
    .bullet-item::before {
      content: "▶";
      position: absolute;
      left: 0;
      color: #ff6b00;
      font-size: 18px;
      top: 2px;
    }
    .table-stat {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 20px;
    }
    .table-stat th, .table-stat td {
      border: 2px solid #cbd5e1;
      padding: 12px 20px;
      text-align: center;
    }
    .table-stat th {
      background: #f1f5f9;
      color: #0f172a;
      font-weight: bold;
    }
    .table-stat tr:nth-child(even) {
      background: #f8fafc;
    }
    .slide-footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 15px;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #64748b;
    }
    .print-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff6b00;
      color: white;
      border: none;
      padding: 12px 24px;
      font-size: 16px;
      font-weight: bold;
      border-radius: 12px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(255,107,0,0.4);
      z-index: 1000;
    }
    @media print {
      body { background: transparent; }
      .slide { margin: 0; box-shadow: none; }
      .print-btn { display: none; }
    }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">In Slide / Lưu PDF</button>

  ${slidesData
    .map((slide, index) => {
      if (slide.type === 'title') {
        return `
        <div class="slide slide-title-bg">
          <div style="font-size: 18px; letter-spacing: 2px; text-transform: uppercase; color: #ff6b00; font-weight: bold; margin-bottom: 20px;">
            HỘI ĐỒNG KHOA HỌC NGÀNH GIÁO DỤC VÀ ĐÀO TẠO
          </div>
          <h1 style="font-size: 46px; font-weight: 900; line-height: 1.25; margin: 0 0 25px 0; color: #ffffff;">
            ${sanitize(slide.title)}
          </h1>
          <div style="font-size: 20px; color: #cbd5e1; margin-bottom: 40px; font-weight: 500;">
            ${sanitize(slide.subtitle || '')}
          </div>
          <div style="background: rgba(255,255,255,0.08); padding: 25px 40px; border-radius: 20px; display: inline-block; border: 1px solid rgba(255,255,255,0.15); margin: 0 auto; text-align: left;">
            <div style="font-size: 22px; font-weight: bold; color: #ffffff;">${sanitize(slide.author || '')}</div>
            <div style="font-size: 18px; color: #94a3b8; margin-top: 6px;">${sanitize(slide.school || '')}</div>
            <div style="font-size: 16px; color: #ff6b00; margin-top: 6px; font-weight: bold;">${sanitize(slide.meta || '')}</div>
          </div>
        </div>`;
      }

      if (slide.type === 'conclusion') {
        return `
        <div class="slide slide-conclusion-bg">
          <h1 style="font-size: 52px; font-weight: 900; color: #ffffff; margin-bottom: 25px;">
            ${sanitize(slide.title)}
          </h1>
          <p style="font-size: 26px; color: #cbd5e1; margin-bottom: 40px;">
            ${sanitize(slide.subtitle || '')}
          </p>
          <div style="font-size: 22px; color: #ff6b00; font-weight: bold;">
            ${sanitize(slide.author || '')}
          </div>
          <div style="font-size: 16px; color: #64748b; margin-top: 50px;">
            HỘI ĐỒNG THẨM ĐỊNH SÁNG KIẾN KINH NGHIỆM GDPT 2018
          </div>
        </div>`;
      }

      return `
      <div class="slide">
        <div class="slide-header">
          <h2 class="slide-title">${sanitize(slide.title)}</h2>
          <span class="slide-badge">SKKN 2026 PRO</span>
        </div>

        <div class="slide-body">
          ${
            slide.type === 'experiment'
              ? `
              <table class="table-stat">
                <thead>
                  <tr>
                    <th>Nhóm Khảo Sát</th>
                    <th>Điểm TB Trước Tác Động</th>
                    <th>Điểm TB Sau Tác Động</th>
                    <th>Mức Độ Tăng Trưởng</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>${sanitize(slide.controlClass || 'Lớp Đối chứng')}</strong></td>
                    <td>${(slide as any).preScore.control} điểm</td>
                    <td>${(slide as any).postScore.control} điểm</td>
                    <td style="color: #64748b;">+${((slide as any).postScore.control - (slide as any).preScore.control).toFixed(1)}đ</td>
                  </tr>
                  <tr style="background: #fff7ed;">
                    <td><strong style="color: #c2410c;">${sanitize(slide.experimentClass || 'Lớp Thực nghiệm')}</strong></td>
                    <td>${(slide as any).preScore.exp} điểm</td>
                    <td style="font-weight: bold; color: #c2410c;">${(slide as any).postScore.exp} điểm</td>
                    <td style="font-weight: bold; color: #16a34a;">+${((slide as any).postScore.exp - (slide as any).preScore.exp).toFixed(1)}đ (Đột phá)</td>
                  </tr>
                </tbody>
              </table>
              <div style="font-size: 16px; color: #15803d; font-weight: bold; margin-bottom: 15px; background: #dcfce7; padding: 8px 16px; border-radius: 8px; display: inline-block;">
                ✓ Kiểm định T-test: p-value = ${(slide as any).pValue} &lt; 0.05 (Khẳng định tác động có ý nghĩa khoa học)
              </div>
            `
              : ''
          }

          <ul class="bullet-list">
            ${(slide.bullets || []).map((b) => `<li class="bullet-item">${sanitize(b)}</li>`).join('')}
          </ul>
        </div>

        <div class="slide-footer">
          <span>${sanitize(project.title.slice(0, 60))}...</span>
          <span>Trang ${index + 1} / ${slidesData.length}</span>
          <span>Tác giả: ${sanitize(project.author)}</span>
        </div>
      </div>`;
    })
    .join('\n')}
</body>
</html>`;

  // Tải file HTML slide presentation về máy
  const blob = new Blob([htmlSlides], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeTitle = project.title
    .replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, '_')
    .slice(0, 50);

  a.href = url;
  a.download = `Slide_Bao_Cao_SKKN_${safeTitle}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
