/**

 * Shared helpers for interactive QP JSON (images, app readiness, normalization).

 */



export function assetSlugFromPaperId(paperId) {

  if (!paperId) return 'unknown';

  return paperId.replace(/-qp$/i, '').replace(/-ms$/i, '');

}

/** Encode public paths so folder names like pdf-pastpaer-q&a work in href/src. */
export function publicAssetUrl(url) {
  if (!url || typeof url !== 'string') return '';
  if (/^https?:\/\//i.test(url)) return url;
  const norm = url.replace(/\\/g, '/');
  return norm
    .split('/')
    .map((segment) => (segment === '' ? '' : encodeURIComponent(segment)))
    .join('/');
}

/** Strip Cambridge PDF footer/binary junk from parsed question text. */
export function cleanPdfText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/[\u0001-\u0008\u000b\u000c\u000e-\u001f]/g, '')
    .replace(/\[Turn over\]/gi, '')
    .replace(/\d{4}\/\d{2}\/?\s*O\/N\/\d{2}\s*©?\s*UCLES\s*20\d{2}/gi, '')
    .replace(/©\s*UCLES\s*20\d{2}/gi, '')
    .replace(/DFD\s*\d+/gi, '')
    .replace(/,\s*Ĭ[\s\S]*?(?=DFD|$)/gi, '')
    .replace(/Ĭ[\s\S]{8,200}?(?=DFD|$)/gi, '')
    .replace(/DO NOT WRITE IN THIS MARGIN/gi, '')
    .replace(/\* 0+\d+ \*/g, '')
    .replace(/\[Total:\s*\d+\]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function questionImagePath(slug, questionNumber) {

  return `/papers/${slug}/q${questionNumber}.png`;

}



export function partImagePath(slug, questionNumber, partId) {

  const safePart = String(partId).replace(/\./g, '_');

  return `/papers/${slug}/q${questionNumber}-${safePart}.png`;

}



function isMcqAnswer(text) {

  if (!text) return false;

  const t = text.trim();

  return /^[A-D]$/i.test(t) || /only correct answer is\s+([A-D])/i.test(t);

}



export function extractMcqLetter(text) {

  if (!text) return '';

  const t = text.trim();

  if (/^[A-D]$/i.test(t)) return t.toUpperCase();

  const m = text.match(/only correct answer is\s+([A-D])/i);

  return m ? m[1].toUpperCase() : '';

}



/** Legacy / MCQ rows: build a single answerable part when `parts` is missing. */
export function ensureQuestionParts(question) {
  if (!question) return question;
  if (Array.isArray(question.parts) && question.parts.length > 0) {
    return question;
  }
  const num =
    question.number ??
    (parseInt(String(question.id || '').replace(/\D/g, ''), 10) || 0);
  const partId = num ? String(num) : 'main';
  const marks = question.marks ?? question.totalMarks ?? 1;
  return {
    ...question,
    totalMarks: question.totalMarks ?? marks,
    marks: question.marks ?? marks,
    parts: [
      {
        id: partId,
        text: (question.text || question.question || '').trim() || `Question ${num}`,
        marks,
        type:
          question.type === 'multiple_choice' ? 'mcq' : question.type || 'structured',
        answer: question.answer || '',
        options: question.options,
        keywords: question.keywords,
        image: question.image ?? ''
      }
    ]
  };
}

export function getQuestionParts(question) {
  return ensureQuestionParts(question).parts || [];
}

export function isPartAnswered(part) {

  if (!part?.answer) return false;

  const a = String(part.answer).trim();

  if (a.length < 2) return false;

  if (isMcqAnswer(a)) return true;

  if (a.length >= 12) return true;

  return false;

}



/** Paper has rendered page images or explicit question images. */

export function hasPaperImages(paper) {

  if (paper?.assets?.pageImages?.length) return true;

  if (paper?.assets?.qpPdf) return true;

  for (const q of paper?.questions || []) {

    if (q.image) return true;

    if (q.parts?.some((p) => p.image)) return true;

  }

  return false;

}



/** Show in subject list and open in Paper view (images; MS optional). */

export function isPaperViewableInApp(paper) {

  if (!paper?.questions?.length) return hasPaperImages(paper);

  return isPaperAppReady(paper) || hasPaperImages(paper);

}



/** Paper has questions with mark-scheme answers suitable for /paper practice. */

export function isPaperAppReady(paper) {

  if (!paper?.questions?.length) return false;



  let readyParts = 0;

  for (const q of paper.questions) {

    if (q.type === 'multiple_choice' && q.answer) {

      readyParts++;

      continue;

    }

    if (q.parts?.length) {

      const answered = q.parts.filter(isPartAnswered);

      if (answered.length > 0) readyParts++;

    } else if (q.answer && isPartAnswered({ answer: q.answer })) {

      readyParts++;

    }

  }

  return readyParts > 0;

}



/** Normalize auto-built JSON for Paper.jsx (parts, MCQ, images). */

export function normalizePaperForApp(paper) {

  if (!paper?.questions) return paper;



  const slug = paper.assets?.basePath?.replace(/^\//, '')?.split('/').pop()

    || assetSlugFromPaperId(paper.paperId);

  const basePath = paper.assets?.basePath || `/papers/${slug}`;



  const questions = paper.questions.map((q) => {

    const num = q.number ?? (parseInt(String(q.id || '').replace(/\D/g, ''), 10) || 0);

    const next = ensureQuestionParts({ ...q });

    if (next.question) next.question = cleanPdfText(next.question);
    if (next.text) next.text = cleanPdfText(next.text);



    /** Omit `image` or set `image` to null/"" when the question has no diagram (text-only MCQ). */

    if (!Object.prototype.hasOwnProperty.call(next, 'image')) {

      next.image = `${basePath}/q${num}.png`;

    } else if (next.image == null || next.image === '') {

      next.image = '';

    }



    if (next.parts?.length) {

      next.parts = next.parts.map((part) => {

        const p = { ...part };
        if (p.text) p.text = cleanPdfText(p.text);

        if (!Object.prototype.hasOwnProperty.call(p, 'image')) {

          p.image = `${basePath}/q${num}-${String(part.id).replace(/\./g, '_')}.png`;

        } else if (p.image == null || p.image === '') {

          p.image = '';

        }

        const letter = extractMcqLetter(p.answer);

        if (letter && (!p.type || p.type === 'structured')) {

          p.type = 'mcq';

          p.answer = letter;

          if (!p.options?.length) {

            p.options = ['A', 'B', 'C', 'D'].map((id) => ({ id, text: `Option ${id}` }));

          }

        }

        if (p.type === 'mcq' && Array.isArray(p.options) && typeof p.options[0] === 'string') {

          p.options = p.options.map((opt) => {

            const m = String(opt).match(/^([A-D])\s+(.+)/i);

            return m ? { id: m[1].toUpperCase(), text: m[2] } : { id: opt, text: opt };

          });

        }

        return p;

      });

    }



    if (next.type === 'multiple_choice' && Array.isArray(next.options) && typeof next.options[0] === 'string') {

      next.options = next.options.map((opt) => {

        const m = String(opt).match(/^([A-D])\s+(.+)/i);

        return m ? { id: m[1].toUpperCase(), text: m[2] } : { id: opt.slice(0, 1), text: opt };

      });

    }



    return next;

  });



  const unitMatch = paper.paperId?.match(/unit(\d+)/i);



  return {

    ...paper,

    unit: paper.unit || (unitMatch ? `Unit ${unitMatch[1]}` : ''),

    assets: {

      ...paper.assets,

      basePath

    },

    questions

  };

}

