import { useMemo, useState } from 'react';
import data from '../data/relatorio.json';
import {
  directionsUrl,
  filterCongregations,
  hasSeasonalTimes,
  indexCongregations,
  regionLabel,
} from '../utils/relatorio';

const congregations = indexCongregations(data.congregations, data.regions);
const regionsById = new Map(data.regions.map((region) => [region.id, region]));

const updated = new Intl.DateTimeFormat('es-AR', {
  timeZone: 'America/Argentina/Buenos_Aires',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date(`${data.revision}T12:00:00-03:00`));

const sectionTitle =
  'font-sans text-xs font-semibold uppercase text-textSecondary dark:text-textSecondaryDark';
const actionButton =
  'inline-flex items-center gap-1.5 rounded border px-3 py-1.5 font-sans text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary';

function CongregationRow({ congregation, isOpen, onToggle }) {
  const { id, name, address, ministry, schedule, phone, isCentral } = congregation;
  const region = regionsById.get(congregation.regionId);
  const summary = [address.street, address.neighborhood].filter(Boolean).join(' · ');
  const locationRows = [
    ['Calle', address.street],
    ['Barrio', address.neighborhood],
    ['Complemento', address.complement],
    ['CP', address.postalCode],
  ].filter(([, value]) => Boolean(value));
  const phoneHref = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : '';

  return (
    <li>
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={`${id}-details`}
          onClick={onToggle}
          className="flex w-full items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-bgLight focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary dark:hover:bg-white/[0.04]"
        >
          <span className="min-w-0 flex-1">
            <span className="block font-sans text-base font-semibold text-textPrimary dark:text-textPrimaryDark">
              {name}
            </span>
            {isCentral && (
              <span className="block font-sans text-xs font-medium text-primary dark:text-primaryDark">
                Central Administrativa
              </span>
            )}
            <span className="mt-0.5 block font-sans text-sm text-textSecondary dark:text-textSecondaryDark">
              {summary}
            </span>
            <span className="mt-0.5 block font-sans text-sm text-textSecondary dark:text-textSecondaryDark">
              {schedule}
            </span>
          </span>
          <span
            className="material-icons-round mt-0.5 shrink-0 text-textSecondary dark:text-textSecondaryDark"
            aria-hidden
          >
            {isOpen ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      </h3>

      {isOpen && (
        <div id={`${id}-details`} className="space-y-4 px-3 pb-4 pt-1 font-sans text-sm">
          <section>
            <h4 className={sectionTitle}>Localización</h4>
            <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5">
              {locationRows.map(([term, value]) => (
                <div key={term} className="contents">
                  <dt className="text-textSecondary dark:text-textSecondaryDark">{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {hasSeasonalTimes(schedule) && (
            <section>
              <h4 className={sectionTitle}>Días de culto</h4>
              <p className="mt-1 text-textSecondary dark:text-textSecondaryDark">
                {data.scheduleNote}
              </p>
            </section>
          )}

          {ministry.length > 0 && (
            <section>
              <h4 className={sectionTitle}>Ministerio</h4>
              <dl className="mt-1 space-y-1.5">
                {ministry.map((group) => (
                  <div key={group.role}>
                    <dt className="text-textSecondary dark:text-textSecondaryDark">{group.role}</dt>
                    {group.names.map((person) => (
                      <dd key={person}>{person}</dd>
                    ))}
                  </div>
                ))}
              </dl>
            </section>
          )}

          <div className="flex flex-wrap gap-2">
            <a
              href={directionsUrl(congregation, region.province)}
              target="_blank"
              rel="noopener noreferrer"
              className={`${actionButton} border-primary/30 text-primary hover:bg-primary/10 dark:border-primaryDark/40 dark:text-primaryDark dark:hover:bg-primaryDark/10`}
            >
              <span className="material-icons-round text-[18px]" aria-hidden>
                near_me
              </span>
              Cómo llegar
            </a>
            {phone && (
              <a
                href={phoneHref}
                aria-label={`Llamar al ${phone}`}
                className={`${actionButton} border-borderLight text-textPrimary hover:bg-bgLight dark:border-white/10 dark:text-textPrimaryDark dark:hover:bg-white/[0.04]`}
              >
                <span className="material-icons-round text-[18px]" aria-hidden>
                  call
                </span>
                {phone}
              </a>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export function Relatorio() {
  const [query, setQuery] = useState('');
  const [regionId, setRegionId] = useState('');
  const [openId, setOpenId] = useState('');

  const groups = useMemo(() => {
    const matches = filterCongregations(congregations, { query, regionId });
    return data.regions
      .map((region) => ({
        region,
        items: matches.filter((congregation) => congregation.regionId === region.id),
      }))
      .filter((group) => group.items.length > 0);
  }, [query, regionId]);

  const total = groups.reduce((sum, group) => sum + group.items.length, 0);
  const isFiltered = Boolean(query.trim() || regionId);

  const clearFilters = () => {
    setQuery('');
    setRegionId('');
  };

  return (
    <section className="space-y-4">
      <p className="font-sans text-sm text-textSecondary dark:text-textSecondaryDark">
        Edición {data.edition} · {data.congregations.length} congregaciones · Actualizado el{' '}
        {updated}
      </p>

      <div className="space-y-2">
        <div className="relative">
          <span
            className="material-icons-round pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary opacity-70 dark:text-primaryDark"
            aria-hidden
          >
            search
          </span>
          <input
            type="search"
            aria-label="Buscar congregación"
            placeholder="Localidad, barrio, calle o código postal"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="block w-full rounded-md border border-borderLight bg-white py-3 pl-10 pr-3 text-sm leading-5 placeholder-textSecondary transition-all focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/[0.08] dark:bg-surfaceDark dark:placeholder-textSecondaryDark/50 dark:focus:ring-primaryDark"
          />
        </div>

        <select
          aria-label="Filtrar por región"
          value={regionId}
          onChange={(event) => setRegionId(event.target.value)}
          className="block w-full rounded-md border border-borderLight bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:border-white/[0.08] dark:bg-surfaceDark dark:focus:ring-primaryDark"
        >
          <option value="">Todas las regiones</option>
          {data.regions.map((region) => (
            <option key={region.id} value={region.id}>
              {regionLabel(region)}
            </option>
          ))}
        </select>
      </div>

      {isFiltered && (
        <p className="font-sans text-sm text-textSecondary dark:text-textSecondaryDark" aria-live="polite">
          {total === 1 ? '1 congregación' : `${total} congregaciones`}
        </p>
      )}

      {groups.length === 0 ? (
        <div className="rounded border border-borderLight bg-white p-4 text-sm dark:border-white/10 dark:bg-surfaceDark">
          <p className="text-textSecondary dark:text-textSecondaryDark">
            No hay congregaciones para mostrar con esta búsqueda.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-2 rounded font-medium text-primary underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-primaryDark"
          >
            Limpiar búsqueda
          </button>
        </div>
      ) : (
        groups.map(({ region, items }) => (
          <section key={region.id} aria-labelledby={`region-${region.id}`}>
            <h2
              id={`region-${region.id}`}
              className="mb-2 flex items-baseline justify-between gap-3 font-serif text-lg font-bold tracking-tight text-textPrimary dark:text-textPrimaryDark"
            >
              {regionLabel(region)}
              <span className="font-sans text-xs font-normal text-textSecondary dark:text-textSecondaryDark">
                {items.length}
              </span>
            </h2>
            <ul className="divide-y divide-borderLight overflow-hidden rounded border border-borderLight bg-white dark:divide-white/10 dark:border-white/10 dark:bg-surfaceDark">
              {items.map((congregation) => (
                <CongregationRow
                  key={congregation.id}
                  congregation={congregation}
                  isOpen={openId === congregation.id}
                  onToggle={() =>
                    setOpenId((current) => (current === congregation.id ? '' : congregation.id))
                  }
                />
              ))}
            </ul>
          </section>
        ))
      )}
    </section>
  );
}
