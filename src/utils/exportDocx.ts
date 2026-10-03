import { SKKNProject } from '../types';

export function exportToWordDocument(project: SKKNProject) {
  const sections = project.sections;

  // Convert markdown-like strings to clean HTML
  const formatMarkdownToHtml = (content: string) => {
    let html = content
      .replace(/^### (.*$)/gim, '<h3 style="font-size: 14pt; font-weight: bold; margin-top: 14pt; margin-bottom: 6pt; color: #1e293b;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="font-size: 15pt; font-weight: bold; margin-top: 18pt; margin-bottom: 8pt; color: #0f172a; text-transform: uppercase;">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 style="font-size: 16pt; font-weight: bold; text-align: center; margin-top: 24pt; margin-bottom: 12pt; text-transform: uppercase;">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/\n\n/gim, '</p><p style="margin-bottom: 8pt; text-indent: 1.27cm; line-height: 1.35; text-align: justify;">')
      .replace(/\n- (.*$)/gim, '<li style="margin-left: 20pt; line-height: 1.35; text-align: justify;">$1</li>');

    // Handle basic markdown tables if present
    if (html.includes('|')) {
      const lines = html.split('\n');
      let inTable = false;
      let tableHtml = '<table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%; margin: 12pt 0; font-size: 13pt;">';

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('|') && line.endsWith('|')) {
          if (line.includes('---')) continue; // Skip separator line
          if (!inTable) {
            inTable = true;
          }
          const cells = line.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
          const isHeader = !tableHtml.includes('<tr>');
          tableHtml += '<tr style="background-color: ' + (isHeader ? '#f1f5f9' : '#ffffff') + ';">';
          cells.forEach((c) => {
            tableHtml += `<td style="padding: 6pt; text-align: center; border: 1px solid #cbd5e1;">${c.trim()}</td>`;
          });
          tableHtml += '</tr>';
        } else {
          if (inTable) {
            tableHtml += '</table>';
            lines[i] = tableHtml + lines[i];
            inTable = false;
          }
        }
      }
      if (inTable) {
        tableHtml += '</table>';
        html = lines.join('\n') + tableHtml;
      } else {
        html = lines.join('\n');
      }
    }

    return `<p style="margin-bottom: 8pt; text-indent: 1.27cm; line-height: 1.35; text-align: justify;">${html}</p>`;
  };

  const docHtml = `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>${project.title}</title>
<style>
  @page {
    size: 210mm 297mm;
    margin: 20mm 20mm 20mm 30mm; /* Top, Right, Bottom, Left chuẩn hành chính VN */
    mso-header-margin: 15mm;
    mso-footer-margin: 15mm;
  }
  body {
    font-family: 'Times New Roman', Times, serif;
    font-size: 14pt;
    line-height: 1.35;
    color: #000000;
  }
  .page-break {
    page-break-before: always;
  }
  .national-header {
    text-align: center;
    font-weight: bold;
    margin-bottom: 24pt;
  }
  .cover-box {
    border: 3px double #000;
    padding: 30pt;
    min-height: 800pt;
    box-sizing: border-box;
    text-align: center;
  }
</style>
</head>
<body>

<!-- TRANG BÌA CHUẨN SỞ GD&ĐT -->
<div class="cover-box">
  <div style="font-size: 14pt; font-weight: bold; text-transform: uppercase;">
    ${project.province ? project.province.toUpperCase() : 'SỞ GIÁO DỤC VÀ ĐÀO TẠO'}<br>
    ${project.school ? project.school.toUpperCase() : 'TRƯỜNG THPT'}
  </div>
  <div style="margin: 40pt 0 20pt 0;">
    <div style="font-size: 18pt; font-weight: bold; text-transform: uppercase; color: #b45309;">
      BÁO CÁO KẾT QUẢ NGHIÊN CỨU, ỨNG DỤNG
    </div>
    <div style="font-size: 20pt; font-weight: bold; text-transform: uppercase; margin-top: 10pt; color: #1e293b;">
      SÁNG KIẾN KINH NGHIỆM
    </div>
  </div>

  <div style="border-top: 2px solid #000; border-bottom: 2px solid #000; padding: 20pt 10pt; margin: 40pt 0;">
    <div style="font-size: 16pt; font-weight: bold; text-transform: uppercase; line-height: 1.4;">
      ${project.title}
    </div>
  </div>

  <div style="margin-top: 60pt; text-align: left; font-size: 14pt; padding-left: 50pt;">
    <p><strong>Lĩnh vực áp dụng:</strong> ${project.subject}</p>
    <p><strong>Cấp học / Khối lớp:</strong> ${project.gradeLevel}</p>
    <p><strong>Tác giả:</strong> ${project.author}</p>
    <p><strong>Chức vụ / Học hàm:</strong> ${project.authorTitle}</p>
    <p><strong>Đơn vị công tác:</strong> ${project.school} - ${project.district}</p>
  </div>

  <div style="margin-top: 80pt; font-size: 14pt; font-weight: bold;">
    NĂM HỌC ${project.academicYear || '2025 - 2026'}
  </div>
</div>

<div class="page-break"></div>

<!-- MỤC LỤC & ĐÁNH GIÁ -->
<div class="national-header">
  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM<br>
  <span style="border-bottom: 1px solid #000; padding-bottom: 3px;">Độc lập - Tự do - Hạnh phúc</span>
</div>

<h2 style="text-align: center; text-transform: uppercase; font-size: 16pt; margin: 24pt 0 16pt 0;">
  BẢN THUYẾT MINH MÔ TẢ SÁNG KIẾN KINH NGHIỆM
</h2>

<p style="font-style: italic; text-align: center; margin-bottom: 20pt;">
  (Áp dụng theo quy chuẩn Thông tư 32/2018/TT-BGDĐT và quy chế Hội đồng Sáng kiến năm 2026)
</p>

<!-- NỘI DUNG 6 PHẦN CHÍNH -->
${Object.values(sections)
  .map(
    (sec) => `
<div style="margin-top: 20pt;">
  <h2 style="font-size: 15pt; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #94a3b8; padding-bottom: 4pt;">
    ${sec.title}
  </h2>
  ${formatMarkdownToHtml(sec.content)}
</div>
`
  )
  .join('')}

<div class="page-break"></div>

<!-- PHẦN XÁC NHẬN CỦA HỘI ĐỒNG VÀ BAN GIÁM HIỆU -->
<div style="margin-top: 40pt;">
  <table style="width: 100%; border: none; font-size: 14pt;">
    <tr>
      <td style="width: 50%; text-align: center; vertical-align: top;">
        <strong>XÁC NHẬN CỦA CƠ SỞ ĐƠN VỊ</strong><br>
        <em>(Ký, ghi rõ họ tên và đóng dấu)</em><br><br><br><br><br><br>
        <strong>........................................................</strong>
      </td>
      <td style="width: 50%; text-align: center; vertical-align: top;">
        <em>Ngày ...... tháng ...... năm 2026</em><br>
        <strong>TÁC GIẢ SÁNG KIẾN</strong><br>
        <em>(Ký và ghi rõ họ tên)</em><br><br><br><br><br><br>
        <strong>${project.author}</strong>
      </td>
    </tr>
  </table>
</div>

</body>
</html>`;

  // Create downloadable file with correct Word MIME
  const blob = new Blob(['\ufeff', docHtml], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const sanitizedTitle = project.title
    .slice(0, 40)
    .replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, '_');
  link.download = `SKKN_2026_${sanitizedTitle}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
