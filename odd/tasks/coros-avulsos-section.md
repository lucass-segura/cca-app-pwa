# Feature: Coros avulsos section

Separate, number-less section for `src/data/coros-avulsos.json`, reachable at
`/coros` from an entry row at the end of Home. Bottom nav keeps its 4 items.

## Decisions

- **Identity**: title slug (`alma-cansada`), not the JSON `himno` field. The JSON
  number is file ordering, not a hymnal number; using it would break stored
  favorites if the file is ever reordered.
- **Favorite key**: `a_<slug>`, a third namespace next to `h_` and `c_`.
- **Search**: Home search keeps covering himnos + coritos only. Coros are browsed
  from their own page (19 items, no search needed).
- **HimnoPreview**: coros carry no number badge. The component currently branches
  on `Object.hasOwn(item, 'himno')` and coros-avulsos DO have that field, so the
  hook must strip it while normalizing.

## Tasks

- [x] 1. Add `slugify` to `src/utils/utils.js`
- [x] 2. Normalize and expose `coros` from `useHimnos` (strip number, add slug)
- [x] 3. Teach `HimnoPreview` the number-less coro variant
- [x] 4. Create `src/pages/Coros.jsx` (list)
- [x] 5. Create `src/pages/CoroDetail.jsx` (reading view, no number in header)
- [x] 6. Wire routes + bottom nav visibility in `src/App.jsx`
- [x] 7. Add the entry row at the end of Home
- [x] 8. Resolve `a_` keys in `src/pages/Favoritos.jsx`
- [x] 9. Verify: lint + build
