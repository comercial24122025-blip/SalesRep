# Cube One

App independiente para gestionar pipeline comercial y operativo en HTML, con almacenamiento persistente en un archivo Excel `.xlsx`. No requiere Linear ni depende de un workspace externo para operar.

## Incluye

- Dashboard ejecutivo con funnel por etapa, mercados por valor y deals en riesgo.
- CRUD local para deals con Legal, DD, Integration y Go Live.
- Gestion de targets con comparacion plan vs actual.
- KPI catalogue basado en tu matriz operativa.
- Arquitectura standalone con frontend propio, servidor local minimo en Node y workbook local como capa de persistencia.
- Paquete Airtable como referencia opcional para estructura operativa en [airtable/REVENUE_EXECUTION_SYSTEM_AIRTABLE.md](/Users/erickmendez/Documents/Codex/pipeline-manager-app/airtable/REVENUE_EXECUTION_SYSTEM_AIRTABLE.md:1), mas el wireframe funcional en [airtable/SALES_EXECUTION_SYSTEM_UI_WIREFRAME.md](/Users/erickmendez/Documents/Codex/pipeline-manager-app/airtable/SALES_EXECUTION_SYSTEM_UI_WIREFRAME.md:1).
- Persistencia en un workbook Excel real.
- Si el workbook local no existe, la app se siembra usando tus archivos de referencia en `/Users/erickmendez/Documents/Sales/`.
- El dashboard tambien toma como referencia `/Users/erickmendez/Documents/Sales/latam_market_dashboard_automated.xlsx` para prioridades regionales y mezcla de etapas.
- La carga principal usa datos reales desde `/Users/erickmendez/Documents/Sales/Opportunities-2026.xlsx`.
- El dashboard de contexto regional usa `/Users/erickmendez/Documents/Sales/latam_market_dashboard_automated.xlsx`.
- La capa de almacenamiento elimina duplicados comerciales y normaliza valores de mercado, tipo, plataforma y etapa al leer o guardar.
- Recarga desde Excel y descarga del workbook actualizado.
- Exportacion CSV de deals y targets.
- Servidor local minimo en Node para sincronizar el HTML con el archivo `.xlsx`.

## Publicacion web

La app esta preparada para publicarse en GitHub Pages desde este repositorio:

```text
https://github.com/comercial24122025-blip/SalesRep
```

URL esperada de publicacion:

```text
https://comercial24122025-blip.github.io/SalesRep/
```

En la version publicada, Cube One carga la base `data/published-state.json` como workspace baseline y guarda cambios con historial local en el navegador cuando no hay backend conectado.

## Abrir la app localmente

1. Inicia el servidor local:

```bash
cd /Users/erickmendez/Documents/Codex/pipeline-manager-app
./start-server.sh
```

2. Abre en el navegador:

```text
http://localhost:8000
```

## Archivo Excel

El workbook que usa la app como almacenamiento queda en:

```text
/Users/erickmendez/Documents/Codex/pipeline-manager-app/data/pipeline-command-center.xlsx
```

La app guarda en ese archivo cuando creas, editas o eliminas deals y targets.

## Archivos principales

- [index.html](/Users/erickmendez/Documents/Codex/pipeline-manager-app/index.html:1)
- [style.css](/Users/erickmendez/Documents/Codex/pipeline-manager-app/style.css:1)
- [script.js](/Users/erickmendez/Documents/Codex/pipeline-manager-app/script.js:1)
- [server.mjs](/Users/erickmendez/Documents/Codex/pipeline-manager-app/server.mjs:1)
- [excelStore.mjs](/Users/erickmendez/Documents/Codex/pipeline-manager-app/excelStore.mjs:1)
