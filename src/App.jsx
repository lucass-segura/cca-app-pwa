import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { useLocation } from 'react-router-dom';
import Home from './pages/Home';
import HimnoDetail from './pages/HimnoDetail';
import CoritoDetail from './pages/CoritoDetail';
import Favoritos from './pages/Favoritos';
import Configuracion from './pages/Configuracion';
import Categorias from './pages/Categorias';
import CategoriaDetalle from './pages/CategoriaDetalle';
import Novedades from './pages/Novedades';
import { UpdateToast } from './components/UpdateToast';
import { InstallScreen } from './components/InstallBanner';
import { BottomNav } from './components/BottomNav';
import { useInstallPrompt } from './hooks/useInstallPrompt';

function AppLayout() {
  const { pathname } = useLocation();
  const showBottomNav =
    pathname === '/' ||
    pathname === '/categorias' ||
    pathname === '/favoritos' ||
    pathname === '/novedades' ||
    pathname === '/configuracion' ||
    pathname.startsWith('/categorias/');

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/himno/:id" element={<HimnoDetail />} />
        <Route path="/corito/:id" element={<CoritoDetail />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categorias/:id" element={<CategoriaDetalle />} />
        <Route path="/novedades" element={<Novedades />} />
      </Routes>
      {showBottomNav && <BottomNav />}
      <UpdateToast />
      <Analytics />
    </>
  );
}

export default function App() {
  const { shouldBlock, os, install, canInstall } = useInstallPrompt();

  if (shouldBlock) {
    return <InstallScreen os={os} install={install} canInstall={canInstall} />;
  }

  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
