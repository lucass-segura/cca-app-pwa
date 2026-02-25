import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import HimnoDetail from './pages/HimnoDetail';
import CoritoDetail from './pages/CoritoDetail';
import Favoritos from './pages/Favoritos';
import Configuracion from './pages/Configuracion';
import { UpdateToast } from './components/UpdateToast';
import { InstallScreen } from './components/InstallBanner';
import { useInstallPrompt } from './hooks/useInstallPrompt';

export default function App() {
  const { shouldBlock, os, install, canInstall } = useInstallPrompt();

  if (shouldBlock) {
    return <InstallScreen os={os} install={install} canInstall={canInstall} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/himno/:id" element={<HimnoDetail />} />
        <Route path="/corito/:id" element={<CoritoDetail />} />
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="/configuracion" element={<Configuracion />} />
      </Routes>
      <UpdateToast />
    </BrowserRouter>
  );
}
