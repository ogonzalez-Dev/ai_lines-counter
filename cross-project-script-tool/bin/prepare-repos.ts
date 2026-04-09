#!/usr/bin/env node

import { prepareRepositories } from '../src/index';

interface PrepareOptions {
    branch?: string;
    help?: boolean;
}

function showHelp() {
    console.log(`
╔═══════════════════════════════════════════════════════════════╗
║     PREPARACIÓN DE REPOSITORIOS - CHECKOUT + PULL            ║
╚═══════════════════════════════════════════════════════════════╝

Uso:
  npm run prepare-repos [opciones]

Opciones:
  -b, --branch <nombre>     Rama objetivo (por defecto: main)
  -h, --help                Muestra esta ayuda

Descripción:
    Este comando cambia todos los repositorios configurados en 
    projects.txt a la rama objetivo y ejecuta git pull.

Funcionalidades:
  ✓ Verifica si cada proyecto ya está en la rama objetivo
  ✓ Detecta cambios sin commitear y advierte al usuario
    ✓ Intenta cambiar a la rama objetivo si es posible
    ✓ Ejecuta git pull origin <rama> en cada repositorio listo
  ✓ Genera un reporte de proyectos que requieren atención manual

Ejemplos:
  # Cambiar todos los repos a la rama 'main'
  npm run prepare-repos

  # Cambiar todos los repos a otra rama
  npm run prepare-repos -- -b develop

  # Después de preparar, ejecutar el análisis
  npm run prepare-repos
  npm run cli -- --all

Flujo de trabajo recomendado:
    1. npm run prepare-repos    ← Deja todos en 'main' y actualizados
  2. npm run cli -- --all     ← Ejecuta el análisis de líneas AI

Nota: Si algún repositorio tiene cambios sin commitear o conflictos,
            se mostrará una advertencia y deberás revisar manualmente.
    `);
}

function parseArgs(args: string[]): PrepareOptions {
    const options: PrepareOptions = {};
    
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        
        if (arg === '-h' || arg === '--help') {
            options.help = true;
        } else if (arg === '-b' || arg === '--branch') {
            options.branch = args[++i];
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
        const targetBranch = options.branch || 'main';
        
        console.log(`\n🔄 Preparando repositorios para checkout + pull en la rama: ${targetBranch}\n`);
        
        const results = await prepareRepositories(targetBranch);
        
        // Verificar si hay errores
        const hasErrors = results.some(r => r.error && r.isGitRepo);
        
        if (hasErrors) {
            console.log('\n⚠️  Algunos repositorios requieren atención manual.');
            console.log('   Por favor, revisa los errores antes de ejecutar el análisis.\n');
            process.exit(1);
        } else {
            console.log('\n✅ Todos los repositorios están listos.\n');
            process.exit(0);
        }
    } catch (error: any) {
        console.error('\n❌ Error durante la preparación:');
        console.error(error.message || error);
        console.error('\nUsa -h o --help para ver las opciones disponibles.\n');
        process.exit(1);
    }
}

main();
