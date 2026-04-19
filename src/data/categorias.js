import { HIMNO_TAGS } from '../utils/tags';

// Estilos visuales por categoría
const STYLES = {
  apertura:     { cardBg: 'bg-amber-50   dark:bg-amber-900/15',  cardBorder: 'border-amber-200  dark:border-amber-800/25',  title: 'text-amber-900  dark:text-amber-100',  count: 'text-amber-500/70 dark:text-amber-400/50',  accent: 'bg-amber-400'   },
  oracion:      { cardBg: 'bg-violet-50  dark:bg-violet-900/15', cardBorder: 'border-violet-200 dark:border-violet-800/25', title: 'text-violet-900 dark:text-violet-100', count: 'text-violet-500/70 dark:text-violet-400/50', accent: 'bg-violet-400'  },
  palabra:      { cardBg: 'bg-sky-50     dark:bg-sky-900/15',    cardBorder: 'border-sky-200    dark:border-sky-800/25',    title: 'text-sky-900    dark:text-sky-100',    count: 'text-sky-500/70    dark:text-sky-400/50',    accent: 'bg-sky-400'     },
  finalizacion: { cardBg: 'bg-emerald-50 dark:bg-emerald-900/15',cardBorder: 'border-emerald-200 dark:border-emerald-800/25',title: 'text-emerald-900 dark:text-emerald-100',count: 'text-emerald-500/70 dark:text-emerald-400/50',accent: 'bg-emerald-400' },
  bautismo:     { cardBg: 'bg-blue-50    dark:bg-blue-900/15',   cardBorder: 'border-blue-200   dark:border-blue-800/25',   title: 'text-blue-900   dark:text-blue-100',   count: 'text-blue-500/70   dark:text-blue-400/50',   accent: 'bg-blue-500'    },
  santacena:    { cardBg: 'bg-rose-50    dark:bg-rose-900/15',   cardBorder: 'border-rose-200   dark:border-rose-800/25',   title: 'text-rose-900   dark:text-rose-100',   count: 'text-rose-500/70   dark:text-rose-400/50',   accent: 'bg-rose-400'    },
  funeral:      { cardBg: 'bg-slate-50   dark:bg-slate-800/20',  cardBorder: 'border-slate-200  dark:border-slate-700/30',  title: 'text-slate-700  dark:text-slate-200',  count: 'text-slate-400/80 dark:text-slate-400/50',  accent: 'bg-slate-400'   },
};

export const CATEGORIAS_GROUPS = [
  {
    group: 'Culto',
    cols: 2,
    items: [
      { id: 'apertura',     label: 'Apertura',     himnos: HIMNO_TAGS.apertura,     ...STYLES.apertura     },
      { id: 'oracion',      label: 'Oración',      himnos: HIMNO_TAGS.oracion,      ...STYLES.oracion      },
      { id: 'palabra',      label: 'Palabra',      himnos: HIMNO_TAGS.palabra,      ...STYLES.palabra      },
      { id: 'finalizacion', label: 'Finalización', himnos: HIMNO_TAGS.finalizacion, ...STYLES.finalizacion },
    ],
  },
  {
    group: 'Ocasiones',
    cols: 1,
    items: [
      { id: 'bautismo',  label: 'Bautismo',   himnos: HIMNO_TAGS.bautismo,  ...STYLES.bautismo  },
      { id: 'santacena', label: 'Santa Cena', himnos: HIMNO_TAGS.santacena, ...STYLES.santacena },
      { id: 'funeral',   label: 'Funeral',    himnos: HIMNO_TAGS.funeral,   ...STYLES.funeral   },
    ],
  },
];

export function getCategoriaById(id) {
  for (const group of CATEGORIAS_GROUPS) {
    const found = group.items.find((c) => c.id === id);
    if (found) return found;
  }
  return null;
}
