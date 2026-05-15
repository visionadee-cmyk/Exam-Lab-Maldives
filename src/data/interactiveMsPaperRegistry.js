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
