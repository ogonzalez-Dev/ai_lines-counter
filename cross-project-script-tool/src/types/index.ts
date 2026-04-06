export interface ProjectType {
    name: string;
    description: string;
}

export interface ScriptOptions {
    verbose?: boolean;
    dryRun?: boolean;
}

export interface ScriptResult {
    success: boolean;
    output?: string;
    error?: string;
}

// AI Code Detection Types
export enum AICommentType {
    METHOD = 'method',           // Regla 7: Método completo (sin cierre)
    FRAGMENT = 'fragment',       // Regla 8: Fragmento con inicio y fin
    REFACTORING = 'refactoring'  // Regla 10: Refactorización con inicio y fin
}

export interface AICommentPattern {
    type: AICommentType;
    startPattern: RegExp;
    endPattern?: RegExp;  // Opcional porque la regla 7 no tiene cierre
    hasClosingComment: boolean;
}

export interface AICodeBlock {
    type: AICommentType;
    startLine: number;
    endLine: number;
    lineCount: number;
    filePath: string;
}

export interface FileAIStats {
    filePath: string;
    totalLines: number;
    aiGeneratedLines: number;
    methods: AICodeBlock[];
    fragments: AICodeBlock[];
    refactorings: AICodeBlock[];
}

export interface ProjectAIStats {
    projectPath: string;
    projectType: string;
    totalFiles: number;
    totalLines: number;
    totalAILines: number;
    aiPercentage: number;
    fileStats: FileAIStats[];
    methodCount: number;
    fragmentCount: number;
    refactoringCount: number;
}

// Multi-Project Analysis Types
export interface MultiProjectResult {
    repositoryName: string;
    projectPath: string;
    stats: ProjectAIStats;
    error?: string;
}