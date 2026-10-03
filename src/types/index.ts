export type SectionKey =
  | 'overview'
  | 'problem'
  | 'current_situation'
  | 'solutions'
  | 'experiment'
  | 'conclusion'
  | 'defense';

export interface ProjectSection {
  id: SectionKey;
  title: string;
  subtitle: string;
  content: string;
  isCompleted: boolean;
  wordCount: number;
  lastUpdated?: string;
  guidelines: string[];
}

export interface SurveyScoreDistribution {
  category: string; // 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu'
  preControl: number; // Trước - Nhóm đối chứng
  postControl: number; // Sau - Nhóm đối chứng
  preExp: number; // Trước - Nhóm thực nghiệm
  postExp: number; // Sau - Nhóm thực nghiệm
}

export interface SurveyData {
  controlClass: string; // VD: "10A2 (40 HS)"
  experimentClass: string; // VD: "10A1 (42 HS)"
  duration: string; // VD: "8 tuần (Học kỳ 1 năm học 2025-2026)"
  surveyTopic: string;
  preTestAvgScore: { control: number; exp: number };
  postTestAvgScore: { control: number; exp: number };
  pValue: number; // p < 0.05
  distribution: SurveyScoreDistribution[];
  softSkillsProgress: {
    skill: string;
    before: number;
    after: number;
  }[];
}

export interface CouncilMember {
  id: string;
  name: string;
  title: string;
  avatar: string;
  institution: string;
  style: string;
  initialQuestion: string;
}

export interface CouncilChatMessage {
  id: string;
  sender: 'user' | 'judge' | 'system';
  judgeId?: string;
  judgeName?: string;
  text: string;
  timestamp: string;
}

export interface AuditResult {
  totalScore: number;
  noveltyScore: number; // max 30
  academicScore: number; // max 25
  practicalScore: number; // max 30
  presentationScore: number; // max 15
  estimatedPrize: string;
  noveltyEvaluation: string;
  strengths: string[];
  weaknesses: string[];
  councilQuestions: string[];
  recommendations: string;
}

export interface ScoringCriterion {
  id?: string;
  category: string; // Tên tiêu chí, ví dụ: "Tính mới và sáng tạo"
  maxScore: number; // Điểm tối đa, ví dụ: 30
  description: string; // Yêu cầu để đạt điểm tối đa
}

export interface RAGDocument {
  id: string;
  title: string;
  source: string;
  type: 'circular' | 'rubric' | 'past_award' | 'guideline';
  rules: string[];
  content: string;
  isActive: boolean;
  fileType?: 'docx' | 'pdf' | 'text';
  fileName?: string;
  fileSize?: string;
  scoringCriteria?: ScoringCriterion[];
  mandatoryRequirements?: string[];
  keyPriorities?: string[];
  uploadedAt?: string;
}

export interface SKKNProject {
  id: string;
  title: string;
  author: string;
  authorTitle: string; // Giáo viên THPT Hạng II, GV Giỏi cấp Tỉnh
  school: string;
  district: string;
  province: string;
  subject: string;
  gradeLevel: string;
  academicYear: string; // 2025-2026
  status: 'draft' | 'in_review' | 'completed';
  noveltyRating: number; // 1-100
  sections: Record<SectionKey, ProjectSection>;
  surveyData: SurveyData;
  auditResult?: AuditResult;
  councilChatHistory: CouncilChatMessage[];
  ragDocuments: RAGDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  appliedToSection?: SectionKey;
}
