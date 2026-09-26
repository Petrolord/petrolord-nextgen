import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC9 Associate m04, Cash Calls.
# Sources: the cash call rule and the threshold rule in the engine's basis,
# January 2027 per party, the small golden ledgers with their reasons, the
# Ekene March and June 2027 rows, and the cash call refusals. One month's call
# and its adjustment at a time; no year's ledger. Every key rests on a
# digest-printed line or an engine return re-run in
# /root/cat-wip-joa/scratch/bank-beginner/witness.mjs.

q(1, "The Ekene 2027 cash calls state a reconciliation lag of 2 months. Which cash call does January 2027's over-call adjust?",
 "The March 2027 call, two months later.",
 ["The February 2027 call, the first one made after January closes.",
  "The April 2027 call, the first month of the year without a call.",
  "The call of the next year."],
 "The engine's reason for March reads, in its own words: 2027-03: the over-call of 400000 in 2027-01 (forecast 4000000, actual 3600000) is credited against this cash call, 2 months later. The lag counts months from the month whose difference it is, so February is too soon, and April makes no call on the Ekene terms at all.")

q(3, "January's differences reach the Ekene March calls. By how much is EKO's call reduced?",
 "200000.000000, its own January difference.",
 ["400000.000000, January's whole over-call.",
  "150000.000000, its June credit.",
  "125000.000000, PA's January difference."],
 "EKO's January difference is its forecast share of 2000000.000000 less its actual share of 1800000.000000, which is 200000.000000, and that is the adjustment on its March row. 400000.000000 is the month's difference over every party, split on the paying interests. 150000.000000 is EKO's June adjustment, and 125000.000000 is PA's January difference.")

q(0, "With the Ekene lag of 2 months, what is EKO's March 2027 cash call?",
 "5800000.000000, its forecast share less January's difference.",
 ["6000000.000000, its forecast share, unadjusted.",
  "5800000.000000 plus May's arrears billing, since March pays arrears.",
  "4350000.000000."],
 "EKO's March forecast share is 6000000.000000 and its adjustment 200000.000000, so the call is 5800000.000000, and the table prints paid 5800000.000000 with an arrears billing of 0.000000. The forecast share alone ignores the lag, May's actual is billed in arrears in June, and 4350000.000000 is EKO's June call.")

q(2, "A worked case states a threshold of 500. January 2027 forecasts exactly 500 and February 499. Which months are called?",
 "January alone.",
 ["Neither month: a forecast at or below the threshold of 500 makes no cash call.",
  "Both months, since each forecast is within one of the stated threshold.",
  "February alone, since January's actual of 500 equals the threshold."],
 "The rule is strictly below: a forecast equal to the threshold is called and one below it is not. On cc-threshold-exactly January is called for 500.000000 and February is not, and the engine's reason reads: 2027-02: no cash call: the forecast 499 is below the stated threshold 500; the actual is billed in arrears in the next month. The test reads the forecast, and there is no margin of one.")

q(1, "On the Ekene terms, what does the no-call threshold of 500000 test?",
 "The month's forecast, which is called unless below 500000.",
 ["The month's actual, known only after the month has closed out.",
  "Each party's forecast share against 500000.",
  "The call after its adjustment."],
 "The engine's basis reads: no cash call in a month whose forecast is below 500000; its actual share is billed in arrears the next month. The test reads the month's forecast, since the call is made before the actuals are known, and it reads the whole month's forecast. A call reduced below 500000 by its adjustment is still a call.")

q(3, "May 2027's forecast is below the Ekene threshold of 500000, and the lag is 2 months. What does PB pay in June 2027?",
 "1715250.000000, its call plus May's arrears billing.",
 ["1631250.000000, its June call; May waits for July.",
  "1687500.000000, its June forecast share.",
  "84000.000000, May's arrears alone."],
 "What a party pays in a month is its call plus its arrears billing. PB's June call is 1631250.000000, its forecast share of 1687500.000000 less an adjustment of 56250.000000, and May's actual is billed in arrears in June at 84000.000000 for PB, so it pays 1715250.000000. The engine's reason reads: 2027-06: the actual of 2027-05, 448000, made without a cash call, is billed in arrears.")

q(2, "On cc-zero-call-month, with lag 1 and negative call rule carry, January over-calls by 200 and February forecasts 0. What happens in February and March?",
 "February's calls are 0.000000, and the 200.000000 credit carries to March, whose calls are 200.000000.",
 ["February's calls are -200.000000, a refund paid out at once, and March is then called in full at 400.000000.",
  "February makes no call, since a forecast of 0 is below any threshold, and the credit lapses at the month's end.",
  "February's calls are 0.000000, and the credit waits until the next year."],
 "With no threshold stated, February is called with a forecast of 0.000000, and the call is the adjustment alone. Under carry, the engine's reason reads: 2027-02: the adjustment exceeds the forecast share of A, B, C: the call is 0 and the rest of the credit is carried to the next cash call. March's forecast of 400.000000 is reduced to calls of 200.000000. Paying the credit back at once belongs to the other stated rule, and this case states no threshold for February to fall under.")

q(0, "The same small case is run with the negative call rule stated as refund. What are February's calls?",
 "-200.000000, a negative call.",
 ["0.000000, with 200.000000 carried to March's call.",
  "200.000000, the credit paid back as a positive call to each party.",
  "0.000000, the excess held on account until the end of the year."],
 "On cc-zero-call-month-refund the engine's reason reads: 2027-02: the adjustment exceeds the forecast share of A, B, C: the excess is refunded (a negative call). February's calls total -200.000000 and March is called in full at 400.000000. A zero call with the credit carried is the carry rule, and a refund is paid out as a negative call, so the sign is below zero.")

q(3, "On cc-year-boundary, December 2026 forecasts 1000 and spends 900, with a lag of 1. January 2027 forecasts 1000. What are January's calls?",
 "900.000000, after December's credit.",
 ["1000.000000: a new year starts the ledger afresh with no adjustment carried in.",
  "1100.000000, as an over-call adds.",
  "800.000000, credited twice."],
 "The engine's reason reads: 2027-01: the over-call of 100 in 2026-12 (forecast 1000, actual 900) is credited against this cash call, 1 month later. January's forecast of 1000.000000 less the credit of 100 gives calls of 900.000000. The lag moves a difference across a year end with no special rule, and an over-call reduces a later call once.")

q(1, "A cash calls box leaves out reconciliationLagMonths. What does the engine do?",
 "It refuses: the lag must be an integer at or above 1.",
 ["It uses a lag of 1 month.",
  "It computes every call with no adjustment and says so in a reason printed for each month.",
  "It applies each difference to the next call, as the Norwegian accounting agreement says."],
 "The reconciliation lag is a contract term with no default. The engine refuses, in its own words: reconciliationLagMonths must be an integer at or above 1; got nothing. It assumes no lag, computes no calls without one, and reads no Norwegian wording into the box.")

q(0, "Can the reconciliation lag be stated as 0, so that a month's difference adjusts its own call?",
 "No: a lag of 0 is refused, the lag being an integer at or above 1.",
 ["Yes: a lag of 0 adjusts each call by its own month's difference.",
  "Yes, where the month's actual is known before its call is paid.",
  "Only under the refund rule."],
 "The engine refuses a lag of 0, in its own words: reconciliationLagMonths must be an integer at or above 1; got 0. The engine's rule applies the difference of the month reconciliationLagMonths earlier, so the lag is stated as a whole number of months from 1 up, and a month's own difference always adjusts a later call.")

q(2, "A box's second month is typed as 2027-03, straight after 2027-01. What does the engine return?",
 "A refusal naming months[1].month, which expected 2027-02.",
 ["A ledger with February filled in at a forecast and actual of 0, and a reason naming it.",
  "A ledger that counts the lag in calendar months across the gap.",
  "A result, with a reason printed that names the missing month."],
 "The months must follow one another with no gap, because the lag counts months. The engine refuses, in its own words: months[1].month must be 2027-02, the month after 2027-01 (the months are consecutive); got \"2027-03\". It fills in no month and computes nothing across the gap.")

q(1, "A cash calls box states negativeCall as net. What happens?",
 "It is refused: the rule must be refund or carry.",
 ["The credit is netted against the actual share.",
  "It is read as carry, the nearer of the two stated rules, and the credit waits for the next call.",
  "The excess is refunded, the rest carried."],
 "The negative call rule takes one of two stated values. The engine refuses, in its own words: negativeCall must be one of \"refund\", \"carry\"; got \"net\". It maps no third word onto either rule and mixes none of them.")

q(2, "On cc-last-month-uncalled, December 2027 forecasts 100 against a threshold of 500. What does the engine print for December?",
 "No cash call, with the actual billed in arrears in the next month.",
 ["A call of 100, since the last month of a ledger is always called in full.",
  "A refusal, since the ledger ends before any of the arrears can be billed.",
  "Calls of 120."],
 "The engine's reason reads: 2027-12: no cash call: the forecast 100 is below the stated threshold 500; the actual is billed in arrears in the next month. December's calls are 0.000000. A last month gets no exception, the engine returns a result with a reason, and 120 is December's actual, which is billed in arrears and never called.")

q(0, "January 2027 on the Ekene terms: forecast 4000000.000000, actual 3600000.000000. What is PA's difference, and what kind is it?",
 "125000.000000, an over-call: forecast share less actual share.",
 ["125000.000000, an under-call it adds to its March call.",
  "400000.000000, the month's whole over-call, credited to PA.",
  "1125000.000000, its actual share."],
 "The difference is the forecast share less the actual share for a month with a call: PA's 1250000.000000 less 1125000.000000 is 125000.000000, and above zero it is an over-call. An under-call is a difference below zero. 400000.000000 is the difference over every party, and 1125000.000000 is PA's actual share.")

emit(Q, '/root/cat-wip-joa/banks/ec9b_m04.json', expect_n=15)
finish()
