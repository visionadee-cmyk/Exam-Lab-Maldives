/**
 * Eager-load Cambridge IGCSE / O Level mark-scheme JSON so Subject detail
 * paper lists stay in sync with files under src/data/papers (no manual map drift).
 */

const biology0610Modules = import.meta.glob('./papers/biology-0610-*-ms.json', { eager: true });
const accounting0452Modules = import.meta.glob('./papers/accounting-0452-*-ms.json', { eager: true });
const accounting7707Modules = import.meta.glob('./papers/accounting-7707-*-ms.json', { eager: true });

function buildMapAndList(modules) {
  const map = {};
  const list = [];
  for (const mod of Object.values(modules)) {
    const data = mod?.default ?? mod;
    if (!data?.paperId) continue;
    map[data.paperId] = data;
    list.push({
      id: data.paperId,
      title: data.title || 'Mark scheme',
      session: data.session || '',
      code: data.code || '',
      type: 'MS'
    });
  }
  list.sort((a, b) => b.id.localeCompare(a.id));
  return { map, list };
}

const biology0610 = buildMapAndList(biology0610Modules);
const accounting0452 = buildMapAndList(accounting0452Modules);
const accounting7707 = buildMapAndList(accounting7707Modules);

/** paperId → parsed JSON (for /paper interactive view) */
export const GLOB_MS_INTERACTIVE_MAP = {
  ...biology0610.map,
  ...accounting0452.map,
  ...accounting7707.map
};

/** App route subject id → paper row metadata for Subject detail */
export const GLOB_MS_PAPER_LISTS = {
  biology_igcse: biology0610.list,
  accounting_igcse: accounting0452.list,
  accounting_olevel: accounting7707.list
};
