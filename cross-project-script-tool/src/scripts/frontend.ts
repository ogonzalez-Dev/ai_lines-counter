import { AILinesCounter } from '../core/aiLinesCounter';
import { ProjectAIStats } from '../types';

export async function runFrontendScript(projectPath: string, debugMode: boolean = false): Promise<ProjectAIStats> {
    console.log('\n🔍 Analizando proyecto frontend...');
    console.log(`📁 Ruta: ${projectPath}`);
    
    const counter = new AILinesCounter(debugMode);
    const stats = await counter.analyzeProject(projectPath, 'frontend');
    
    // Mostrar reporte en consola
    console.log(counter.generateTextReport(stats));
    
    return stats;
}