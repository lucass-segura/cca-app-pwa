# Feature: Coros avulsos en Categorías

Los coros avulsos (`src/data/coros-avulsos.json`) viven en la pestaña
**Categorías**, como primera sección, con buscador propio en `/coros`.

## Revert de UI (decisión del usuario)

El trabajo original de esta feature incluía un rediseño de UI que el usuario
pidió deshacer. Todos los archivos de UI volvieron a `master`:

`src/index.css`, `src/components/HimnoPreview.jsx`, `ThemeToggle.jsx`,
`NewsModal.jsx`, `ui/bottom-nav-bar.jsx`, `pages/Novedades.jsx`,
`Configuracion.jsx`, `CategoriaDetalle.jsx`, `HimnoDetail.jsx`,
`CoritoDetail.jsx`, `Favoritos.jsx`, `Home.jsx`, `Categorias.jsx`, `App.jsx`.

Sobre esa base se re-cableó **sólo** la feature de coros, usando el lenguaje
visual de master (`rounded-xl`, `p-4`, `size-12`, headers `bg-bgLight/95`,
`space-y-3`), no el del rediseño descartado.

### Error a no repetir

En el commit `3b3ca7b` se hizo `git add -A` sobre un working tree que ya tenía
cambios de UI previos del usuario sin commitear, y quedaron arrastrados dentro
del commit de esta feature. Commitear sólo los archivos efectivamente tocados.

## Decisions

- **No se crea una categoría sintética en `CATEGORIAS_GROUPS`.** Ese array mapea
  tags de himnos numerados (`HIMNO_TAGS`) y `CategoriaDetalle` filtra por número.
  Los coros no tienen número: van en su propia sección, sobre los grupos.
- **Identidad por slug del título**, no por el campo `himno` del JSON, que es
  sólo el orden del archivo.
- **Clave de favoritos `a_<slug>`**, tercer namespace junto a `h_` y `c_`.
- **Back de `/coros` apunta a `/categorias`.**
- El navbar queda exactamente como en master: no se agregó `alsoMatch`, así que
  ninguna pestaña se marca activa en `/coros`.
- Sin `lucide-react` ni migración a shadcn/TS: el proyecto es JS + Tailwind v4
  sin config file y usa Material Icons Round.

## Estado

- [x] `slugify` en `src/utils/utils.js`
- [x] `coros` normalizados en `useHimnos` (descarta títulos inválidos)
- [x] Variante sin número en `HimnoPreview` + `scrollKey`
- [x] `src/pages/Coros.jsx` con buscador
- [x] `src/pages/CoroDetail.jsx`
- [x] Rutas y visibilidad del nav en `src/App.jsx`
- [x] Sección "Coros avulsos" en `src/pages/Categorias.jsx`
- [x] Claves `a_` en `src/pages/Favoritos.jsx`
- [x] `news.js`: `NEWS_VERSION` 2 + entrada de coros avulsos
- [x] Verificado: `pnpm lint` + `pnpm build`

## Hallazgos de revisión

**Bloqueante, corregido**: `coros-avulsos.json` traía el coro 16 con
`titulo: null`. `slugify` llama a `normalize`, que tira excepción con `null`, y
`useHimnos` ejecuta ese map al importarse: rompía toda la app, no sólo la vista
de coros. Se completó el título y se filtran entradas sin título válido.

**Informativo, corregido en el re-cableado**: `CoroDetail` ordenaba versos
asumiendo claves numéricas. Ahora filtra con `/^\d+$/`, así que `marcaCoro`,
`marcaCoro1` y similares no se cuelan como versos.
