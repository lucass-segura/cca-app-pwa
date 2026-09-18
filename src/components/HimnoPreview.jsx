import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { formatTitle } from '../utils/utils';
import { himnoTagsMap } from '../utils/tags';

const TAG_TEXT = {
  apertura:     'text-amber-600/80 dark:text-amber-400/70',
  oracion:      'text-violet-600/80 dark:text-violet-400/70',
  palabra:      'text-sky-600/80 dark:text-sky-400/70',
  finalizacion: 'text-emerald-600/80 dark:text-emerald-400/70',
  bautismo:     'text-blue-600/80 dark:text-blue-400/70',
  santacena:    'text-rose-600/80 dark:text-rose-400/70',
  funeral:      'text-slate-500/80 dark:text-slate-400/70',
};

const TAG_DOT = {
  apertura:     'bg-amber-500/55 dark:bg-amber-400/55',
  oracion:      'bg-violet-500/55 dark:bg-violet-400/55',
  palabra:      'bg-sky-500/55 dark:bg-sky-400/55',
  finalizacion: 'bg-emerald-500/55 dark:bg-emerald-400/55',
  bautismo:     'bg-blue-500/55 dark:bg-blue-400/55',
  santacena:    'bg-rose-500/55 dark:bg-rose-400/55',
  funeral:      'bg-slate-400/55 dark:bg-slate-400/55',
};

const TAG_LABELS = {
  apertura:     'Apertura',
  oracion:      'Oración',
  palabra:      'Palabra',
  finalizacion: 'Finalización',
  bautismo:     'Bautismo',
  santacena:    'Santa Cena',
  funeral:      'Funeral',
};

function HimnoPreview({ himno, isFavorite, onToggleFavorite, scrollKey = 'home_scroll' }) {
  // Los coros avulsos no tienen número: se identifican por slug.
  const isCoro = Object.hasOwn(himno, 'slug');
  const isHimno = !isCoro && Object.hasOwn(himno, 'himno');
  const id = isCoro ? null : isHimno ? himno.himno : himno.corito;
  const href = isCoro
    ? `/coro/${himno.slug}`
    : isHimno
      ? `/himno/${id}`
      : `/corito/${id}`;
  const tags = isHimno ? (himnoTagsMap.get(id) ?? []) : [];

  const [animState, setAnimState] = useState(null); // null | 'adding' | 'removing'

  const handleToggleFavorite = useCallback(() => {
    if (isFavorite) {
      // Mostrar animación primero, luego quitar del estado
      setAnimState('removing');
      setTimeout(() => {
        onToggleFavorite();
        setAnimState(null);
      }, 500);
    } else {
      // Agregar inmediatamente y animar
      onToggleFavorite();
      setAnimState('adding');
      setTimeout(() => setAnimState(null), 500);
    }
  }, [isFavorite, onToggleFavorite]);

  return (
    <Link
      to={href}
      className="block no-underline text-inherit"
      onClick={() => sessionStorage.setItem(scrollKey, window.scrollY)}
    >
      <article className="group relative flex items-center p-3 bg-white/95 dark:bg-surfaceDark rounded border border-borderLight/90 dark:border-white/[0.07] hover:border-primary/30 dark:hover:border-white/[0.15] transition-[border-color,transform] duration-200 active:scale-[0.99] cursor-pointer">

        {/* Número sin fondo — los coros avulsos no lo tienen */}
        {!isCoro && (
          <div className="shrink-0 size-11 flex items-center justify-center mr-3">
            <span className="min-w-8 px-1.5 py-1 rounded-sm bg-primary/[0.07] dark:bg-primaryDark/10 font-serif font-bold text-lg text-primary/85 dark:text-primaryDark/80 text-center group-hover:text-primary dark:group-hover:text-primaryDark transition-colors leading-none">
              {id}
            </span>
          </div>
        )}

        {/* Contenido */}
        <div className={`flex-1 min-w-0 pr-2${isCoro ? ' pl-1' : ''}`}>
          <h3 className="font-serif font-semibold text-base text-textPrimary dark:text-textPrimaryDark truncate leading-snug">
            {formatTitle(himno.titulo)}
          </h3>
          {tags.length > 0 && (
            <div className="flex gap-3 mt-2">
              {tags.map(tag => (
                <span key={tag} className={`inline-flex items-center gap-1.5 ${TAG_TEXT[tag]}`}>
                  <span className={`size-1.5 rounded-full shrink-0 ${TAG_DOT[tag]}`} />
                  <span className="font-sans text-[10px] font-medium uppercase tracking-[0.15em] leading-none">
                    {TAG_LABELS[tag]}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Favorito */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleToggleFavorite();
          }}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          className={`shrink-0 size-9 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full ${isFavorite || animState === 'adding' || animState === 'removing'
            ? 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
            : 'text-textSecondary/50 dark:text-textSecondaryDark/50 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
          }`}
        >
          <span
            className={`material-icons-round text-xl ${
              animState === 'adding' ? 'animate-heart-pop' :
              animState === 'removing' ? 'animate-heart-break' : ''
            }`}
          >
            {animState === 'removing'
              ? 'heart_broken'
              : isFavorite
                ? 'favorite'
                : 'favorite_border'
            }
          </span>
        </button>
      </article>
    </Link>
  );
}

export function AnimatedHimnoPreview({ himno, index, isFavorite, onToggleFavorite, scrollKey }) {
  const shouldAnimate = index < 15;

  return (
    <div
      className={shouldAnimate ? 'animate-card-enter' : undefined}
      style={shouldAnimate ? { animationDelay: `${index * 30}ms` } : undefined}
    >
      <HimnoPreview himno={himno} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} scrollKey={scrollKey} />
    </div>
  );
}
