import * as fs from 'fs';
import * as path from 'path';
import { AICodeDetector } from './aiCodeDetector';
import { FileAIStats, ProjectAIStats, AICodeBlock, AICommentType } from '../types';

export class AILinesCounter {
    private detector: AICodeDetector;
    private fileExtensions: string[];
    private debugMode: boolean;

    constructor(debugMode: boolean = false) {
        this.detector = new AICodeDetector();
        this.debugMode = debugMode;
        // Extensiones de archivos de código a analizar
        this.fileExtensions = [
            '.ts', '.tsx', '.js', '.jsx',  // TypeScript y JavaScript
            '.cs', '.java', '.py',          // C#, Java, Python
            '.cpp', '.c', '.h',             // C++, C
            '.php', '.rb', '.go',           // PHP, Ruby, Go
            '.swift', '.kt',                // Swift, Kotlin
            '.rs', '.scala'                 // Rust, Scala
        ];
    }

    /**
     * Analiza un proyecto completo y retorna estadísticas de código AI
     */
    public async analyzeProject(projectPath: string, projectType: string): Promise<ProjectAIStats> {
        const files = this.getAllCodeFiles(projectPath);
        const fileStats: FileAIStats[] = [];

        if (this.debugMode) {
            console.log(`\n📊 Modo debug activado`);
            console.log(`📁 Total de archivos a analizar: ${files.length}\n`);
        }

        for (const filePath of files) {
            const stats = await this.analyzeFile(filePath);
            if (stats) {
                fileStats.push(stats);
            }
        }

        return this.aggregateStats(projectPath, projectType, fileStats);
    }

    /**
     * Analiza un archivo individual
     */
    public async analyzeFile(filePath: string): Promise<FileAIStats | null> {
        try {
            // Intentar leer con diferentes encodings
            let content: string;
            try {
                // Primero intentar UTF-8
                content = fs.readFileSync(filePath, 'utf-8');
            } catch {
                try {
                    // Si falla, intentar latin1 (Windows-1252)
                    content = fs.readFileSync(filePath, 'latin1');
                } catch {
                    // Como último recurso, intentar binary y convertir
                    const buffer = fs.readFileSync(filePath);
                    content = buffer.toString('utf-8');
                }
            }

            const lines = content.split('\n');
            
            const blocks = this.detector.detectAIBlocks(content, filePath);

            // Modo debug: mostrar información detallada solo en archivos con código AI
            if (this.debugMode && blocks.length > 0) {
                this.detector.debugDetection(content, filePath);
            }

            const methods = blocks.filter(b => b.type === AICommentType.METHOD);
            const fragments = blocks.filter(b => b.type === AICommentType.FRAGMENT);
            const refactorings = blocks.filter(b => b.type === AICommentType.REFACTORING);

            const aiGeneratedLines = blocks.reduce((sum, block) => sum + block.lineCount, 0);

            return {
                filePath,
                totalLines: lines.length,
                aiGeneratedLines,
                methods,
                fragments,
                refactorings
            };
        } catch (error) {
            console.error(`Error analizando archivo ${filePath}:`, error);
            return null;
        }
    }

    /**
     * Obtiene todos los archivos de código en el proyecto
     */
    private getAllCodeFiles(dirPath: string, fileList: string[] = []): string[] {
        try {
            const files = fs.readdirSync(dirPath);

            for (const file of files) {
                const filePath = path.join(dirPath, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    // Ignorar directorios comunes que no contienen código fuente
                    if (this.shouldSkipDirectory(file)) {
                        continue;
                    }
                    this.getAllCodeFiles(filePath, fileList);
                } else if (stat.isFile() && this.isCodeFile(file)) {
                    fileList.push(filePath);
                }
            }
        } catch (error) {
            console.error(`Error leyendo directorio ${dirPath}:`, error);
        }

        return fileList;
    }

    /**
     * Verifica si un archivo es un archivo de código
     */
    private isCodeFile(fileName: string): boolean {
        const ext = path.extname(fileName).toLowerCase();
        return this.fileExtensions.includes(ext);
    }

    /**
     * Verifica si se debe omitir un directorio
     */
    private shouldSkipDirectory(dirName: string): boolean {
        const skipDirs = [
            'node_modules',
            'dist',
            'build',
            '.git',
            '.vscode',
            'coverage',
            '.next',
            '.nuxt',
            'out',
            'bin',
            'obj',
            'target',
            '__pycache__',
            'venv',
            '.env'
        ];
        return skipDirs.includes(dirName);
    }

    /**
     * Agrega estadísticas de todos los archivos
     */
    private aggregateStats(
        projectPath: string,
        projectType: string,
        fileStats: FileAIStats[]
    ): ProjectAIStats {
        const totalFiles = fileStats.length;
        const totalLines = fileStats.reduce((sum, stat) => sum + stat.totalLines, 0);
        const totalAILines = fileStats.reduce((sum, stat) => sum + stat.aiGeneratedLines, 0);
        const aiPercentage = totalLines > 0 ? (totalAILines / totalLines) * 100 : 0;

        const methodCount = fileStats.reduce((sum, stat) => sum + stat.methods.length, 0);
        const fragmentCount = fileStats.reduce((sum, stat) => sum + stat.fragments.length, 0);
        const refactoringCount = fileStats.reduce((sum, stat) => sum + stat.refactorings.length, 0);

        return {
            projectPath,
            projectType,
            totalFiles,
            totalLines,
            totalAILines,
            aiPercentage: Math.round(aiPercentage * 100) / 100,
            fileStats: fileStats.filter(stat => stat.aiGeneratedLines > 0), // Solo archivos con código AI
            methodCount,
            fragmentCount,
            refactoringCount
        };
    }

    /**
     * Genera un reporte detallado en formato texto
     */
    public generateTextReport(stats: ProjectAIStats): string {
        const lines: string[] = [];
        
        lines.push('═══════════════════════════════════════════════════════════════');
        lines.push('       REPORTE DE LÍNEAS GENERADAS POR GITHUB COPILOT        ');
        lines.push('═══════════════════════════════════════════════════════════════');
        lines.push('');
        lines.push(`Proyecto: ${stats.projectPath}`);
        lines.push(`Tipo: ${stats.projectType}`);
        lines.push('');
        lines.push('───────────────────────────────────────────────────────────────');
        lines.push('RESUMEN GENERAL');
        lines.push('───────────────────────────────────────────────────────────────');
        lines.push(`Total de archivos analizados: ${stats.totalFiles}`);
        lines.push(`Total de líneas de código: ${stats.totalLines}`);
        lines.push(`Líneas generadas por AI: ${stats.totalAILines}`);
        lines.push(`Porcentaje de código AI: ${stats.aiPercentage}%`);
        lines.push('');
        lines.push('───────────────────────────────────────────────────────────────');
        lines.push('DESGLOSE POR TIPO');
        lines.push('───────────────────────────────────────────────────────────────');
        lines.push(`Métodos completos (Regla 7): ${stats.methodCount}`);
        lines.push(`Fragmentos de código (Regla 8): ${stats.fragmentCount}`);
        lines.push(`Refactorizaciones (Regla 10): ${stats.refactoringCount}`);
        lines.push('');

        if (stats.fileStats.length > 0) {
            lines.push('───────────────────────────────────────────────────────────────');
            lines.push('ARCHIVOS CON CÓDIGO AI');
            lines.push('───────────────────────────────────────────────────────────────');
            
            for (const fileStat of stats.fileStats) {
                const relativePath = path.relative(stats.projectPath, fileStat.filePath);
                const percentage = Math.round((fileStat.aiGeneratedLines / fileStat.totalLines) * 100);
                
                lines.push('');
                lines.push(`📄 ${relativePath}`);
                lines.push(`   Total: ${fileStat.totalLines} líneas | AI: ${fileStat.aiGeneratedLines} líneas (${percentage}%)`);
                
                if (fileStat.methods.length > 0) {
                    lines.push(`   └─ Métodos: ${fileStat.methods.length}`);
                }
                if (fileStat.fragments.length > 0) {
                    lines.push(`   └─ Fragmentos: ${fileStat.fragments.length}`);
                }
                if (fileStat.refactorings.length > 0) {
                    lines.push(`   └─ Refactorizaciones: ${fileStat.refactorings.length}`);
                }
            }
        }

        lines.push('');
        lines.push('═══════════════════════════════════════════════════════════════');
        
        return lines.join('\n');
    }

    /**
     * Genera un reporte en formato JSON
     */
    public generateJsonReport(stats: ProjectAIStats): string {
        return JSON.stringify(stats, null, 2);
    }

    /**
     * Guarda el reporte en un archivo
     */
    public saveReport(stats: ProjectAIStats, outputPath: string, format: 'text' | 'json' = 'text'): void {
        try {
            const report = format === 'json' 
                ? this.generateJsonReport(stats)
                : this.generateTextReport(stats);
            
            fs.writeFileSync(outputPath, report, 'utf-8');
            console.log(`\n✅ Reporte guardado en: ${outputPath}`);
        } catch (error) {
            console.error(`Error guardando reporte:`, error);
        }
    }
}
