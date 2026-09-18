# Feature: Coros en Categorías + mejora de UI del bottom nav

Dos trabajos en una sola entrega sobre `develop`:

1. Los coros avulsos (`src/data/coros-avulsos.json`) dejan de colgar de Home y pasan
   a vivir en la pestaña **Categorías** del bottom nav, como primera categoría,
   con buscador dentro de la lista.
2. Rediseño del indicador activo del bottom nav tomando el patrón de
   `floating-nav` (indicador deslizante medido por refs), adaptado al stack real.

## Decisions

- **No se crea una categoría sintética en `CATEGORIAS_GROUPS`.** Ese array mapea
  tags de himnos numerados (`HIMNO_TAGS`) y `CategoriaDetalle` filtra por número.
  Los coros no tienen número. Se agrega una sección propia arriba de los grupos,
  enlazando a la ruta `/coros` que ya existe.
- **Un solo punto de entrada.** Se quita la fila "Coros" del final de Home: ahora
  vive en Categorías. Evita dos caminos a la misma lista.
- **Back de `/coros` apunta a `/categorias`**, no a `/`.
- **Buscador de coros**: mismo patrón que Home (normalización sin acentos),
  busca por título y por letra.
- **No se instala `lucide-react`.** El proyecto usa Material Icons Round en todo
  el chrome; mezclar dos sets de iconos rompe la consistencia visual. Del
  componente `floating-nav` se toma la idea (indicador deslizante con `motion`,
  refs y recálculo en resize), no las dependencias.
- **No se adopta estructura shadcn/TS.** El proyecto es JS + Tailwind v4 sin
  config file; `src/components/ui/` ya cumple el rol de `/components/ui`.

## Tasks

- [x] 1. Sección "Coros" como primera entrada en `src/pages/Categorias.jsx`
- [x] 2. Buscador dentro de `src/pages/Coros.jsx` + back a `/categorias`
- [x] 3. Quitar la fila de entrada a Coros de `src/pages/Home.jsx`
      (`normalizeText`/`textMatchesQuery` se extrajeron a `src/utils/utils.js`
      para que Home y Coros compartan la misma búsqueda)
- [x] 4. Rediseño del indicador activo en `src/components/ui/bottom-nav-bar.jsx`
      (delegado a `gentle-ai-worker`; el parent agregó `alsoMatch: ['/coros']`
      para que la pestaña Categorías quede activa en la ruta de coros)
- [x] 5. Verificar: `pnpm lint` + `pnpm build`
- [x] 6. Commit y push a `develop` (`3b3ca7b`)

## Hallazgo de revisión (bloqueante, corregido)

`coros-avulsos.json` traía el coro 16 con `titulo: null`. `slugify` llama a
`normalize`, que tira excepción con `null`, y `useHimnos` ejecuta ese map al
importarse: el fallo no rompía sólo la vista de coros, rompía toda la app.
Se completó el título faltante y se filtran las entradas sin título válido.

Pendiente informativo (no bloqueante): `src/pages/CoroDetail.jsx:25-27` asume
claves de verso numéricas; las claves no numéricas (`marcaCoro`, etc.) quedan
fuera del orden esperado.
