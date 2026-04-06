#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../src/index");
const path = __importStar(require("path"));
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
function parseArgs(args) {
    const options = {};
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '-h' || arg === '--help') {
            options.help = true;
        }
        else if (arg === '-a' || arg === '--all') {
            options.all = true;
        }
        else if (arg === '-o' || arg === '--output') {
            options.outputFile = args[++i];
        }
        else if (arg === '-f' || arg === '--format') {
            const format = args[++i];
            options.format = format === 'json' ? 'json' : 'text';
        }
        else if (arg === '-d' || arg === '--debug') {
            options.debug = true;
        }
        else if (!arg.startsWith('-') && !options.projectPath) {
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
            await (0, index_1.analyzeAllProjects)(outputFile, options.format || 'text', options.debug || false);
        }
        else {
            // Modo proyecto único
            const projectPath = options.projectPath
                ? path.resolve(options.projectPath)
                : process.cwd();
            await (0, index_1.analyzeProject)(projectPath, outputFile, options.debug || false);
        }
        console.log('\n✅ Análisis completado exitosamente.');
        process.exit(0);
    }
    catch (error) {
        console.error('\n❌ Error durante el análisis:');
        console.error(error.message || error);
        console.error('\nUsa -h o --help para ver las opciones disponibles.');
        process.exit(1);
    }
}
main();
