import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import { kml } from '@mapbox/togeojson';

const DEFAULT_CENTER = [-34.6037, -58.3816];
const SELECTED_ZOOM = 16;
const MALVINAS_LABEL_POSITION = [-51.7963, -59.5236];
const LIGHT_TILE_LAYER = {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
};
const DARK_TILE_LAYER = {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
};

function stripHtml(value = '') {
  const doc = new DOMParser().parseFromString(value, 'text/html');
  return doc.body.textContent?.trim() ?? '';
}

function normalizeSearchText(value = '') {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function churchMatchesQuery(church, query) {
  const normalizedQuery = normalizeSearchText(query.trim());
  if (!normalizedQuery) return true;

  return (
    normalizeSearchText(church.name).includes(normalizedQuery) ||
    normalizeSearchText(church.description).includes(normalizedQuery)
  );
}

function getPointCoordinates(feature) {
  const { geometry } = feature;
  if (!geometry) return null;

  if (geometry.type === 'Point') {
    return geometry.coordinates;
  }

  if (geometry.type === 'MultiPoint') {
    return geometry.coordinates[0];
  }

  return null;
}

function featureToChurch(feature, index) {
  const coordinates = getPointCoordinates(feature);
  if (!coordinates) return null;

  const [lng, lat] = coordinates;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const name = stripHtml(feature.properties?.name) || `Iglesia ${index + 1}`;
  const description = stripHtml(feature.properties?.description);

  return {
    id: `${name}-${lat}-${lng}`,
    name,
    description,
    lat,
    lng,
  };
}

const kmlStores = new Map();

function createKmlStore(kmlUrl) {
  let snapshot = {
    churches: [],
    loading: true,
    error: '',
  };
  let loadingStarted = false;
  const listeners = new Set();

  const emitChange = () => {
    for (const listener of listeners) {
      listener();
    }
  };

  const loadKml = async () => {
    try {
      const response = await fetch(kmlUrl, { cache: 'no-cache' });

      if (!response.ok) {
        throw new Error(`No se pudo cargar ${kmlUrl}`);
      }

      const text = await response.text();
      const documentXml = new DOMParser().parseFromString(text, 'text/xml');
      const geojson = kml(documentXml);
      const churches = geojson.features
        .flatMap((feature, index) => {
          const church = featureToChurch(feature, index);
          return church ? [church] : [];
        })
        .sort((a, b) => a.name.localeCompare(b.name, 'es'));

      snapshot = {
        churches,
        loading: false,
        error: churches.length ? '' : 'El KML no contiene puntos de iglesias.',
      };
    } catch {
      snapshot = {
        churches: [],
        loading: false,
        error: 'No se pudo cargar el mapa de iglesias.',
      };
    }

    emitChange();
  };

  const ensureLoaded = () => {
    if (loadingStarted || typeof fetch === 'undefined') return;
    loadingStarted = true;
    loadKml();
  };

  return {
    getSnapshot: () => snapshot,
    subscribe: (listener) => {
      listeners.add(listener);
      ensureLoaded();
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

function getKmlStore(kmlUrl) {
  if (!kmlStores.has(kmlUrl)) {
    kmlStores.set(kmlUrl, createKmlStore(kmlUrl));
  }

  return kmlStores.get(kmlUrl);
}

function useChurchesFromKml(kmlUrl) {
  const store = useMemo(() => getKmlStore(kmlUrl), [kmlUrl]);
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot
  );
}

function subscribeToTheme(listener) {
  const observer = new MutationObserver(listener);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });

  return () => observer.disconnect();
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains('dark');
}

function useIsDarkTheme() {
  return useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    () => false
  );
}

function getChurchBounds(churches) {
  if (churches.length === 0) return undefined;

  const bounds = L.latLngBounds(churches.map((church) => [church.lat, church.lng]));
  return [
    [bounds.getSouth(), bounds.getWest()],
    [bounds.getNorth(), bounds.getEast()],
  ];
}

function flyToChurch(map, church) {
  if (!map || !church) return;

  map.flyTo([church.lat, church.lng], SELECTED_ZOOM, {
    duration: 0.8,
    easeLinearity: 0.2,
  });
}

function centerPopupInMap(map, marker) {
  if (!map || !marker) return;

  const popupElement = marker.getPopup()?.getElement();
  const mapElement = map.getContainer();

  if (!popupElement || !mapElement) return;

  const popupRect = popupElement.getBoundingClientRect();
  const mapRect = mapElement.getBoundingClientRect();
  const popupCenter = L.point(
    popupRect.left + popupRect.width / 2 - mapRect.left,
    popupRect.top + popupRect.height / 2 - mapRect.top
  );

  map.panTo(map.containerPointToLatLng(popupCenter), {
    animate: true,
    duration: 0.35,
  });
}

function openChurchPopup(map, marker) {
  window.setTimeout(() => {
    marker?.openPopup();
    window.requestAnimationFrame(() => centerPopupInMap(map, marker));
  }, 850);
}

function buildChurchIndex(churches) {
  return new Map(churches.map((church) => [church.id, church]));
}

function createMarkerRefHandler(markerRefs, churchId) {
  return (marker) => {
    if (marker) {
      markerRefs.current[churchId] = marker;
    } else {
      delete markerRefs.current[churchId];
    }
  };
}

function ChurchPopup({ church }) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${church.lat},${church.lng}`;

  return (
    <div className="w-56 font-sans">
      <p className="text-base font-semibold text-slate-900">{church.name}</p>
      {church.description && (
        <p className="mt-1 text-sm leading-5 text-slate-600">{church.description}</p>
      )}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="google-maps-button mt-4 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Abrir en Google Maps
      </a>
    </div>
  );
}

function MalvinasLabel() {
  const icon = useMemo(() => (
    L.divIcon({
      className: 'malvinas-map-label',
      html: '<span>Islas Malvinas</span>',
      iconSize: [116, 24],
      iconAnchor: [58, 12],
    })
  ), []);

  return (
    <Marker
      position={MALVINAS_LABEL_POSITION}
      icon={icon}
      interactive={false}
      keyboard={false}
    />
  );
}

function ChurchList({ churches, selectedChurchId, onSelectChurch }) {
  return (
    <aside className="flex max-h-[520px] min-h-0 min-w-0 max-w-full flex-col overflow-hidden rounded-3xl border border-borderLight bg-white shadow-xl dark:border-white/[0.07] dark:bg-surfaceDark">
      <div className="border-b border-borderLight px-5 py-4 dark:border-white/[0.07]">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-textSecondary dark:text-textSecondaryDark">
          Iglesias
        </p>
        <p className="mt-1 font-serif text-2xl font-bold text-textPrimary dark:text-textPrimaryDark">
          {churches.length} ubicaciones
        </p>
      </div>

      <div className="min-h-0 min-w-0 max-w-full flex-1 overflow-y-auto p-3">
        {churches.length === 0 ? (
          <div className="px-3 py-8 text-center font-sans text-sm text-textSecondary dark:text-textSecondaryDark">
            No se encontraron iglesias.
          </div>
        ) : (
          <div className="min-w-0 max-w-full space-y-2">
            {churches.map((church) => {
              const isSelected = church.id === selectedChurchId;

              return (
                <button
                  key={church.id}
                  type="button"
                  onClick={() => onSelectChurch(church.id)}
                  className={`block w-full min-w-0 max-w-full rounded-2xl border px-4 py-3 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isSelected
                      ? 'border-primary/30 bg-primary/10 shadow-sm dark:border-primaryDark/40 dark:bg-primaryDark/15'
                      : 'border-transparent hover:border-borderLight hover:bg-bgLight dark:hover:border-white/[0.07] dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="flex min-w-0 max-w-full items-start gap-3">
                    <span
                      className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-2xl ${
                        isSelected
                          ? 'bg-primary text-white dark:bg-primaryDark'
                          : 'bg-primary/10 text-primary dark:bg-primaryDark/15 dark:text-primaryDark'
                      }`}
                    >
                      <span className="material-icons-round text-[20px]" aria-hidden>
                        home
                      </span>
                    </span>
                    <span className="block min-w-0 flex-1 overflow-hidden">
                      <span className="block truncate font-sans text-sm font-semibold text-textPrimary dark:text-textPrimaryDark">
                        {church.name}
                      </span>
                      {church.description && (
                        <span className="mt-0.5 block truncate font-sans text-xs text-textSecondary dark:text-textSecondaryDark">
                          {church.description}
                        </span>
                      )}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}

function ChurchSearch({
  inputId,
  searchQuery,
  searchSuggestions,
  isSearchOpen,
  onSearchChange,
  onSearchFocus,
  onSearchKeyDown,
  onClearSearch,
  onSelectChurch,
}) {
  return (
    <div className="relative block w-full min-w-0">
      <label htmlFor={inputId} className="sr-only">Buscar iglesia</label>
      <span className="material-icons-round pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[21px] text-textSecondary/70 dark:text-textSecondaryDark/70">
        search
      </span>
      <input
        id={inputId}
        type="search"
        value={searchQuery}
        onChange={onSearchChange}
        onFocus={onSearchFocus}
        onKeyDown={onSearchKeyDown}
        placeholder="Buscar iglesia…"
        className="h-12 w-full rounded-2xl border border-borderLight bg-white pl-12 pr-12 font-sans text-sm text-textPrimary shadow-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10 dark:border-white/[0.07] dark:bg-surfaceDark dark:text-textPrimaryDark dark:focus:border-primaryDark dark:focus:ring-primaryDark/15"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={onClearSearch}
          className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-textSecondary transition-colors hover:bg-bgLight hover:text-textPrimary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-textSecondaryDark dark:hover:bg-white/[0.06] dark:hover:text-textPrimaryDark"
          aria-label="Borrar busqueda"
        >
          <span className="material-icons-round text-[18px]" aria-hidden>
            close
          </span>
        </button>
      )}
      {isSearchOpen && searchSuggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[3200] max-h-72 overflow-y-auto rounded-2xl border border-borderLight bg-white shadow-xl dark:border-white/[0.07] dark:bg-surfaceDark">
          {searchSuggestions.map((church) => (
            <button
              key={church.id}
              type="button"
              onClick={() => onSelectChurch(church.id)}
              className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-bgLight focus:outline-none focus-visible:bg-bgLight dark:hover:bg-white/[0.04] dark:focus-visible:bg-white/[0.04]"
            >
              <span className="material-icons-round mt-0.5 text-[20px] text-primary dark:text-primaryDark" aria-hidden>
                home
              </span>
              <span className="min-w-0">
                <span className="block truncate font-sans text-sm font-semibold text-textPrimary dark:text-textPrimaryDark">
                  {church.name}
                </span>
                {church.description && (
                  <span className="mt-0.5 block truncate font-sans text-xs text-textSecondary dark:text-textSecondaryDark">
                    {church.description}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ChurchMap({ kmlUrl = '/iglesias.kml' }) {
  const { churches, loading, error } = useChurchesFromKml(kmlUrl);
  const isDarkTheme = useIsDarkTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [selectedChurchId, setSelectedChurchId] = useState('');
  const markerRefs = useRef({});
  const mapRef = useRef(null);
  const tileLayer = isDarkTheme ? DARK_TILE_LAYER : LIGHT_TILE_LAYER;

  const markerIcon = useMemo(() => (
    L.divIcon({
      className: 'church-marker',
      html: '<div class="church-marker-pin"><span class="material-icons-round">home</span></div>',
      iconSize: [34, 34],
      iconAnchor: [17, 32],
      popupAnchor: [0, -30],
    })
  ), []);

  const searchSuggestions = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return [];

    return churches
      .filter((church) => churchMatchesQuery(church, query));
  }, [churches, searchQuery]);

  const churchIndex = useMemo(() => buildChurchIndex(churches), [churches]);
  const mapBounds = useMemo(() => getChurchBounds(churches), [churches]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      mapRef.current?.invalidateSize();
    }, 260);

    return () => window.clearTimeout(timeoutId);
  }, [isMapFullscreen]);

  useEffect(() => {
    document.body.style.overflow = isMapFullscreen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMapFullscreen]);

  const handleSelectChurch = useCallback((churchId) => {
    const church = churchIndex.get(churchId);
    setSelectedChurchId(churchId);
    setSearchQuery(church?.name ?? '');
    setIsSearchOpen(false);
    flyToChurch(mapRef.current, church);
    openChurchPopup(mapRef.current, markerRefs.current[churchId]);
  }, [churchIndex]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setIsSearchOpen(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedChurchId('');
    setIsSearchOpen(false);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key !== 'Enter' || searchSuggestions.length === 0) return;
    event.preventDefault();
    handleSelectChurch(searchSuggestions[0].id);
  };

  const searchProps = {
    searchQuery,
    searchSuggestions,
    isSearchOpen,
    onSearchChange: handleSearchChange,
    onSearchFocus: () => setIsSearchOpen(searchQuery.trim().length > 0),
    onSearchKeyDown: handleSearchKeyDown,
    onClearSearch: handleClearSearch,
    onSelectChurch: handleSelectChurch,
  };

  return (
    <section className="w-full min-w-0 max-w-full space-y-5">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary dark:text-primaryDark">
            Ubicaciones
          </p>
          <h2 className="font-serif text-4xl font-bold leading-tight text-textPrimary dark:text-textPrimaryDark">
            Mapa de Iglesias
          </h2>
        </div>

        {!isMapFullscreen && (
          <div className="w-full min-w-0 sm:max-w-sm">
            <ChurchSearch inputId="church-search" {...searchProps} />
          </div>
        )}
      </div>

      <div className="grid w-full min-w-0 max-w-full gap-5 xl:grid-cols-[minmax(0,0.41fr)_380px] xl:items-start">
        <div
          className={`${
            isMapFullscreen
              ? 'fixed inset-0 z-[3000] rounded-none border-0 bg-bgLight p-0 dark:bg-bgDark'
              : 'relative z-0 w-full min-w-0 max-w-full rounded-3xl border border-white/70 bg-white p-1 shadow-xl dark:border-white/[0.07] dark:bg-surfaceDark'
          }`}
        >
          <div className={`${isMapFullscreen ? 'fixed left-3 right-3 top-4 z-[3100] mx-auto max-w-md' : 'hidden'}`}>
            <ChurchSearch inputId="church-search-fullscreen" {...searchProps} />
          </div>

          <button
            type="button"
            onClick={() => setIsMapFullscreen((expanded) => !expanded)}
            className={`absolute right-3 z-[3150] flex size-11 items-center justify-center rounded-2xl border border-white/70 bg-white/90 text-textPrimary shadow-lg backdrop-blur-xl transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-white/[0.10] dark:bg-surfaceDark/90 dark:text-textPrimaryDark dark:hover:bg-surfaceDark ${
              isMapFullscreen ? 'top-[76px] sm:top-4' : 'top-3'
            }`}
            aria-label={isMapFullscreen ? 'Achicar mapa' : 'Agrandar mapa'}
            aria-pressed={isMapFullscreen}
          >
            <span className="material-icons-round text-[23px]" aria-hidden>
              {isMapFullscreen ? 'fullscreen_exit' : 'fullscreen'}
            </span>
          </button>

          {isMapFullscreen && (
            <div className="absolute bottom-20 left-5 z-[3150] overflow-hidden rounded-2xl border border-white/70 bg-white/90 shadow-lg backdrop-blur-xl dark:border-white/[0.10] dark:bg-surfaceDark/90">
              <button
                type="button"
                onClick={() => mapRef.current?.zoomIn()}
                className="flex size-11 items-center justify-center text-2xl font-semibold text-textPrimary transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-textPrimaryDark dark:hover:bg-white/[0.07]"
                aria-label="Acercar mapa"
              >
                +
              </button>
              <div className="h-px bg-borderLight dark:bg-white/[0.08]" />
              <button
                type="button"
                onClick={() => mapRef.current?.zoomOut()}
                className="flex size-11 items-center justify-center text-3xl font-light leading-none text-textPrimary transition hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-textPrimaryDark dark:hover:bg-white/[0.07]"
                aria-label="Alejar mapa"
              >
                -
              </button>
            </div>
          )}

          <div className={`map-viewport min-w-0 w-full ${isMapFullscreen ? 'map-viewport-fullscreen h-screen rounded-none' : 'aspect-[5/5.7] min-h-[180px] sm:aspect-[16/9] md:aspect-[2/1] xl:aspect-auto xl:h-[480px]'}`}>
            {loading ? (
              <div className="flex h-full items-center justify-center bg-bgLight font-sans text-sm text-textSecondary dark:bg-bgDark dark:text-textSecondaryDark">
                Cargando mapa de iglesias…
              </div>
            ) : error ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 bg-bgLight px-6 text-center font-sans dark:bg-bgDark">
                <span className="material-icons-round text-4xl text-primary dark:text-primaryDark">
                  map
                </span>
                <p className="text-sm font-medium text-textPrimary dark:text-textPrimaryDark">
                  {error}
                </p>
                <p className="text-xs text-textSecondary dark:text-textSecondaryDark">
                  Verificá que el archivo KML exista en {kmlUrl}.
                </p>
              </div>
            ) : (
              <MapContainer
                ref={mapRef}
                bounds={mapBounds}
                boundsOptions={{ padding: [36, 36], maxZoom: 13 }}
                center={DEFAULT_CENTER}
                zoom={10}
                zoomControl={false}
                scrollWheelZoom
                className="h-full w-full max-w-full"
              >
                {!isMapFullscreen && <ZoomControl position="topleft" />}
                <TileLayer
                  key={tileLayer.url}
                  attribution={tileLayer.attribution}
                  url={tileLayer.url}
                />
                <MalvinasLabel />
                {churches.map((church) => (
                  <Marker
                    key={church.id}
                    ref={createMarkerRefHandler(markerRefs, church.id)}
                    position={[church.lat, church.lng]}
                    icon={markerIcon}
                    eventHandlers={{
                      click: () => handleSelectChurch(church.id),
                    }}
                  >
                    <Popup closeButton={false} autoPanPadding={[24, 24]} maxWidth={260}>
                      <ChurchPopup church={church} />
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </div>
        </div>

        <ChurchList
          churches={churches}
          selectedChurchId={selectedChurchId}
          onSelectChurch={handleSelectChurch}
        />
      </div>
    </section>
  );
}
