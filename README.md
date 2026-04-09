# Copilot AI lines counter project

### Prepare project
git clone del proyecto
` git clone https://github.com/ogonzalez-Dev/ai_lines-counter.git`

Instalación de paquetes
`npm i`

### Usage
Prepara todos los proyectos haciendo switch hacia la rama main (o en la que se quiera hacer el análisis):

`npm run prepare-repos -- -b main`

Se ejecuta este comando para realizar el análisis de las líneas con IA de todos los proyectos incluídos en el archivo _projects.txt_ :

`npm run cli -- --all`


El resultado de este análisis, sería algo así:
```
┌────────────────────────────────────────────────────────────────────┐
│ Repositorio                   │ Líneas de Código  │ Líneas Copilot │
├────────────────────────────────────────────────────────────────────┤
│ ApiBackMiLicencia             │             156454│             114│
│ ApiBackPortalAdminCentro      │             354208│            2232│
│ MiLicencia_ApiBackIntegrador  │              63750│            4399│
│ ApiFrontMiLicencia            │              12558│            1046│
│ MiLicencia_FrontEndCentro     │              15985│               0│
│ MiLicencia_PortalAdminCentro  │              40696│            3408│
│ MiLicencia_FrontEndCiudadano  │              60079│            1995│
├────────────────────────────────────────────────────────────────────┤
│ TOTAL                         │             703730│           13194│
└────────────────────────────────────────────────────────────────────┘
```

O se puede hacer un análisis proyecto a proyecto con:

`npm run cli C:/ruta/de_tu/proyecto`
