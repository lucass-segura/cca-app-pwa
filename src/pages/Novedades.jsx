import { lazy, Suspense } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ThemeToggle } from '../components/ThemeToggle';

const ChurchMap = lazy(() => import('../components/ChurchMap').then((module) => ({
  default: module.ChurchMap,
})));

const sections = [
  {
    id: 'reuniones',
    label: 'Reuniones',
    icon: 'groups',
  },
  {
    id: 'ubicaciones',
    label: 'Ubicaciones',
    icon: 'map',
  },
  {
    id: 'relatorio',
    label: 'Relatorio',
    icon: 'article',
  },
];

export default function Novedades() {
  const navigate = useNavigate();
  const { sectionId } = useParams();
  const activeSection = sections.some((section) => section.id === sectionId)
    ? sectionId
    : 'reuniones';
  const activeSectionLabel = sections.find((section) => section.id === activeSection)?.label;

  return (
    <div className="app-shell min-h-screen text-textPrimary dark:text-textPrimaryDark font-sans antialiased pb-28">
      <header className="app-header sticky top-0 z-[1500] border-b">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              aria-label="Volver"
              onClick={() => navigate('/')}
              className="relative size-10 shrink-0 rounded-full flex items-center justify-center text-textSecondary transition-transform duration-150 hover:bg-black/5 active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-textSecondaryDark dark:hover:bg-white/10"
            >
              <span className="material-icons-round text-[22px]" aria-hidden>
                arrow_back
              </span>
            </button>
            <h1 className="truncate font-serif font-bold text-2xl tracking-tight text-textPrimary dark:text-textPrimaryDark">
              {activeSectionLabel}
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className={`${activeSection === 'ubicaciones' ? 'max-w-7xl' : 'max-w-md'} mx-auto w-full px-3 pt-6 space-y-5 sm:px-4`}>
        {activeSection === 'reuniones' && (
          <section className="rounded bg-white/95 dark:bg-surfaceDark border border-borderLight dark:border-white/[0.07] p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-icons-round text-primary dark:text-primaryDark">
                groups
              </span>
              <h2 className="font-serif text-2xl font-bold text-textPrimary dark:text-textPrimaryDark">
                Reuniones
              </h2>
            </div>
            <p className="text-sm leading-6 text-textSecondary dark:text-textSecondaryDark">
              Próximamente se publicará la información de reuniones.
            </p>
          </section>
        )}

        {activeSection === 'ubicaciones' && (
          <Suspense
            fallback={(
              <div className="flex h-[430px] items-center justify-center rounded-3xl bg-white font-sans text-sm text-textSecondary shadow-xl dark:bg-surfaceDark dark:text-textSecondaryDark">
                Cargando mapa de iglesias…
              </div>
            )}
          >
            <ChurchMap />
          </Suspense>
        )}

        {activeSection === 'relatorio' && (
          <section className="rounded bg-white/95 dark:bg-surfaceDark border border-borderLight dark:border-white/[0.07] p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-icons-round text-primary dark:text-primaryDark">
                article
              </span>
              <h2 className="font-serif text-2xl font-bold text-textPrimary dark:text-textPrimaryDark">
                Relatorio
              </h2>
            </div>
            <p className="text-sm leading-6 text-textSecondary dark:text-textSecondaryDark">
              Próximamente se publicará el relatorio.
            </p>
          </section>
        )}
      </main>
    </div>
  );
}
