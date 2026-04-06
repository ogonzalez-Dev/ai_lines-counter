import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface GitStatus {
    projectPath: string;
    projectName: string;
    isGitRepo: boolean;
    currentBranch?: string;
    hasUncommittedChanges?: boolean;
    switchedToMain?: boolean;
    error?: string;
}

/**
 * Gestor de operaciones Git para proyectos
 */
export class GitManager {
    private targetBranch: string;

    constructor(targetBranch: string = 'main') {
        this.targetBranch = targetBranch;
    }

    /**
     * Verifica si un directorio es un repositorio Git
     */
    public isGitRepository(projectPath: string): boolean {
        try {
            const gitDir = path.join(projectPath, '.git');
            return fs.existsSync(gitDir);
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtiene la rama actual del repositorio
     */
    public getCurrentBranch(projectPath: string): string | null {
        try {
            const branch = execSync('git branch --show-current', {
                cwd: projectPath,
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe']
            }).trim();
            return branch || null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Verifica si hay cambios sin commitear
     */
    public hasUncommittedChanges(projectPath: string): boolean {
        try {
            const status = execSync('git status --porcelain', {
                cwd: projectPath,
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe']
            }).trim();
            return status.length > 0;
        } catch (error) {
            return false;
        }
    }

    /**
     * Verifica si existe la rama objetivo (main)
     */
    public branchExists(projectPath: string, branchName: string): boolean {
        try {
            // Verificar en ramas locales
            const localBranches = execSync('git branch --list', {
                cwd: projectPath,
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe']
            });

            if (localBranches.includes(branchName)) {
                return true;
            }

            // Verificar en ramas remotas
            const remoteBranches = execSync('git branch -r --list', {
                cwd: projectPath,
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe']
            });

            return remoteBranches.includes(`origin/${branchName}`);
        } catch (error) {
            return false;
        }
    }

    /**
     * Cambia a la rama objetivo (main)
     */
    public switchToMainBranch(projectPath: string): GitStatus {
        const projectName = path.basename(projectPath);
        const status: GitStatus = {
            projectPath,
            projectName,
            isGitRepo: false,
            switchedToMain: false
        };

        // Verificar si es repositorio Git
        if (!this.isGitRepository(projectPath)) {
            status.error = 'No es un repositorio Git';
            return status;
        }

        status.isGitRepo = true;

        // Obtener rama actual
        const currentBranch = this.getCurrentBranch(projectPath);
        if (!currentBranch) {
            status.error = 'No se pudo determinar la rama actual';
            return status;
        }

        status.currentBranch = currentBranch;

        // Si ya está en la rama objetivo, no hacer nada
        if (currentBranch === this.targetBranch) {
            status.switchedToMain = true;
            return status;
        }

        // Verificar si hay cambios sin commitear
        if (this.hasUncommittedChanges(projectPath)) {
            status.hasUncommittedChanges = true;
            status.error = `Hay cambios sin commitear. Por favor, haz commit o stash de los cambios antes de cambiar de rama.`;
            return status;
        }

        // Verificar si la rama objetivo existe
        if (!this.branchExists(projectPath, this.targetBranch)) {
            status.error = `La rama '${this.targetBranch}' no existe en este repositorio`;
            return status;
        }

        // Intentar cambiar a la rama objetivo
        try {
            execSync(`git checkout ${this.targetBranch}`, {
                cwd: projectPath,
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe']
            });

            status.switchedToMain = true;
            return status;
        } catch (error: any) {
            status.error = `Error al cambiar a ${this.targetBranch}: ${error.message || 'Error desconocido'}`;
            return status;
        }
    }

    /**
     * Procesa múltiples proyectos y cambia a la rama objetivo
     */
    public async processMultipleProjects(projectPaths: string[]): Promise<GitStatus[]> {
        const results: GitStatus[] = [];

        console.log('\n╔═══════════════════════════════════════════════════════════════╗');
        console.log('║          PREPARACIÓN DE REPOSITORIOS - RAMA MAIN             ║');
        console.log('╚═══════════════════════════════════════════════════════════════╝\n');
        console.log(`📂 Repositorios a verificar: ${projectPaths.length}\n`);

        for (let i = 0; i < projectPaths.length; i++) {
            const projectPath = projectPaths[i];
            const projectName = path.basename(projectPath);

            console.log(`[${i + 1}/${projectPaths.length}] Procesando: ${projectName}`);
            console.log(`    Ruta: ${projectPath}`);

            const status = this.switchToMainBranch(projectPath);
            results.push(status);

            if (!status.isGitRepo) {
                console.log(`    ⚠️  ${status.error}`);
            } else if (status.switchedToMain && status.currentBranch === this.targetBranch) {
                console.log(`    ✅ Ya estaba en '${this.targetBranch}'`);
            } else if (status.switchedToMain) {
                console.log(`    ✅ Cambiado de '${status.currentBranch}' → '${this.targetBranch}'`);
            } else if (status.error) {
                console.log(`    ❌ ${status.error}`);
                console.log(`    📝 Rama actual: ${status.currentBranch}`);
            }

            console.log('');
        }

        return results;
    }

    /**
     * Genera un resumen de los resultados
     */
    public generateSummary(results: GitStatus[]): string {
        const lines: string[] = [];

        lines.push('╔═══════════════════════════════════════════════════════════════╗');
        lines.push('║                    RESUMEN DE OPERACIÓN                       ║');
        lines.push('╚═══════════════════════════════════════════════════════════════╝\n');

        const alreadyOnMain = results.filter(r => r.isGitRepo && r.currentBranch === this.targetBranch);
        const switchedSuccessfully = results.filter(r => r.isGitRepo && r.switchedToMain && r.currentBranch !== this.targetBranch);
        const withErrors = results.filter(r => r.error && r.isGitRepo);
        const notGitRepos = results.filter(r => !r.isGitRepo);

        lines.push('📊 ESTADÍSTICAS:');
        lines.push(`   • Total de proyectos: ${results.length}`);
        lines.push(`   • Ya estaban en '${this.targetBranch}': ${alreadyOnMain.length}`);
        lines.push(`   • Cambiados exitosamente: ${switchedSuccessfully.length}`);
        lines.push(`   • Con errores (requieren atención): ${withErrors.length}`);
        if (notGitRepos.length > 0) {
            lines.push(`   • No son repositorios Git: ${notGitRepos.length}`);
        }
        lines.push('');

        // Mostrar proyectos que requieren atención manual
        if (withErrors.length > 0) {
            lines.push('⚠️  PROYECTOS QUE REQUIEREN ATENCIÓN MANUAL:');
            lines.push('');
            for (const result of withErrors) {
                lines.push(`   📌 ${result.projectName}`);
                lines.push(`      Rama actual: ${result.currentBranch}`);
                lines.push(`      Problema: ${result.error}`);
                lines.push('');
            }
        }

        // Estado final
        const allReady = withErrors.length === 0 && notGitRepos.length === 0;
        if (allReady) {
            lines.push('✅ Todos los repositorios están listos en la rama \'main\'');
            lines.push('   Puedes ejecutar el análisis con: npm run cli -- --all');
        } else {
            lines.push('⚠️  Algunos repositorios requieren atención manual');
            lines.push('   Por favor, revisa los errores antes de ejecutar el análisis');
        }

        lines.push('');

        return lines.join('\n');
    }
}
