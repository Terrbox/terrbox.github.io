# GM Viewer

Panel web (React + MUI) que muestra las fichas de los personajes de D&D 5e a
partir de los ficheros **GM** que genera el sync de Fight Club (`(GM) *.xml`,
formato `<characters><pc>/<npc>`). Fichas tematizadas: CA en escudo, PV, atributos
con modificador, salvaciones/habilidades, idiomas y acciones/rasgos/conjuros.
Agrupa por campaña (una subcarpeta = una campaña).

## Es una app estática

No necesita servidor propio. `npm run dev` es SOLO para desarrollo. Tres formas de usarla:

1. **Fichero único (sin nada instalado):** `npm install && npm run build` genera un
   único **`dist/index.html`** autocontenido (todo el JS/CSS incrustado). Copia ese
   archivo donde quieras y **ábrelo con doble clic** en Chrome o Edge — funciona desde
   `file://`, sin servidor. (El botón "Ver demo" necesita servir la carpeta, porque
   `fetch` está bloqueado en `file://`; "Abrir carpeta" y "Seleccionar archivos" sí van.)
2. **Servido en local:** `npm run build` y luego `npx serve dist` (o cualquier servidor
   estático). Aquí también va la demo.
3. **Hosting estático:** sube `dist/` a Netlify / GitHub Pages / Vercel → una URL, sin backend.

Para desarrollo: `npm install && npm run dev` (http://localhost:5173).

Requisito: la función "Abrir carpeta" (File System Access API) es de navegadores
Chromium (Chrome/Edge). En otros, usa "Seleccionar archivos" / arrastrar.

- **Abrir carpeta**: elige tu carpeta de **Google Drive para escritorio** ya
  sincronizada (la raíz que comparten los jugadores, o una campaña concreta).
  Usa la File System Access API (Chrome/Edge). La carpeta se recuerda entre
  sesiones; botón **Recargar** para releer.
- Sin esa API (Firefox/Safari) o para una prueba rápida: **Seleccionar archivos**
  o arrastrar los `.xml`.
- **Ver demo** (o `?demo=1`): carga `public/samples/demo.xml` de ejemplo.

Solo lee ficheros; no escribe nada. Todo local en el navegador.

## Conjuros preparados

El fichero **GM** (`(GM) *.xml`) lista TODOS los conjuros del lanzador, sin marca
de preparado. El dato de preparado + nivel solo está en el **fichero de jugador**
(`Nombre_<id>.xml`, que el sync deja junto al GM). El viewer cruza ambos por el
`<id>` del nombre de archivo: la ficha sale del GM y los conjuros **preparados
agrupados por nivel** (trucos siempre; niveles ≥1 solo si están preparados) del
fichero de jugador. Si no hay fichero de jugador para un personaje, se muestran
los huecos por nivel y la lista de conjuros del GM etiquetada como "Conjuros".

## Flujo completo

1. Cada jugador sincroniza su personaje con la app modificada de Fight Club
   (`fightclub5-sync.apk`) a una carpeta de Drive → se crea `(GM) Nombre_id.xml`.
2. El GM tiene esa carpeta (o su raíz con subcarpetas por campaña) sincronizada
   en el PC con Google Drive para escritorio.
3. Abre GM Viewer, apunta a la carpeta, y ve todas las fichas al día (Recargar).
