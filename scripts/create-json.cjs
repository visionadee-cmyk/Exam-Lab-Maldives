const fs = require('fs');

const text = fs.readFileSync('C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/scripts/pdf-output.txt', 'utf8');

// Parse the text to extract questions and answers
const lines = text.split('\n');

// Extract paper info
const paperCode = '7707/23';
const session = 'October/November 2025';
const subject = 'Accounting';
const totalMarks = 100;

// Question patterns
const questionPattern = /^(\d)\((\w)\)\s*(.*)$/;
const questionStartPattern = /^(\d)\s*$/;
const marksPattern = /\((\d+)\)(?:OF)?/g;

// Parse questions manually based on the PDF structure
const questions = [
  {
    id: 'q1',
    number: 1,
    type: 'structured',
    totalMarks: 12,
    question: 'Petty cash book and journal',
    parts: [
      { id: '1a', text: 'Complete the petty cash book with dates, details, and totals', marks: 12, type: 'structured', answer: 'See mark scheme for completed petty cash book with dates, analysis columns, and totals', keywords: ['petty cash', 'dates', 'totals'] },
      { id: '1b', text: 'What type of system is used for petty cash?', marks: 1, type: 'short_answer', answer: 'Imprest', keywords: ['imprest'] },
      { id: '1c', text: 'State two advantages of using a petty cash system', marks: 2, type: 'short_answer', answer: 'Reduces the number of entries in the cash book/reduces the possibility of theft/fraud/Provides training for junior employees/Reduces the workload of the chief cashier', keywords: ['advantages', 'petty cash'] },
      { id: '1d', text: 'State two reasons why there may be a difference between the cash book balance and the actual cash in the petty cash box', marks: 2, type: 'short_answer', answer: 'Overpayment/underpayment by petty cashier/Missing petty cash voucher/Error in recording entry in petty cash book/Fraud/theft', keywords: ['differences', 'petty cash'] },
      { id: '1e', text: 'Prepare the necessary journal entries to correct the errors', marks: 4, type: 'structured', answer: 'Drawings Dr $1500, Bank Cr $1500; Purchases Dr $664, AB Autoparts Cr $664', keywords: ['journal', 'corrections'] }
    ]
  },
  {
    id: 'q2',
    number: 2,
    type: 'structured',
    totalMarks: 18,
    question: 'Sales ledger control account',
    parts: [
      { id: '2a', text: 'Prepare the sales ledger control account for Jenny', marks: 9, type: 'structured', answer: 'See mark scheme for completed sales ledger control account', keywords: ['sales ledger', 'control account'] },
      { id: '2b', text: 'State one advantage of maintaining a sales ledger', marks: 1, type: 'short_answer', answer: 'Book-keeping can be divided between several members of staff/Detail is removed from the general ledger/Useful for the preparation of control accounts/Provides total of credit sales', keywords: ['advantages', 'sales ledger'] },
      { id: '2c', text: 'Complete the table to show the source document for each book of prime entry', marks: 2, type: 'table', answer: 'Sales journal - Invoice (Issued); Purchase returns journal - Credit note (Received)', keywords: ['source documents', 'books of prime entry'] },
      { id: '2d_i', text: 'Define trade discount', marks: 1, type: 'short_answer', answer: 'An allowance given when an account is settled within a specified time period', keywords: ['trade discount'] },
      { id: '2d_ii', text: 'Define quantity discount', marks: 1, type: 'short_answer', answer: 'A reduction in the list price of goods/allowance to encourage bulk buying', keywords: ['quantity discount'] },
      { id: '2e', text: 'Identify the document that Talula would send to a customer who returned goods', marks: 1, type: 'short_answer', answer: 'Debit note', keywords: ['debit note'] },
      { id: '2f', text: 'Discuss arguments for and against creating a provision for doubtful debts', marks: 5, type: 'essay', answer: 'Arguments for: Profit not overstated/Trade receivables shown at realistic amount/Applies matching and prudence principles. Arguments against: Provision is only an estimate/Time consuming/Reduces profit. Recommendation required.', keywords: ['provision', 'doubtful debts'] }
    ]
  },
  {
    id: 'q3',
    number: 3,
    type: 'structured',
    totalMarks: 23,
    question: 'Financial statement analysis',
    parts: [
      { id: '3a', text: 'Calculate: (i) ROCE, (ii) Rate of inventory turnover, (iii) Trade receivables turnover (days), (iv) Trade payables turnover (days), (v) Current ratio', marks: 8, type: 'calculation', answer: 'ROCE: 14.13%; Inventory turnover: 9.56 times; Receivables: 42 days; Payables: 37 days; Current ratio: 2.28:1', keywords: ['ROCE', 'inventory turnover', 'ratios'] },
      { id: '3b_i', text: 'Suggest two ways to improve ROCE', marks: 2, type: 'short_answer', answer: 'Increase profit for the year/reduce expenses/Reduce capital/Repay long-term loan', keywords: ['improve ROCE'] },
      { id: '3b_ii', text: 'Suggest two ways to improve the rate of inventory turnover', marks: 2, type: 'short_answer', answer: 'Increase quantity sold/reduce selling prices/More efficient stock control', keywords: ['inventory turnover'] },
      { id: '3c_i', text: 'State the accounting principle for inventory valuation', marks: 1, type: 'short_answer', answer: 'Lower of cost or net realisable value', keywords: ['inventory valuation'] },
      { id: '3c_ii', text: 'Identify the accounting principle being applied', marks: 1, type: 'short_answer', answer: 'Prudence', keywords: ['prudence'] },
      { id: '3c_iii', text: 'State the effect on gross profit if inventory is valued at NRV instead of cost', marks: 1, type: 'short_answer', answer: 'Increase', keywords: ['gross profit', 'NRV'] },
      { id: '3d', text: 'Discuss arguments for and against offering a cash discount', marks: 5, type: 'essay', answer: 'Arguments for: Improve cash flow/improve relationship/improve sales/reduce irrecoverable debts. Arguments against: Increase expenses/less cash received/no guarantee customers will pay/time consuming. Recommendation required.', keywords: ['cash discount'] }
    ]
  },
  {
    id: 'q4',
    number: 4,
    type: 'structured',
    totalMarks: 20,
    question: 'Sole trader and partnership',
    parts: [
      { id: '4a', text: 'Prepare the income statement for Talula for the year ended 30 September 2025', marks: 5, type: 'structured', answer: 'Income: $132,380; Expenses: $114,446; Profit: $17,934', keywords: ['income statement'] },
      { id: '4b', text: 'Identify two courses of action to improve profitability and explain the impact on the business', marks: 4, type: 'essay', answer: 'Increase service prices (may reduce customers)/Change electricity supplier (may not get cheaper)/Increase rent (Sheila may move out)/Reduce opening hours (cannot maintain income)/Reduce staff (employees may leave)', keywords: ['profitability', 'courses of action'] },
      { id: '4c', text: 'Discuss arguments for and against accepting card payments', marks: 5, type: 'essay', answer: 'Arguments for: Meet customer needs/increased sales/reduced theft/saves time. Arguments against: Rental fee and transaction charge/cost of cash register/staff training/customer numbers may not increase. Recommendation required.', keywords: ['card payments'] },
      { id: '4d', text: 'State three advantages of operating as a partnership rather than as a sole trader', marks: 3, type: 'short_answer', answer: 'Additional finance available/Additional skills and knowledge/Sharing of responsibilities/Risks are shared/Losses are shared', keywords: ['partnership advantages'] },
      { id: '4e', text: 'State three matters that should be included in a partnership agreement', marks: 3, type: 'short_answer', answer: 'Amount of capital invested by each partner/Interest on capital/Partners salaries/Upper limit on drawings/Interest on drawings/Interest on partners loans/Responsibilities of each partner', keywords: ['partnership agreement'] }
    ]
  },
  {
    id: 'q5',
    number: 5,
    type: 'structured',
    totalMarks: 27,
    question: 'Capital expenditure and company accounts',
    parts: [
      { id: '5a_i', text: 'Define capital expenditure', marks: 1, type: 'short_answer', answer: 'Money spent on purchasing, improving or extending non-current assets', keywords: ['capital expenditure'] },
      { id: '5a_ii', text: 'Define revenue expenditure', marks: 1, type: 'short_answer', answer: 'Money spent on day to day running a business', keywords: ['revenue expenditure'] },
      { id: '5a_iii', text: 'Define capital receipt', marks: 1, type: 'short_answer', answer: 'Money received from a source other than normal trading activities', keywords: ['capital receipt'] },
      { id: '5a_iv', text: 'Define revenue receipt', marks: 1, type: 'short_answer', answer: 'Money received by a business from normal trading activities', keywords: ['revenue receipt'] },
      { id: '5b', text: 'Classify each item as capital expenditure, revenue expenditure, capital receipt, or revenue receipt', marks: 4, type: 'table', answer: 'Delivery charges: Capital expenditure; Repairs to roof: Revenue expenditure; Painting new extension: Capital expenditure; Sale of motor vehicle: Capital receipt', keywords: ['classification'] },
      { id: '5c', text: 'Prepare the Statement of Changes in Equity for P Limited', marks: 3, type: 'structured', answer: 'Balance at 1 July 2024: $46,220; Profit for year: $37,350; Dividend: ($36,400); Transfer to general reserve: ($8,000); Balance at 30 June 2025: $39,170', keywords: ['statement of changes in equity'] },
      { id: '5d', text: 'Prepare the Statement of Financial Position for P Limited', marks: 9, type: 'structured', answer: 'Non-current assets: $313,246; Current assets: $89,858; Total assets: $403,104; Equity: $293,470; Non-current liabilities: $54,000; Current liabilities: $55,634; Total equity and liabilities: $403,104', keywords: ['statement of financial position'] }
    ]
  }
];

const json = {
  paperId: 'accounting-7707-2025-unit2-nov-ms',
  subjectId: 'accounting_cambridge_olevel',
  code: paperCode,
  session: session,
  title: `${subject} Unit 2 - Mark Scheme`,
  totalMarks: totalMarks,
  timeMinutes: 120,
  questions: questions
};

const outputPath = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/src/data/papers/accounting-7707-2025-unit2-nov-ms.json';
fs.writeFileSync(outputPath, JSON.stringify(json, null, 2));
console.log('JSON saved to:', outputPath);
