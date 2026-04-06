import { AILinesCounter } from '../core/aiLinesCounter';
import { ProjectAIStats } from '../types';

export async function runBackendScript(projectPath: string, debugMode: boolean = false): Promise<ProjectAIStats> {
    console.log('\n🔍 Analizando proyecto backend...');
    console.log(`📁 Ruta: ${projectPath}`);
    
    const counter = new AILinesCounter(debugMode);
    const stats = await counter.analyzeProject(projectPath, 'backend');
    
    // Mostrar reporte en consola
    console.log(counter.generateTextReport(stats));
    
    return stats;
}