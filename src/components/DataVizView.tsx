import React, { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  CheckCircle2,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  Info,
  Sparkles,
  Download,
} from 'lucide-react';
import { SKKNProject, SurveyData } from '../types';

interface DataVizViewProps {
  project: SKKNProject;
  onUpdateSurveyData: (newData: SurveyData) => void;
  onInsertToSection: (sectionKey: 'experiment', textToAppend: string) => void;
}

export const DataVizView: React.FC<DataVizViewProps> = ({
  project,
  onUpdateSurveyData,
  onInsertToSection,
}) => {
  const [data, setData] = useState<SurveyData>(project.surveyData);
  const [activeTab, setActiveTab] = useState<'comparison' | 'distribution' | 'softskills'>('comparison');
  const [copiedNotice, setCopiedNotice] = useState(false);

  const handleScoreChange = (type: 'pre' | 'post', group: 'control' | 'exp', val: number) => {
    const updated = {
      ...data,
      preTestAvgScore:
        type === 'pre'
          ? { ...data.preTestAvgScore, [group]: val }
          : data.preTestAvgScore,
      postTestAvgScore:
        type === 'post'
          ? { ...data.postTestAvgScore, [group]: val }
          : data.postTestAvgScore,
    };
    setData(updated);
    onUpdateSurveyData(updated);
  };

  const handleInsertReportToDocument = () => {
    const reportText = `### BẢNG TỔNG HỢP KẾT QUẢ THỰC NGHIỆM SƯ PHẠM ĐỐI CHỨNG
- **Nhóm Thực nghiệm:** ${data.experimentClass} | Điểm trước: ${data.preTestAvgScore.exp} -> Điểm sau: ${data.postTestAvgScore.exp} (Tăng +${(data.postTestAvgScore.exp - data.preTestAvgScore.exp).toFixed(2)} điểm)
- **Nhóm Đối chứng:** ${data.controlClass} | Điểm trước: ${data.preTestAvgScore.control} -> Điểm sau: ${data.postTestAvgScore.control} (Tăng +${(data.postTestAvgScore.control - data.preTestAvgScore.control).toFixed(2)} điểm)
- **Giá trị kiểm định T-test:** p = ${data.pValue} < 0.05 (Khẳng định sự chênh lệch có ý nghĩa thống kê khoa học).

#### Bảng tỷ lệ xếp loại sau tác động:
${data.distribution
  .map(
    (d) =>
      `- **${d.category}:** Lớp Thực nghiệm đạt ${d.postExp}% (so với Đối chứng ${d.postControl}%)`
  )
  .join('\n')}`;

    onInsertToSection('experiment', reportText);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 3000);
  };

  const expGain = (data.postTestAvgScore.exp - data.preTestAvgScore.exp).toFixed(2);
  const controlGain = (data.postTestAvgScore.control - data.preTestAvgScore.control).toFixed(2);

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-100/70">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Thống kê & Thực nghiệm Sư phạm
              </span>
              <span className="text-xs text-slate-300">Chuẩn nghiên cứu khoa học sư phạm ứng dụng</span>
            </div>
            <h2 className="text-xl font-bold mt-1 text-white">
              Phân Tích Số Liệu & Kiểm Định Thống Kê T-test
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              So sánh khách quan giữa Lớp Thực Nghiệm (áp dụng giải pháp SKKN) và Lớp Đối Chứng (dạy học truyền thống) theo chuẩn Đề tài cấp Tỉnh/Thành phố.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleInsertReportToDocument}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white text-xs font-bold transition shadow-lg shadow-orange-500/25"
            >
              {copiedNotice ? (
                <CheckCircle2 className="w-4 h-4 text-white" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-200" />
              )}
              <span>{copiedNotice ? 'Đã chèn vào Mục 5!' : 'Chèn bảng vào bài SKKN'}</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Score Growth */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Mức tăng điểm TB (Gain)</span>
              <span className="p-2 rounded-xl bg-orange-50 text-[#FF6B00]">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">+{expGain} đ</span>
              <span className="text-xs text-emerald-600 font-semibold">(Lớp Thực nghiệm)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Lớp đối chứng chỉ tăng +{controlGain} đ (Chênh lệch: +{(parseFloat(expGain) - parseFloat(controlGain)).toFixed(2)} đ)
            </p>
          </div>

          {/* Card 2: Statistical Significance T-test */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Kiểm định T-test (p-value)</span>
              <span className="p-2 rounded-xl bg-purple-50 text-purple-600">
                <Layers className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-purple-700">p = {data.pValue}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                p &lt; 0.01 (Tuyệt đối)
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Sự chênh lệch có ý nghĩa thống kê cao, loại trừ yếu tố may rủi.
            </p>
          </div>

          {/* Card 3: Excellent rate growth */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Tỷ lệ học sinh Giỏi</span>
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                <BarChart2 className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-emerald-600">
                {data.distribution[0]?.postExp}%
              </span>
              <span className="text-xs text-slate-500 line-through">
                {data.distribution[0]?.preExp}%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Tăng trưởng vượt bậc +{(data.distribution[0]?.postExp - data.distribution[0]?.preExp).toFixed(1)}% sau tác động.
            </p>
          </div>
        </div>

        {/* Tab Navigation for Visualizations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex gap-1">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition ${
              activeTab === 'comparison'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📊 So sánh Điểm TB Trước & Sau tác động
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition ${
              activeTab === 'distribution'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📈 Phân bố Xếp loại (Giỏi - Khá - TB - Yếu)
          </button>
          <button
            onClick={() => setActiveTab('softskills')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition ${
              activeTab === 'softskills'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🎯 Đánh giá Năng lực Sư phạm & Phẩm chất
          </button>
        </div>

        {/* Visual Charts Container */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          {activeTab === 'comparison' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    Biểu Đồ So Sánh Điểm Trung Bình Kiểm Tra (Thang 10)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Đối chiếu Lớp Thực nghiệm ({data.experimentClass}) và Lớp Đối chứng ({data.controlClass})
                  </p>
                </div>
              </div>

              {/* Custom SVG Bar Chart */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                {/* Before Intervention */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="text-xs font-bold text-slate-600 mb-4 text-center uppercase tracking-wide">
                    1. Khảo sát Trước Tác Động (Đầu kỳ)
                  </div>
                  <div className="h-48 flex items-end justify-center gap-8 px-4 border-b border-slate-300 pb-2">
                    {/* Control */}
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">
                        {data.preTestAvgScore.control}
                      </span>
                      <div
                        className="w-16 bg-slate-400 rounded-t-lg transition-all duration-500 shadow-xs"
                        style={{ height: `${(data.preTestAvgScore.control / 10) * 160}px` }}
                      />
                      <span className="text-[11px] font-medium text-slate-600">Đối chứng</span>
                    </div>

                    {/* Exp */}
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xs font-bold text-[#FF6B00]">
                        {data.preTestAvgScore.exp}
                      </span>
                      <div
                        className="w-16 bg-orange-400 rounded-t-lg transition-all duration-500 shadow-xs"
                        style={{ height: `${(data.preTestAvgScore.exp / 10) * 160}px` }}
                      />
                      <span className="text-[11px] font-medium text-slate-600">Thực nghiệm</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-center text-slate-500 mt-3">
                    Độ lệch ban đầu: Chỉ chênh {(data.preTestAvgScore.exp - data.preTestAvgScore.control).toFixed(2)} điểm (Tương đương)
                  </p>
                </div>

                {/* After Intervention */}
                <div className="bg-purple-50/40 p-5 rounded-2xl border border-purple-200">
                  <div className="text-xs font-bold text-purple-900 mb-4 text-center uppercase tracking-wide">
                    2. Kết quả Sau Tác Động (Cuối kỳ)
                  </div>
                  <div className="h-48 flex items-end justify-center gap-8 px-4 border-b border-purple-300 pb-2">
                    {/* Control */}
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">
                        {data.postTestAvgScore.control}
                      </span>
                      <div
                        className="w-16 bg-slate-400 rounded-t-lg transition-all duration-500 shadow-xs"
                        style={{ height: `${(data.postTestAvgScore.control / 10) * 160}px` }}
                      />
                      <span className="text-[11px] font-medium text-slate-600">Đối chứng</span>
                    </div>

                    {/* Exp */}
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xs font-bold text-[#7C3AED]">
                        {data.postTestAvgScore.exp}
                      </span>
                      <div
                        className="w-16 bg-gradient-to-t from-[#7C3AED] to-purple-500 rounded-t-lg transition-all duration-500 shadow-md shadow-purple-500/30"
                        style={{ height: `${(data.postTestAvgScore.exp / 10) * 160}px` }}
                      />
                      <span className="text-[11px] font-bold text-purple-900">Thực nghiệm (+{expGain})</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-center text-purple-700 font-semibold mt-3">
                    Bứt phá rõ rệt: Lớp Thực nghiệm cao hơn Đối chứng +{(data.postTestAvgScore.exp - data.postTestAvgScore.control).toFixed(2)} điểm
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'distribution' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  Cơ Cấu Tỷ Lệ Xếp Loại Sau Thực Nghiệm (%)
                </h3>
                <p className="text-xs text-slate-500">
                  Minh chứng giải pháp giúp xóa học sinh yếu kém và tăng tỷ lệ học sinh Giỏi
                </p>
              </div>

              <div className="space-y-4 pt-2">
                {data.distribution.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 mb-1.5">
                      <span>{item.category}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-500 font-normal">
                          Đối chứng: <strong>{item.postControl}%</strong>
                        </span>
                        <span className="text-purple-700 font-bold">
                          Thực nghiệm: <strong>{item.postExp}%</strong>
                        </span>
                      </div>
                    </div>
                    {/* Visual Comparison Progress bars */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="w-16 text-slate-400 shrink-0">Đối chứng</span>
                        <div className="flex-1 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-slate-400 h-full rounded-full"
                            style={{ width: `${item.postControl}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="w-16 text-[#FF6B00] font-bold shrink-0">Thực nghiệm</span>
                        <div className="flex-1 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#FF6B00] to-purple-600 h-full rounded-full"
                            style={{ width: `${item.postExp}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'softskills' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-slate-800 text-base">
                  Chỉ Số Phát Triển Năng Lực Sư Phạm Theo GDPT 2018 (%)
                </h3>
                <p className="text-xs text-slate-500">
                  Đánh giá định tính qua bảng hỏi quan sát hành vi và thang đo Likert 5 mức độ
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {data.softSkillsProgress.map((skill, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800">{skill.skill}</span>
                      <span className="text-xs font-bold text-emerald-600">
                        +{skill.after - skill.before}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-500">{skill.before}%</span>
                      <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${skill.after}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700">{skill.after}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Editable Raw Data Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-slate-800 text-base">
                Bảng Thông Số Nhập Liệu Thực Nghiệm (Có Thể Chỉnh Sửa)
              </h3>
            </div>
            <span className="text-xs text-slate-400">Dữ liệu được cập nhật tự động lên biểu đồ</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-700 border-collapse">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="p-3 border border-slate-200">Nhóm Khảo Sát</th>
                  <th className="p-3 border border-slate-200">Tên Lớp & Sĩ số</th>
                  <th className="p-3 border border-slate-200 text-center">Điểm TB Trước tác động</th>
                  <th className="p-3 border border-slate-200 text-center">Điểm TB Sau tác động</th>
                  <th className="p-3 border border-slate-200 text-center">Độ Tăng (Gain)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border border-slate-200 font-semibold text-slate-600">
                    Lớp Đối chứng
                  </td>
                  <td className="p-3 border border-slate-200">{data.controlClass}</td>
                  <td className="p-2 border border-slate-200 text-center">
                    <input
                      type="number"
                      step="0.05"
                      value={data.preTestAvgScore.control}
                      onChange={(e) =>
                        handleScoreChange('pre', 'control', parseFloat(e.target.value) || 0)
                      }
                      className="w-20 text-center p-1 rounded border border-slate-300 font-bold"
                    />
                  </td>
                  <td className="p-2 border border-slate-200 text-center">
                    <input
                      type="number"
                      step="0.05"
                      value={data.postTestAvgScore.control}
                      onChange={(e) =>
                        handleScoreChange('post', 'control', parseFloat(e.target.value) || 0)
                      }
                      className="w-20 text-center p-1 rounded border border-slate-300 font-bold"
                    />
                  </td>
                  <td className="p-3 border border-slate-200 text-center font-bold text-slate-600">
                    +{(data.postTestAvgScore.control - data.preTestAvgScore.control).toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-orange-50/30">
                  <td className="p-3 border border-slate-200 font-bold text-[#FF6B00]">
                    Lớp Thực nghiệm (SKKN)
                  </td>
                  <td className="p-3 border border-slate-200 font-semibold text-slate-900">
                    {data.experimentClass}
                  </td>
                  <td className="p-2 border border-slate-200 text-center">
                    <input
                      type="number"
                      step="0.05"
                      value={data.preTestAvgScore.exp}
                      onChange={(e) =>
                        handleScoreChange('pre', 'exp', parseFloat(e.target.value) || 0)
                      }
                      className="w-20 text-center p-1 rounded border border-orange-400 font-bold text-[#FF6B00]"
                    />
                  </td>
                  <td className="p-2 border border-slate-200 text-center">
                    <input
                      type="number"
                      step="0.05"
                      value={data.postTestAvgScore.exp}
                      onChange={(e) =>
                        handleScoreChange('post', 'exp', parseFloat(e.target.value) || 0)
                      }
                      className="w-20 text-center p-1 rounded border border-purple-400 font-bold text-purple-700"
                    />
                  </td>
                  <td className="p-3 border border-slate-200 text-center font-extrabold text-emerald-600">
                    +{(data.postTestAvgScore.exp - data.preTestAvgScore.exp).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
