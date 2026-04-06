import { ProjectsConfig } from '../config/projectsConfig';
import { AILinesCounter } from './aiLinesCounter';
import { ProjectDetector } from './projectDetector';
import { ProjectAIStats } from '../types';

export interface MultiProjectResult {
    repositoryName: string;
    projectPath: string;
    stats: ProjectAIStats;
    error?: string;
}

/**
 * Analizador de múltiples proyectos
 */
export class MultiProjectAnalyzer {
    private config: ProjectsConfig;
    private debugMode: boolean;

    constructor(configFilePath?: string, debugMode: boolean = false) {
        this.config = new ProjectsConfig(configFilePath);
        this.debugMode = debugMode;
    }

    /**
     * Analiza todos los proyectos configurados
     */
    public async analyzeAllProjects(): Promise<MultiProjectResult[]> {
        console.log('\n╔═══════════════════════════════════════════════════════════════╗');
        console.log('║          LINE COUNTER - ANÁLISIS MULTI-PROYECTO              ║');
        console.log('╚═══════════════════════════════════════════════════════════════╝\n');

        // Cargar rutas de proyectos
        const projectPaths = this.config.loadProjectPaths();
        console.log(`📂 Proyectos a analizar: ${projectPaths.length}\n`);

        const results: MultiProjectResult[] = [];

        // Analizar cada proyecto secuencialmente
        for (let i = 0; i < projectPaths.length; i++) {
            const projectPath = projectPaths[i];
            const repositoryName = ProjectsConfig.extractRepositoryName(projectPath);

            console.log(`[${i + 1}/${projectPaths.length}] Analizando: ${repositoryName}`);
            console.log(`    Ruta: ${projectPath}`);

            try {
                // Detectar tipo de proyecto
                const projectDetector = new ProjectDetector(projectPath);
                const projectType = projectDetector.detectProjectType();

                // Analizar proyecto
                const counter = new AILinesCounter(this.debugMode);
                const stats = await counter.analyzeProject(projectPath, projectType);

                results.push({
                    repositoryName,
                    projectPath,
                    stats
                });

                console.log(`    ✅ Completado: ${stats.totalLines} líneas totales, ${stats.totalAILines} líneas AI\n`);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
                console.error(`    ❌ Error: ${errorMessage}\n`);

                results.push({
                    repositoryName,
                    projectPath,
                    stats: this.createEmptyStats(projectPath),
                    error: errorMessage
                });
            }
        }

        return results;
    }

    /**
     * Genera una tabla resumen de todos los proyectos analizados
     */
    public generateSummaryTable(results: MultiProjectResult[]): string {
        const lines: string[] = [];

        lines.push('\n╔═══════════════════════════════════════════════════════════════╗');
        lines.push('║                       LINE COUNTER                            ║');
        lines.push('║                   RESUMEN DE ANÁLISIS                         ║');
        lines.push('╚═══════════════════════════════════════════════════════════════╝\n');

        // Calcular anchos de columnas para alineación
        const maxRepoNameLength = Math.max(
            ...results.map(r => r.repositoryName.length),
            'Repositorio'.length
        );

        const col1Width = Math.max(maxRepoNameLength, 30);
        const col2Width = 18;
        const col3Width = 16;

        // Encabezado de tabla
        const headerSeparator = '─'.repeat(col1Width + col2Width + col3Width + 4);
        
        lines.push('┌' + headerSeparator + '┐');
        lines.push(
            '│ ' + 
            this.padString('Repositorio', col1Width) + '│ ' +
            this.padString('Líneas de Código', col2Width) + '│ ' +
            this.padString('Líneas Copilot', col3Width) + '│'
        );
        lines.push('├' + headerSeparator + '┤');

        // Filas de datos
        let totalLines = 0;
        let totalAILines = 0;

        for (const result of results) {
            const repoName = result.error ? `${result.repositoryName} ⚠️` : result.repositoryName;
            const linesOfCode = result.error ? 'Error' : result.stats.totalLines.toString();
            const aiLines = result.error ? '-' : result.stats.totalAILines.toString();

            if (!result.error) {
                totalLines += result.stats.totalLines;
                totalAILines += result.stats.totalAILines;
            }

            lines.push(
                '│ ' +
                this.padString(repoName, col1Width) + '│ ' +
                this.padString(linesOfCode, col2Width, 'right') + '│ ' +
                this.padString(aiLines, col3Width, 'right') + '│'
            );
        }

        // Fila de totales
        lines.push('├' + headerSeparator + '┤');
        lines.push(
            '│ ' +
            this.padString('TOTAL', col1Width, 'left', true) + '│ ' +
            this.padString(totalLines.toString(), col2Width, 'right', true) + '│ ' +
            this.padString(totalAILines.toString(), col3Width, 'right', true) + '│'
        );
        lines.push('└' + headerSeparator + '┘\n');

        // Estadísticas adicionales
        const successCount = results.filter(r => !r.error).length;
        const errorCount = results.filter(r => r.error).length;
        const aiPercentage = totalLines > 0 ? ((totalAILines / totalLines) * 100).toFixed(2) : '0.00';

        lines.push('📊 ESTADÍSTICAS GENERALES:');
        lines.push(`   • Proyectos analizados exitosamente: ${successCount}/${results.length}`);
        if (errorCount > 0) {
            lines.push(`   • Proyectos con errores: ${errorCount}`);
        }
        lines.push(`   • Total de líneas de código: ${totalLines}`);
        lines.push(`   • Total de líneas generadas por Copilot: ${totalAILines}`);
        lines.push(`   • Porcentaje de código AI: ${aiPercentage}%`);
        lines.push('');

        return lines.join('\n');
    }

    /**
     * Genera un reporte detallado en formato texto
     */
    public generateDetailedReport(results: MultiProjectResult[]): string {
        const lines: string[] = [];

        lines.push(this.generateSummaryTable(results));
        lines.push('═══════════════════════════════════════════════════════════════');
        lines.push('                    DETALLES POR PROYECTO                      ');
        lines.push('═══════════════════════════════════════════════════════════════\n');

        for (const result of results) {
            lines.push(`\n📦 ${result.repositoryName}`);
            lines.push(`   Ruta: ${result.projectPath}`);

            if (result.error) {
                lines.push(`   ❌ Error: ${result.error}\n`);
                continue;
            }

            const stats = result.stats;
            lines.push(`   Tipo de proyecto: ${stats.projectType}`);
            lines.push(`   Archivos analizados: ${stats.totalFiles}`);
            lines.push(`   Total de líneas: ${stats.totalLines}`);
            lines.push(`   Líneas AI: ${stats.totalAILines} (${stats.aiPercentage}%)`);
            lines.push(`   Métodos completos: ${stats.methodCount}`);
            lines.push(`   Fragmentos: ${stats.fragmentCount}`);
            lines.push(`   Refactorizaciones: ${stats.refactoringCount}`);
            lines.push('');
        }

        return lines.join('\n');
    }

    /**
     * Guarda el reporte en un archivo
     */
    public saveReport(results: MultiProjectResult[], outputFile: string, format: 'text' | 'json' = 'text') {
        const fs = require('fs');
        const path = require('path');

        try {
            let content: string;

            if (format === 'json') {
                content = JSON.stringify(results, null, 2);
            } else {
                content = this.generateDetailedReport(results);
            }

            fs.writeFileSync(outputFile, content, 'utf-8');
            console.log(`\n💾 Reporte guardado en: ${path.resolve(outputFile)}`);
        } catch (error) {
            console.error(`\n❌ Error guardando reporte: ${error}`);
        }
    }

    /**
     * Helper: Ajusta una cadena a un ancho específico con padding
     */
    private padString(str: string, width: number, align: 'left' | 'right' = 'left', bold: boolean = false): string {
        const displayStr = bold ? str : str;
        const length = str.length;

        if (length >= width) {
            return displayStr.substring(0, width);
        }

        const padding = ' '.repeat(width - length);
        return align === 'left' ? displayStr + padding : padding + displayStr;
    }

    /**
     * Crea estadísticas vacías para proyectos con error
     */
    private createEmptyStats(projectPath: string): ProjectAIStats {
        return {
            projectPath,
            projectType: 'unknown',
            totalFiles: 0,
            totalLines: 0,
            totalAILines: 0,
            aiPercentage: 0,
            fileStats: [],
            methodCount: 0,
            fragmentCount: 0,
            refactoringCount: 0
        };
    }
}
