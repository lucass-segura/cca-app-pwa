# /revisar-ux

Audita el diseño UX/UI del componente o página especificada (o todos si no se indica ninguno) contra las guías del CLAUDE.md de este proyecto.

## Pasos

1. Lee el archivo o archivos relevantes en `src/components/` y `src/pages/`
2. Lee `src/index.css` para el sistema de tokens
3. Lee `CLAUDE.md` para las reglas de diseño de este proyecto
4. Para cada componente o página, identifica:

### Problemas críticos (deben corregirse):
- Uso de `rounded-xl`, `rounded-2xl`, `rounded-3xl` en cards o containers de lista
- `shadow-md` o mayor en elementos de lista repetidos
- `bg-primary` sólido en badges repetidos en cada item de lista
- Glass effects en contenido principal (no en overlays)
- Emojis en mensajes de error de la UI

### Advertencias (evaluar si mejorar):
- `rounded-lg` en cards (preferible `rounded` o `rounded-sm`)
- Múltiples efectos hover simultáneos (escala + shadow + color)
- `text-primary` en todos los h2 de sección (considerar `text-textPrimary`)
- Cualquier elemento con `shadow` que podría reemplazarse con `border`
- Inputs con `rounded-xl` (preferible `rounded-md`)

### Verificaciones de accesibilidad:
- Botones sin `aria-label` o texto visible
- Inputs sin `<label>` o `aria-label`
- Elementos interactivos sin `focus-visible:ring`
- Texto que podría no pasar contraste AA

## Output esperado

Para cada archivo auditado:
```
### src/components/NombreComponente.jsx
❌ CRÍTICO: [descripción del problema] — línea X
⚠️  ADVERTENCIA: [descripción] — línea X
✅ OK: [qué está bien]
```

Luego un resumen con los cambios más prioritarios y las clases de Tailwind específicas a modificar.

**No hagas los cambios automáticamente** — presenta el reporte y espera confirmación del usuario sobre qué corregir.
