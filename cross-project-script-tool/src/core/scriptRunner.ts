import { runFrontendScript } from '../scripts/frontend';
import { runBackendScript } from '../scripts/backend';
import { ProjectDetector } from './projectDetector';

export class ScriptRunner {
    public async runScript(projectPath: string): Promise<void> {
        const projectDetector = new ProjectDetector(projectPath);
        const projectType = projectDetector.detectProjectType();

        try {
            switch (projectType) {
                case 'frontend':
                    await runFrontendScript(projectPath);
                    break;
                case 'backend':
                    await runBackendScript(projectPath);
                    break;
                default:
                    throw new Error('Unsupported project type detected.');
            }
        } catch (error) {
            console.error('Error executing script:', error);
        }
    }
}