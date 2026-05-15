/**
 * Biology IGCSE practice pool (wrapper around paperPracticePool).
 */
import {
  getPracticeQuestionsForSubject,
  pickPracticeQuestions
} from './paperPracticePool.js';

export function getAllBiologyPracticeQuestions() {
  return getPracticeQuestionsForSubject('biology_igcse');
}

export function pickBiologyPracticeQuestions(topic, count = 10) {
  return pickPracticeQuestions('biology_igcse', topic, count);
}
