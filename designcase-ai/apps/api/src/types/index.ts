// Type definitions for the application

export interface ProjectInput {
  userId: string;
  name: string;
  description?: string;
  sourceType: 'UPLOAD' | 'FIGMA' | 'URL';
  sourceData: Record<string, unknown>;
}

export interface AnalysisInput {
  projectId: string;
  colorPalette: unknown;
  typography: unknown;
  layout: unknown;
}

export interface CaseStudyInput {
  projectId: string;
  title: string;
  overview: string;
  templateId: string;
}
