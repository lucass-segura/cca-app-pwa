// Helpers for the Relatorio directory (search and link building), ported from
// the CCA website so both show the same data with the same rules.

/** Lowercases, strips diacritics and collapses whitespace so "Córdoba" matches "cordoba". */
export function normalizeText(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// "Interior" alone is ambiguous next to the provinces, so it keeps its province in the label.
const REGION_LABELS = {
  'buenos-aires-interior': 'Interior de Buenos Aires',
};

export function regionLabel(region) {
  return REGION_LABELS[region.id] ?? region.name;
}

/** Adds a normalized `searchText` covering name, region, province and address. */
export function indexCongregations(congregations, regions) {
  const labels = new Map(
    regions.map((region) => [region.id, `${regionLabel(region)} ${region.province}`])
  );

  return congregations.map((congregation) => {
    const { address } = congregation;
    return {
      ...congregation,
      searchText: normalizeText(
        [
          congregation.name,
          labels.get(congregation.regionId),
          address.street,
          address.neighborhood,
          address.complement,
          address.postalCode,
        ]
          .filter(Boolean)
          .join(' ')
      ),
    };
  });
}

/** Every whitespace-separated token of the query must appear in the search text. */
export function filterCongregations(list, { query, regionId }) {
  const tokens = normalizeText(query).split(' ').filter(Boolean);

  return list.filter((congregation) => {
    if (regionId && congregation.regionId !== regionId) return false;
    return tokens.every((token) => congregation.searchText.includes(token));
  });
}

/** Google Maps directions: exact coordinates when known, otherwise the address as text. */
export function directionsUrl(congregation, regionName) {
  const base = 'https://www.google.com/maps/dir/?api=1&destination=';
  const { location, address, name } = congregation;
  if (location) return `${base}${location.lat},${location.lng}`;
  return `${base}${encodeURIComponent(`${address.street}, ${name}, ${regionName}, Argentina`)}`;
}

/** True when the schedule has a winter/summer time pair such as "17:00/18:00". */
export function hasSeasonalTimes(schedule) {
  return /\d{1,2}[:.]\d{2}\s*\/\s*\d{1,2}[:.]\d{2}/.test(schedule);
}
