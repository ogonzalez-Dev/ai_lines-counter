import { ProjectDetector } from './core/projectDetector';
import { runFrontendScript } from './scripts/frontend';
import { runBackendScript } from './scripts/backend';
import { AILinesCounter } from './core/aiLinesCounter';
import { MultiProjectAnalyzer } from './core/multiProjectAnalyzer';
import { GitManager } from './core/gitManager';
import { ProjectsConfig } from './config/projectsConfig';
import * as path from 'path';

export async function analyzeProject(projectPath?: string, outputFile?: string, debugMode: boolean = false) {
    try {
        // Usar el directorio actual si no se especifica una ruta
        const targetPath = projectPath || process.cwd();
        
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('   CONTADOR DE LÍNEAS GENERADAS POR GITHUB COPILOT');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log(`\n🔍 Analizando proyecto en: ${targetPath}\n`);

        // Detectar tipo de proyecto
        const projectDetector = new ProjectDetector(targetPath);
        const projectType = projectDetector.detectProjectType();
        
        console.log(`📋 Tipo de proyecto detectado: ${projectType.toUpperCase()}`);

        let stats;

        // Ejecutar el script correspondiente según el tipo de proyecto
        switch (projectType) {
            case 'frontend':
                stats = await runFrontendScript(targetPath, debugMode);
                break;
            case 'backend':
                stats = await runBackendScript(targetPath, debugMode);
                break;
            case 'unknown':
                console.log('\n⚠️  Tipo de proyecto no reconocido. Analizando como proyecto genérico...');
                const counter = new AILinesCounter(debugMode);
                stats = await counter.analyzeProject(targetPath, 'generic');
                console.log(counter.generateTextReport(stats));
                break;
            default:
                throw new Error('Tipo de proyecto no soportado');
        }

        // Guardar reporte si se especifica un archivo de salida
        if (outputFile && stats) {
            const counter = new AILinesCounter(debugMode);
            const ext = path.extname(outputFile).toLowerCase();
            const format = ext === '.json' ? 'json' : 'text';
            counter.saveReport(stats, outputFile, format);
        }

        return stats;
    } catch (error) {
        console.error('\n❌ Error ejecutando el análisis:', error);
        throw error;
    }
}

/**
 * Analiza múltiples proyectos configurados en projects.txt.txt
 */
export async function analyzeAllProjects(outputFile?: string, format: 'text' | 'json' = 'text', debugMode: boolean = false) {
    try {
        const analyzer = new MultiProjectAnalyzer(undefined, debugMode);
        const results = await analyzer.analyzeAllProjects();

        // Mostrar tabla resumen en consola
        console.log(analyzer.generateSummaryTable(results));

        // Guardar reporte si se especifica un archivo de salida
        if (outputFile) {
            analyzer.saveReport(results, outputFile, format);
        }

        return results;
    } catch (error) {
        console.error('\n❌ Error ejecutando el análisis multi-proyecto:', error);
        throw error;
    }
}

/**
 * Prepara todos los repositorios cambiándolos a la rama main
 */
export async function prepareRepositories(targetBranch: string = 'main') {
    try {
        const config = new ProjectsConfig();
        const projectPaths = config.loadProjectPaths();
        
        const gitManager = new GitManager(targetBranch);
        const results = await gitManager.processMultipleProjects(projectPaths);
        
        // Mostrar resumen
        console.log(gitManager.generateSummary(results));
        
        return results;
    } catch (error) {
        console.error('\n❌ Error preparando repositorios:', error);
        throw error;
    }
}

// Permitir ejecutar directamente si se llama como script
if (require.main === module) {
    const args = process.argv.slice(2);
    const projectPath = args[0];
    const outputFile = args[1];
    
    analyzeProject(projectPath, outputFile)
        .then(() => {
            console.log('\n✅ Análisis completado exitosamente.');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Análisis fallido:', error.message);
            process.exit(1);
        });
}