import { Link } from 'react-router-dom';
import { formatTitle } from '../utils/utils';

export function HimnoPreview({ himno, isFavorite, onToggleFavorite }) {
  const isHimno = himno.hasOwnProperty('himno');
  const id = isHimno ? himno.himno : himno.corito;
  const href = isHimno ? `/himno/${id}` : `/corito/${id}`;

  return (
    <Link to={href} className="block no-underline text-inherit">
      <article className="group relative flex items-center p-3 bg-white dark:bg-surfaceDark rounded-xl shadow-sm hover:shadow-md border border-borderLight dark:border-gray-800 transition-[box-shadow,transform] duration-300 active:scale-[0.99] cursor-pointer">
        <div className="shrink-0 mr-4">
          <div className="h-12 w-12 flex items-center justify-center bg-primary dark:bg-primaryDark/20 rounded-lg text-white dark:text-primaryDark font-bold font-serif text-lg shadow-sm border border-transparent dark:border-primaryDark/30 group-hover:bg-primaryDark dark:group-hover:bg-primaryDark/30">
            {id}
          </div>
        </div>
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="text-base font-serif font-semibold text-textPrimary dark:text-white truncate leading-tight group-hover:text-primary dark:group-hover:text-primaryDark">
            {formatTitle(himno.titulo)}
          </h3>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite();
          }}
          className={`shrink-0 p-2 focus:outline-none rounded-full ${isFavorite
            ? 'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
            : 'text-textSecondary dark:text-textSecondaryDark hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
        >
          <span className="material-icons-round text-xl">
            {isFavorite ? 'favorite' : 'favorite_border'}
          </span>
        </button>
      </article>
    </Link>
  );
}

export function AnimatedHimnoPreview({ himno, index, isFavorite, onToggleFavorite }) {
  const shouldAnimate = index < 15;

  return (
    <div
      className={shouldAnimate ? 'animate-card-enter' : undefined}
      style={shouldAnimate ? { animationDelay: `${index * 30}ms` } : undefined}
    >
      <HimnoPreview himno={himno} isFavorite={isFavorite} onToggleFavorite={onToggleFavorite} />
    </div>
  );
}
