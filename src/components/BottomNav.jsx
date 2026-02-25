import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { path: '/', icon: 'home', label: 'Inicio' },
  { path: '/favoritos', icon: 'favorite', label: 'Favoritos' },
  { path: '/configuracion', icon: 'settings', label: 'Configuración' },
];

export function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 bg-white dark:bg-surfaceDark border-t border-borderLight dark:border-gray-800"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 ${
                isActive
                  ? 'text-primary dark:text-primaryDark'
                  : 'text-textSecondary dark:text-textSecondaryDark hover:text-primary dark:hover:text-primaryDark'
              }`}
            >
              <span className="material-icons-round text-2xl mb-0.5">{tab.icon}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
