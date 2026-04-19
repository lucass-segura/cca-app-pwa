import { BottomNav } from '../components/BottomNav';
import { useDarkMode } from '../hooks/useDarkMode';
import { useDarkTheme } from '../hooks/useDarkTheme';

const DARK_THEMES = [
  {
    id: 'blue',
    label: 'Azul noche',
    bg: '#0B1121',
    surface: '#1a2540',
  },
  {
    id: 'black',
    label: 'Negro puro',
    bg: '#000000',
    surface: '#0d0d0d',
  },
];

export default function Configuracion() {
  const { isDark, toggle } = useDarkMode();
  const { darkTheme, setDarkTheme } = useDarkTheme();

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark text-textPrimary dark:text-textPrimaryDark font-sans antialiased pb-28">
      <header className="sticky top-0 z-10 bg-bgLight/95 dark:bg-bgDark/95 backdrop-blur-md border-b border-borderLight dark:border-gray-800">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="font-serif font-bold text-2xl tracking-tight text-primary dark:text-primaryDark">
            Configuración
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-6 space-y-6">

        {/* Apariencia */}
        <section>
          <p className="text-[11px] font-sans font-medium text-textSecondary dark:text-textSecondaryDark uppercase tracking-widest mb-2 px-0.5">
            Apariencia
          </p>

          <div className="bg-white dark:bg-surfaceDark rounded-xl border border-borderLight dark:border-white/[0.07] overflow-hidden divide-y divide-borderLight dark:divide-white/[0.06]">

            {/* Toggle modo oscuro */}
            <button
              onClick={toggle}
              className="w-full flex items-center justify-between p-4 hover:bg-bgLight dark:hover:bg-white/[0.03] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="material-icons-round text-xl text-textSecondary dark:text-textSecondaryDark">
                  {isDark ? 'dark_mode' : 'light_mode'}
                </span>
                <span className="font-sans font-medium text-sm text-textPrimary dark:text-textPrimaryDark">
                  Modo oscuro
                </span>
              </div>
              <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${isDark ? 'bg-primary dark:bg-primaryDark' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${isDark ? 'left-[22px]' : 'left-[2px]'}`} />
              </div>
            </button>

            {/* Selector de color — siempre visible */}
            <div className="p-4">
              <p className="font-sans text-sm font-medium text-textPrimary dark:text-textPrimaryDark mb-3">
                Fondo en modo oscuro
              </p>
              <div className="flex gap-3">
                {DARK_THEMES.map((theme) => {
                  const isActive = darkTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setDarkTheme(theme.id)}
                      className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded border transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        isActive
                          ? 'border-primary/50 dark:border-primaryDark/50 bg-primary/5 dark:bg-primaryDark/10'
                          : 'border-borderLight dark:border-white/[0.07] hover:border-primary/30 dark:hover:border-white/[0.15]'
                      }`}
                    >
                      <span
                        className="shrink-0 w-5 h-5 rounded-sm border border-black/10"
                        style={{ background: theme.bg }}
                      />
                      <span className={`font-sans text-xs font-medium ${isActive ? 'text-primary dark:text-primaryDark' : 'text-textSecondary dark:text-textSecondaryDark'}`}>
                        {theme.label}
                      </span>
                      {isActive && (
                        <span className="material-icons-round text-primary dark:text-primaryDark text-base ml-auto">
                          check
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </section>

      </main>

      <BottomNav />
    </div>
  );
}
