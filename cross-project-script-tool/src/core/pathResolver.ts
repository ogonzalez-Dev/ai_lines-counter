export class PathResolver {
    static resolvePath(basePath: string, relativePath: string): string {
        const path = require('path');
        return path.resolve(basePath, relativePath);
    }

    static getScriptPath(projectType: string): string {
        const scriptPaths: { [key: string]: string } = {
            frontend: 'src/scripts/frontend.ts',
            backend: 'src/scripts/backend.ts',
            common: 'src/scripts/common.ts'
        };
        return scriptPaths[projectType] || '';
    }

    static getConfigPath(): string {
        return 'src/config/settings.ts';
    }
}