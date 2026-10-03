/**
 * docParser.ts
 * Bộ tiện ích trích xuất nội dung văn bản và bảng biểu từ tệp Word (.docx) và PDF.
 * Hoạt động mượt mà cả trên trình duyệt (client-side) và server, không phụ thuộc nặng nề vào thư viện ngoài.
 */

export interface ParsedDocumentResult {
  fileName: string;
  fileSize: string;
  fileType: 'docx' | 'pdf' | 'text';
  text: string;
  base64?: string;
  suggestedTitle: string;
  suggestedSource: string;
}

/**
 * Định dạng dung lượng tệp dễ đọc (KB, MB)
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Đọc file dưới dạng Base64
 */
export function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Tách bỏ phần tiền tố "data:application/pdf;base64," nếu có
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Giải nén và trích xuất text từ file Word (.docx)
 * File .docx thực chất là file ZIP chứa thư mục "word/document.xml".
 */
export async function parseDocxFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Tìm và giải nén tệp "word/document.xml" từ cấu trúc ZIP
  const xmlContent = await extractXmlFromZip(bytes, 'word/document.xml');
  if (!xmlContent) {
    throw new Error('Không tìm thấy nội dung văn bản (word/document.xml) trong tệp Word này.');
  }

  // Parse XML sang text có cấu trúc (hỗ trợ cả văn bản thường và bảng biểu)
  return parseWordXmlToMarkdown(xmlContent);
}

/**
 * Trích xuất một tệp cụ thể trong file ZIP bằng native JavaScript (hỗ trợ DecompressionStream)
 */
async function extractXmlFromZip(bytes: Uint8Array, targetFileName: string): Promise<string | null> {
  let offset = 0;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  while (offset + 30 < bytes.length) {
    // Local file header signature: 0x04034b50
    const sig = view.getUint32(offset, true);
    if (sig !== 0x04034b50) {
      break;
    }

    const compMethod = view.getUint16(offset + 8, true);
    const compSize = view.getUint32(offset + 18, true);
    const nameLen = view.getUint16(offset + 26, true);
    const extraLen = view.getUint16(offset + 28, true);

    const nameBytes = bytes.subarray(offset + 30, offset + 30 + nameLen);
    const fileName = new TextDecoder('utf-8').decode(nameBytes);

    const dataStart = offset + 30 + nameLen + extraLen;
    const dataEnd = dataStart + compSize;

    if (fileName === targetFileName || fileName.endsWith(targetFileName)) {
      const compressedData = bytes.subarray(dataStart, dataEnd);

      // Method 0: Không nén (Stored)
      if (compMethod === 0) {
        return new TextDecoder('utf-8').decode(compressedData);
      }

      // Method 8: Nén Deflate (Chuẩn của .docx)
      if (compMethod === 8) {
        try {
          if (typeof DecompressionStream !== 'undefined') {
            const ds = new DecompressionStream('deflate-raw');
            const writer = ds.writable.getWriter();
            writer.write(compressedData);
            writer.close();

            const response = new Response(ds.readable);
            const arrayBuf = await response.arrayBuffer();
            return new TextDecoder('utf-8').decode(arrayBuf);
          }
        } catch (e) {
          console.warn('DecompressionStream error:', e);
        }
      }
    }

    offset = dataEnd;
  }

  // Fallback: Tìm thẻ XML trực tiếp nếu ZIP có header phức tạp
  try {
    const rawString = new TextDecoder('latin1').decode(bytes);
    const docStart = rawString.indexOf('<w:document');
    const docEnd = rawString.indexOf('</w:document>');
    if (docStart !== -1 && docEnd !== -1) {
      const xmlSlice = rawString.substring(docStart, docEnd + '</w:document>'.length);
      return xmlSlice;
    }
  } catch (err) {
    console.error('Fallback scan error:', err);
  }

  return null;
}

/**
 * Chuyển đổi XML của Word sang Markdown có cấu trúc, giữ nguyên bảng biểu và ngắt đoạn
 */
function parseWordXmlToMarkdown(xmlStr: string): string {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlStr, 'application/xml');

    const body = doc.querySelector('w\\:body, body');
    if (!body) {
      // Fallback regex bóc tách thẻ <w:t>
      const matches = xmlStr.match(/<w:t[^>]*>(.*?)<\/w:t>/g) || [];
      return matches
        .map((m) => m.replace(/<w:t[^>]*>/, '').replace(/<\/w:t>/, ''))
        .join(' ');
    }

    const lines: string[] = [];

    // Duyệt qua các phần tử con trực tiếp của body: đoạn văn <w:p> hoặc bảng <w:tbl>
    const children = body.children;
    for (let i = 0; i < children.length; i++) {
      const el = children[i];
      const nodeName = el.nodeName.toLowerCase();

      if (nodeName.endsWith(':p') || nodeName === 'p') {
        const text = extractTextFromParagraph(el);
        if (text.trim()) {
          lines.push(text.trim());
        }
      } else if (nodeName.endsWith(':tbl') || nodeName === 'tbl') {
        // Xử lý bảng biểu tiêu chí chấm điểm
        const tableMd = extractTableToMarkdown(el);
        if (tableMd.trim()) {
          lines.push('\n' + tableMd + '\n');
        }
      }
    }

    return lines.join('\n\n');
  } catch (e) {
    console.error('Error parsing XML to Markdown:', e);
    return xmlStr
      .replace(/<w:p[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n\s*\n+/g, '\n\n')
      .trim();
  }
}

/**
 * Bóc tách text trong 1 đoạn văn <w:p>
 */
function extractTextFromParagraph(pEl: Element): string {
  const textRuns = pEl.querySelectorAll('w\\:t, t');
  let line = '';
  textRuns.forEach((t) => {
    line += t.textContent || '';
  });
  return line;
}

/**
 * Bóc tách bảng biểu <w:tbl> trong Word thành bảng Markdown
 */
function extractTableToMarkdown(tblEl: Element): string {
  const rows = tblEl.querySelectorAll('w\\:tr, tr');
  if (rows.length === 0) return '';

  const tableData: string[][] = [];

  rows.forEach((row) => {
    const cells = row.querySelectorAll('w\\:tc, tc');
    const rowData: string[] = [];
    cells.forEach((cell) => {
      const pEls = cell.querySelectorAll('w\\:p, p');
      const cellText = Array.from(pEls)
        .map((p) => extractTextFromParagraph(p))
        .join(' ')
        .replace(/\|/g, '\\|')
        .trim();
      rowData.push(cellText);
    });
    if (rowData.some((c) => c.length > 0)) {
      tableData.push(rowData);
    }
  });

  if (tableData.length === 0) return '';

  // Tạo header
  const colCount = Math.max(...tableData.map((r) => r.length));
  const normalizedData = tableData.map((r) => {
    while (r.length < colCount) r.push('');
    return r;
  });

  const header = '| ' + normalizedData[0].join(' | ') + ' |';
  const divider = '| ' + normalizedData[0].map(() => '---').join(' | ') + ' |';
  const bodyRows = normalizedData.slice(1).map((r) => '| ' + r.join(' | ') + ' |');

  return [header, divider, ...bodyRows].join('\n');
}

/**
 * Hàm phân tích file tổng hợp (hỗ trợ .docx, .doc, .pdf)
 */
export async function processUploadedFile(file: File): Promise<ParsedDocumentResult> {
  const name = file.name;
  const lowerName = name.toLowerCase();
  const fileSize = formatFileSize(file.size);

  let fileType: 'docx' | 'pdf' | 'text' = 'text';
  let text = '';
  let base64: string | undefined = undefined;

  let suggestedTitle = name.replace(/\.[^/.]+$/, '');
  let suggestedSource = 'Sở Giáo dục và Đào tạo';

  if (lowerName.includes('hà nội') || lowerName.includes('hn')) suggestedSource = 'Sở GD&ĐT Hà Nội';
  else if (lowerName.includes('hồ chí minh') || lowerName.includes('hcm')) suggestedSource = 'Sở GD&ĐT TP. Hồ Chí Minh';
  else if (lowerName.includes('bộ') || lowerName.includes('bgddt')) suggestedSource = 'Bộ Giáo dục và Đào tạo';
  else if (lowerName.includes('phòng')) suggestedSource = 'Phòng Giáo dục và Đào tạo';

  if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
    fileType = 'docx';
    try {
      text = await parseDocxFile(file);
    } catch (e: any) {
      console.warn('Word client extraction fallback:', e);
      text = `[Tệp Word: ${name} (${fileSize})] - Hệ thống đã nạp file để gửi AI phân tích.`;
    }
    base64 = await readFileAsBase64(file);
  } else if (lowerName.endsWith('.pdf')) {
    fileType = 'pdf';
    base64 = await readFileAsBase64(file);
    text = `[Tệp PDF: ${name} (${fileSize})] - Đang sử dụng Multimodal Document Understanding của Gemini AI để phân tích bảng biểu và tiêu chí chấm điểm...`;
  } else {
    // Tệp text, markdown, txt
    text = await file.text();
  }

  return {
    fileName: name,
    fileSize,
    fileType,
    text,
    base64,
    suggestedTitle,
    suggestedSource,
  };
}
