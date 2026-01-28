// Shared types for DesignCase AI

export type PlanType = 'FREE' | 'PRO' | 'ENTERPRISE';
export type SourceType = 'UPLOAD' | 'FIGMA' | 'URL';
export type ProjectStatus =
  | 'PENDING'
  | 'UPLOADING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'ARCHIVED';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  plan: PlanType;
  projectsCount: number;
  storageUsed: bigint;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description?: string;
  slug: string;
  sourceType: SourceType;
  sourceData: Record<string, unknown>;
  status: ProjectStatus;
  progress: number;
  errorMsg?: string;
  thumbnail?: string;
  fileSize?: bigint;
  dimensions?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface Analysis {
  id: string;
  projectId: string;
  colorPalette: unknown;
  typography: unknown;
  layout: unknown;
  components: unknown;
  designSystem?: string;
  framework?: string;
  strengths: unknown[];
  improvements: unknown[];
  uniqueness: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseStudy {
  id: string;
  projectId: string;
  title: string;
  overview: string;
  templateId: string;
  published: boolean;
  slug: string;
  views: number;
  likes: number;
  shares: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  thumbnail: string;
  isPremium: boolean;
  isPublic: boolean;
  sortOrder: number;
}
