/**
 * Eager-load interactive QP/MS JSON from src/data/papers.
 */
import {
  isPaperAppReady,
  isPaperViewableInApp,
  normalizePaperForApp
} from '../lib/paperSchema.js';

/** Map JSON subjectId to UI subject id in subjects.js */
const SUBJECT_ID_ALIASES = {
  accounting_cambridge_olevel: 'accounting_olevel'
};

function uiSubjectId(subjectId) {
  return SUBJECT_ID_ALIASES[subjectId] || subjectId;
}

const qpModules = import.meta.glob(
  ['./papers/*-qp.json', './papers/biology-wbi*.json'],
  { eager: true }
);
const msModules = import.meta.glob('./papers/*-ms.json', { eager: true });

function paperRow(data, type, interactive) {
  return {
    id: data.paperId,
    title: data.title || (type === 'QP' ? 'Question paper' : 'Mark scheme'),
    session: data.session || '',
    code: data.code || '',
    type,
    interactive: Boolean(interactive),
    hasMarkScheme: Boolean(data.hasMarkScheme)
  };
}

function buildRegistry() {
  const map = {};
  const listsBySubject = {};
  const msById = {};

  for (const mod of Object.values(msModules)) {
    const data = mod?.default ?? mod;
    if (data?.paperId) msById[data.paperId] = data;
  }

  const addPaper = (data, type, interactive = false) => {
    if (!data?.paperId) return;
    map[data.paperId] = data;
    const sid = uiSubjectId(data.subjectId || 'unknown');
    if (!listsBySubject[sid]) listsBySubject[sid] = [];
    listsBySubject[sid].push(paperRow(data, type, interactive));
  };

  for (const mod of Object.values(msModules)) {
    addPaper(mod?.default ?? mod, 'MS', false);
  }

  for (const mod of Object.values(qpModules)) {
    const raw = mod?.default ?? mod;
    const normalized = normalizePaperForApp(raw);
    const interactive = isPaperViewableInApp(normalized);
    const withMs = isPaperAppReady(normalized);
    addPaper({ ...normalized, hasMarkScheme: withMs }, 'QP', interactive);
    if (interactive) {
      map[normalized.paperId] = normalized;
    }
  }

  for (const sid of Object.keys(listsBySubject)) {
    listsBySubject[sid].sort((a, b) => b.id.localeCompare(a.id));
  }

  const interactiveBySubject = {};
  for (const [sid, list] of Object.entries(listsBySubject)) {
    interactiveBySubject[sid] = list.filter(
      (p) => p.type === 'QP' && p.interactive
    );
  }

  return { map, listsBySubject, interactiveBySubject, msById };
}

const registry = buildRegistry();

export const GLOB_MS_INTERACTIVE_MAP = registry.map;
export const GLOB_MS_PAPER_LISTS = registry.listsBySubject;
export const GLOB_INTERACTIVE_QP_LISTS = registry.interactiveBySubject;
export const GLOB_MS_BY_ID = registry.msById;

/** Prefer main paper over v01 / va variants for the same session+unit. */
function isPreferredPaperRow(a, b) {
  const variant = /-(v\d+[a-z]?|va)-qp$/i;
  if (variant.test(a.id) && !variant.test(b.id)) return false;
  if (!variant.test(a.id) && variant.test(b.id)) return true;
  return a.id.localeCompare(b.id) > 0;
}

function paperRowKey(paper) {
  return String(paper.id || '')
    .replace(/-(v\d+[a-z]?|va)-qp$/i, '-qp')
    .replace(/-qp$/i, '');
}

/** One row per exam session+unit, Biology-style list for subject pages. */
export function getSubjectPaperList(subjectId) {
  const sid = uiSubjectId(subjectId);
  const rows = GLOB_INTERACTIVE_QP_LISTS[sid] || [];
  const byKey = new Map();
  for (const row of rows) {
    const key = paperRowKey(row);
    const existing = byKey.get(key);
    if (!existing || isPreferredPaperRow(row, existing)) {
      byKey.set(key, row);
    }
  }
  return [...byKey.values()].sort((a, b) => b.id.localeCompare(a.id));
}
