# Copilot AI lines counter project

### Prepare project
git clone del proyecto
` git clone https://github.com/ogonzalez-Dev/ai_lines-counter.git`

Instalación de paquetes
`npm i`

### Rutas de los archivos a analizar
En el `projects.txt` ubicado en la raíz del proyecto, se encuentran las rutas que se van a analizar, se deben cambiar por las rutas locales de los proyectos, así:
```
D:/tu_ruta/MiLicencia/backend/ApiBackMiLicencia
D:/tu_ruta/ApiBackPortalAdm/ApiBackPortalAdminCentro
D:/tu_ruta/MiLicencia/backend/ApiBackIntegrador
D:/tu_ruta/MiLicencia/backend/ApiFrontMiLicencia
D:/tu_ruta/MiLicencia/frontend/FrontEndCentro
D:/tu_ruta/MiLicencia/frontend/portal_adm/PortalAdminCentro
```

### Usage
Los siguientes comandos se ejecutarán en la raíz del proyecto de conteo de líneas:

`npm run prepare-repos -- -b main`\
Prepara todos los proyectos haciendo switch hacia la rama main (o en la que se quiera hacer el análisis) y hace un git pull enn cada una de estas rutas, para traer el código más actual

**Resultado:**
```bash
╔══════════════════════════════════════════════════════════════╗
║      PREPARACIÓN DE REPOSITORIOS - CHECKOUT + PULL           ║
╚══════════════════════════════════════════════════════════════╝
📂 Repositorios a verificar: 7

[1/7] Procesando: ApiBackMiLicencia
    Ruta: D:/Olimpia_dev_projects/MiLicencia/backend/ApiBackMiLicencia
    ✅ Cambiado de 'Feature/169669-pass-Otp-229785-ogonzalez' → 'main' y pull ejecutado

[2/7] Procesando: ApiBackIntegrador
    Ruta: D:/Olimpia_dev_projects/MiLicencia/backend/ApiBackIntegrador
    ✅ Ya estaba en 'main' y se hizo pull

[3/7] Procesando: ApiFrontMiLicencia
    Ruta: D:/Olimpia_dev_projects/MiLicencia/backend/ApiFrontMiLicencia
    ❌ Hay cambios sin commitear. Por favor, haz commit o stash de los cambios antes de cambiar de rama y hacer pull.
    📝 Rama actual: main
...
```

----------------------------------------------------

`npm run cli -- --all`\
Se ejecuta este comando para realizar el análisis de las líneas con IA de todos los proyectos incluídos en el archivo _projects.txt_

**Resultado:**

```bash
╔═══════════════════════════════════════════════════════════════╗
║                       LINE COUNTER                            ║
║                   RESUMEN DE ANÁLISIS                         ║
╚═══════════════════════════════════════════════════════════════╝
┌────────────────────────────────────────────────────────────────────┐
│ Repositorio                   │ Líneas de Código  │ Líneas Copilot │
├────────────────────────────────────────────────────────────────────┤
│ ApiBackMiLicencia             │             157949│            1539│
│ ApiBackPortalAdminCentro      │             354837│            2806│
│ MiLicencia_ApiBackIntegrador  │              64257│            4787│
│ ApiFrontMiLicencia            │              13332│            1221│
│ MiLicencia_FrontEndCentro     │              15997│               0│
│ MiLicencia_PortalAdminCentro  │              40796│            3508│
│ MiLicencia_FrontEndCiudadano  │              60696│            2499│
├────────────────────────────────────────────────────────────────────┤
│ TOTAL                         │             707864│           16360│
└────────────────────────────────────────────────────────────────────┘

```

O se puede hacer un análisis proyecto a proyecto con:

`npm run cli C:/ruta/de_tu/proyecto`
