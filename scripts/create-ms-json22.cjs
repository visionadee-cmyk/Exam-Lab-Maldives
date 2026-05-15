const fs = require('fs');

const json = {
  paperId: 'accounting-7707-2025-unit2-june-ms',
  subjectId: 'accounting_cambridge_olevel',
  code: '7707/22',
  session: 'May/June 2025',
  title: 'Accounting Unit 2 - Mark Scheme',
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
        {
          id: '1a',
          text: 'Complete Kadima\'s cash book on page 3. Balance the cash book and bring down the balances at 1 April 2025.',
          marks: 12,
          type: 'structured',
          answer: 'Cash received: Balance b/d $50, Sophiah $291, Merve $375, Bank transfer $400. Total $1,506. Cash paid: Lee $196, Motor expenses $26, Mark $240, Cash to bank $400, Wages $362, Motor expenses $91, Balance c/d $62,579. Total $1,506. Bank: Balance b/d $840, Merve $375. Paid: Lee $4, Motor expenses $26, Mark $10, Wages $362, Motor expenses $91, Balance c/d $579. Total $1,506. Balance b/d Apr 1: Cash $62,579, Bank $579.',
          keywords: ['cash book', 'balance', 'discount']
        },
        {
          id: '1b',
          text: 'Calculate the amount for the bank balance which Kadima would show in his statement of financial position at 31 March 2025.',
          marks: 3,
          type: 'calculation',
          answer: 'Cash book balance $579. Cash book error (357 - 375) = (18). Revised cash book balance $561.',
          keywords: ['bank balance', 'statement of financial position']
        },
        {
          id: '1c',
          text: 'Advise Kadima whether or not he should stop using cash and cheques. Justify your answer by providing points for and against making these changes.',
          marks: 5,
          type: 'essay',
          answer: 'For: Record keeping would be easier; Increase in cash discount may attract more customers/increase sales; Most businesses use bank transfers; Money is usually safer in the bank/reduces risk of theft/fraud; No need to visit the bank to pay in cheques; Cheques may be returned unpaid; Cheques take time to clear. Against: Increased cash discount allowed would reduce profitability; Bank charges may increase; Some customers/suppliers may prefer to deal in cash/cheques; Not all customers may have a bank account; Employees may prefer to continue to be paid in cash. Recommendation required.',
          keywords: ['cash', 'cheques', 'bank transfer', 'discount']
        }
      ]
    },
    {
      id: 'q2',
      number: 2,
      type: 'structured',
      totalMarks: 20,
      question: 'Farah and Salma - Partnership accounts',
      parts: [
        {
          id: '2a',
          text: 'Prepare the appropriation account for Farah and Salma for the year ended 28 February 2025.',
          marks: 6,
          type: 'structured',
          answer: 'Profit for year $38,175. Add: Interest on drawings - Farah $95, Salma $210 = $305. Total $38,480. Less: Interest on capital - Farah $1,040, Salma $1,500 = $2,540. Salary - Farah $11,200. Total $13,740. Profit share: Farah 30% × $24,740 = $7,422; Salma 70% × $24,740 = $17,318.',
          keywords: ['appropriation account', 'partnership', 'profit share']
        },
        {
          id: '2b',
          text: 'Prepare Farah\'s current account for the year ended 28 February 2025. Balance the account and bring down the balance at 1 March 2025.',
          marks: 7,
          type: 'structured',
          answer: 'Feb 28: Drawings $14,250, Interest on drawings $95, Balance c/d $8,767. Total $23,112. Mar 1: Balance b/d $3,450. Feb 28: Interest on capital $1,040, Salary $11,200, Share of profit $7,422. Balance b/d $8,767.',
          keywords: ['current account', 'balance', 'partnership']
        },
        {
          id: '2c',
          text: 'State two reasons why Salma should not take more drawings.',
          marks: 2,
          type: 'short_answer',
          answer: 'There may be insufficient money in the bank/reduces liquidity; There may be a limit on drawings (stated in the partnership agreement); May damage the relationship between the partners; Salma would have to pay interest on drawings.',
          keywords: ['drawings', 'partnership']
        },
        {
          id: '2d',
          text: 'Advise Farah and Salma whether or not they should convert to a limited company. Justify your answer with advantages and disadvantages.',
          marks: 5,
          type: 'essay',
          answer: 'Advantages: Easier to raise capital/finance/loans; Shareholders have limited liability; Workload/responsibility is shared; Profit may increase; Farah receives an increase in salary; Limited company has continuity of existence/separate legal identity. Disadvantages: Farah and Salma would lose control; The brothers may have no business experience; Increased legal and administrative costs; Cash/profit may be reduced to pay salaries/dividends; The investment may not be sufficient to fund the expansion. Recommendation required.',
          keywords: ['limited company', 'advantages', 'disadvantages']
        }
      ]
    },
    {
      id: 'q3',
      number: 3,
      type: 'structured',
      totalMarks: 20,
      question: 'Jasmine - Ledger accounts and financial statements',
      parts: [
        {
          id: '3a',
          text: 'Prepare the provision for depreciation of motor vehicles account for the year ended 31 March 2025. Balance the account and bring down the balance at 1 April 2025.',
          marks: 4,
          type: 'structured',
          answer: 'Apr 1: Balance b/d $7,000. Mar 31: Income statement $6,750 (27,000 × 25%), Balance c/d $13,750. Total $13,750. Apr 1: Balance b/d $13,750.',
          keywords: ['depreciation', 'motor vehicles', 'reducing balance']
        },
        {
          id: '3b',
          text: 'Prepare the provision for doubtful debts account for the year ended 31 March 2025. Balance the account and bring down the balance at 1 April 2025.',
          marks: 4,
          type: 'structured',
          answer: 'Mar 31: Income statement $21, Balance c/d $345. Total $366. Apr 1: Balance b/d $366. Apr 1: Balance b/d $345 (11,500 × 3%).',
          keywords: ['doubtful debts', 'provision']
        },
        {
          id: '3c',
          text: 'Prepare the rent and rates account for the year ended 31 March 2025. Balance the account and bring down the balances at 1 April 2025.',
          marks: 6,
          type: 'structured',
          answer: 'Rent: Apr 1 Balance b/d $900, Mar 31 Bank $14,960, Balance c/d $185. Total $16,045. Apr 1 Balance b/d $925. Rates: Apr 1 Balance b/d $270, Mar 31 Income statement $14,850, Balance c/d $925. Total $16,045. Apr 1 Balance b/d $185.',
          keywords: ['rent', 'rates', 'prepaid', 'accrued']
        },
        {
          id: '3d',
          text: 'Prepare the current assets section of Jasmine\'s statement of financial position at 31 March 2025.',
          marks: 3,
          type: 'structured',
          answer: 'Trade receivables $11,500 - Provision $345 = $11,155. Other receivables $925. Total current assets $12,080.',
          keywords: ['current assets', 'statement of financial position']
        },
        {
          id: '3e_i',
          text: 'State how the principle of consistency is applied when charging depreciation.',
          marks: 1,
          type: 'short_answer',
          answer: 'Depreciation is charged using the same method each year.',
          keywords: ['consistency', 'depreciation']
        },
        {
          id: '3e_ii',
          text: 'State one way Jasmine may reduce the possibility of irrecoverable debts.',
          marks: 1,
          type: 'short_answer',
          answer: 'Obtaining credit references/Establishing credit limits; Sending invoices and statements promptly; Improve credit control/monitoring/investigating/chasing overdue accounts; Refusing to supply customers until outstanding amounts have been paid; Taking legal action.',
          keywords: ['irrecoverable debts', 'credit control']
        },
        {
          id: '3e_iii',
          text: 'Identify which accounting principle Jasmine is applying by making an adjustment for rent prepaid.',
          marks: 1,
          type: 'short_answer',
          answer: 'Matching / accruals',
          keywords: ['prepaid rent', 'accruals']
        }
      ]
    },
    {
      id: 'q4',
      number: 4,
      type: 'structured',
      totalMarks: 20,
      question: 'Bilal - Error correction and capital',
      parts: [
        {
          id: '4a',
          text: 'Prepare the journal entries on page 15 to correct errors 1–5. Narratives are not required.',
          marks: 11,
          type: 'structured',
          answer: '1. Cash Dr $185, Purchases Cr $185. 2. Motor expenses Dr $27, Bank Cr $27. 3. Bank loan Dr $2,000, Capital Cr $2,000. 4. Purchases Dr $168, Moira Cr $84, Maya Cr $84. 5. Drawings Dr $130, Insurance Cr $130.',
          keywords: ['journal', 'errors', 'corrections']
        },
        {
          id: '4b',
          text: 'Calculate Bilal\'s profit for the year after correcting errors 1–5.',
          marks: 5,
          type: 'calculation',
          answer: 'Original profit $12,930 + Error 1 $185 - Error 2 $27 - Error 4 $168 + Error 5 $130 = $13,050.',
          keywords: ['profit', 'errors', 'adjustments']
        },
        {
          id: '4c',
          text: 'Calculate the balance on the capital account at 31 December 2024.',
          marks: 4,
          type: 'calculation',
          answer: 'Capital at 1 Jan 2024 $6,200 + Revised profit $13,050 + Capital introduced $2,000 = $21,250. Less: Drawings ($11,260 + $130) = $11,390. Capital at 31 Dec 2024 = $9,860.',
          keywords: ['capital account', 'balance']
        }
      ]
    },
    {
      id: 'q5',
      number: 5,
      type: 'structured',
      totalMarks: 20,
      question: 'Rexford - Incomplete records',
      parts: [
        {
          id: '5a',
          text: 'Prepare Rexford\'s purchases ledger control account for the year to 31 December 2024. Balance the account and bring down the balance at 1 January 2025.',
          marks: 4,
          type: 'structured',
          answer: 'Dec 31: Bank $68,100, Discount received $380, Balance c/d $7,100. Total $75,580. Jan 1: Balance b/d $5,680. Dec 31: Purchases $69,900. Balance b/d Jan 1 $7,100.',
          keywords: ['purchases ledger', 'control account']
        },
        {
          id: '5b',
          text: 'Prepare Rexford\'s income statement for the year ended 31 December 2024.',
          marks: 8,
          type: 'structured',
          answer: 'Revenue: $104,250 (69,500 × 1.5). Cost of sales: Opening inventory $6,000 + Purchases $69,900 = $75,900 - Closing inventory $6,400 = $69,500. Gross profit $34,750. Add: Discount received $380 = $35,130. Less: Rent and insurance $10,420, General expenses $4,730, Wages $6,400, Depreciation $5,600 = $27,150. Profit for year $7,980.',
          keywords: ['income statement', 'mark-up']
        },
        {
          id: '5c',
          text: 'Calculate Rexford\'s trade receivables at 31 December 2024.',
          marks: 3,
          type: 'calculation',
          answer: 'Opening trade receivables $21,750 + Revenue $104,250 - Receipts from sales $103,200 = Closing trade receivables $22,800.',
          keywords: ['trade receivables']
        },
        {
          id: '5d',
          text: 'Advise Rexford whether or not he should employ a bookkeeper. Justify your answer by providing two points for and two points against employing a part-time bookkeeper.',
          marks: 5,
          type: 'essay',
          answer: 'For: More reliable records/more accurate records/less errors; More up-to-date figures available; Time freed up for other tasks; Payments to trade payables will be monitored so that more cash discount is claimed; More detailed records would be available/easier to prepare financial statements. Against: The salary would reduce profit/increases expenses; There would be a reduction in cash/liquidity; The money may be better spent elsewhere; The book-keeper will not prepare the financial statements. Recommendation required.',
          keywords: ['bookkeeper', 'employment', 'advantages', 'disadvantages']
        }
      ]
    }
  ]
};

const outputPath = 'C:/Users/maushaz.MADIHAA/Desktop/Rettey/exam-lab-maldives/exam-lab-mv/src/data/papers/accounting-7707-2025-unit2-june-ms.json';
fs.writeFileSync(outputPath, JSON.stringify(json, null, 2));
console.log('JSON saved to:', outputPath);
