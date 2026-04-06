# 📖 Instrucciones de Uso - Contador de Líneas AI

## 🎯 Inicio Rápido

### 1. Primera Ejecución

Después de instalar las dependencias con `npm install`, puedes probar el contador en el proyecto de ejemplo:

```bash
npm run cli ./example
```

Esto analizará el archivo [example/userService.ts](example/userService.ts) que contiene ejemplos de los tres tipos de reglas.

## 🔍 Casos de Uso

### Caso 1: Analizar el Proyecto Actual

Ejecuta el comando desde el directorio raíz de tu proyecto:

```bash
npm run cli
```

El script detectará automáticamente el tipo de proyecto (frontend/backend) y analizará todos los archivos de código.

### Caso 2: Analizar un Proyecto Externo

Especifica la ruta completa del proyecto a analizar:

```bash
# Windows
npm run cli "C:\Users\usuario\Documents\mi-proyecto"

# Linux/Mac
npm run cli "/home/usuario/proyectos/mi-app"
```

### Caso 3: Preparar Repositorios para Análisis Multi-Proyecto (NUEVO) 🔄

**⚡ Flujo de trabajo recomendado:**

Antes de analizar múltiples proyectos, asegúrate de que todos estén en la rama `main`:

```bash
# 1. Preparar todos los repositorios (cambiarlos a la rama 'main')
npm run prepare-repos

# 2. Ejecutar el análisis de líneas AI
npm run cli -- --all
```

#### ¿Qué hace `npm run prepare-repos`?

Este comando:
- ✅ Lee las rutas de proyectos desde `projects.txt.txt`
- ✅ Verifica si cada repositorio ya está en la rama `main`
- ✅ Detecta cambios sin commitear y advierte si los hay
- ✅ Cambia automáticamente a `main` si es posible
- ✅ Genera un reporte de proyectos que requieren atención manual

#### Ejemplo de salida:

```
╔═══════════════════════════════════════════════════════════════╗
║          PREPARACIÓN DE REPOSITORIOS - RAMA MAIN             ║
╚═══════════════════════════════════════════════════════════════╝

📂 Repositorios a verificar: 7

[1/7] Procesando: ApiBackMiLicencia
    Ruta: D:/Olimpia_dev_projects/MiLicencia/backend/ApiBackMiLicencia
    ✅ Ya estaba en 'main'

[2/7] Procesando: ApiBackIntegrador
    Ruta: D:/Olimpia_dev_projects/MiLicencia/backend/ApiBackIntegrador
    ✅ Cambiado de 'develop' → 'main'

[3/7] Procesando: ApiFrontMiLicencia
    Ruta: D:/Olimpia_dev_projects/MiLicencia/backend/ApiFrontMiLicencia
    ❌ Hay cambios sin commitear. Por favor, haz commit o stash.
    📝 Rama actual: feature/nueva-funcionalidad

╔═══════════════════════════════════════════════════════════════╗
║                    RESUMEN DE OPERACIÓN                       ║
╚═══════════════════════════════════════════════════════════════╝

📊 ESTADÍSTICAS:
   • Total de proyectos: 7
   • Ya estaban en 'main': 5
   • Cambiados exitosamente: 1
   • Con errores (requieren atención): 1

⚠️  PROYECTOS QUE REQUIEREN ATENCIÓN MANUAL:
   📌 ApiFrontMiLicencia
      Rama actual: feature/nueva-funcionalidad
      Problema: Hay cambios sin commitear
```

#### Opciones adicionales:

```bash
# Cambiar a otra rama (ej: develop)
npm run prepare-repos -- -b develop

# Ver ayuda
npm run prepare-repos -- --help
```

### Caso 4: Analizar Múltiples Proyectos (NUEVO) 🚀

Analiza múltiples proyectos en una sola ejecución usando el flag `--all`:

```bash
npm run cli --all
```

Este comando analizará todos los proyectos configurados en el archivo `projects.txt.txt` y mostrará una tabla resumen consolidada.

#### Configuración de Proyectos

Edita el archivo `projects.txt.txt` en la raíz del proyecto y agrega las rutas de los proyectos a analizar (una por línea):

```
# Configuración de Proyectos para Análisis Multi-Proyecto
# Las líneas que comienzan con # son comentarios

# Backend Projects
D:/Olimpia_dev_projects/MiLicencia/backend/ApiBackMiLicencia
D:/Olimpia_dev_projects/MiLicencia/backend/ApiBackIntegrador

# Frontend Projects
D:/Olimpia_dev_projects/MiLicencia/frontend/FrontEndCentro
D:/Olimpia_dev_projects/MiLicencia/frontend/FrontEndCiudadano/MiLicencia
```

#### Generar Reporte Consolidado

Para guardar el reporte de múltiples proyectos en un archivo:

```bash
npm run cli --all -o reporte-consolidado.txt
```

Para formato JSON:

```bash
npm run cli --all -o reporte-consolidado.json -f json
```

#### Resultado Esperado

El comando `--all` generará una tabla como esta:

```
╔═══════════════════════════════════════════════════════════════╗
║                       LINE COUNTER                            ║
║                   RESUMEN DE ANÁLISIS                         ║
╚═══════════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│ Repositorio                      │ Líneas de Código │ Líneas Copilot │
├─────────────────────────────────────────────────────────────┤
│ MiLicencia_ApiBackMiLicencia     │           63,227 │            737 │
│ MiLicencia_ApiBackIntegrador     │           23,366 │          4,191 │
│ MiLicencia_ApiFront              │            9,460 │            634 │
│ MiLicencia_FrontEndCentro        │           17,223 │              0 │
│ MiLicencia_PortalAdminCentro     │           45,471 │          2,673 │
│ MiLicencia_FrontEndCiudadano     │           62,190 │            967 │
│ ApiBackPortalAdminCentro         │           38,450 │          1,234 │
├─────────────────────────────────────────────────────────────┤
│ TOTAL                            │          259,387 │         10,436 │
└─────────────────────────────────────────────────────────────┘

📊 ESTADÍSTICAS GENERALES:
   • Proyectos analizados exitosamente: 7/7
   • Total de líneas de código: 259,387
   • Total de líneas generadas por Copilot: 10,436
   • Porcentaje de código AI: 4.02%
```

### Caso 5: Generar Reporte en Archivo

Para guardar el reporte de un proyecto individual en un archivo de texto:

```bash
npm run cli ./mi-proyecto -o reporte-copilot.txt
```

Para generar un reporte en formato JSON (útil para procesamiento posterior):

```bash
npm run cli ./mi-proyecto -o estadisticas.json -f json
```

## 📋 Ejemplos con Diferentes Tipos de Proyectos

### Proyecto Angular (Frontend)

```bash
npm run cli "C:\proyectos\mi-app-angular" -o angular-ai-report.txt
```

Detectará:
- Componentes en `src/app/components`
- Servicios en `src/app/services`
- Módulos en `src/app`

### Proyecto React/Next.js (Frontend)

```bash
npm run cli "C:\proyectos\mi-app-react" -o react-ai-report.txt
```

Analizará:
- Componentes en `src/components`
- Páginas en `pages` o `src/pages`
- Hooks personalizados en `src/hooks`

### Proyecto Node.js/Express (Backend)

```bash
npm run cli "C:\proyectos\api-express" -o backend-ai-report.txt
```

Revisará:
- Controladores en `src/controllers`
- Servicios en `src/services`
- Modelos en `src/models`
- Rutas en `src/routes`

### Proyecto .NET (Backend)

```bash
npm run cli "C:\proyectos\MiAPI.NET" -o dotnet-ai-report.txt
```

Analizará archivos `.cs` en todo el proyecto.

### Proyecto Python (Backend)

```bash
npm run cli "C:\proyectos\api-python" -o python-ai-report.txt
```

Analizará archivos `.py` siguiendo las mismas reglas.

## 🎨 Formato del Reporte

El reporte incluye:

1. **Información del Proyecto**: Ruta y tipo detectado
2. **Resumen General**: 
   - Total de archivos analizados
   - Total de líneas de código
   - Líneas generadas por AI
   - Porcentaje de código AI
3. **Desglose por Tipo**:
   - Cantidad de métodos completos (Regla 7)
   - Cantidad de fragmentos (Regla 8)
   - Cantidad de refactorizaciones (Regla 10)
4. **Detalle por Archivo**: Lista de archivos con código AI

## 🔧 Solución de Problemas

### Error: "Tipo de proyecto no reconocido"

Si el proyecto no es detectado automáticamente:
- Verifica que el proyecto tenga archivos como `package.json`, `angular.json`, etc.
- El script igualmente analizará el proyecto como "genérico"

### Error: "Cannot find module"

Asegúrate de instalar las dependencias:

```bash
npm install
```

### Error de Permisos en PowerShell

Si recibes un error de ejecución de scripts en PowerShell:

```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
npm run cli
```

## 💡 Tips y Mejores Prácticas

### 1. Analizar Múltiples Proyectos

**Método Recomendado (Nuevo):** Usa el flag `--all` con el archivo `projects.txt.txt`:

```bash
# Edita projects.txt.txt con las rutas de tus proyectos
npm run cli --all
```

**Método Alternativo (Script batch/PowerShell):** Si necesitas análisis personalizados:

**Windows (batch):**
```batch
@echo off
npm run cli "C:\proyectos\proyecto1" -o reportes\proyecto1.txt
npm run cli "C:\proyectos\proyecto2" -o reportes\proyecto2.txt
npm run cli "C:\proyectos\proyecto3" -o reportes\proyecto3.txt
echo Análisis completado para todos los proyectos!
```

**Windows (PowerShell):**
```powershell
$proyectos = @(
    "C:\proyectos\proyecto1",
    "C:\proyectos\proyecto2",
    "C:\proyectos\proyecto3"
)

foreach ($proyecto in $proyectos) {
    $nombre = Split-Path $proyecto -Leaf
    npm run cli $proyecto -o "reportes\$nombre-report.txt"
}
Write-Host "Análisis completado!"
```

### 2. Integración con CI/CD

Puedes integrar el contador en tu pipeline de CI/CD para trackear el código generado por AI:

**GitHub Actions:**
```yaml
- name: Analizar código AI
  run: |
    npm install
    npm run cli . -o ai-report.json -f json
    
- name: Subir reporte
  uses: actions/upload-artifact@v2
  with:
    name: ai-code-report
    path: ai-report.json
```

### 3. Comparar Reportes

Genera reportes periódicamente para ver la evolución:

```bash
npm run cli . -o "reportes/reporte-$(date +%Y%m%d).txt"
```

## 🔍 Verificación de Resultados

Para verificar que el contador funciona correctamente, usa el archivo de ejemplo:

```bash
# Analizar el archivo de ejemplo
npm run cli ./example

# Resultado esperado:
# - 2 métodos completos (FindUserById, GetActiveUsers)
# - 1 fragmento de código (processData)
# - 1 refactorización (calculateStats)
```

## 📊 Interpretación de Resultados

### Porcentaje de Código AI

- **< 20%**: Uso moderado de Copilot
- **20-40%**: Uso significativo de Copilot  
- **40-60%**: Alto uso de Copilot
- **> 60%**: Muy alto uso de Copilot

### Distribución de Tipos

- **Muchos métodos (Regla 7)**: Copilot está generando funciones/métodos completos
- **Muchos fragmentos (Regla 8)**: Uso de Copilot para snippets específicos
- **Muchas refactorizaciones (Regla 10)**: Uso de Copilot para optimización de código

## 🆘 Soporte

Si encuentras problemas o tienes preguntas:
1. Revisa esta documentación
2. Verifica los ejemplos en la carpeta `example`
3. Revisa el [README.md](README.md) principal
4. Abre un issue en el repositorio
