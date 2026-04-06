import * as fs from 'fs';
import * as path from 'path';

export class ProjectDetector {
    constructor(private projectPath: string = process.cwd()) {}

    detectProjectType(): string {
        if (this.isFrontendProject()) {
            return 'frontend';
        } else if (this.isBackendProject()) {
            return 'backend';
        } else {
            return 'unknown';
        }
    }

    private isFrontendProject(): boolean {
        const frontendIndicators = [
            'angular.json',      // Angular
            'vue.config.js',     // Vue
            'nuxt.config.js',    // Nuxt
            'next.config.js',    // Next.js
            'svelte.config.js',  // Svelte
            'webpack.config.js'  // Webpack (común en frontend)
        ];

        // Verificar archivos específicos de frontend
        if (this.checkForFiles(frontendIndicators)) {
            return true;
        }

        // Verificar package.json con dependencias de frontend
        if (this.hasPackageJsonWith(['react', 'vue', 'angular', '@angular/core', 'next', 'svelte'])) {
            return true;
        }

        // Verificar estructura de directorios típica de frontend
        if (this.hasDirectories(['src/components', 'src/pages', 'public'])) {
            return true;
        }

        return false;
    }

    private isBackendProject(): boolean {
        const backendIndicators = [
            'server.js',
            'app.js',
            'index.js',
            'main.ts',
            'Program.cs',        // .NET
            'pom.xml',           // Java Maven
            'build.gradle',      // Java Gradle
            'requirements.txt',  // Python
            'Gemfile',           // Ruby
            'go.mod'             // Go
        ];

        // Verificar archivos específicos de backend
        if (this.checkForFiles(backendIndicators)) {
            return true;
        }

        // Verificar package.json con dependencias de backend
        if (this.hasPackageJsonWith(['express', 'koa', 'fastify', 'nest', '@nestjs/core', 'hapi'])) {
            return true;
        }

        // Verificar estructura de directorios típica de backend
        if (this.hasDirectories(['src/controllers', 'src/services', 'src/models', 'api'])) {
            return true;
        }

        return false;
    }

    private checkForFiles(fileNames: string[]): boolean {
        try {
            for (const fileName of fileNames) {
                const filePath = path.join(this.projectPath, fileName);
                if (fs.existsSync(filePath)) {
                    return true;
                }
            }
        } catch (error) {
            console.error('Error verificando archivos:', error);
        }
        return false;
    }

    private hasDirectories(dirNames: string[]): boolean {
        try {
            for (const dirName of dirNames) {
                const dirPath = path.join(this.projectPath, dirName);
                if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
                    return true;
                }
            }
        } catch (error) {
            console.error('Error verificando directorios:', error);
        }
        return false;
    }

    private hasPackageJsonWith(dependencies: string[]): boolean {
        try {
            const packageJsonPath = path.join(this.projectPath, 'package.json');
            if (!fs.existsSync(packageJsonPath)) {
                return false;
            }

            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
            const allDeps = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            };

            return dependencies.some(dep => dep in allDeps);
        } catch (error) {
            console.error('Error leyendo package.json:', error);
            return false;
        }
    }

    public getProjectInfo(): { type: string; path: string } {
        return {
            type: this.detectProjectType(),
            path: this.projectPath
        };
    }
}

export default ProjectDetector;