#!/usr/bin/env node

import { analyzeProject, analyzeAllProjects } from '../src/index';
import * as path from 'path';

interface CliOptions {
    projectPath?: string;
    outputFile?: string;
    format?: 'text' | 'json';
    debug?: boolean;
    help?: boolean;
    all?: boolean;
}

function showHelp() {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║  CONTADOR DE LÍNEAS GENERADAS POR GITHUB COPILOT             ║
╚═══════════════════════════════════════════════════════════════╝

Uso:
  npm run cli [ruta-proyecto] [opciones]
  npm run cli --all [opciones]

Opciones:
  [ruta-proyecto]           Ruta del proyecto a analizar (por defecto: directorio actual)
  -a, --all                 Analiza todos los proyectos configurados en projects.txt.txt
  -o, --output <archivo>    Guarda el reporte en un archivo
  -f, --format <formato>    Formato del reporte: text o json (por defecto: text)
  -d, --debug               Modo debug: muestra información detallada de detección
  -h, --help                Muestra esta ayuda

Ejemplos:
  # Analizar el proyecto actual
  npm run cli

  # Analizar un proyecto específico
  npm run cli /ruta/al/proyecto

  # Analizar todos los proyectos configurados (NUEVO)
  npm run cli --all

  # Analizar todos y guardar reporte
  npm run cli --all -o reporte-completo.txt

  # Generar reporte en archivo de texto
  npm run cli /ruta/al/proyecto -o reporte.txt

  # Generar reporte en formato JSON
  npm run cli /ruta/al/proyecto -o reporte.json -f json

  # Modo debug para diagnosticar problemas
  npm run cli /ruta/al/proyecto -d

  # Usando ts-node directamente
  ts-node bin/cli.ts

Reglas detectadas:
  ✓ Regla 7:  Métodos completos generados por GitHub Copilot
              // Método generado por GitHub Copilot
              
  ✓ Regla 8:  Fragmentos de código con inicio y fin
              // Inicio código generado por GitHub Copilot
              ...código...
              // Fin código generado por GitHub Copilot

  ✓ Regla 10: Refactorizaciones y optimizaciones
              // Inicio refactorización/optimización por GitHub Copilot
              ...código...
              // Fin refactorización/optimización por GitHub Copilot
    `);
}

function parseArgs(args: string[]): CliOptions {
    const options: CliOptions = {};
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        if (arg === '-h' || arg === '--help') {
            options.help = true;
        } else if (arg === '-a' || arg === '--all') {
            options.all = true;
        } else if (arg === '-o' || arg === '--output') {
            options.outputFile = args[++i];
        } else if (arg === '-f' || arg === '--format') {
            const format = args[++i];
            options.format = format === 'json' ? 'json' : 'text';
        } else if (arg === '-d' || arg === '--debug') {
            options.debug = true;
        } else if (!arg.startsWith('-') && !options.projectPath) {
            options.projectPath = arg;
        }
    }
    
    return options;
}

async function main() {
    const args = process.argv.slice(2);
    const options = parseArgs(args);

    if (options.help) {
        showHelp();
        process.exit(0);
    }

    try {
        let outputFile = options.outputFile;
        
        // Si se especifica formato JSON pero no hay extensión, agregar .json
        if (options.format === 'json' && outputFile && !outputFile.endsWith('.json')) {
            outputFile = outputFile.replace(/\.[^.]*$/, '.json') || outputFile + '.json';
        }

        // Modo multi-proyecto
        if (options.all) {
            await analyzeAllProjects(outputFile, options.format || 'text', options.debug || false);
        } else {
            // Modo proyecto único
            const projectPath = options.projectPath 
                ? path.resolve(options.projectPath)
                : process.cwd();

            await analyzeProject(projectPath, outputFile, options.debug || false);
        }
        
        console.log('\n✅ Análisis completado exitosamente.');
        process.exit(0);
    } catch (error: any) {
        console.error('\n❌ Error durante el análisis:');
        console.error(error.message || error);
        console.error('\nUsa -h o --help para ver las opciones disponibles.');
        process.exit(1);
    }
}

main();
