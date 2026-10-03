import React, { useState, useEffect } from 'react';
import { SKKNProject, SectionKey, SurveyData, AuditResult, CouncilChatMessage, RAGDocument } from './types';
import { SAMPLE_PROJECTS } from './data/defaultProjects';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { EditorView } from './components/EditorView';
import { DataVizView } from './components/DataVizView';
import { AuditView } from './components/AuditView';
import { CouncilView } from './components/CouncilView';
import { PreviewView } from './components/PreviewView';
import { RightAiPanel } from './components/RightAiPanel';
import { RAGModal } from './components/RAGModal';
import { NewProjectModal } from './components/NewProjectModal';
import { ApiKeyModal } from './components/ApiKeyModal';

export default function App() {
  const [projects, setProjects] = useState<SKKNProject[]>(() => {
    const saved = localStorage.getItem('skkn_projects_2026');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved projects', e);
      }
    }
    return SAMPLE_PROJECTS;
  });

  const [currentProjectId, setCurrentProjectId] = useState<string>(projects[0]?.id || 'skkn-proj-01');
  const [activeSectionKey, setActiveSectionKey] = useState<SectionKey>('overview');
  const [currentView, setCurrentView] = useState<'editor' | 'dataviz' | 'audit' | 'council' | 'preview'>('editor');
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true);
  const [isRAGOpen, setIsRAGOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Sync projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('skkn_projects_2026', JSON.stringify(projects));
    } catch (e) {
      console.warn('Storage limit or error', e);
    }
  }, [projects]);

  // Check API key on initial load - prompt user if not set
  useEffect(() => {
    const key = localStorage.getItem('gemini_api_key_skkn');
    if (!key) {
      setIsApiKeyModalOpen(true);
    }
  }, []);

  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  // Handlers
  const handleSelectProject = (proj: SKKNProject) => {
    setCurrentProjectId(proj.id);
  };

  const handleCreateProject = (newProj: SKKNProject) => {
    setProjects([newProj, ...projects]);
    setCurrentProjectId(newProj.id);
    setActiveSectionKey('overview');
    setCurrentView('editor');
  };

  const handleUpdateSectionContent = (key: SectionKey, content: string, isCompleted: boolean) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== currentProjectId) return p;
        const currentSec = p.sections[key];
        const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
        return {
          ...p,
          updatedAt: new Date().toISOString().split('T')[0],
          sections: {
            ...p.sections,
            [key]: {
              ...currentSec,
              content,
              isCompleted,
              wordCount,
              lastUpdated: 'Vừa xong',
            },
          },
        };
      })
    );
  };

  const handleUpdateSurveyData = (newSurvey: SurveyData) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === currentProjectId ? { ...p, surveyData: newSurvey } : p))
    );
  };

  const handleUpdateAuditResult = (audit: AuditResult) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === currentProjectId ? { ...p, auditResult: audit } : p))
    );
  };

  const handleUpdateCouncilChat = (chat: CouncilChatMessage[]) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === currentProjectId ? { ...p, councilChatHistory: chat } : p))
    );
  };

  const handleInsertTextToEditor = (textToInsert: string) => {
    if (!currentProject) return;
    const currentSection = currentProject.sections[activeSectionKey];
    const newContent = currentSection.content + '\n\n' + textToInsert;
    handleUpdateSectionContent(activeSectionKey, newContent, currentSection.isCompleted);
    setCurrentView('editor');
  };

  const handleInsertToExperimentSection = (sectionKey: 'experiment', textToAppend: string) => {
    if (!currentProject) return;
    const currentSec = currentProject.sections[sectionKey];
    const newContent = currentSec.content + '\n\n' + textToAppend;
    handleUpdateSectionContent(sectionKey, newContent, currentSec.isCompleted);
    setActiveSectionKey(sectionKey);
    setCurrentView('editor');
  };

  // RAG management
  const handleRAGAddDocument = (newDoc: RAGDocument) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== currentProjectId) return p;
        return {
          ...p,
          ragDocuments: [newDoc, ...p.ragDocuments],
        };
      })
    );
  };

  const handleRAGToggle = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== currentProjectId) return p;
        return {
          ...p,
          ragDocuments: p.ragDocuments.map((d) =>
            d.id === id ? { ...d, isActive: !d.isActive } : d
          ),
        };
      })
    );
  };

  const handleRAGDelete = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== currentProjectId) return p;
        return {
          ...p,
          ragDocuments: p.ragDocuments.filter((d) => d.id !== id),
        };
      })
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-800 antialiased select-none">
      {/* 1. Left Sidebar (280px) */}
      <Sidebar
        currentProject={currentProject}
        projects={projects}
        onSelectProject={handleSelectProject}
        onNewProject={() => setIsNewProjectOpen(true)}
        activeSectionKey={activeSectionKey}
        onSelectSection={(key) => setActiveSectionKey(key)}
        onOpenRAG={() => setIsRAGOpen(true)}
        currentView={currentView}
        onChangeView={(view) => setCurrentView(view)}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header
          project={currentProject}
          currentView={currentView}
          onChangeView={(view) => setCurrentView(view)}
          isAiPanelOpen={isAiPanelOpen}
          onToggleAiPanel={() => setIsAiPanelOpen(!isAiPanelOpen)}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        />

        {/* Dynamic Center Workspaces */}
        <div className="flex-1 flex min-w-0 overflow-hidden">
          {currentView === 'editor' && (
            <EditorView
              project={currentProject}
              activeSectionKey={activeSectionKey}
              onUpdateSectionContent={handleUpdateSectionContent}
              onTriggerAiCopilot={(p) => {
                setIsAiPanelOpen(true);
              }}
              onOpenRAG={() => setIsRAGOpen(true)}
            />
          )}

          {currentView === 'dataviz' && (
            <DataVizView
              project={currentProject}
              onUpdateSurveyData={handleUpdateSurveyData}
              onInsertToSection={handleInsertToExperimentSection}
            />
          )}

          {currentView === 'audit' && (
            <AuditView
              project={currentProject}
              onUpdateAuditResult={handleUpdateAuditResult}
              onGoToSection={(sec) => {
                setActiveSectionKey(sec);
                setCurrentView('editor');
              }}
              onOpenRAG={() => setIsRAGOpen(true)}
            />
          )}

          {currentView === 'council' && (
            <CouncilView
              project={currentProject}
              onUpdateCouncilChat={handleUpdateCouncilChat}
            />
          )}

          {currentView === 'preview' && (
            <PreviewView
              project={currentProject}
              onBackToEditor={() => setCurrentView('editor')}
            />
          )}

          {/* 3. Right AI Copilot Panel (Docked or Collapsed) */}
          {currentView !== 'preview' && (
            <RightAiPanel
              isOpen={isAiPanelOpen}
              onClose={() => setIsAiPanelOpen(false)}
              project={currentProject}
              activeSectionKey={activeSectionKey}
              onInsertTextToEditor={handleInsertTextToEditor}
            />
          )}
        </div>
      </main>

      {/* RAG Knowledge Base Modal */}
      <RAGModal
        isOpen={isRAGOpen}
        onClose={() => setIsRAGOpen(false)}
        documents={currentProject.ragDocuments || []}
        onAddDocument={handleRAGAddDocument}
        onToggleDocument={handleRAGToggle}
        onDeleteDocument={handleRAGDelete}
      />

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onCreateProject={handleCreateProject}
      />

      {/* Gemini API Key & Model Settings Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
}
