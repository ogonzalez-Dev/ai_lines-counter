import * as fs from 'fs';
import * as path from 'path';

/**
 * Configuración de proyectos para análisis multi-proyecto
 */
export class ProjectsConfig {
    private configFilePath: string;

    constructor(configFilePath?: string) {
        // Por defecto busca projects.txt en la raíz del proyecto
        this.configFilePath = configFilePath || path.join(process.cwd(), 'projects.txt');
    }

    /**
     * Carga las rutas de proyectos desde el archivo de configuración
     * @returns Array de rutas de proyectos válidas
     */
    public loadProjectPaths(): string[] {
        try {
            if (!fs.existsSync(this.configFilePath)) {
                throw new Error(`Archivo de configuración no encontrado: ${this.configFilePath}`);
            }

            const content = fs.readFileSync(this.configFilePath, 'utf-8');
            const lines = content.split('\n');

            const projectPaths: string[] = [];

            for (const line of lines) {
                // Eliminar espacios en blanco y saltar líneas vacías o comentarios
                const trimmedLine = line.trim();
                if (!trimmedLine || trimmedLine.startsWith('#')) {
                    continue;
                }

                // Validar que la ruta exista
                if (fs.existsSync(trimmedLine)) {
                    projectPaths.push(trimmedLine);
                } else {
                    console.warn(`⚠️  Ruta no encontrada (omitida): ${trimmedLine}`);
                }
            }

            if (projectPaths.length === 0) {
                throw new Error('No se encontraron rutas de proyectos válidas en el archivo de configuración');
            }

            return projectPaths;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Error leyendo archivo de configuración: ${error.message}`);
            }
            throw error;
        }
    }

    /**
     * Extrae el nombre del repositorio desde la ruta del proyecto
     * @param projectPath Ruta completa del proyecto
     * @returns Nombre del repositorio formateado
     */
    public static extractRepositoryName(projectPath: string): string {
        // Normalizar la ruta y separar por el separador del sistema
        const normalizedPath = projectPath.replace(/\\/g, '/');
        const parts = normalizedPath.split('/').filter(p => p.length > 0);

        // Buscar el índice de "MiLicencia" en las partes
        const milicenciaIndex = parts.findIndex(p => p.toLowerCase().includes('milicencia'));
        
        if (milicenciaIndex !== -1) {
            // Caso: Proyectos bajo MiLicencia
            const projectName = parts[parts.length - 1]; // Último directorio
            const parentDir = parts[parts.length - 2]; // Penúltimo directorio
            
            // Si el último directorio es "MiLicencia" (repetido), usar el penúltimo
            if (projectName.toLowerCase() === 'milicencia' && parentDir) {
                return `MiLicencia_${parentDir}`;
            }
            
            // Si el proyecto ya contiene "MiLicencia" en su nombre, usarlo solo
            if (projectName.toLowerCase().includes('milicencia')) {
                return projectName;
            }
            
            // Si es un backend/frontend de MiLicencia, agregar prefijo
            return `MiLicencia_${projectName}`;
        }

        // Caso: Proyectos fuera de MiLicencia (ej: ApiBackPortalAdminCentro)
        return parts[parts.length - 1] || 'Unknown';
    }

    /**
     * Valida que todas las rutas en el archivo de configuración sean válidas
     * @returns Objeto con información de validación
     */
    public validateConfiguration(): { valid: number; invalid: string[] } {
        try {
            if (!fs.existsSync(this.configFilePath)) {
                return { valid: 0, invalid: [this.configFilePath] };
            }

            const content = fs.readFileSync(this.configFilePath, 'utf-8');
            const lines = content.split('\n');

            let validCount = 0;
            const invalidPaths: string[] = [];

            for (const line of lines) {
                const trimmedLine = line.trim();
                if (!trimmedLine || trimmedLine.startsWith('#')) {
                    continue;
                }

                if (fs.existsSync(trimmedLine)) {
                    validCount++;
                } else {
                    invalidPaths.push(trimmedLine);
                }
            }

            return { valid: validCount, invalid: invalidPaths };
        } catch (error) {
            return { valid: 0, invalid: [this.configFilePath] };
        }
    }
}
