import { lazy, Suspense, useState } from 'react';
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
  const [activeSection, setActiveSection] = useState('reuniones');

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark text-textPrimary dark:text-textPrimaryDark font-sans antialiased pb-28">
      <header className="sticky top-0 z-[1500] bg-bgLight/95 dark:bg-bgDark/95 backdrop-blur-md border-b border-borderLight dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="font-serif font-bold text-2xl tracking-tight text-primary dark:text-primaryDark">
            Novedades
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className={`${activeSection === 'ubicaciones' ? 'max-w-7xl' : 'max-w-md'} mx-auto w-full px-3 pt-6 space-y-5 sm:px-4`}>
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-white dark:bg-surfaceDark border border-borderLight dark:border-white/[0.07] p-1">
          {sections.map((section) => {
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive
                    ? 'bg-primary/10 text-primary dark:bg-primaryDark/15 dark:text-primaryDark'
                    : 'text-textSecondary hover:bg-black/5 dark:text-textSecondaryDark dark:hover:bg-white/5'
                }`}
              >
                <span className="material-icons-round text-[21px]" aria-hidden>
                  {section.icon}
                </span>
                <span className="leading-tight">{section.label}</span>
              </button>
            );
          })}
        </div>

        {activeSection === 'reuniones' && (
          <section className="rounded-xl bg-white dark:bg-surfaceDark border border-borderLight dark:border-white/[0.07] p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-icons-round text-primary dark:text-primaryDark">
                groups
              </span>
              <h2 className="font-serif text-2xl font-bold text-primary dark:text-primaryDark">
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
          <section className="rounded-xl bg-white dark:bg-surfaceDark border border-borderLight dark:border-white/[0.07] p-5">
            <div className="flex items-center gap-3 mb-3">
              <span className="material-icons-round text-primary dark:text-primaryDark">
                article
              </span>
              <h2 className="font-serif text-2xl font-bold text-primary dark:text-primaryDark">
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
