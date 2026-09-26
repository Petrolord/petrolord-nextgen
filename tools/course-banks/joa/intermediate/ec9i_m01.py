import sys; sys.path.insert(0, '/root/dc-wavekit')
from bankkit import emit, finish
Q=[]
def q(k,p,c,ds,e): Q.append((k,p,c,ds,e))

# EC9 Professional m01, The Cash Call Ledger.
# Every figure is quoted from digest.txt, where the engine returned it on the
# Ekene fixture's months or on a stated golden input. Every call is quoted with
# its lag, its negative call rule and its threshold. No capstone name, term,
# series or value appears.

T = '(lag 2 months, rule "carry", no call below 500000.000000)'

q(2, f"The Ekene 2027 cash call ledger (synthetic) states a reconciliation lag of 2 months, the negative call rule \"carry\" and no cash call below 500000.000000. January 2027 is forecast at 4000000.000000 and spends 3600000.000000, an over-call of 400000.000000. Which call does the engine credit it against?",
 "The March 2027 call, two months later, where EKO is called 5800000.000000 on a forecast share of 6000000.000000",
 ["The February 2027 call, the very next request, where each party's January difference comes off before any lag is counted",
  "The January 2027 call itself, reissued once the actuals are known so that each party pays exactly its actual share",
  "One reconciliation at the close of 2027 for all twelve months"],
 "The engine's reason reads \"2027-03: the over-call of 400000 in 2027-01 (forecast 4000000, actual 3600000) is credited against this cash call, 2 months later\", and EKO's March adjustment of 200000.000000 takes its call to 5800000.000000. The lag is a stated term, so the next request (February) is only reached when the contract states a lag of 1. No call is reissued, and nothing waits for a year end: each difference meets the call the lag names.")

q(0, "A learner copies the Ekene 2027 ledger into the recovery calculator and types 0 into the reconciliation lag control, so that each month's difference would settle against its own call. What does the engine return?",
 "A refusal, in the engine's own words: reconciliationLagMonths must be an integer at or above 1; got 0",
 ["A ledger in which every month is called at its actual spend, so each difference is 0.000000 and every balance closes at 0.000000",
  "The same ledger run with a lag of 1, the smallest lag the engine accepts, substituted for the 0 and reported in the basis",
  "A ledger that states each month's difference and adjusts no later call with it, leaving all of them open at the close"],
 "The engine refuses the lag by name: \"reconciliationLagMonths must be an integer at or above 1; got 0\". A month cannot adjust its own call, because its actual is known only after the call is made. The engine substitutes no lag of its own: the lag is a stated input with no default, and a call without one is refused with the same message ending \"got nothing\".")

q(3, f"The golden input cc-ekene-2027-lag1 runs the same twelve Ekene months with a lag of 1 month, the rule \"carry\" and no cash call below 500000.000000. What do the calls over the year total?",
 "68500000.000000",
 ["68604000.000000, the yearly calls of the Ekene ledger as the fixture states it, which the lag cannot move",
  "69148000.000000, the year's actual spend, since a lag of 1 settles every month's difference inside the year",
  "69052000.000000, the calls of a ledger in which every month is called whatever its forecast"],
 "The engine returns calls of 68500000.000000 over the year with a lag of 1, against 68604000.000000 with the fixture's lag of 2. Both ledgers bill 448000.000000 in arrears and both spend 69148000.000000; the lag moves the month in which a difference is settled, so what is still open at the close differs. 69052000.000000 belongs to the golden input with no threshold, cc-ekene-2027-every-month.")

q(1, "On the same lag-1 ledger (the rule \"carry\", no cash call below 500000.000000), November 2027 is forecast at 7000000.000000 and spends 6896000.000000. Where does the engine put that over-call of 104000?",
 "Against the December 2027 call, one month later, in the engine's own reason",
 ["Into January 2028, outside the ledger, left open at the close",
  "Written off to the operator at the year end",
  "Refunded as a negative call in November itself"],
 "The lag-1 reasons include \"2027-12: the over-call of 104000 in 2027-11 (forecast 7000000, actual 6896000) is credited against this cash call, 1 month later\". A lag of 2 would carry it past December and leave it among the differences not yet adjusted. Nothing is written off in a cash call ledger, and the stated rule is \"carry\", which never turns a difference into a negative call in its own month.")

q(3, f"On the Ekene 2027 ledger {T}, February's under-call of 500000 comes due in April, and April has a forecast of 0.000000. What does the engine record for EKO in April 2027?",
 "A call of 0.000000, an adjustment of -250000.000000 and -250000.000000 carried, so that April makes no call",
 ["A call of 250000.000000 in April for the under-call alone",
  "Nothing: February's under-call is dropped",
  "Arrears of 250000.000000 billed in May, since an under-call that meets a month with no call is billed like spend"],
 "April's forecast of 0 is below the stated threshold, so the month makes no call; the engine's reason reads \"2027-04: the under-call of 500000 in 2027-02 (forecast 6000000, actual 6500000) is added to the next cash call (none is made this month), 2 months later\", and EKO's April row shows the adjustment and the amount carried at -250000.000000. A zero-forecast month is called for its adjustment only when no threshold is stated. Arrears billing is for actual spend made without a call.")

q(0, "Under the fixture's terms of a two-month lag, a \"carry\" rule and a 500000.000000 threshold, May 2027 is forecast at 400000.000000 and spends 448000.000000 with no call made. What does EKO pay in June?",
 "4574000.000000: its call of 4350000.000000 and an arrears billing of 224000.000000",
 ["4350000.000000, its June call, with May's spend left in its balance until the next called month clears it",
  "4500000.000000, its forecast share for June, since the arrears and the credit held from May net out",
  "9148000.000000, what the whole venture pays in June, calls and arrears together"],
 "The engine's June row for EKO shows a call of 4350000.000000, an arrears billing of 224000.000000 and a payment of 4574000.000000; its reason reads \"2027-06: the actual of 2027-05, 448000, made without a cash call, is billed in arrears\". What a party pays in a month is its call plus its arrears billing. 9148000.000000 is June's total across the parties.")

q(2, "July 2027 spends 13800000.000000 against a forecast of 15000000.000000, and with the fixture's two-month lag its over-call of 1200000 lands on September, forecast at only 1000000.000000. The stated negative call rule is \"carry\" (threshold 500000.000000). What does the engine return for EKO in September?",
 "A call of 0.000000 on a forecast share of 500000.000000, and 100000.000000 carried to the next call",
 ["A negative call of -100000.000000, the excess over its forecast share paid back in September",
  "A call of 500000.000000, with the whole adjustment of 600000.000000 moved to October",
  "A call of 0.000000, with the 100000.000000 excess written off to the operator, since the engine lets no call go below 0.000000"],
 "The fixture states \"carry\", and the engine's basis reads \"an adjustment above the forecast share makes the call 0 and the rest is carried to the next call\". EKO's adjustment of 600000.000000 exceeds its forecast share of 500000.000000, so its call is 0.000000 and 100000.000000 is carried. A negative call is what \"refund\" produces. The rest of the credit is carried and applied in October, where the reason reads \"2027-10: a credit of 200000 held from 2027-09 is applied to this cash call\".")

q(1, "Suppose the Ekene months are rerun as cc-ekene-2027-refund: the same two-month lag and 500000.000000 threshold, but a credit above a forecast share is paid back (the rule \"refund\"). What are September's total and the year's total of calls?",
 "-200000.000000 in September, and 68604000.000000 over the year",
 ["0.000000 in September with 200000.000000 carried to October, and 68604000.000000 over the year",
  "-200000.000000 in September, and 68500000.000000 over the year, the refund having settled the July over-call a month early",
  "1000000.000000 called in full in September"],
 "Under \"refund\" the excess is paid back as a negative call of -200000.000000 in total, and the engine's reason reads \"2027-09: the adjustment exceeds the forecast share of EKO, PA, PB: the excess is refunded (a negative call)\". The digest prints calls over the year of 68604000.000000 for both the carried and the refunded ledger. A September of 0.000000 with 200000.000000 carried is the \"carry\" ledger. 68500000.000000 is the yearly total of the lag-1 ledger, a different term.")

q(3, "A learner loads the Ekene 2027 ledger and sets the control \"A negative call is (stated)\" to not stated, which removes negativeCall from the box. What does the engine return?",
 "A refusal: negativeCall must be one of \"refund\", \"carry\"; got nothing",
 ["The same ledger computed under \"refund\", which the Norwegian Accounting Agreement prints as the rule absent an agreement",
  "The same ledger computed under \"carry\", which the Kenya Model PSC 2015 prints as the reduction of the next advance",
  "A refusal only at September's call"],
 "The engine holds no negative call rule, and the digest prints the refusal for this very change, in the engine's words: negativeCall must be one of \"refund\", \"carry\"; got nothing. Both public texts allow both outcomes, which is why the rule is a stated input with no default. The refusal comes before any month is computed; the engine never runs part of a ledger.")

q(0, f"At the end of May 2027 on the Ekene ledger {T}, EKO has 150000.000000 carried and May's actual share of 224000.000000 not yet billed. What balance with the operator does the engine return for EKO?",
 "-74000.000000",
 ["150000.000000, the carried amount alone, since spend made without a call has not yet been billed and does not count",
  "224000.000000, the May spend the operator is owed, which the engine sets as EKO's balance until June's billing",
  "-48000.000000, the balance EKO closes the year on, which the engine carries back to each month end"],
 "EKO's May row prints a balance of -74000.000000. The engine's identity reads \"balance with the operator = differences not yet adjusted + carried - arrears billed and not yet paid\", so May's unbilled spend counts against the credit carried. In June the call and the arrears billing are paid and EKO's balance returns to 0.000000.")

q(2, f"The course checks the closing rows of the Ekene 2027 ledger {T}. EKO closes at -48000.000000, all of it differences not yet adjusted. What does the course say the check establishes?",
 "For each party, the balance less (the differences not yet adjusted + carried - arrears due) is within 0.000001 of zero",
 ["For each party, the closing balance equals its share of the year's calls less its share of the year's actual spend, to the cent",
  "The four closing balances sum to 0.000000, since whatever one party holds with the operator another owes it",
  "Every closing balance is 0.000000 once the differences not yet adjusted are billed in arrears in the following month"],
 "The digest states the identity on the closing rows as derived: \"for each party the balance less (the differences not yet adjusted + carried - arrears due) is within 0.000001 of zero\", checked for EKO, PA, PB and NOC. It is checked within a stated bound. The closing balances of EKO, PA and PB are -48000.000000, -30000.000000 and -18000.000000, which do not cancel. An unadjusted difference is left for a later call; it is not billed in arrears.")

q(1, "The golden input cc-ekene-2027-every-month runs the Ekene months with a lag of 2 months, the rule \"carry\" and no threshold stated. What does the engine return?",
 "Calls of 69052000.000000 over the year, 0.000000 billed in arrears, and EKO closing at -48000.000000",
 ["A refusal naming noCallBelow, a term with no default",
  "68604000.000000 in calls and 448000.000000 in arrears, as before",
  "69148000.000000 in calls, with EKO closing at 0.000000"],
 "With no threshold every month is called, so nothing is billed in arrears: the engine returns calls of 69052000.000000, arrears of 0.000000 and an EKO closing balance of -48000.000000. The threshold is an optional term, applied only when stated, and the engine holds no Norwegian figure: the NOK 5 million a month is the text's. The calls still differ from the actual, because the last two months' differences are open at the close.")

q(2, "A learner types a key \"lag\" into the top level of a cashCalls call, meaning the reconciliation lag. What does the engine return?",
 "A refusal: lag is not an accepted key; the accepted keys at the top level are parties, carries, months, reconciliationLagMonths, negativeCall, noCallBelow",
 ["A ledger that reads \"lag\" as the reconciliation lag, since the engine matches an input key to the nearest accepted name",
  "A ledger that ignores \"lag\" and runs with no reconciliation lag at all, reporting the unknown key among its reasons",
  "A refusal naming reconciliationLagMonths as missing, with no mention of the key \"lag\" that was typed in its place"],
 "The engine refuses an input key it does not read, at every level, naming the key and the accepted keys: \"lag is not an accepted key; the accepted keys at the top level are parties, carries, months, reconciliationLagMonths, negativeCall, noCallBelow\". It never guesses a key and never silently drops a term, so a misspelt contract term cannot quietly change a call.")

q(3, f"NOC holds a participating interest of 20.000000 in the Ekene joint venture and is carried in full, pro rata. What does the Ekene 2027 ledger {T} call from NOC?",
 "0.000000 in every month, on a paying interest of 0.000000",
 ["20 percent of each month's forecast, its participating interest, paid by the carriers on NOC's behalf and billed to it later",
  "Nothing during the year, with its 20 percent share of the year's actual spend billed in arrears in December",
  "Its beneficial interest of 20.000000 percent of every forecast, since cash calls follow the share of production"],
 "Every split of a joint account amount is calculatePartnerCosts on the paying interests, and NOC's paying interest is 0.000000 under the carry; every NOC row of the ledger prints a forecast share, call and balance of 0.000000. Its beneficial interest stays 20.000000, because a carry moves cost and never moves production. The carriers pay NOC's share through their own paying interests (EKO 50.000000, PA 31.250000, PB 18.750000); nothing is billed to NOC through the cash calls.")

q(1, "The golden input cc-year-boundary states parties A 50, B 30 and C 20 percent, a lag of 1 month and the rule \"carry\". December 2026 is forecast at 1000.000000 and spends 900.000000. What does the engine call in January 2027, a month forecast at 1000.000000?",
 "900.000000, with December's over-call of 100 credited across the year boundary",
 ["1000.000000, as each year settles its own differences",
  "1000.000000 in January, with the 100.000000 over-call refunded in December as its own negative call",
  "800.000000, the 100 credited twice"],
 "The ledger runs in consecutive months regardless of the calendar year, and the engine's reason reads \"2027-01: the over-call of 100 in 2026-12 (forecast 1000, actual 900) is credited against this cash call, 1 month later\"; January's calls total 900.000000. The stated rule is \"carry\", which makes no negative call, and a difference is credited once.")

emit(Q, '/root/cat-wip-joa/banks/ec9i_m01.json', expect_n=15)
finish()
