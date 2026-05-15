const fs = require('fs');

const json = {
  paperId: 'accounting-7707-2025-unit2-june-qp',
  subjectId: 'accounting_cambridge_olevel',
  code: '7707/22',
  session: 'May/June 2025',
  title: 'Accounting Unit 2 - Question Paper',
  totalMarks: 100,
  timeMinutes: 105,
  questions: [
    {
      id: 'q1',
      number: 1,
      type: 'structured',
      totalMarks: 20,
      question: 'Kadima - Cash book and bank reconciliation',
      parts: [
        { id: '1a', text: 'Complete Kadima\'s cash book on page 3. Balance the cash book and bring down the balances at 1 April 2025.', marks: 12, type: 'structured', keywords: ['cash book', 'balance', 'discount'] },
        { id: '1b', text: 'Calculate the amount for the bank balance which Kadima would show in his statement of financial position at 31 March 2025.', marks: 3, type: 'calculation', keywords: ['bank balance', 'statement of financial position'] },
        { id: '1c', text: 'Advise Kadima whether or not he should stop using cash and cheques. Justify your answer by providing points for and against making these changes.', marks: 5, type: 'essay', keywords: ['cash', 'cheques', 'bank transfer', 'discount'] }
      ]
    },
    {
      id: 'q2',
      number: 2,
      type: 'structured',
      totalMarks: 20,
      question: 'Farah and Salma - Partnership accounts',
      parts: [
        { id: '2a', text: 'Prepare the appropriation account for Farah and Salma for the year ended 28 February 2025.', marks: 6, type: 'structured', keywords: ['appropriation account', 'partnership'] },
        { id: '2b', text: 'Prepare Farah\'s current account for the year ended 28 February 2025. Balance the account and bring down the balance at 1 March 2025.', marks: 7, type: 'structured', keywords: ['current account', 'balance'] },
        { id: '2c', text: 'State two reasons why Salma should not take more drawings.', marks: 2, type: 'short_answer', keywords: ['drawings', 'partnership'] },
        { id: '2d', text: 'Advise Farah and Salma whether or not they should convert to a limited company. Justify your answer with advantages and disadvantages.', marks: 5, type: 'essay', keywords: ['limited company', 'advantages', 'disadvantages'] }
      ]
    },
    {
      id: 'q3',
      number: 3,
      type: 'structured',
      totalMarks: 20,
      question: 'Jasmine - Ledger accounts and financial statements',
      parts: [
        { id: '3a', text: 'Prepare the provision for depreciation of motor vehicles account for the year ended 31 March 2025. Balance the account and bring down the balance at 1 April 2025.', marks: 4, type: 'structured', keywords: ['depreciation', 'motor vehicles', 'reducing balance'] },
        { id: '3b', text: 'Prepare the provision for doubtful debts account for the year ended 31 March 2025. Balance the account and bring down the balance at 1 April 2025.', marks: 4, type: 'structured', keywords: ['doubtful debts', 'provision'] },
        { id: '3c', text: 'Prepare the rent and rates account for the year ended 31 March 2025. Balance the account and bring down the balances at 1 April 2025.', marks: 6, type: 'structured', keywords: ['rent', 'rates', 'prepaid', 'accrued'] },
        { id: '3d', text: 'Prepare the current assets section of Jasmine\'s statement of financial position at 31 March 2025.', marks: 3, type: 'structured', keywords: ['current assets', 'statement of financial position'] },
        { id: '3e_i', text: 'State how the principle of consistency is applied when charging depreciation.', marks: 1, type: 'short_answer', keywords: ['consistency', 'depreciation'] },
        { id: '3e_ii', text: 'State one way Jasmine may reduce the possibility of irrecoverable debts.', marks: 1, type: 'short_answer', keywords: ['irrecoverable debts', 'credit control'] },
        { id: '3e_iii', text: 'Identify which accounting principle Jasmine is applying by making an adjustment for rent prepaid.', marks: 1, type: 'short_answer', keywords: ['prepaid rent', 'accruals'] }
      ]
    },
    {
      id: 'q4',
      number: 4,
      type: 'structured',
      totalMarks: 20,
      question: 'Bilal - Error correction and capital',
      parts: [
        { id: '4a', text: 'Prepare the journal entries on page 15 to correct errors 1–5. Narratives are not required.', marks: 11, type: 'structured', keywords: ['journal', 'errors', 'corrections'] },
        { id: '4b', text: 'Calculate Bilal\'s profit for the year after correcting errors 1–5.', marks: 5, type: 'calculation', keywords: ['profit', 'errors', 'adjustments'] },
        { id: '4c', text: 'Calculate the balance on the capital account at 31 December 2024.', marks: 4, type: 'calculation', keywords: ['capital account', 'balance'] }
      ]
    },
    {
      id: 'q5',
      number: 5,
      type: 'structured',
      totalMarks: 20,
      question: 'Rexford - Incomplete records',
      parts: [
        { id: '5a', text: 'Prepare Rexford\'s purchases ledger control account for the year to 31 December 2024. Balance the account and bring down the balance at 1 January 2025.', marks: 4, type: 'structured', keywords: ['purchases ledger', 'control account'] },
        { id: '5b', text: 'Prepare Rexford\'s income statement for the year ended 31 December 2024.', marks: 8, type: 'structured', keywords: ['income statement', 'mark-up'] },
        { id: '5c', text: 'Calculate Rexford\'s trade receivables at 31 December 2024.', marks: 3, type: 'calculation', keywords: ['trade receivables'] },
        { id: '5d', text: 'Advise Rexford whether or not he should employ a bookkeeper. Justify your answer by providing two points for and two points against employing a part-time bookkeeper.', marks: 5, type: 'essay', keywords: ['bookkeeper', 'employment', 'advantages', 'disadvantages'] }
      ]
    }
  ]
};

const outputPath = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/src/data/papers/accounting-7707-2025-unit2-june-qp.json';
fs.writeFileSync(outputPath, JSON.stringify(json, null, 2));
console.log('JSON saved to:', outputPath);
