# GM Viewer 0.1

Panel web (React + MUI) que muestra las fichas de los personajes de D&D 5e a
partir de los ficheros **GM** que genera el sync de Fight Club (`(GM) *.xml`,
formato `<characters><pc>/<npc>`). Fichas tematizadas: CA en escudo, PV, atributos
con modificador, salvaciones/habilidades, idiomas y acciones/rasgos/conjuros.
Agrupa por campaña (una subcarpeta = una campaña).

## Es una app estática

No necesita servidor propio. `npm run dev` es SOLO para desarrollo. El build
(`npm run build`, con `vite-plugin-singlefile`) genera un único **`docs/index.html`**
autocontenido (todo el JS/CSS incrustado). Ese `docs/` ya está commiteado en el repo.

### GitHub Pages (el método de este repo)

El build va a `docs/` y está versionado. Se publica con un workflow de Actions que
**sube `docs/` tal cual** (sin build ni Jekyll): `.github/workflows/deploy.yml`.

En el repo: **Settings → Pages → Build and deployment → Source: "GitHub Actions"**.
Con eso, cada push a `main` publica `docs/index.html` (ya compilado y autocontenido).
Tras cambiar código: `npm run build` y commitea `docs/`.

> No uses "Deploy from a branch": en este repo dispara Jekyll (que intenta renderizar
> un tema y falla) o sirve el `index.html` de desarrollo (apunta a `/src/main.jsx` →
> error "MIME type text/jsx"). El workflow de Actions evita ambos problemas.

### Otras formas

- **Doble clic:** abre `docs/index.html` en Chrome/Edge (funciona desde `file://`).
  (El botón "Ver demo" necesita servidor porque `fetch` está bloqueado en `file://`;
  "Abrir carpeta" y "Seleccionar archivos" sí van.)
- **Servido local / otro hosting:** sirve `docs/` con `npx serve docs`, Netlify, etc.

Para desarrollo: `npm install && npm run dev` (http://localhost:5173).

Requisito: "Abrir carpeta" (File System Access API) es de navegadores Chromium
(Chrome/Edge, sobre HTTPS o file://). En otros, usa "Seleccionar archivos" / arrastrar.

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
