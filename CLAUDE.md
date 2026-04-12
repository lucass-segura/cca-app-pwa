# CLAUDE.md — CCA Himnos PWA

Guías técnicas y de diseño para este proyecto. Léelas antes de proponer cualquier cambio de UI.

---

## Qué es esta app

PWA móvil de lectura de himnos y coritos para una congregación. El contenido (las letras) es el producto. La interfaz debe servir al texto, no competir con él. El referente visual no es una "app moderna genérica", sino un **himnario impreso**: claro, sobrio, sin adornos innecesarios.

---

## Stack

- React 19 + React Router 7
- Tailwind CSS v4 (sin config file — todo en `src/index.css` con `@theme`)
- Vite + vite-plugin-pwa
- Fuentes: MarkaziText (lectura de himnos), Merriweather (títulos), Inter (UI)

---

## Principios de diseño — NO NEGOCIABLES

### 1. Sin bordes excesivamente redondeados

El `rounded-xl` (12px) y `rounded-2xl` en elementos de lista o cards hace que la UI se vea genérica y "AI-generada". Las reglas son:

| Elemento | Máximo border-radius permitido |
|---|---|
| Cards de lista (HimnoPreview) | `rounded` (4px) o `rounded-sm` (2px) |
| Inputs de búsqueda | `rounded-md` (6px) |
| Botones de acción (A+, A-) | `rounded` (4px) |
| Badges numéricos | `rounded-sm` (2px) — cuadrado con leve corte |
| Toggles pill / switches | `rounded-full` ✅ — único uso legítimo |
| Modales y bottom sheets | `rounded-t-lg` (8px) solo en la esquina superior |
| Tooltips, toasts | `rounded-md` (6px) |

**Nunca usar `rounded-xl`, `rounded-2xl`, `rounded-3xl` en contenedores de lista o cards.** Si sientes la tentación de hacerlo, es una señal de que estás diseñando algo genérico.

### 2. Sombras — preferir bordes

Las sombras de caja (`shadow-sm`, `shadow-md`) en cada card crean ruido visual y hacen que la UI se vea como un template de dashboard. En su lugar:

- **Usar `border`** para definir superficies y separación
- `shadow-sm` solo cuando hay elevación real (modales, bottom bars)
- Nunca `shadow-md` o mayor en elementos de lista repetidos
- El bottom nav ya tiene `border-t` — no añadir sombra encima

### 3. Sin glass effects en contenido principal

Los efectos `.glass-panel` y `.glass-tile` son para overlays y banners de instalación (contextos oscuros con fondo real detrás). **Nunca aplicarlos a:**
- Cards de lista de himnos
- Secciones de contenido
- Cabeceras de página de contenido

Están permitidos en: `InstallBanner`, bottom sheets sobre fondo opaco, notificaciones flotantes.

### 4. Paleta de colores — usarla con intención

El azul primario `#2563EB` es correcto para acentos, pero **no debe dominar** la UI. Reglas:

- El color primario va en: acentos activos del nav, badges de número activos, texto de sección destacado, focus rings
- Los títulos de sección (`h2`) en lista deben ser `text-textPrimary dark:text-textPrimaryDark`, no siempre azul
- Los números de himno en el badge pueden ser azul (es funcional), pero considera también una variante neutra
- **No usar el color primario como fondo** en elementos de lista repetidos (el badge `bg-primary` en cada card satura la pantalla de azul)

### 5. Tipografía — MarkaziText es el alma de la app

- `font-himn` (MarkaziText) es para la letra de los himnos. Trátala bien: `line-height` generoso (1.6–1.8), tamaño mínimo 20px
- `font-serif` (Merriweather) es para títulos de página y sección. Úsala con `tracking-tight` o normal, nunca `tracking-wide`
- `font-sans` (Inter) es para etiquetas, metadatos, UI chrome. Tamaño mínimo `text-xs` (12px) solo para labels secundarios
- **Nunca mezclar las tres fuentes en el mismo bloque visual** sin una razón clara
- El título del himno en la card de lista puede estar en `font-himn` — es más auténtico que `font-serif`

### 6. Densidad de lista — menos espacio entre cards

Las listas de himnos son largas (480+ himnos). El `space-y-3` (12px de gap) entre cards es razonable, pero si se reduce el padding interno de la card, se puede aumentar la densidad y hacer la lista más escaneable, como un índice de himnario impreso.

- `p-3` en cards está bien
- `space-y-2` (8px) es más denso y aceptable
- No añadir `mb-4` extra a cards individuales

---

## Patrones de componentes

### HimnoPreview (card de lista)

```
❌ Evitar:
- rounded-xl + shadow-md + bg-primary badge = genérico de dashboard
- Hover que cambia demasiado (escala, color, sombra simultáneos)

✅ Preferir:
- rounded o rounded-sm en el artículo
- Border como separación, sin shadow en estado normal
- Badge numérico con bg sutil (bg-primary/10 dark:bg-primaryDark/10) y texto coloreado
- Hover: solo un cambio sutil (border-color o bg muy suave)
- Active: scale(0.99) está bien, es discreto
```

### Header sticky

```
✅ Correcto (ya implementado):
- backdrop-blur-md + bg-bgLight/95
- border-b como separador
- Sin sombra
```

### Botones A+ / A-

```
❌ Evitar:
- rounded-lg con bg-primary sólido — se ve como botón de formulario genérico

✅ Preferir:
- rounded con border y texto coloreado (ghost button)
- O píldoras muy pequeñas: rounded-full px-2 py-0.5 text-xs
```

### Input de búsqueda

```
❌ Evitar: rounded-xl (demasiado)
✅ Preferir: rounded-md con border y focus:ring-2
```

---

## Qué evitar — lista de señales de alerta de diseño genérico

1. `rounded-xl` o mayor en elementos de lista → **reemplazar con `rounded` o `rounded-sm`**
2. `shadow-md` en cards de lista → **eliminar o reemplazar con border**
3. `bg-primary` sólido en badges repetidos en cada card → **usar variante `bg-primary/10`**
4. Múltiples efectos hover simultáneos (escala + shadow + color) → **elegir uno**
5. Glass effects en contenido de lista → **reservar para overlays**
6. `text-primary` en todos los h2 de sección → **usar `text-textPrimary` para la mayoría**
7. Emojis en mensajes de error → **usar iconos de Material Icons o texto plano**
8. Gradients en elementos de lista → **evitar, son decorativos innecesarios**
9. Animaciones simultáneas en cards al cargar → **stagger está bien, pero mantenerlo sutil**

---

## Dark mode

- El modo oscuro usa `#0B1121` (bgDark) y `#151e32` (surfaceDark) — son correctos, evitando el negro puro
- En dark mode, los borders deben ser visibles pero sutiles: `border-gray-800` o `border-white/10`
- No usar `gray-700` o `gray-600` como borders en dark — son demasiado claros
- Los colores de texto en dark deben tener suficiente contraste: `text-textPrimaryDark` (#F1F5F9) sobre `surfaceDark` (#151e32) es AA

---

## Flujo de lectura — la vista HimnoDetail es la más importante

- El usuario pasa el 80% del tiempo en HimnoDetail leyendo
- Esta vista debe tener cero distracciones: sin cards, sin badges, sin bordes decorativos
- El header sticky ya es correcto
- Los botones A+/A- deben ser lo más discretos posible
- El coro del himno debe tener diferenciación visual clara pero sin exceso: sangría (`ml-4` o `ml-6`) + `font-bold` es suficiente
- `line-height` calculado dinámicamente está bien, asegurarse que sea ≥ 1.5× el font-size

---

## Accesibilidad mínima requerida

- Todos los botones interactivos deben tener `focus-visible:ring-2` o `focus:outline-none focus-visible:ring-2 focus-visible:ring-primary`
- El toggle de favoritos debe tener `aria-label`
- El input de búsqueda debe tener `aria-label` o `<label>` asociado
- Contraste mínimo AA en todos los textos (usa los colores del tema, no improvises)
- `prefers-reduced-motion` ya está manejado para `.animate-card-enter` — mantenerlo

---

## Proceso para proponer cambios de UI

1. **Leer el componente antes de proponer cambios**
2. **Preguntarse: ¿este cambio sirve al contenido o al adorno?**
3. **Verificar border-radius** — si propones `rounded-xl` en una card, reconsiderar
4. **Verificar shadows** — preferir borders
5. **No añadir animaciones** sin que el usuario las pida
6. **No refactorizar** componentes que no son parte del cambio pedido
